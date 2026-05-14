// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from "vitest";

const { toastMock } = vi.hoisted(() => ({
  toastMock: vi.fn((options: { dismissible?: boolean; extraClasses?: string; message: string | HTMLElement }) => {
    const element = document.createElement("div");
    element.className = `notification ${options.extraClasses ?? ""}`.trim();

    if (options.dismissible) {
      const closeButton = document.createElement("button");
      closeButton.className = "delete";
      element.append(closeButton);
    }

    if (options.message instanceof HTMLElement) {
      element.append(options.message);
    }

    document.body.append(element);
  }),
}));

vi.mock("bulma-toast", () => ({ toast: toastMock }));

import { showUndoToast } from "./toast";

const dispatchTouchEvent = (target: HTMLElement, eventName: "touchstart" | "touchend", x: number, y: number) => {
  const event = new Event(eventName) as TouchEvent;
  Object.defineProperty(event, "changedTouches", {
    value: [{ clientX: x, clientY: y }],
  });
  target.dispatchEvent(event);
};

describe("showUndoToast", () => {
  beforeEach(() => {
    toastMock.mockClear();
    document.body.innerHTML = "";
  });

  it("shows an undo toast with close button", () => {
    showUndoToast("message", "undo", vi.fn());

    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({
      dismissible: true,
      extraClasses: "undo-toast",
    }));
    expect(document.querySelector(".undo-toast .delete")).not.toBeNull();
  });

  it("dismisses when swiped horizontally", () => {
    showUndoToast("message", "undo", vi.fn());

    const toast = document.querySelector(".undo-toast");
    expect(toast).not.toBeNull();
    const closeButton = toast?.querySelector("button.delete");
    expect(closeButton).not.toBeNull();
    const closeButtonClickSpy = vi.spyOn(closeButton as HTMLButtonElement, "click");

    dispatchTouchEvent(toast as HTMLElement, "touchstart", 0, 10);
    dispatchTouchEvent(toast as HTMLElement, "touchend", 80, 10);

    expect(closeButtonClickSpy).toHaveBeenCalledTimes(1);
  });
});
