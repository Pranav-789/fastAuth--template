import { useState, useRef } from 'react';
import { blogAPI } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FONTS = ['Arial', 'Inter', 'Georgia', 'Courier New', 'Times New Roman', 'Verdana'];
const SIZES = [
  { label: 'Small', value: '2' },
  { label: 'Normal', value: '3' },
  { label: 'Large', value: '5' },
  { label: 'Huge', value: '7' },
];

export default function CreateBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return; // Should be protected by Route but good to check

    setLoading(true);
    setError('');

    // If editor content is empty or just <br> tags
    const cleanContent = content.replace(/<[^>]*>?/gm, '').trim();
    if (!cleanContent) {
       setError("Content cannot be empty");
       setLoading(false);
       return;
    }

    try {
      await blogAPI.create({
        title,
        content,
      });
      navigate('/blogs');
    } catch (err: unknown) {
      const errorMessage = (err as any).response?.data?.message || 'Failed to create blog post';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-0 min-h-[calc(100vh-6rem)] flex flex-col">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 shadow-sm border border-red-100 dark:border-red-900/50">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[600px]">
        
        {/* Editor Action Bar */}
        <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/80 sticky top-0 z-10 backdrop-blur-sm flex-wrap gap-4">
          
          {/* Formatting Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <select 
                onChange={(e) => handleFormat('fontName', e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm rounded-lg px-2 py-1.5 outline-none text-gray-700 dark:text-gray-200 cursor-pointer"
            >
                <option value="">Font Family</option>
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            
            <select 
                onChange={(e) => handleFormat('fontSize', e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm rounded-lg px-2 py-1.5 outline-none text-gray-700 dark:text-gray-200 cursor-pointer"
            >
                <option value="">Text Size</option>
                {SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-600 mx-1 hidden sm:block"></div>

            <button
                type="button"
                onClick={() => handleFormat('bold')}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold font-serif transition-colors"
                title="Bold"
            >
                B
            </button>
            <button
                type="button"
                onClick={() => handleFormat('italic')}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 italic font-serif transition-colors"
                title="Italic"
            >
                I
            </button>
            <button
                type="button"
                onClick={() => handleFormat('underline')}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 underline font-serif transition-colors"
                title="Underline"
            >
                U
            </button>
          </div>

          <div className="flex justify-end gap-3 ml-auto">
            <button
              type="button"
              onClick={() => navigate('/blogs')}
              className="px-4 py-1.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="px-5 py-1.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md hover:shadow-blue-500/20 text-sm"
            >
              {loading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="p-8 md:p-12 flex-1 flex flex-col h-full bg-white dark:bg-gray-800">
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white bg-transparent outline-none placeholder-gray-300 dark:placeholder-gray-600 mb-8 border-none focus:ring-0 p-0"
            placeholder="Document Title"
            required
            maxLength={100}
          />
          
          <div
             ref={editorRef}
             id="content"
             contentEditable
             onInput={(e) => setContent(e.currentTarget.innerHTML)}
             className="w-full flex-1 text-lg text-gray-700 dark:text-gray-300 bg-transparent outline-none border-none focus:ring-0 p-0 font-serif leading-relaxed"
             style={{ minHeight: '300px' }}
             data-placeholder="Start writing to the world..."
          />
        </div>
      </form>
      <style>{`
        div[contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9CA3AF; /* Tailwind gray-400 */
            cursor: text;
        }
        .dark div[contenteditable]:empty:before {
            color: #6B7280; /* Tailwind gray-500 */
        }
      `}</style>
    </div>
  );
}
