// TodoList.jsx
import React, { useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTodosAsync, toggleTodo } from '../features/todoSlice';
import AddTodo from './AddTodo';
import { deleteTodo } from '../config/api';

const TodoList = () => {
  const dispatch = useDispatch();
  const { todos = [], loading, error, currentPage, hasMore } = useSelector((state) => state.todos);
    // console.log("todos",todos)
  const observer = useRef();
  const lastTodoRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchTodosAsync(currentPage + 1));
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, currentPage, dispatch]
  );

  useEffect(() => {
    dispatch(fetchTodosAsync(1));
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      dispatch(fetchTodosAsync(1));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Render a single todo item (used in both table and card views)
  const renderTodoItem = (todo, index, isLast) => {
    const ref = isLast ? lastTodoRef : null;
    return (
      <div
        key={todo._id}
        ref={ref}
        className="border-b border-gray-200 last:border-0 p-4 hover:bg-gray-50 transition"
      >
        <div className="flex justify-between items-start">
          <div className="font-medium text-gray-800">{todo.title}</div>
          <span
            className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
              todo.completed
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {todo.completed ? 'Completed' : 'Pending'}
          </span>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => dispatch(toggleTodo({ id: todo._id }))}
            className={`px-3 py-1 text-sm rounded-md font-medium flex-1 ${
              todo.completed
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            } transition`}
          >
            {todo.completed ? 'Undo' : 'Complete'}
          </button>
          <button
            onClick={() => handleDelete(todo._id)}
            className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium transition flex-1"
          >
            Delete
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">#{index + 1}</div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">Todo List</h2>

      <div className="mb-8 p-5 bg-white rounded-xl shadow-sm border">
        <AddTodo />
      </div>

      {error && <div className="mb-4 text-center text-red-600 font-medium">{error}</div>}

      <div className="bg-white rounded-xl shadow overflow-hidden border">
        {Array.isArray(todos) && todos.length === 0 && !loading ? (
          <div className="py-12 text-center text-gray-500">
            <p>No todos found. Add one to get started!</p>
          </div>
        ) : (
          <>
            {/* Desktop/Tablet: Table */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Array.isArray(todos) && todos.map((todo, index) => (
                    <tr
                      key={todo._id}
                      ref={index === todos.length - 1 ? lastTodoRef : null}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">{todo.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            todo.completed
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {todo.completed ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => dispatch(toggleTodo({ id: todo._id }))}
                          className={`px-3 py-1 text-sm rounded-md font-medium ${
                            todo.completed
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          } transition`}
                        >
                          {todo.completed ? 'Undo' : 'Complete'}
                        </button>
                        <button
                          onClick={() => handleDelete(todo._id)}
                          className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: Card List */}
            <div className="md:hidden">
              {Array.isArray(todos) && todos.map((todo, index) =>
                renderTodoItem(todo, index, index === todos.length - 1)
              )}
            </div>
          </>
        )}

        {/* Infinite scroll loader (appears on all screens) */}
        {loading && currentPage > 1 && (
          <div className="py-4 text-center text-gray-600 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Loading more todos...
          </div>
        )}

        {/* End of list (appears on all screens) */}
        {!hasMore && todos.length > 0 && (
          <div className="py-4 text-center text-gray-500 text-sm">No more todos to load.</div>
        )}
      </div>
    </div>
  );
};

export default TodoList;