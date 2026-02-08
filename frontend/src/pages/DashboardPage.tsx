import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import {
    LayoutDashboard,
    ClipboardList,
    User as UserIcon,
    LogOut,
    Send,
    Clock,
    CheckCircle,
    HelpCircle,
    ListTodo,
    Circle
} from 'lucide-react';


const DashboardPage: React.FC = () => {
    const { user, logout, token } = useAuth();
    const [activeTab, setActiveTab] = useState<'home' | 'queries' | 'profile'>('home');
    const [queries, setQueries] = useState<any[]>([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
    const [profile, setProfile] = useState<any>(null);
    const [queryText, setQueryText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (token) {
            fetchDashboardData();
        }
    }, [token]);

    const fetchDashboardData = async () => {
        try {
            const userId = token;

            const userRes = await fetch(`${API_BASE_URL}/api/auth/user/${userId}`);
            if (userRes.ok) {
                const userData = await userRes.json();
                setProfile({
                    full_name: userData.name,
                    email: userData.email,
                    mobile_number: userData.mobile,
                    age: userData.age,
                    gender: userData.gender,
                    qualification: userData.qualification,
                    college_name: userData.college,
                    location: userData.place && userData.state ? `${userData.place}, ${userData.state}` : userData.place
                });
            }

            const qRes = await fetch(`${API_BASE_URL}/api/queries/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!qRes.ok) {
                if (qRes.status === 401) {
                    logout();
                    return;
                }
                console.error('Fetch failed:', qRes.status, qRes.statusText);
                return;
            }

            const queriesData = await qRes.json();
            setQueries(queriesData);

            const total = queriesData.length;
            const pending = queriesData.filter((q: any) => q.status !== 'RESOLVED').length;
            const resolved = queriesData.filter((q: any) => q.status === 'RESOLVED').length;
            setStats({ total, pending, resolved });
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const handleQuerySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (queryText.length < 10) return;

        setIsSubmitting(true);
        setMessage('');
        try {
            const response = await fetch(API_BASE_URL + '/api/queries/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: token,
                    queryText: queryText,
                    category: 'General',
                    priority: 'Medium'
                }),
            });

            const data = await response.json();
            if (data.message) {
                setMessage('Success! Query submitted with ID: ' + data.queryId);
                setQueryText('');
                fetchDashboardData();
            } else {
                setMessage(data.message || 'Submission failed');
            }
        } catch (err) {
            setMessage('Error connecting to server');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div className="animate-fade-in">
                        <div className="mb-6 md:mb-8 mt-12">
                            <h2 className="font-heading ml-5 text-2xl md:text-[2.2rem] font-extrabold text-text-main mb-2 tracking-tight">
                                Welcome back, {profile?.full_name || user?.full_name}! 👋
                            </h2>
                            <p className="text-text-muted ml-5 text-base md:text-lg font-medium">Here's what's happening with your queries today.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                            <div className="bg-white/60 backdrop-blur-xl p-5 md:p-6 rounded-2xl border border-white/80 shadow-sm flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-md">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-sm bg-blue-50 text-blue-500">
                                    <ClipboardList size={24} />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="font-heading text-2xl md:text-3xl font-bold text-text-main leading-tight">{stats.total}</span>
                                    <span className="text-sm font-semibold text-text-muted">Total Queries</span>
                                </div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-xl p-5 md:p-6 rounded-2xl border border-white/80 shadow-sm flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-md">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-sm bg-amber-50 text-amber-500">
                                    <Clock size={24} />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="font-heading text-2xl md:text-3xl font-bold text-text-main leading-tight">{stats.pending}</span>
                                    <span className="text-sm font-semibold text-text-muted">Pending</span>
                                </div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-xl p-5 md:p-6 rounded-2xl border border-white/80 shadow-sm flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-md">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-sm bg-emerald-50 text-emerald-600">
                                    <CheckCircle size={24} />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="font-heading text-2xl md:text-3xl font-bold text-text-main leading-tight">{stats.resolved}</span>
                                    <span className="text-sm font-semibold text-text-muted">Resolved</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full bg-white/70 backdrop-blur-xl border border-white/80 p-6 md:p-8 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(40,114,161,0.1)] mt-auto">
                            <h3 className="text-xl font-bold text-text-main mb-6 border-b-2 border-primary/10 pb-2 inline-block">New Query Submission</h3>
                            <form onSubmit={handleQuerySubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-text-main mb-2 ml-1">Describe your issue or question</label>
                                    <textarea
                                        value={queryText}
                                        onChange={(e) => setQueryText(e.target.value)}
                                        rows={4}
                                        placeholder="Type your query here (minimum 10 characters)..."
                                        className="w-full bg-slate-50 min-h-[120px] p-4 rounded-xl border border-slate-200 text-text-main focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none resize-none transition-all shadow-inner"
                                    />
                                </div>
                                {message && (
                                    <div className={`p-4 rounded-xl mb-6 text-sm font-semibold flex items-center gap-3 animate-fade-in ${message.includes('Success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                        {message.includes('Success') ? <CheckCircle size={18} /> : <HelpCircle size={18} />}
                                        {message}
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    className="flex items-center justify-center px-8 py-3 bg-gradient-to-br from-primary to-primary-dark text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed mx-auto mt-2 min-w-[200px]"
                                    disabled={isSubmitting || queryText.length < 10}
                                >
                                    {isSubmitting ? (
                                        'Submitting...'
                                    ) : (
                                        <>
                                            <Send size={18} className="mr-2" />
                                            Submit Query
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                );
            case 'queries':
                return (
                    <div className="animate-fade-in h-4/4  ">
                        <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-text-main mb-8 tracking-tight">Detailed Query History</h2>
                        <div className="w-full overflow-hidden rounded-2xl border border-white/60 shadow-sm bg-white/50 backdrop-blur-md">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px] border-collapse text-left">
                                    <thead>
                                        <tr>
                                            <th className="bg-secondary-light/50 p-5 font-heading font-bold text-sm tracking-wide text-primary-dark uppercase">Query ID</th>
                                            <th className="bg-secondary-light/50 p-5 font-heading font-bold text-sm tracking-wide text-primary-dark uppercase">Description</th>
                                            <th className="bg-secondary-light/50 p-5 font-heading font-bold text-sm tracking-wide text-primary-dark uppercase">Current Status</th>
                                            <th className="bg-secondary-light/50 p-5 font-heading font-bold text-sm tracking-wide text-primary-dark uppercase">Submission Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {queries.length > 0 ? queries.map((q) => (
                                            <tr key={q.queryId} className="hover:bg-white/60 transition-colors border-b border-slate-100 last:border-0">
                                                <td className="p-5 font-extrabold text-primary">{q.queryId}</td>
                                                <td className="p-5 font-medium text-text-main max-w-[300px] truncate">{q.originalQuery}</td>
                                                <td className="p-5">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm border ${q.status === 'RESOLVED' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                                                        {q.status}
                                                    </span>
                                                </td>
                                                <td className="p-5 text-text-muted font-medium">{new Date(q.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="text-center p-16 text-text-muted text-lg font-medium">
                                                    You haven't submitted any queries yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div className="animate-fade-in">
                        <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-text-main mb-8 tracking-tight">Account Profile</h2>
                        <div className="w-full max-w-[800px] bg-white/70 backdrop-blur-xl border border-white/80 p-6 md:p-10 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(40,114,161,0.1)]">
                            <h3 className="text-lg font-bold text-text-main mb-6 border-b border-slate-100 pb-2">Personal Details</h3>
                            <div className="space-y-1">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center py-3 border-b border-slate-100 last:border-0 border-dashed">
                                    <span className="font-medium text-text-muted">Full Legal Name</span>
                                    <span className="font-bold text-text-main text-lg">{profile?.full_name}</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center py-3 border-b border-slate-100 last:border-0 border-dashed">
                                    <span className="font-medium text-text-muted">Primary Email</span>
                                    <span className="font-bold text-text-main text-lg">{profile?.email}</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center py-3 border-b border-slate-100 last:border-0 border-dashed">
                                    <span className="font-medium text-text-muted">Mobile Contact</span>
                                    <span className="font-bold text-text-main text-lg">{profile?.mobile_number}</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center py-3 border-b border-slate-100 last:border-0 border-dashed">
                                    <span className="font-medium text-text-muted">Age & Gender</span>
                                    <span className="font-bold text-text-main text-lg">{profile?.age} yrs / {profile?.gender}</span>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-text-main mb-6 mt-10 border-b border-slate-100 pb-2">Educational Background</h3>
                            <div className="space-y-1">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center py-3 border-b border-slate-100 last:border-0 border-dashed">
                                    <span className="font-medium text-text-muted">Highest Qualification</span>
                                    <span className="font-bold text-text-main text-lg">{profile?.qualification}</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center py-3 border-b border-slate-100 last:border-0 border-dashed">
                                    <span className="font-medium text-text-muted">Institution / College</span>
                                    <span className="font-bold text-text-main text-lg">{profile?.college_name}</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center py-3 border-b border-slate-100 last:border-0 border-dashed">
                                    <span className="font-medium text-text-muted">Current Location</span>
                                    <span className="font-bold text-text-main text-lg">{profile?.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-secondary-light font-body text-text-main">
            { }
            <div className="md:hidden fixed top-0 left-0 w-full h-[60px] bg-white/90 backdrop-blur-xl border-b border-white/50 z-40 flex items-center justify-between px-4 shadow-sm">
                <button className="text-text-main p-2" onClick={toggleMobileMenu}>
                    <ListTodo size={24} />
                </button>
                <span className="font-heading text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                    Query Management System
                </span>
                <div className="w-6"></div> { }
            </div>

            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            <aside className={`fixed inset-y-0 left-0 w-[280px] bg-white/90 backdrop-blur-2xl border-r border-white/50 z-50 transition-transform duration-300 ease-out shadow-[10px_0_40px_rgba(40,114,161,0.04)] flex flex-col p-6 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="bg-gradient-to-br from-primary to-primary-dark p-2 rounded-xl text-white shadow-lg">
                        <Circle size={24} />
                    </div>
                    <span className="font-heading text-2xl font-extrabold bg-gradient-to-br from-primary to-primary-dark bg-clip-text text-transparent tracking-tight">
                        Query Management System
                    </span>
                </div>

                <nav className="flex-1 flex flex-col gap-3">
                    <div
                        className={`flex items-center gap-4 p-3.5 rounded-2xl font-semibold text-[0.95rem] cursor-pointer transition-all duration-200 border border-transparent ${activeTab === 'home' ? 'bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] text-primary border-primary/10 shadow-sm translate-x-1' : 'text-text-muted hover:bg-white hover:text-primary hover:shadow-sm hover:translate-x-1'}`}
                        onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                    >
                        <LayoutDashboard size={20} /> <span>Home Dashboard</span>
                    </div>
                    <div
                        className={`flex items-center gap-4 p-3.5 rounded-2xl font-semibold text-[0.95rem] cursor-pointer transition-all duration-200 border border-transparent ${activeTab === 'queries' ? 'bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] text-primary border-primary/10 shadow-sm translate-x-1' : 'text-text-muted hover:bg-white hover:text-primary hover:shadow-sm hover:translate-x-1'}`}
                        onClick={() => { setActiveTab('queries'); setMobileMenuOpen(false); }}
                    >
                        <ClipboardList size={20} /> <span>My Inquiries</span>
                    </div>
                    <div
                        className={`flex items-center gap-4 p-3.5 rounded-2xl font-semibold text-[0.95rem] cursor-pointer transition-all duration-200 border border-transparent ${activeTab === 'profile' ? 'bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] text-primary border-primary/10 shadow-sm translate-x-1' : 'text-text-muted hover:bg-white hover:text-primary hover:shadow-sm hover:translate-x-1'}`}
                        onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
                    >
                        <UserIcon size={20} /> <span>My Profile</span>
                    </div>
                </nav>

                <div className="mt-auto bg-white/60 rounded-[20px] p-4 border border-white/60 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold shadow-md">
                            {profile?.full_name?.charAt(0) || user?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-bold text-sm text-text-main truncate max-w-[130px]">{profile?.full_name || user?.full_name}</span>
                            <span className="text-xs text-text-muted">User Account</span>
                        </div>
                    </div>
                    <button
                        className="w-full flex items-center justify-center gap-2.5 p-3 rounded-xl border border-red-100 bg-red-50 text-red-500 font-semibold text-sm hover:bg-red-100 hover:-translate-y-0.5 transition-all duration-200"
                        onClick={logout}
                    >
                        <LogOut size={18} /> <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <main className={`flex-1 flex flex-col p-4 pt-20 md:pt-4 md:ml-[280px] w-full md:w-[calc(100%-280px)] min-h-screen transition-all ${activeTab === 'home' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
                {renderContent()}
            </main>
        </div>
    );
};

export default DashboardPage;
