import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';


const SignupPage: React.FC = () => {
    const [fields, setFields] = useState({
        full_name: '',
        age: '',
        gender: '',
        qualification: '',
        college_name: '',
        location: '',
        mobile_number: '',
        email: '',
    });
    const [errors, setErrors] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        let newErrors: any = {};
        if (!fields.full_name) newErrors.full_name = "Full name is required";
        if (!fields.age || parseInt(fields.age) < 16 || parseInt(fields.age) > 80) newErrors.age = "Age must be 16-80";
        if (!fields.gender) newErrors.gender = "Gender is required";
        if (!fields.qualification) newErrors.qualification = "Qualification is required";
        if (!fields.college_name) newErrors.college_name = "College name is required";
        if (!fields.location) newErrors.location = "Location is required";
        if (!fields.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) newErrors.email = "Invalid email format";
        if (!fields.mobile_number || !/^\d{10}$/.test(fields.mobile_number)) newErrors.mobile_number = "Mobile number must be 10 digits";
        return newErrors;
    };

    const isFormValid = () => {
        const errs = validate();
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const valErrors = validate();
        if (Object.keys(valErrors).length > 0) {
            setErrors(valErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});
        try {
            const response = await fetch(API_BASE_URL + '/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: fields.full_name,
                    age: fields.age,
                    gender: fields.gender,
                    qualification: fields.qualification,
                    college: fields.college_name,
                    place: fields.location.split(',')[0]?.trim() || fields.location,
                    state: fields.location.split(',')[1]?.trim() || '',
                    mobile: fields.mobile_number,
                    email: fields.email
                }),
            });

            const data = await response.json();
            if (data.message && data.message.includes('OTP sent')) {
                localStorage.setItem('temp_user_data', JSON.stringify(fields));
                navigate('/verify-otp', { state: { email: fields.email, type: 'signup' } });
            } else {
                alert(data.message || 'Signup failed');
            }
        } catch (err) {
            alert('Connection error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: any) => {
        setFields({ ...fields, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-5 w-full">
            <div className="w-full max-w-[550px] bg-white/70 backdrop-blur-xl border border-white/80 p-8 rounded-3xl shadow-[0_10px_40px_-10px_rgba(40,114,161,0.1)] transition-transform hover:-translate-y-1">
                <h2 className="font-heading text-3xl font-bold bg-gradient-to-br from-primary to-primary-dark bg-clip-text text-transparent mb-2 text-center tracking-tight">
                    Create Your Account
                </h2>
                <p className="text-base text-text-muted mb-6 text-center font-medium leading-relaxed">
                    Please fill in your correct details
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-text-main mb-1.5 ml-1">Full Name</label>
                        <input
                            name="full_name"
                            value={fields.full_name}
                            onChange={handleChange}
                            className="w-full p-3.5 border-2 border-gray-200 bg-white rounded-xl text-base text-text-main font-body transition-all shadow-[0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none focus:border-primary-light focus:ring-4 focus:ring-primary/10"
                        />
                        {errors.full_name && <p className="text-danger text-xs mt-1 ml-1 font-medium">{errors.full_name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-text-main mb-1.5 ml-1">Age</label>
                            <input
                                name="age"
                                type="number"
                                value={fields.age}
                                onChange={handleChange}
                                className="w-full p-3.5 border-2 border-gray-200 bg-white rounded-xl text-base text-text-main font-body transition-all shadow-[0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none focus:border-primary-light focus:ring-4 focus:ring-primary/10"
                            />
                            {errors.age && <p className="text-danger text-xs mt-1 ml-1 font-medium">{errors.age}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-text-main mb-1.5 ml-1">Gender</label>
                            <select
                                name="gender"
                                value={fields.gender}
                                onChange={handleChange}
                                className="w-full p-3.5 border-2 border-gray-200 bg-white rounded-xl text-base text-text-main font-body transition-all shadow-[0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none focus:border-primary-light focus:ring-4 focus:ring-primary/10 appearance-none bg-no-repeat bg-[right_1rem_center]"
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.gender && <p className="text-danger text-xs mt-1 ml-1 font-medium">{errors.gender}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm border-gray-200 font-semibold text-text-main mb-1.5 ml-1">Qualification</label>
                        <input
                            name="qualification"
                            value={fields.qualification}
                            onChange={handleChange}
                            className="w-full p-3.5 border-2 border-gray-200 bg-white rounded-xl text-base text-text-main font-body transition-all shadow-[0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none focus:border-primary-light focus:ring-4 focus:ring-primary/10"
                        />
                        {errors.qualification && <p className="text-danger text-xs mt-1 ml-1 font-medium">{errors.qualification}</p>}
                    </div>
                    <div>
                        <label className="block text-sm border-gray-200 font-semibold text-text-main mb-1.5 ml-1">College Name</label>
                        <input
                            name="college_name"
                            value={fields.college_name}
                            onChange={handleChange}
                            className="w-full p-3.5 border-2 border-gray-200 bg-white rounded-xl text-base text-text-main font-body transition-all shadow-[0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none focus:border-primary-light focus:ring-4 focus:ring-primary/10"
                        />
                        {errors.college_name && <p className="text-danger text-xs mt-1 ml-1 font-medium">{errors.college_name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm border-gray-200 font-semibold text-text-main mb-1.5 ml-1">Location (Place & State)</label>
                        <input
                            name="location"
                            value={fields.location}
                            onChange={handleChange}
                            className="w-full p-3.5 border-2 border-gray-200 bg-white rounded-xl text-base text-text-main font-body transition-all shadow-[0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none focus:border-primary-light focus:ring-4 focus:ring-primary/10"
                        />
                        {errors.location && <p className="text-danger text-xs mt-1 ml-1 font-medium">{errors.location}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm border-gray-200 font-semibold text-text-main mb-1.5 ml-1">Mobile Number</label>
                            <input
                                name="mobile_number"
                                value={fields.mobile_number}
                                onChange={handleChange}
                                className="w-full p-3.5 border-2 border-gray-200 bg-white rounded-xl text-base text-text-main font-body transition-all shadow-[0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none focus:border-primary-light focus:ring-4 focus:ring-primary/10"
                            />
                            {errors.mobile_number && <p className="text-danger text-xs mt-1 ml-1 font-medium">{errors.mobile_number}</p>}
                        </div>
                        <div>
                            <label className="block text-sm border-gray-200 font-semibold text-text-main mb-1.5 ml-1">Email ID</label>
                            <input
                                name="email"
                                value={fields.email}
                                onChange={handleChange}
                                className="w-full p-3.5 border-2 border-gray-200 bg-white rounded-xl text-base text-text-main font-body transition-all shadow-[0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none focus:border-primary-light focus:ring-4 focus:ring-primary/10"
                            />
                            {errors.email && <p className="text-danger text-xs mt-1 ml-1 font-medium">{errors.email}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full p-4 bg-gradient-to-br from-primary to-primary-dark text-white rounded-[14px] text-lg font-heading font-semibold mt-6 shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 transition-all disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none relative overflow-hidden"
                        disabled={isLoading || !isFormValid()}
                    >
                        {isLoading ? 'Processing...' : 'Register & Get OTP'}
                    </button>
                </form>
                <div className="mt-6 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-primary font-semibold hover:text-primary-dark hover:underline transition-colors">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
