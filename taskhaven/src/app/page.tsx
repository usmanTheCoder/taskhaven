'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { RootState } from '@/redux/store';
import { addTodo, toggleTodo, deleteTodo, fetchTodos } from '@/redux/slices/todoSlice';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/utils';
import Link from 'next/link';

const Home = () => {
  const dispatch = useDispatch();
  const { todos, loading, error } = useSelector((state: RootState) => state.todos);
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const utils = trpc.useContext();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTodos());
    }
  }, [dispatch, isAuthenticated]);

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      newTodo: { value: string };
    };
    const newTodo = target.newTodo.value.trim();
    if (newTodo) {
      const result = await utils.todos.addTodo.mutate({ text: newTodo });
      if (result.success) {
        dispatch(addTodo(result.data));
        target.newTodo.value = '';
      } else {
      }
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    const result = await utils.todos.toggleTodo.mutate({ id, completed: !completed });
    if (result.success) {
      dispatch(toggleTodo(id));
    } else {
    }
  };

  const handleDeleteTodo = async (id: string) => {
    const result = await utils.todos.deleteTodo.mutate({ id });
    if (result.success) {
      dispatch(deleteTodo(id));
    } else {
    }
  };

  return (
    <main className="container mx-auto max-w-3xl py-8">
      <h1 className="text-4xl font-bold mb-8">Task Haven</h1>
      {authLoading ? (
        <div>Loading...</div>
      ) : isAuthenticated ? (
        <>
          <form onSubmit={handleAddTodo} className="flex mb-4">
            <input
              type="text"
              name="newTodo"
              placeholder="Enter a new task"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors duration-200"
            >
              <FaPlus />
            </button>
          </form>
          {loading ? (
            <div>Loading todos...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <ul>
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between mb-2 px-4 py-2 bg-white rounded-md shadow"
                >
                  <div className="flex items-center">
                    <button
                      onClick={() => handleToggleTodo(todo.id, todo.completed)}
                      className="mr-4 text-2xl"
                    >
                      {todo.completed ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <FaTimesCircle className="text-red-500" />
                      )}
                    </button>
                    <span
                      className={`${todo.completed ? 'line-through text-gray-500' : ''}`}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-600 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div>
          <p>You must be logged in to use Task Haven.</p>
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </div>
      )}
    </main>
  );
};

export default Home;