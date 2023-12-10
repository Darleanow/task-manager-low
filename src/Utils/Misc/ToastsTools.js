import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const makeToast = (message, toastId) => {
  const existingToast = toast.isActive(toastId);

  if(existingToast){
    toast.dismiss(toastId);
  }
  toast(message, {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    toastId: toastId,
  });
};

export const makeInfoToast = (infoMessage, toastId) => {
  const existingToast = toast.isActive(toastId);

  if(existingToast){
    toast.dismiss(toastId);
  }
  toast.info(infoMessage, {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    toastId: toastId,
  });
  
};

export const makeSuccessToast = (successMessage, toastId) => {
  
  const existingToast = toast.isActive(toastId);
  if(existingToast){
    toast.dismiss(toastId);
  }
  toast.success(successMessage, {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    toastId: toastId,
  });

};

export const makeWarnToast = (warnMessage,  toastId) => {
  const existingToast = toast.isActive(toastId);
  if(existingToast){
    toast.dismiss(toastId);
  }
  toast.warn(warnMessage, {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    toastId: toastId,
  });
};

export const makeErrorToast = (errorMessage, toastId) => {
  const existingToast = toast.isActive(toastId);
  if(existingToast){
    toast.dismiss(toastId);
  }
  toast.error(errorMessage, {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    toastId: toastId,
  });
};
