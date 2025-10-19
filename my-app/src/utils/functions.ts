export const isExpired = () => {
  const token = localStorage.getItem("token");
  const tokenDetails = JSON.parse(atob(token!.split(".")[1]));
  const isExpired = tokenDetails.exp * 1000 < Date.now();
  if (isExpired) {
    localStorage.clear();
  }
  return isExpired;
};
