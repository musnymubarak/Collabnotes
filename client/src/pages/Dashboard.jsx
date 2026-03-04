import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNotes, createNote, deleteNote } from '../api/notes';
import { logoutUser } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { useDebounce } from '../hooks/useDebounce';
import NoteCard from '../components/NoteCard';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 9;

    const debouncedSearch = useDebounce(search);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const loadNotes = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await fetchNotes({ search: debouncedSearch, page, limit: LIMIT });
            setNotes(data.notes);
            setTotalPages(data.pages);
        } catch {
            toast.error('Failed to load notes');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, page]);

    // Reset to page 1 when search changes
    useEffect(() => { setPage(1); }, [debouncedSearch]);
    useEffect(() => { loadNotes(); }, [loadNotes]);

    const handleCreate = async () => {
        try {
            const { data } = await createNote({ title: 'Untitled Note', content: '' });
            navigate(`/notes/${data._id}`);
        } catch {
            toast.error('Could not create note');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNote(id);
            setNotes((prev) => prev.filter((n) => n._id !== id));
            toast.success('Note deleted');
            // If we deleted the last item on a non-first page, go back
            if (notes.length === 1 && page > 1) setPage((p) => p - 1);
        } catch {
            toast.error('Delete failed');
        }
    };

    const handleLogout = async () => {
        await logoutUser();
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <h1 className="text-lg font-semibold text-gray-800">CollabNotes</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{user?.username}</span>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-500 hover:text-gray-800 transition"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleCreate}
                        className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition whitespace-nowrap"
                    >
                        + New Note
                    </button>
                </div>

                {loading ? (
                    <div className="text-sm text-gray-400 text-center py-16">Loading...</div>
                ) : notes.length === 0 ? (
                    <div className="text-sm text-gray-400 text-center py-16">
                        {search ? 'No notes match your search.' : 'No notes yet. Create your first one!'}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {notes.map((note) => (
                            <NoteCard
                                key={note._id}
                                note={note}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            ← Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`px-3 py-1.5 text-sm rounded-lg border transition ${p === page
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
