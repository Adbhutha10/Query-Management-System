import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { LogOut, CheckCircle, LayoutGrid } from 'lucide-react';


const AdminDashboardPage: React.FC = () => {
    const [queries, setQueries] = useState<any[]>([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [itemsPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();
    const token = localStorage.getItem('admin_token');
    const adminEmail = localStorage.getItem('admin_email') || 'admin@example.com';
    const adminDisplayName = 'Admin';

    useEffect(() => {
        if (!token) navigate('/admin/login');
        fetchQueries();
    }, [token, navigate]);

    const fetchQueries = async () => {
        if (!token) return;
        try {
            const response = await fetch(API_BASE_URL + '/api/admin/queries', {
                headers: { 'X-ADMIN-ID': token }
            });
            const data = await response.json();
            setQueries(data);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const updateStatus = async (queryId: string, newStatus: string) => {
        if (!token) return;
        try {
            const response = await fetch(API_BASE_URL + '/api/admin/reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-ADMIN-ID': token
                },
                body: JSON.stringify({
                    queryId: queryId,
                    reply: `Status updated to: ${newStatus}`
                })
            });
            const data = await response.text();
            if (data.includes('successfully')) {
                fetchQueries();
            }
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate('/admin/login');
    };

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);


    const indexOfLastQuery = currentPage * itemsPerPage;
    const indexOfFirstQuery = indexOfLastQuery - itemsPerPage;
    const currentQueries = queries.slice(indexOfFirstQuery, indexOfLastQuery);
    const totalPages = Math.ceil(queries.length / itemsPerPage);

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-secondary-light font-body text-text-main">
            { }
            <div className="md:hidden fixed top-0 left-0 w-full h-[60px] bg-white/90 backdrop-blur-xl border-b border-white/50 z-40 flex items-center justify-between px-4 shadow-sm">
                <button className="text-text-main p-2" onClick={toggleMobileMenu}>
                    <LayoutGrid size={24} />
                </button>
                <span className="font-heading text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                    Admin Portal
                </span>
                <div className="w-6"></div>
            </div>

            { }
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            { }

            { }
            <aside className={`fixed inset-y-0 left-0 w-[280px] bg-white/90 backdrop-blur-2xl border-r border-white/50 z-50 transition-transform duration-300 ease-out shadow-[10px_0_40px_rgba(40,114,161,0.04)] flex flex-col p-6 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="bg-gradient-to-br from-primary to-primary-dark p-2 rounded-xl text-white shadow-lg">
                        <LayoutGrid size={24} />
                    </div>
                    <span className="font-heading text-2xl font-extrabold bg-gradient-to-br from-primary to-primary-dark bg-clip-text text-transparent tracking-tight">
                        Admin Portal
                    </span>
                </div>

                <nav className="flex-1 flex flex-col gap-3">
                    <div className="flex items-center gap-4 p-3.5 rounded-2xl font-semibold text-[0.95rem] cursor-pointer bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] text-primary border border-primary/10 shadow-sm translate-x-1" onClick={() => setMobileMenuOpen(false)}>
                        <LayoutGrid size={20} /> <span>Query Management</span>
                    </div>
                </nav>

                <div className="mt-auto bg-white/60 rounded-[20px] p-4 border border-white/60 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold shadow-md">
                            {adminDisplayName.charAt(0) || 'A'}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-bold text-sm text-text-main truncate max-w-[130px]">{adminDisplayName}</span>
                            <span className="text-xs text-text-muted">Admin Access</span>
                        </div>
                    </div>
                    <button
                        className="w-full flex items-center justify-center gap-2.5 p-3 rounded-xl border border-red-100 bg-red-50 text-red-500 font-semibold text-sm hover:bg-red-100 hover:-translate-y-0.5 transition-all duration-200"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} /> <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col p-4 pt-20 md:pt-6 md:ml-[280px] w-full md:w-[calc(100%-280px)] min-h-screen">
                <div className="animate-fade-in h-[97%] flex flex-col max-w-7xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 mt-2 gap-4">
                        <h2 className="font-heading text-2xl md:text-[2.2rem] font-extrabold text-text-main tracking-tight">
                            Hello, Admin 🛡️
                        </h2>
                        <span className="bg-white/80 backdrop-blur-md px-5 py-2 rounded-full text-sm font-bold text-text-main shadow-sm border border-white/60 self-start md:self-auto">
                            {queries.length} Total Queries
                        </span>
                    </div>

                    <div className="w-full flex-1 overflow-hidden rounded-2xl border border-white/60 shadow-sm bg-white/50 backdrop-blur-md flex flex-col relative">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px] border-collapse text-left">
                                <thead className="sticky top-0 bg-secondary-light/95 backdrop-blur-sm z-10 shadow-sm">
                                    <tr>
                                        <th className="py-4 px-5 font-heading font-bold text-sm tracking-wide text-primary-dark uppercase w-[80px]">ID</th>
                                        <th className="py-4 px-5 font-heading font-bold text-sm tracking-wide text-primary-dark uppercase w-[220px]">User</th>
                                        <th className="py-4 px-5 font-heading font-bold text-sm tracking-wide text-primary-dark uppercase">Issue Description</th>
                                        <th className="py-4 px-5 font-heading font-bold text-sm tracking-wide text-primary-dark uppercase w-[120px]">Status</th>
                                        <th className="py-4 px-5 font-heading font-bold text-sm tracking-wide text-primary-dark uppercase w-[140px]">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentQueries.length > 0 ? (
                                        currentQueries.map((q) => (
                                            <tr key={q.queryId} className="hover:bg-white/60 transition-colors border-b border-slate-100 last:border-0 group">
                                                <td className="py-3 px-5 font-extrabold text-primary text-sm">{q.queryId}</td>
                                                <td className="py-3 px-5">
                                                    <div className="font-bold text-text-main text-[0.95rem]">{q.name || q.fullName || q.userName || q.user_full_name || q.userId}</div>
                                                </td>
                                                <td className="py-3 px-5 font-medium text-text-main leading-relaxed max-w-[350px] text-sm">{q.originalQuery}</td>
                                                <td className="py-3 px-5">
                                                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide shadow-sm border ${q.status === 'RESOLVED' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                                                        {q.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-5">
                                                    {q.status !== 'RESOLVED' && (
                                                        <button
                                                            className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm hover:-translate-y-0.5"
                                                            onClick={() => updateStatus(q.queryId, 'RESOLVED')}
                                                        >
                                                            <CheckCircle size={13} /> Resolve
                                                        </button>
                                                    )}
                                                    {q.status === 'RESOLVED' && (
                                                        <span className="text-emerald-600 text-xs font-bold flex items-center gap-1 opacity-80">
                                                            <CheckCircle size={13} /> Completed
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-text-muted italic">No queries found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        { }
                        <div className="mt-auto p-4 border-t border-white/50 bg-white/40 flex items-center justify-between">
                            <span className="text-sm font-medium text-text-muted pl-1">
                                Showing {indexOfFirstQuery + 1} - {Math.min(indexOfLastQuery, queries.length)} of {queries.length}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-sm font-bold text-primary bg-white border border-primary/20 rounded-xl shadow-sm hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-xl shadow-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboardPage;

