import { useEffect, useState } from 'react';
import { blogAPI } from '../lib/api';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: number;
  title: string;
  createdAt: string;
  _count: {
    likes: number;
  };
}

export default function MyBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBlogs = async () => {
    setLoading(true);
    try {
      const response = await blogAPI.getMyBlogs();
      setBlogs(response.data.data);
    } catch (error) {
      console.error('Failed to fetch my blogs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await blogAPI.delete(blogId);
      setBlogs((prev) => prev.filter((b) => b.id !== blogId));
    } catch (error) {
      console.error('Failed to delete blog', error);
      alert('Failed to delete blog post');
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Blogs</h1>
        <Link
          to="/blogs/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </Link>
      </div>

      {loading ? (
         <div className="flex justify-center p-8">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
         </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">You haven't posted any blogs yet.</p>
              <Link to="/blogs/create" className="text-blue-600 hover:underline">
                Create your first blog post
              </Link>
            </div>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Published on {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    <span>{blog._count?.likes || 0}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/blogs/${blog.id}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-3 py-1 rounded bg-blue-50 dark:bg-blue-900/20 text-sm font-medium transition-colors"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 px-3 py-1 rounded bg-red-50 dark:bg-red-900/20 text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
