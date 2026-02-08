import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';


const LoginPage: React.FC = () => {
    const [contact, setContact] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        if (!contact) return "Email is required";
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
        if (!isEmail) return "Invalid email format";
        return "";
    };

    const isFormValid = () => {
        const err = validate();
        return err === "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const valError = validate();
        if (valError) {
            setError(valError);
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
            if (!isEmail) {
                setError('Invalid email format. Please enter a valid email address');
                setIsLoading(false);
                return;
            }

            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: contact }),
            });

            const data = await response.json();
            if (response.ok && data.message && data.message.includes('OTP sent')) {
                navigate('/verify-otp', { state: { email: contact, type: 'login' } });
            } else if (!response.ok) {
                if (data.message && (data.message.includes('not found') || data.message.includes('not activated'))) {
                    setError('User not found. Please sign up first');
                } else {
                    setError(data.message || 'Login failed. Please try again');
                }
            } else {
                setError('Login failed. Please try again');
            }
        } catch (err) {
            setError('Connection error. Please check your internet and try again');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-5 w-full">
            <div className="w-full max-w-[550px] bg-white/70 backdrop-blur-xl border border-white/80 p-10 rounded-3xl shadow-[0_10px_40px_-10px_rgba(40,114,161,0.1)] transition-transform hover:-translate-y-1">
                <h2 className="font-heading text-3xl font-bold bg-gradient-to-br from-primary to-primary-dark bg-clip-text text-transparent mb-2 text-center tracking-tight">
                    Login to Your Account
                </h2>
                <p className="text-base text-text-muted mb-10 text-center font-medium leading-relaxed">
                    Enter your email to get an OTP
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-text-main mb-2 ml-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="example@mail.com"
                            className="w-full p-4 border-2 border-gray-200 bg-white rounded-xl text-base text-text-main font-body transition-all shadow-[0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none focus:border-primary-light focus:ring-4 focus:ring-primary/10"
                            aria-label="Email address"
                        />
                        {error && (
                            <p className="text-danger text-sm mt-2 flex items-center gap-1.5 font-medium">
                                {error}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full p-4 bg-gradient-to-br from-primary to-primary-dark text-white rounded-[14px] text-lg font-heading font-semibold mt-4 shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 transition-all disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none relative overflow-hidden"
                        disabled={isLoading || !isFormValid()}
                    >
                        {isLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:text-primary-dark hover:underline transition-colors">Sign Up</Link>
                </div>
                <div className="mt-3 text-center text-sm">
                    <Link to="/admin/login" className="text-text-muted hover:text-text-main transition-colors no-underline">Admin Portal Access</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
