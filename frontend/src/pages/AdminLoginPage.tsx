import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';


const AdminLoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/admin/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email }),
            });

            const data = await response.json();
            if (data.message && data.message.includes('OTP sent')) {
                localStorage.setItem('admin_email', email);
                navigate('/admin/verify-otp');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Connection error');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-secondary-light p-6 relative overflow-hidden font-body">
            { }
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

            <div className="w-full max-w-[450px] bg-white/75 backdrop-blur-xl border border-white/80 p-8 md:p-10 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(40,114,161,0.1)] relative z-10 hover:shadow-[0_20px_50px_-10px_rgba(40,114,161,0.15)] transition-all duration-500">
                <div className="mb-8 text-center">
                    <h2 className="font-heading text-[2rem] font-bold bg-gradient-to-br from-primary to-primary-dark bg-clip-text text-transparent tracking-tight mb-2">
                        Admin Portal
                    </h2>
                    <p className="text-text-muted font-medium">Please login to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-text-main mb-2 ml-1 opacity-90">Admin Email Address</label>
                        <input
                            type="email"
                            value={email}
                            required
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-text-main placeholder-text-muted/50 font-medium transition-all shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none focus:shadow-md"
                            placeholder="Enter Admin Email"
                        />
                    </div>

                    {error && (
                        <div className="text-danger text-sm text-center font-bold bg-red-50 py-3 rounded-xl border border-red-100 animate-fade-in flex items-center justify-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full p-4 bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl text-lg font-heading font-bold mt-4 shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 transition-all duration-300 relative overflow-hidden group"
                    >
                        <span className="relative z-10 group-hover:tracking-wide transition-all">Access Dashboard</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>

                    <div className="mt-8 text-center space-y-3">
                        <div className="text-sm font-medium text-text-muted">
                            Only authorized administrators can access this portal
                        </div>
                        <div
                            className="text-xs font-bold text-slate-400 hover:text-primary cursor-pointer transition-colors inline-block pt-2 border-t border-slate-100 px-4"
                            onClick={() => navigate('/login')}
                        >
                            ← Back to User Login
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
