export const genrateVerificationToken = () => {
  let code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
};
