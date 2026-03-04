import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import RichEditor from '../components/RichEditor';
import CollaboratorPanel from '../components/CollaboratorPanel';
import toast from 'react-hot-toast';

export default function NotePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [note, setNote] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [showCollabs, setShowCollabs] = useState(false);

    useEffect(() => {
        api.get(`/notes/${id}`).then(({ data }) => {
            setNote(data);
            setTitle(data.title);
            setContent(data.content);
        }).catch(() => {
            toast.error('Note not found');
            navigate('/dashboard');
        });
    }, [id]);

    const isOwner = note?.owner._id === user?._id;
    const isEditor = isOwner || note?.collaborators?.find(
        (c) => c.user._id === user?._id && c.role === 'editor'
    );

    const handleSave = useCallback(async () => {
        setSaving(true);
        try {
            await api.put(`/notes/${id}`, { title, content });
            toast.success('Saved');
        } catch {
            toast.error('Save failed');
        } finally {
            setSaving(false);
        }
    }, [id, title, content]);

    if (!note) return <div className="p-8 text-sm text-gray-400">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
                <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-400 hover:text-gray-700">
                    ← Back
                </button>
                <div className="flex gap-3">
                    {isOwner && (
                        <button
                            onClick={() => setShowCollabs(!showCollabs)}
                            className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                        >
                            Collaborators
                        </button>
                    )}
                    {isEditor && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    )}
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={!isEditor}
                    className="w-full text-2xl font-bold text-gray-800 border-none outline-none bg-transparent mb-4 disabled:cursor-default"
                />
                <RichEditor content={content} onChange={setContent} editable={!!isEditor} />

                {showCollabs && (
                    <CollaboratorPanel
                        note={note}
                        onUpdate={(updated) => setNote(updated)}
                    />
                )}
            </main>
        </div>
    );
}