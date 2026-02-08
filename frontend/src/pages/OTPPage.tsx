import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';


const OTPPage: React.FC = () => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const [timer, setTimer] = useState(300); // 5 minutes in seconds
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const otpRefs = useRef<HTMLInputElement[]>([]);

    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    const email = location.state?.email;
    const type = location.state?.type || 'login';

    useEffect(() => {
        if (!email) navigate('/login');

        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer, email, navigate]);

    const handleChange = (value: string, index: number) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value !== '' && index < 5) otpRefs.current[index + 1].focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                otpRefs.current[index - 1].focus();
            }
        }
    };

    const handleVerify = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) return;

        setIsSubmitting(true);
        setError('');
        try {
            let endpoint = 'verify-login-otp';
            if (type === 'signup') {
                endpoint = 'verify-signup-otp';
            }

            const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    otp: otpValue
                }),
            });

            const data = await response.json();
            if (data.message && data.message.includes('successful')) {

                if (type === 'login') {
                    const userResponse = await fetch(`${API_BASE_URL}/api/auth/user/${data.userId}`);
                    const userData = await userResponse.json();
                    login(data.userId, {
                        userId: data.userId,
                        full_name: userData.name || email,
                        name: userData.name,
                        email: userData.email,
                        age: userData.age,
                        gender: userData.gender,
                        qualification: userData.qualification,
                        college: userData.college,
                        place: userData.place,
                        state: userData.state,
                        mobile: userData.mobile
                    });
                    navigate('/');
                } else {
                    navigate('/login');
                }
            } else {
                setError(data.message || 'Verification failed');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-5 w-full">
            <div className="w-full max-w-[500px] bg-white/70 backdrop-blur-xl border border-white/80 p-10 rounded-3xl shadow-[0_10px_40px_-10px_rgba(40,114,161,0.1)] transition-transform hover:-translate-y-1">
                <h2 className="font-heading text-3xl font-bold bg-gradient-to-br from-primary to-primary-dark bg-clip-text text-transparent mb-2 text-center tracking-tight">
                    OTP Verification
                </h2>
                <p className="text-base text-text-muted mb-8 text-center font-medium leading-relaxed">
                    Please enter the OTP sent to your email
                </p>

                <div className="mb-8">
                    <label className="block text-center text-sm font-semibold text-text-main mb-3">OTP Verification</label>
                    <div className="flex justify-center gap-2 md:gap-3 my-2">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                className="w-10 h-12 md:w-12 md:h-14 p-0 text-center text-xl md:text-2xl font-bold font-heading border-2 border-gray-200 bg-white rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.05)] text-text-main focus:border-primary focus:ring-4 focus:ring-primary/10 focus:-translate-y-1 transition-all outline-none"
                                value={data}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => { if (el) otpRefs.current[index] = el; }}
                            />
                        ))}
                    </div>
                    <p className="text-center text-sm text-text-muted mt-3">
                        Enter the 6-digit code sent to {email}
                    </p>
                </div>

                {error && <p className="text-danger text-sm text-center mt-4 font-medium animate-pulse">{error}</p>}

                <div className="text-center text-primary font-semibold mt-6 min-h-[24px]">
                    {timer > 0 ? (
                        <span className="text-text-muted">OTP expires in <span className="text-primary font-bold">{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</span></span>
                    ) : (
                        <button
                            className="bg-transparent border-none text-primary font-bold cursor-pointer hover:underline hover:text-primary-dark transition-colors"
                            onClick={async () => {
                                try {
                                    const endpoint = type === 'login' ? 'login' : 'signup';
                                    const res = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ email: email }),
                                    });
                                    const data = await res.json();
                                    if (data.message && data.message.includes('OTP sent')) {
                                        setTimer(300); // Reset to 5 minutes
                                        setError('');
                                        // Clear inputs for fresh start
                                        setOtp(new Array(6).fill(''));
                                        otpRefs.current[0].focus();
                                    } else {
                                        setError(data.message || 'Failed to resend');
                                    }
                                } catch (err) {
                                    setError('Connection error');
                                }
                            }}
                        >
                            Resend OTPs
                        </button>
                    )}
                </div>

                <button
                    className="w-full p-4 bg-gradient-to-br from-primary to-primary-dark text-white rounded-[14px] text-lg font-heading font-semibold mt-8 shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 transition-all disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none relative overflow-hidden"
                    onClick={handleVerify}
                    disabled={otp.join('').length !== 6 || isSubmitting}
                >
                    {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                </button>
            </div>
        </div>
    );
};

export default OTPPage;
