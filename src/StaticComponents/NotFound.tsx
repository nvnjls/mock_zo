import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0b1120] via-[#111827] to-[#0f172a] text-slate-100 p-6">
            {/* Icon */}
            <div className="mb-6 p-6 rounded-full bg-red-500/10 border border-red-500/30">
                <AlertTriangle className="h-12 w-12 text-red-400" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold mb-2">404 – Page Not Found</h1>
            <p className="text-slate-400 text-center max-w-md mb-8">
                Oops! The page you’re looking for doesn’t exist.
                Maybe the link is broken, or you mistyped the address.
            </p>

            {/* Actions */}
            <div className="flex gap-4">
                <Link
                    to="/"
                    className="px-5 py-2 rounded-xl bg-emerald-400 text-slate-900 font-semibold hover:bg-emerald-300 transition"
                >
                    Back to Home
                </Link>
                <Link
                    to="/admin"
                    className="px-5 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition"
                >
                    Admin Login
                </Link>
            </div>

            {/* Footer note */}
            <div className="mt-10 text-xs text-slate-500">
                Need help? Reach out to our support team.
            </div>
        </div>
    );
};

export default NotFound;