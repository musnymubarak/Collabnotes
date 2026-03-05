import { Link } from 'react-router-dom';

const features = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
        ),
        title: 'Rich Note Editing',
        desc: 'Create and organize notes with a clean, distraction-free editor.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        title: 'Real-Time Collaboration',
        desc: 'Work together with your team on shared notes in real time.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
        title: 'Secure & Private',
        desc: 'Your notes are protected with authentication and access controls.',
    },
];

export default function Landing() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="w-full flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur border-b border-gray-100">
                <span className="text-xl font-bold text-indigo-600 tracking-tight">CollabNotes</span>
                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition px-3 py-2"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                        Notes, together —{' '}
                        <span className="text-indigo-600">in real time</span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-500 max-w-lg mx-auto">
                        CollabNotes lets you create, edit, and share notes with your team instantly.
                        Stay organized and collaborate without friction.
                    </p>

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Link
                            to="/register"
                            id="cta-get-started"
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/login"
                            id="cta-sign-in"
                            className="border border-gray-200 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:border-indigo-300 hover:text-indigo-600 transition"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl w-full mb-16">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className="bg-white rounded-2xl p-6 shadow-sm text-left hover:shadow-md transition"
                        >
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-4">
                                {f.icon}
                            </div>
                            <h3 className="text-sm font-semibold text-gray-800 mb-1">{f.title}</h3>
                            <p className="text-sm text-gray-500">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center text-xs text-gray-400 py-6 border-t border-gray-100">
                © {new Date().getFullYear()} CollabNotes. All rights reserved.
            </footer>
        </div>
    );
}
