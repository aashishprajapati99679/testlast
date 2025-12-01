import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import { User, Mail, Book, Award, Save, Loader2, CheckCircle } from 'lucide-react';

const StudentProfile = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        skills: '',
        education: ''
    });
    const [message, setMessage] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                bio: user.profile?.bio || '',
                skills: user.profile?.skills?.join(', ') || '',
                education: user.profile?.education || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
            const payload = { ...formData, skills: skillsArray };

            await axios.put('/api/student/profile', payload);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-500 mt-1 text-lg">Manage your personal information and portfolio details.</p>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.includes('Failed')
                    ? 'bg-red-50 text-red-700 border border-red-100'
                    : 'bg-green-50 text-green-700 border border-green-100'
                    }`}>
                    {message.includes('Failed') ? null : <CheckCircle className="w-5 h-5" />}
                    <span className="font-medium">{message}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                        <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-4xl font-bold mx-auto mb-4 border-4 border-white shadow-md">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                        <p className="text-slate-500 text-sm mb-4">{user?.email}</p>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wide border border-primary-100">
                            Student
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-900">Profile Details</h3>
                            <p className="text-slate-500 text-sm">Update your information to stand out to NGOs.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <User className="w-4 h-4 text-slate-400" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-slate-50 focus:bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-slate-50 focus:bg-white resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <Award className="w-4 h-4 text-slate-400" />
                                        Skills
                                    </label>
                                    <input
                                        type="text"
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        placeholder="React, Node.js, etc."
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-slate-50 focus:bg-white"
                                    />
                                    <p className="text-xs text-slate-400">Comma separated values</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <Book className="w-4 h-4 text-slate-400" />
                                        Education
                                    </label>
                                    <input
                                        type="text"
                                        name="education"
                                        value={formData.education}
                                        onChange={handleChange}
                                        placeholder="University / School"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-slate-50 focus:bg-white"
                                    />

                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Book className="w-4 h-4 text-slate-400" />
                                    Resume (PDF)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            const formData = new FormData();
                                            formData.append('resume', file);

                                            try {
                                                setSaving(true);
                                                await axios.post('/api/student/profile/resume', formData, {
                                                    headers: {
                                                        'Content-Type': 'multipart/form-data'
                                                    }
                                                });
                                                setMessage('Resume uploaded successfully!');
                                                setTimeout(() => setMessage(''), 3000);
                                            } catch (error) {
                                                console.error('Error uploading resume:', error);
                                                setMessage('Failed to upload resume.');
                                            } finally {
                                                setSaving(false);
                                            }
                                        }}
                                        className="block w-full text-sm text-slate-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-primary-50 file:text-primary-700
                                            hover:file:bg-primary-100
                                        "
                                    />
                                    {user?.profile?.resume && (
                                        <a
                                            href={`http://localhost:5000/${user.profile.resume}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary-600 hover:underline"
                                        >
                                            View Current Resume
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 focus:ring-4 focus:ring-primary-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
