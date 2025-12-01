import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    CheckCircle,
    ArrowRight,
    Users,
    Globe,
    Award,
    BookOpen,
    Shield,
    CreditCard,
    Bell,
    Mail,
    Phone,
    MapPin,
    Send,
    Menu,
    X,
    ChevronDown,
    Loader2,
    MessageSquare
} from 'lucide-react';

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    // Contact Form State
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await axios.post('/api/support/public', contactForm);
            setSent(true);
            setContactForm({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setSent(false), 5000);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
            setIsMenuOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-auto py-1">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
                            <img src="/logo.png" alt="GetServe.in" className="h-[9rem] w-auto" />
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            {['Home', 'Features', 'About Us', 'Contact'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                                    className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center gap-4">
                            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-primary-600 transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" className="px-5 py-2.5 bg-primary-600 text-white text-sm font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 hover:-translate-y-0.5">
                                Register
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-slate-600"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4 shadow-xl">
                        {['Home', 'Features', 'About Us', 'Contact'].map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                                className="block w-full text-left py-2 text-slate-600 font-semibold"
                            >
                                {item}
                            </button>
                        ))}
                        <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                            <Link to="/login" className="w-full py-3 text-center font-bold text-slate-600 bg-slate-50 rounded-xl">
                                Login
                            </Link>
                            <Link to="/signup" className="w-full py-3 text-center font-bold text-white bg-primary-600 rounded-xl">
                                Register
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* 1. HOME PAGE - Hero Section */}
            <section id="home" className="pt-48 pb-20 lg:pt-64 lg:pb-32 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
                    <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary-50 text-primary-600 text-xs font-bold tracking-wide mb-6 border border-primary-100">
                        EMPOWERING STUDENTS TO LEARN, SERVE & GROW
                    </span>
                    <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
                        Your Gateway to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
                            Real-World Impact
                        </span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Discover verified volunteering opportunities, real-world internships, and high-value skill-based certifications — all in one unified platform designed for students and NGOs.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/30 hover:-translate-y-1 flex items-center justify-center gap-2">
                            Get Started <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                            Register as NGO
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why GetServe */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why GetServe?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">A trusted ecosystem connecting students and NGOs.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Shield, title: 'Verified NGOs Only', desc: 'Every NGO listed undergoes a strict verification process to ensure credibility and student safety.' },
                            { icon: Send, title: 'One-Click Applications', desc: 'Apply to any opportunity with your saved profile and resume — no repeated forms, no delays.' },
                            { icon: Award, title: 'Skill-Based Certifications', desc: 'Access curated certificate programs from top institutions like IBM, Google, Meta & more.' },
                            { icon: BookOpen, title: 'Track Your Journey', desc: 'All your volunteering hours, internships, and certificates stay recorded in one place.' }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-6">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-slate-600">Start your journey in 4 simple steps.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>

                        {[
                            { step: '01', title: 'Sign Up', desc: 'Create your Student or NGO account and complete onboarding.' },
                            { step: '02', title: 'Explore', desc: 'Browse hundreds of open volunteering activities, internships, and skill-based certs.' },
                            { step: '03', title: 'Apply & Participate', desc: 'Attend events, complete internships, and gain experience.' },
                            { step: '04', title: 'Earn Certificates', desc: 'Get certificates issued by NGOs or unlock external certification programs.' }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white pt-4 relative">
                                <div className="w-16 h-16 bg-white border-4 border-primary-50 rounded-full flex items-center justify-center text-xl font-bold text-primary-600 mx-auto mb-6 shadow-sm">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">{item.title}</h3>
                                <p className="text-slate-600 text-center text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. FEATURES PAGE Content */}
            <section id="features" className="py-20 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary-400 font-bold tracking-wider text-sm uppercase">Features</span>
                        <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-6">Everything you need to grow</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Volunteering, internships, certificates & more — all in one powerful platform.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Student Dashboard', desc: 'View applied opportunities, access certificates, track status, and update profile.' },
                            { title: 'NGO Dashboard', desc: 'Manage event listings, intern applications, volunteer assignments, and issue certificates.' },
                            { title: 'Skill-Based Certifications', desc: 'Browse and access admin-curated certificates from top global providers.' },
                            { title: 'Opportunity Discovery', desc: 'Filter by category, location, mode, skills, and duration.' },
                            { title: 'Certificate Management', desc: 'Issue and download volunteering, internship, and participation certificates.' },
                            { title: 'Secure Platform', desc: 'Encrypted data, verified organizations, and a safe, trusted experience.' }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-primary-500/50 transition-all">
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. ABOUT US PAGE Content */}
            <section id="about-us" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-primary-600 font-bold tracking-wider text-sm uppercase">About Us</span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2 mb-6">
                                Building India’s largest student–NGO skill & service ecosystem.
                            </h2>
                            <div className="space-y-6 text-slate-600 leading-relaxed">
                                <p>
                                    GetServe was founded with one mission: to make volunteering, internships, and skill-building accessible to every student in India.
                                </p>
                                <p>
                                    We realized hundreds of NGOs need volunteers each month, and millions of students need real-world exposure. But there was no unified, trusted platform connecting both sides effectively. So we built GetServe — a simple, transparent, verified ecosystem.
                                </p>
                                <div className="grid grid-cols-2 gap-6 mt-8">
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Our Mission</h4>
                                        <p className="text-sm">To enable every student to discover meaningful opportunities.</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Our Vision</h4>
                                        <p className="text-sm">To become India’s leading platform for experiential learning.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-3xl transform rotate-3 opacity-10"></div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">What We Stand For</h3>
                                <ul className="space-y-4">
                                    {[
                                        { title: 'Trust', desc: 'Verified NGOs. Genuine opportunities.' },
                                        { title: 'Access', desc: 'Opportunities for students from every background.' },
                                        { title: 'Impact', desc: 'Measurable community contributions.' },
                                        { title: 'Growth', desc: 'Skill development at every level.' }
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <span className="font-bold text-slate-900">{item.title}: </span>
                                                <span className="text-slate-600">{item.desc}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. CONTACT PAGE Content */}
            <section id="contact" className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16">
                        <div>
                            <span className="text-primary-600 font-bold tracking-wider text-sm uppercase">Contact Us</span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2 mb-6">
                                We’re here to help — reach out anytime.
                            </h2>
                            <p className="text-slate-600 mb-10">
                                Have questions about the platform, partnerships, or need technical support? We're just a message away.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm border border-slate-100">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Email Support</h4>
                                        <p className="text-slate-600 text-sm mt-1">support@getserve.in</p>
                                        <p className="text-slate-600 text-sm">partners@getserve.in</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm border border-slate-100">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Office</h4>
                                        <p className="text-slate-600 text-sm mt-1">GetServe HQ, Tech Park, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <MessageSquare className="w-6 h-6 text-primary-600" />
                                Send us a Message
                            </h3>

                            {sent ? (
                                <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
                                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                    <h4 className="font-bold text-green-800 text-lg">Message Sent!</h4>
                                    <p className="text-green-600 mt-1">Thank you for contacting us. We will get back to you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleContactSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={contactForm.name}
                                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={contactForm.email}
                                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Subject</label>
                                        <input
                                            type="text"
                                            required
                                            value={contactForm.subject}
                                            onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                            placeholder="How can we help?"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Message</label>
                                        <textarea
                                            required
                                            rows="4"
                                            value={contactForm.message}
                                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                                            placeholder="Tell us more about your inquiry..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {sending ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <img src="/logo.png" alt="GetServe.in" className="h-8 w-auto" />
                            </div>
                            <p className="text-sm leading-relaxed max-w-xs">
                                Empowering students to learn, serve, and grow through verified volunteering opportunities and internships.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><button onClick={() => scrollToSection('home')} className="hover:text-primary-400 transition-colors">Home</button></li>
                                <li><button onClick={() => scrollToSection('features')} className="hover:text-primary-400 transition-colors">Features</button></li>
                                <li><button onClick={() => scrollToSection('about-us')} className="hover:text-primary-400 transition-colors">About Us</button></li>
                                <li><button onClick={() => scrollToSection('contact')} className="hover:text-primary-400 transition-colors">Contact</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="#" className="hover:text-primary-400 transition-colors">Documentation</Link></li>
                                <li><Link to="#" className="hover:text-primary-400 transition-colors">Help Center</Link></li>
                                <li><Link to="#" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                                <li><Link to="#" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-800 text-center text-sm">
                        &copy; {new Date().getFullYear()} GetServe.in. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
