import * as bulmaToast from "bulma-toast";

const UNDO_TOAST_CLASS = "undo-toast";
const UNDO_TOAST_SWIPE_THRESHOLD = 56;

export const showToast = (
  message: string,
  type: bulmaToast.ToastType,
  duration: number = 2000,
) => {
  bulmaToast.toast({
    message: useProcessString.replaceLooseLineBreaks(message),
    duration,
    type,
    dismissible: true,
    animate: { in: "fadeIn", out: "fadeOut" },
  });
};

export const showSuccessToast = (message: string) => {
  showToast(message, "is-success");
};

export const showWarningToast = (message: string) => {
  showToast(message, "is-warning");
};

export const showDangerToast = (message: string) => {
  showToast(message, "is-danger", 10000);
};

export const showUndoToast = (
  message: string,
  actionLabel: string,
  onUndo: () => void,
  duration: number = 5000,
) => {
  if (typeof document === "undefined") {
    showWarningToast(message);
    return;
  }

  const container = document.createElement("div");
  container.className = "is-flex is-align-items-center";

  const text = document.createElement("span");
  // Keep message as plain text to avoid rendering literal HTML tags in the undo toast.
  text.style.whiteSpace = "pre-line";
  text.textContent = message;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "button is-small is-light ml-3";
  button.textContent = actionLabel;
  button.addEventListener("click", () => {
    button.disabled = true;
    onUndo();
  });

  container.append(text, button);

  bulmaToast.toast({
    message: container,
    duration,
    type: "is-primary",
    dismissible: true,
    pauseOnHover: true,
    closeOnClick: false,
    extraClasses: UNDO_TOAST_CLASS,
    animate: { in: "fadeIn", out: "fadeOut" },
  });

  const undoToasts = document.querySelectorAll<HTMLElement>(`.${UNDO_TOAST_CLASS}`);
  const toastElement = undoToasts[undoToasts.length - 1];
  if (!toastElement) return;

  let swipeStartX: number | undefined;
  let swipeStartY: number | undefined;
  const closeButton = toastElement.querySelector<HTMLButtonElement>("button.delete");
  const cleanup = () => {
    toastElement.removeEventListener("touchstart", handleTouchStart);
    toastElement.removeEventListener("touchend", handleTouchEnd);
    closeButton?.removeEventListener("click", cleanup);
  };
  const dismissToast = () => {
    closeButton?.click();
  };
  const handleSwipeEnd = (endX: number, endY: number) => {
    if (swipeStartX === undefined || swipeStartY === undefined) return;

    const deltaX = Math.abs(endX - swipeStartX);
    const deltaY = Math.abs(endY - swipeStartY);
    swipeStartX = undefined;
    swipeStartY = undefined;

    if (deltaX >= UNDO_TOAST_SWIPE_THRESHOLD && deltaX > deltaY) {
      dismissToast();
    }
  };

  const handleTouchStart = (event: TouchEvent) => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    swipeStartX = touch.clientX;
    swipeStartY = touch.clientY;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    handleSwipeEnd(touch.clientX, touch.clientY);
  };

  toastElement.addEventListener("touchstart", handleTouchStart, { passive: true });
  toastElement.addEventListener("touchend", handleTouchEnd, { passive: true });
  closeButton?.addEventListener("click", cleanup, { once: true });
};
