import { RootState } from '@/redux/store';

declare module 'react-redux' {
  interface DefaultRootState extends RootState {}
}

declare module '@reduxjs/toolkit' {
  interface SerializableStatePreloadedState {
    auth: AuthState;
    todos: TodosState;
    ui: UIState;
  }
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TodosState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
}

interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface UIState {
  isModalOpen: boolean;
  modalContent: ModalContent | null;
  isLoading: boolean;
  error: string | null;
}

type ModalContent =
  | 'login'
  | 'signup'
  | 'forgotPassword'
  | 'resetPassword'
  | 'createTodo'
  | 'updateTodo';