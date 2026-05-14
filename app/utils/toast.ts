import * as bulmaToast from "bulma-toast";

const SWIPE_DISMISS_THRESHOLD_PX = 60;

const dismissToastElement = (baseElement: HTMLElement) => {
  const notification = baseElement.closest(
    ".notification.toast",
  ) as HTMLElement | null;
  notification?.remove();
};

const setupSwipeToDismiss = (
  toastElement: HTMLElement,
  dismiss: () => void,
  thresholdPx: number,
) => {
  let startX: number | null = null;
  let currentDeltaX = 0;

  toastElement.style.touchAction = "pan-y";

  toastElement.addEventListener(
    "touchstart",
    (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches.item(0);
      if (!touch) return;
      startX = touch.clientX;
      currentDeltaX = 0;
    },
    { passive: true },
  );

  toastElement.addEventListener(
    "touchmove",
    (event: TouchEvent) => {
      if (startX === null || event.touches.length !== 1) return;
      const touch = event.touches.item(0);
      if (!touch) return;
      currentDeltaX = touch.clientX - startX;
      const opacity = Math.max(0.35, 1 - Math.abs(currentDeltaX) / 220);
      toastElement.style.transform = `translateX(${currentDeltaX}px)`;
      toastElement.style.opacity = `${opacity}`;
    },
    { passive: true },
  );

  toastElement.addEventListener("touchend", () => {
    if (startX === null) return;

    if (Math.abs(currentDeltaX) >= thresholdPx) {
      dismiss();
      return;
    }

    toastElement.style.transform = "";
    toastElement.style.opacity = "";
    startX = null;
    currentDeltaX = 0;
  });

  toastElement.addEventListener("touchcancel", () => {
    if (startX === null) return;

    if (Math.abs(currentDeltaX) >= thresholdPx) {
      dismiss();
      return;
    }

    toastElement.style.transform = "";
    toastElement.style.opacity = "";
    startX = null;
    currentDeltaX = 0;
  });
};

const setupSwipeToDismissForLatestToast = (
  dismiss: (toastElement: HTMLElement) => void,
  thresholdPx: number = SWIPE_DISMISS_THRESHOLD_PX,
) => {
  if (typeof document === "undefined") return;

  requestAnimationFrame(() => {
    const toastElements = document.querySelectorAll<HTMLElement>(
      ".notification.toast",
    );
    const latestToast = toastElements.item(toastElements.length - 1);
    if (!latestToast) return;

    setupSwipeToDismiss(latestToast, () => dismiss(latestToast), thresholdPx);
  });
};

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

  setupSwipeToDismissForLatestToast(dismissToastElement);
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
  options: {
    closeAriaLabel?: string;
    swipeThresholdPx?: number;
  } = {},
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
    dismissToastElement(container);
  });

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "delete ml-3";
  closeButton.setAttribute(
    "aria-label",
    options.closeAriaLabel ?? "Close notification",
  );
  closeButton.addEventListener("click", () => {
    dismissToastElement(container);
  });

  container.append(text, button, closeButton);

  bulmaToast.toast({
    message: container,
    duration,
    type: "is-primary",
    dismissible: false,
    pauseOnHover: true,
    closeOnClick: false,
    animate: { in: "fadeIn", out: "fadeOut" },
  });

  setupSwipeToDismissForLatestToast(
    () => dismissToastElement(container),
    options.swipeThresholdPx ?? SWIPE_DISMISS_THRESHOLD_PX,
  );
};
