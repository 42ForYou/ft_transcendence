const formDataToStr = (formData) => {
  let formDataString = "";
  for (const [key, value] of formData.entries()) {
    formDataString += `${key}: ${value}\n`;
  }
  return formDataString;
};

export default formDataToStr;
