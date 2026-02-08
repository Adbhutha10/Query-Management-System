import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '../config';


interface OTPVerificationProps {
    userId: number;
    onVerifySuccess: (token: string) => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ userId, onVerifySuccess }) => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const [timer, setTimer] = useState(60);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef<HTMLInputElement[]>([]);

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next
        if (element.value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) return;

        setIsSubmitting(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, otpCode }),
            });

            const data = await response.json();
            if (data.success) {
                onVerifySuccess(data.token);
            } else {
                setError(data.message || 'Verification failed');
            }
        } catch (err) {
            console.error(err);
            setError('Error connecting to server');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = () => {
        alert('A new OTP has been sent (Simulated)');
        setTimer(60);
        setOtp(new Array(6).fill(''));
        setError('');
    };

    return (
        <div className="w-full max-w-[480px] bg-white/70 backdrop-blur-xl border border-white/80 p-10 rounded-3xl shadow-[0_10px_40px_-10px_rgba(40,114,161,0.1)] transition-transform hover:-translate-y-1">
            <h2 className="font-heading text-3xl font-bold bg-gradient-to-br from-primary to-primary-dark bg-clip-text text-transparent mb-2 text-center tracking-tight">
                Verify OTP
            </h2>
            <p className="text-base text-text-muted mb-8 text-center font-medium leading-relaxed">
                Enter the 6-digit OTP sent to your email/mobile
            </p>

            <div className="flex justify-center gap-2 md:gap-3 my-6">
                {otp.map((data, index) => (
                    <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        className="w-10 h-12 md:w-12 md:h-14 p-0 text-center text-xl md:text-2xl font-bold font-heading border-2 border-gray-200 bg-white rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.05)] text-text-main focus:border-primary focus:ring-4 focus:ring-primary/10 focus:-translate-y-1 transition-all outline-none"
                        value={data}
                        onChange={(e) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        ref={(el) => { if (el) inputRefs.current[index] = el; }}
                    />
                ))}
            </div>

            {error && <p className="text-danger text-sm text-center mt-4 font-medium animate-pulse">{error}</p>}

            <div className="text-center text-primary font-semibold mt-6 min-h-[24px]">
                {timer > 0 ? (
                    <span className="text-text-muted">Resend OTP in <span className="text-primary font-bold">{timer}</span> seconds</span>
                ) : (
                    <button
                        className="bg-transparent border-none text-primary font-bold cursor-pointer hover:underline hover:text-primary-dark transition-colors"
                        onClick={handleResend}
                    >
                        Resend OTP
                    </button>
                )}
            </div>

            <button
                className="w-full p-4 bg-gradient-to-br from-primary to-primary-dark text-white rounded-[14px] text-lg font-heading font-semibold mt-8 shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 transition-all disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none relative overflow-hidden"
                onClick={handleVerify}
                disabled={otp.join('').length !== 6 || isSubmitting}
            >
                {isSubmitting ? 'Verifying...' : 'Verify Button'}
            </button>
        </div>
    );
};

export default OTPVerification;
