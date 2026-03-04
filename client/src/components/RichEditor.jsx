import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

const MenuBar = ({ editor }) => {
    if (!editor) return null;
    const btn = (action, label, active) => (
        <button
            key={label}
            onMouseDown={(e) => { e.preventDefault(); action(); }}
            className={`px-2 py-1 rounded text-xs font-medium transition ${active ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="flex flex-wrap gap-1 border-b border-gray-100 p-2">
            {btn(() => editor.chain().focus().toggleBold().run(), 'Bold', editor.isActive('bold'))}
            {btn(() => editor.chain().focus().toggleItalic().run(), 'Italic', editor.isActive('italic'))}
            {btn(() => editor.chain().focus().toggleStrike().run(), 'Strike', editor.isActive('strike'))}
            {btn(() => editor.chain().focus().toggleBulletList().run(), 'List', editor.isActive('bulletList'))}
            {btn(() => editor.chain().focus().toggleOrderedList().run(), 'Ordered', editor.isActive('orderedList'))}
            {btn(() => editor.chain().focus().toggleBlockquote().run(), 'Quote', editor.isActive('blockquote'))}
            {btn(() => editor.chain().focus().toggleCodeBlock().run(), 'Code', editor.isActive('codeBlock'))}
        </div>
    );
};

export default function RichEditor({ content, onChange, editable = true }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: 'Start writing...' }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    });

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            {editable && <MenuBar editor={editor} />}
            <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none p-4 min-h-[400px] outline-none"
            />
        </div>
    );
}