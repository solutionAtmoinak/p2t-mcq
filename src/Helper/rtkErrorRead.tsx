import { StatusCodes } from "http-status-codes";
import toastNotify from "./ToastNotify";

const rtkErrorRead = (error: any) => {
  if ("status" in error!) {
    const data: any = error?.data!;
    if (data && data.errorMessages) {
      toastNotify(
        `${error?.status}: ${data.errorMessages?.join("<br />")}`,
        "error"
      );
    } else {
      if (typeof error?.status === "number") {
        toastNotify(
          `${error?.status}: ${StatusCodes[error?.status] || "Unknown Status Code"
          }`,
          "error"
        );
      } else {
        toastNotify(`${error?.status}: ${error?.error}`, "error");
      }
    }
  } else {
    console.error(error);
  }
};

export default rtkErrorRead;
