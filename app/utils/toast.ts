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

  const toastElement = document.querySelector<HTMLElement>(`.${UNDO_TOAST_CLASS}:last-child`);
  if (!toastElement) return;

  let dragStartX: number | undefined;
  let dragStartY: number | undefined;
  const dismissToast = () => {
    const closeButton = toastElement.querySelector<HTMLButtonElement>("button.delete");
    closeButton?.click();
  };
  const handleSwipeEnd = (endX: number, endY: number) => {
    if (dragStartX === undefined || dragStartY === undefined) return;

    const deltaX = Math.abs(endX - dragStartX);
    const deltaY = Math.abs(endY - dragStartY);
    dragStartX = undefined;
    dragStartY = undefined;

    if (deltaX >= UNDO_TOAST_SWIPE_THRESHOLD && deltaX > deltaY) {
      dismissToast();
    }
  };

  toastElement.addEventListener("touchstart", (event) => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    dragStartX = touch.clientX;
    dragStartY = touch.clientY;
  }, { passive: true });

  toastElement.addEventListener("touchend", (event) => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    handleSwipeEnd(touch.clientX, touch.clientY);
  }, { passive: true });
};
