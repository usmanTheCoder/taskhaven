import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import { FaCheck, FaTrash } from "react-icons/fa";

const defaultTodoSelect = Prisma.validator<Prisma.TodoSelect>()({
  id: true,
  title: true,
  description: true,
  completed: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const todosRouter = router({
  getAllTodos: protectedProcedure
    .input(
      z.object({
        filter: z
          .object({
            search: z.string().optional(),
            completed: z.boolean().optional(),
          })
          .optional(),
        take: z.number().min(1).max(100).optional(),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { filter, take = 10, cursor } = input;
      const userId = ctx.session.user.id;

      const items = await prisma.todo.findMany({
        where: {
          userId,
          ...(filter?.search && {
            title: {
              contains: filter.search,
              mode: "insensitive",
            },
          }),
          ...(filter?.completed !== undefined && {
            completed: filter.completed,
          }),
        },
        cursor: cursor ? { id: cursor } : undefined,
        take: take + 1,
        orderBy: {
          createdAt: "desc",
        },
        select: defaultTodoSelect,
      });

      let nextCursor: string | null = null;
      if (items.length > take) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id || null;
      }

      return {
        items,
        nextCursor,
      };
    }),

  getTodoById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const todo = await prisma.todo.findFirst({
        where: {
          id: input,
          userId,
        },
        select: defaultTodoSelect,
      });

      if (!todo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Todo not found",
        });
      }

      return todo;
    }),

  createTodo: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const todo = await prisma.todo.create({
        data: {
          ...input,
          userId,
        },
        select: defaultTodoSelect,
      });

      return todo;
    }),

  updateTodo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          title: z.string().min(1).max(100).optional(),
          description: z.string().optional(),
          completed: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, data } = input;
      const userId = ctx.session.user.id;

      const todo = await prisma.todo.findUnique({
        where: {
          id,
        },
      });

      if (!todo || todo.userId !== userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Todo not found",
        });
      }

      const updatedTodo = await prisma.todo.update({
        where: {
          id,
        },
        data,
        select: defaultTodoSelect,
      });

      return updatedTodo;
    }),

  deleteTodo: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const todo = await prisma.todo.findUnique({
        where: {
          id: input,
        },
      });

      if (!todo || todo.userId !== userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Todo not found",
        });
      }

      await prisma.todo.delete({
        where: {
          id: input,
        },
      });

      return {
        success: true,
        message: "Todo deleted successfully",
      };
    }),
});