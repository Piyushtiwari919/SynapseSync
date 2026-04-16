export const getSanatizedUser = (user) => {
  if (!user) return null;

  const plainUser = typeof user.toObject === "function" ? user.toObject() : user;
  const { password, __v, ...sanitizedData } = plainUser;

  return sanitizedData;
};

export const messageSanitization = (message) => {
  if (message.trim() == "") {
    throw new Error("The message is empty");
  }
};
