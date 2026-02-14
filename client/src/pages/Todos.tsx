import { useEffect, useState } from 'react';
import { todoAPI } from '../lib/api';

interface Todo {
  id: number;
  content: string;
  status: number;
  userId: number;
}

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTodoContent, setNewTodoContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await todoAPI.getAllTasks();
      setTodos(response.data.data?.tasks || []);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoContent.trim()) return;

    setIsAdding(true);
    try {
      await todoAPI.addTask({ content: newTodoContent.trim() });
      setNewTodoContent('');
      fetchTodos();
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      await todoAPI.updateTask({
        taskId: todo.id,
        status: todo.status === 0 ? 1 : 0,
      });
      fetchTodos();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await todoAPI.deleteTask(id);
      fetchTodos();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Todos</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your tasks and stay organized.</p>
      </div>

      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo} className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTodoContent}
            onChange={(e) => setNewTodoContent(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isAdding}
          />
          <button
            type="submit"
            disabled={isAdding || !newTodoContent.trim()}
            className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAdding ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>

      {/* Todos List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading todos...</div>
        </div>
      ) : todos.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <p className="text-gray-500 dark:text-gray-400">No tasks yet. Add one above to get started!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {todos.map((todo) => {
            const isCompleted = todo.status === 1;
            return (
              <div
                key={todo.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => handleToggleTodo(todo)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-gray-900 dark:text-blue-500 focus:ring-2 focus:ring-gray-900 dark:focus:ring-offset-gray-800"
                  />
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-base font-medium ${isCompleted
                          ? 'text-gray-400 dark:text-gray-500 line-through'
                          : 'text-gray-900 dark:text-white'
                        }`}
                    >
                      {todo.content}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete task"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
