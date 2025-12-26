export const getSanatizedUser = (user) => {
  const sanatizedUser = user.toObject();
  delete sanatizedUser.password;
  delete sanatizedUser.__v;
  return sanatizedUser;
};
