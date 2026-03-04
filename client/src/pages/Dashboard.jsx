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
    const debouncedSearch = useDebounce(search);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const loadNotes = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await fetchNotes({ search: debouncedSearch, page: 1, limit: 20 });
            setNotes(data.notes);
        } catch {
            toast.error('Failed to load notes');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch]);

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
                    <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">Logout</button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-6">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search notes..."
                        className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleCreate}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                    >
                        + New Note
                    </button>
                </div>

                {loading ? (
                    <p className="text-sm text-gray-400 text-center mt-12">Loading...</p>
                ) : notes.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center mt-12">No notes yet. Create one!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {notes.map((note) => (
                            <NoteCard key={note._id} note={note} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}