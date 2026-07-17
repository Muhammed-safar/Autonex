import JWT from "jsonwebtoken";

export const generateToken = (userId) => {
  return JWT.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
