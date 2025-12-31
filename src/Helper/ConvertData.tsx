import toastNotify from "./ToastNotify";


const convertData = (input: any): any => {
  try {
    // Check if input is a string that needs to be parsed (may include escaped quotes)
    if (
      typeof input === "string" &&
      input.startsWith('"') &&
      input.endsWith('"')
    ) {
      const unescapedString = JSON.parse(input); // Unescape the string
      toastNotify(unescapedString, "success");
      return false;
    } else {
      const jsonObj = JSON.parse(input);
      return jsonObj;
    }
  } catch (e) {
    toastNotify(input, "success");
    return false;
  }
};

export default convertData;
