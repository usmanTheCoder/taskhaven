import { router } from '../trpc';
import { authRouter } from './auth';
import { todosRouter } from './todos';

export const appRouter = router({
  auth: authRouter,
  todos: todosRouter,
});

export type AppRouter = typeof appRouter;