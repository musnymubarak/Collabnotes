import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function CollaboratorPanel({ note, onUpdate }) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('viewer');
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const { data } = await api.post(`/notes/${note._id}/collaborators`, { email, role });
            onUpdate(data);
            setEmail('');
            toast.success('Collaborator added');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add collaborator');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (userId) => {
        try {
            const { data } = await api.delete(`/notes/${note._id}/collaborators/${userId}`);
            onUpdate(data);
            toast.success('Removed');
        } catch {
            toast.error('Could not remove collaborator');
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const { data } = await api.put(`/notes/${note._id}/collaborators/${userId}`, { role: newRole });
            onUpdate(data);
        } catch {
            toast.error('Failed to update role');
        }
    };

    return (
        <div className="mt-6 bg-white border border-gray-100 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Manage Collaborators</h3>

            <div className="flex gap-2 mb-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="User email"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none"
                >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                </select>
                <button
                    onClick={handleAdd}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                >
                    Add
                </button>
            </div>

            {note.collaborators?.length === 0 ? (
                <p className="text-xs text-gray-400">No collaborators yet.</p>
            ) : (
                <ul className="space-y-2">
                    {note.collaborators.map((c) => (
                        <li key={c.user._id} className="flex items-center justify-between text-sm">
                            <div>
                                <span className="font-medium text-gray-700">{c.user.username}</span>
                                <span className="text-gray-400 ml-2 text-xs">{c.user.email}</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <select
                                    value={c.role}
                                    onChange={(e) => handleRoleChange(c.user._id, e.target.value)}
                                    className="text-xs border border-gray-200 rounded px-2 py-1 outline-none"
                                >
                                    <option value="viewer">Viewer</option>
                                    <option value="editor">Editor</option>
                                </select>
                                <button
                                    onClick={() => handleRemove(c.user._id)}
                                    className="text-xs text-red-400 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}