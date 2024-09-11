import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { createRouter } from '../createRouter';
import { prisma } from '@/lib/prisma';
import { signJwt, verifyJwt } from '@/lib/auth';

export const authRouter = createRouter()
  .mutation('register', {
    input: z.object({
      email: z.string().email(),
      password: z.string().min(8),
      name: z.string().min(2),
    }),
    async resolve({ input }) {
      const { email, password, name } = input;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new TRPCError({ code: 'CONFLICT', message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      const token = signJwt({ userId: user.id });

      return { user, token };
    },
  })
  .mutation('login', {
    input: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
    async resolve({ input }) {
      const { email, password } = input;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid password' });
      }

      const token = signJwt({ userId: user.id });

      return { user, token };
    },
  })
  .query('me', {
    async resolve({ ctx }) {
      const authHeader = ctx.req.headers.get('authorization');
      if (!authHeader) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing authorization header' });
      }

      const token = authHeader.split(' ')[1];
      const payload = verifyJwt(token);
      if (!payload) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' });
      }

      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      return user;
    },
  });