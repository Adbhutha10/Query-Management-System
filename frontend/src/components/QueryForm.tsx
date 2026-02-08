import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';


interface FormFields {
    full_name: string;
    age: string;
    gender: string;
    qualification: string;
    college_name: string;
    location: string;
    mobile_number: string;
    email: string;
    query_text: string;
    otp_method: 'email' | 'mobile';
}

interface Errors {
    [key: string]: string;
}

interface QueryFormProps {
    onSubmitSuccess: (userId: string) => void;
}

const QueryForm: React.FC<QueryFormProps> = ({ onSubmitSuccess }) => {
    const [fields, setFields] = useState<FormFields>({
        full_name: '',
        age: '',
        gender: '',
        qualification: '',
        college_name: '',
        location: '',
        mobile_number: '',
        email: '',
        query_text: '',
        otp_method: 'email',
    });

    const [errors, setErrors] = useState<Errors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    const validateField = (name: string, value: string) => {
        let error = '';
        switch (name) {
            case 'full_name':
                if (!/^[a-zA-Z\s]+$/.test(value)) error = 'Letters & spaces only';
                break;
            case 'age':
                const ageNum = parseInt(value);
                if (isNaN(ageNum) || ageNum < 16 || ageNum > 80) error = 'Age must be 16-80';
                break;
            case 'mobile_number':
                if (!/^\d{10}$/.test(value)) error = '10 digits required';
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
                break;
            case 'query_text':
                if (value.length < 10) error = 'Minimum 10 characters';
                break;
            case 'gender':
            case 'qualification':
            case 'college_name':
            case 'location':
                if (!value.trim()) error = 'This field is required';
                break;
        }
        return error;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFields((prev) => ({ ...prev, [name]: value }));
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    useEffect(() => {
        const hasErrors = Object.values(errors).some((msg) => msg !== '');
        const allFilled = Object.entries(fields)
            .filter(([key]) => key !== 'otp_method')
            .every(([_, value]) => value !== '');
        setIsFormValid(!hasErrors && allFilled);
    }, [fields, errors]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsSubmitting(true);
        try {
            // First signup the user
            const signupResponse = await fetch(`${API_URL}/api/auth/signup`, {
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

            const signupData = await signupResponse.json();
            if (signupData.message && signupData.message.includes('OTP sent')) {
                // Store user data temporarily and proceed to OTP verification
                localStorage.setItem('temp_user_data', JSON.stringify(fields));
                onSubmitSuccess(fields.email); // Pass email for OTP verification
            } else {
                alert(signupData.message || 'Signup failed');
            }
        } catch (err) {
            console.error(err);
            alert('Error connecting to server');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card">
            <h2 className="title">Submit Your Query</h2>
            <p className="subtitle">Please fill in your details below</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input name="full_name" value={fields.full_name} onChange={handleChange} placeholder="Enter full name" />
                    {errors.full_name && <p className="error-text">{errors.full_name}</p>}
                </div>

                <div className="grid">
                    <div className="form-group">
                        <label>Age</label>
                        <input type="number" name="age" value={fields.age} onChange={handleChange} placeholder="16-80" />
                        {errors.age && <p className="error-text">{errors.age}</p>}
                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <select name="gender" value={fields.gender} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.gender && <p className="error-text">{errors.gender}</p>}
                    </div>
                </div>

                <div className="form-group">
                    <label>Qualification</label>
                    <input name="qualification" value={fields.qualification} onChange={handleChange} placeholder="E.g. B.Tech" />
                    {errors.qualification && <p className="error-text">{errors.qualification}</p>}
                </div>

                <div className="form-group">
                    <label>College Name</label>
                    <input name="college_name" value={fields.college_name} onChange={handleChange} placeholder="Enter college name" />
                    {errors.college_name && <p className="error-text">{errors.college_name}</p>}
                </div>

                <div className="form-group">
                    <label>Place & State</label>
                    <input name="location" value={fields.location} onChange={handleChange} placeholder="E.g. Hyderabad, TS" />
                    {errors.location && <p className="error-text">{errors.location}</p>}
                </div>

                <div className="grid">
                    <div className="form-group">
                        <label>Mobile Number</label>
                        <input name="mobile_number" value={fields.mobile_number} onChange={handleChange} placeholder="10 digits" />
                        {errors.mobile_number && <p className="error-text">{errors.mobile_number}</p>}
                    </div>
                    <div className="form-group">
                        <label>Email ID</label>
                        <input name="email" value={fields.email} onChange={handleChange} placeholder="example@mail.com" />
                        {errors.email && <p className="error-text">{errors.email}</p>}
                    </div>
                </div>

                <div className="form-group">
                    <label>Query Text</label>
                    <textarea name="query_text" value={fields.query_text} onChange={handleChange} rows={4} placeholder="Describe your query..." />
                    {errors.query_text && <p className="error-text">{errors.query_text}</p>}
                </div>

                <div className="form-group">
                    <label>Send OTP via</label>
                    <div className="radio-group">
                        <label className="radio-item">
                            <input type="radio" name="otp_method" value="email" checked={fields.otp_method === 'email'} onChange={handleChange} />
                            Email
                        </label>
                        <label className="radio-item">
                            <input type="radio" name="otp_method" value="mobile" checked={fields.otp_method === 'mobile'} onChange={handleChange} />
                            Mobile
                        </label>
                    </div>
                </div>

                <button type="submit" className="btn-primary" disabled={!isFormValid || isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit & Get OTP'}
                </button>
            </form>
        </div>
    );
};

export default QueryForm;
