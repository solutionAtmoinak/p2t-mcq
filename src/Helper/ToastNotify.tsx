import { TypeOptions, toast } from "react-toastify";

const toastNotify = (message: string, type: TypeOptions = "success") => {
  let displayMessage = message;

  try {
   
    const parsedMessage = JSON.parse(message);
    if (typeof parsedMessage === "string") {
      displayMessage = parsedMessage;
    } else {
      displayMessage = JSON.stringify(parsedMessage, null, 2); 
    }
  } catch (e) {
 
    displayMessage = message;
  }

  toast(displayMessage, {
    type: type,
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export default toastNotify;
