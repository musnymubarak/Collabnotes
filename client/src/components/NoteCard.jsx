import { Link } from 'react-router-dom';

export default function NoteCard({ note, onDelete }) {
    // Strip HTML tags from rich text to show a plain text preview
    const previewContent = note.content
        ? note.content.replace(/<[^>]+>/g, '').substring(0, 120) + '...'
        : 'No content';

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition group relative flex flex-col h-full">
            <Link to={`/notes/${note._id}`} className="flex-1 block">
                <h3 className="text-base font-semibold text-gray-800 mb-2 truncate pr-6">
                    {note.title || 'Untitled Note'}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-3 overflow-hidden text-ellipsis">
                    {previewContent}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-2 border-t border-gray-50">
                    <span>
                        {new Date(note.updatedAt || note.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                    {note.collaborators?.length > 0 && (
                        <span className="bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            {note.collaborators.length} collab(s)
                        </span>
                    )}
                </div>
            </Link>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(note._id);
                }}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                title="Delete note"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    );
}
