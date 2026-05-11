import * as bulmaToast from "bulma-toast";

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
  text.textContent = useProcessString.replaceLooseLineBreaks(message);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "button is-small is-light ml-3";
  button.textContent = useProcessString.replaceLooseLineBreaks(actionLabel);
  button.addEventListener("click", () => {
    button.disabled = true;
    onUndo();
  });

  container.append(text, button);

  bulmaToast.toast({
    message: container,
    duration,
    type: "is-warning",
    dismissible: true,
    pauseOnHover: true,
    closeOnClick: false,
    animate: { in: "fadeIn", out: "fadeOut" },
  });
};
