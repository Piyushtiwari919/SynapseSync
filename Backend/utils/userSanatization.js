export const getSanatizedUser = (user) => {
  const userObj = (user.toObject && typeof user.toObject === 'function') 
  ? user.toObject() 
  : user;
  delete userObj.password;
  delete userObj.__v;
  return userObj;
};
