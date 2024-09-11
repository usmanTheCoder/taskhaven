import { hash, compare } from 'bcryptjs';
import { prisma } from './prisma';
import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = process.env.SECRET_KEY || 'changeme';

export const hashPassword = async (password: string) => {
  try {
    const hashedPassword = await hash(password, 12);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Error hashing password');
  }
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
) => {
  try {
    const isValid = await compare(password, hashedPassword);
    return isValid;
  } catch (error) {
    console.error('Error verifying password:', error);
    throw new Error('Error verifying password');
  }
};

export const signJwt = async (user: { email: string; id: string }) => {
  const payload = { email: user.email, userId: user.id };
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(SECRET_KEY));

  return token;
};

export const verifyJwt = async (token: string) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(SECRET_KEY),
    );
    return verified.payload;
  } catch (error) {
    console.error('Error verifying JWT:', error);
    throw new Error('Error verifying JWT');
  }
};

export const getUserFromToken = async (token: string) => {
  try {
    const payload = await verifyJwt(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
    });
    return user;
  } catch (error) {
    console.error('Error getting user from token:', error);
    throw new Error('Error getting user from token');
  }
};