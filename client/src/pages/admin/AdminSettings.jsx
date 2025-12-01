import React, { useState, useEffect } from 'react';
import { Save, Shield, Bell, CreditCard, Award, Settings, AlertTriangle, CheckCircle, X } from 'lucide-react';
import api from '../../services/api';

const AdminSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        general: {
            platformName: '',
            supportEmail: '',
            supportPhone: '',
            bannerMessage: '',
            maintenanceMode: { enabled: false, message: '' }
        },
        payment: {
            fees: { volunteering: 0, internship: 0, certification: 0 },
            razorpay: { keyId: '', keySecret: '' },
            refunds: { enabled: false, rules: '' }
        },
        certificate: {
            minHours: 10,
            allowPartial: false,
            allowTransfer: false,
            maxHoursBeforePurchase: 60
        },
        notifications: {
            email: true,
            sms: false,
            web: true,
            templates: { success: '', approval: '', rejection: '' }
        },
        security: {
            otpRequired: false,
            documentReuploadInterval: 6,
            ipRestriction: ''
        }
    });

    const [activeSection, setActiveSection] = useState('general');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/admin/settings');
            if (response.data.success) {
                setSettings(response.data.data);
            }
        } catch (error) {
            showToast('Failed to load settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (section) => {
        setSaving(true);
        try {
            // Only send the section being saved to avoid overwriting other concurrent changes (though backend handles merge)
            const updateData = { [section]: settings[section] };
            const response = await api.put('/admin/settings', updateData);

            if (response.data.success) {
                showToast(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully`);
                // Update local state with returned data to ensure sync
                setSettings(prev => ({ ...prev, [section]: response.data.data[section] }));
            }
        } catch (error) {
            showToast('Failed to save settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
    };

    const handleChange = (section, field, value, nestedField = null) => {
        setSettings(prev => {
            if (nestedField) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [field]: {
                            ...prev[section][field],
                            [nestedField]: value
                        }
                    }
                };
            }
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            };
        });
    };

    if (loading) return <div className="p-8 text-center">Loading settings...</div>;

    const sections = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'payment', label: 'Payment & Fees', icon: CreditCard },
        { id: 'certificate', label: 'Certificates', icon: Award },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Platform Settings</h1>
                    <p className="text-gray-500">Manage global platform configurations</p>
                </div>
            </div>

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 text-white z-50 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                    {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                    {toast.message}
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${activeSection === section.id
                                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <section.icon size={18} />
                                <span className="font-medium">{section.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {/* General Settings */}
                    {activeSection === 'general' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Settings size={20} className="text-blue-600" />
                                General Platform Settings
                            </h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                                        <input
                                            type="text"
                                            value={settings.general.platformName}
                                            onChange={(e) => handleChange('general', 'platformName', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                                        <input
                                            type="email"
                                            value={settings.general.supportEmail}
                                            onChange={(e) => handleChange('general', 'supportEmail', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                                        <input
                                            type="text"
                                            value={settings.general.supportPhone}
                                            onChange={(e) => handleChange('general', 'supportPhone', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Website Banner Message</label>
                                    <input
                                        type="text"
                                        value={settings.general.bannerMessage}
                                        onChange={(e) => handleChange('general', 'bannerMessage', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Announcement shown at top of site"
                                    />
                                </div>

                                <div className="border-t pt-4 mt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h3 className="font-medium text-gray-800">Maintenance Mode</h3>
                                            <p className="text-sm text-gray-500">Take the site offline for updates</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={settings.general.maintenanceMode.enabled}
                                                onChange={(e) => handleChange('general', 'maintenanceMode', e.target.checked, 'enabled')}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    {settings.general.maintenanceMode.enabled && (
                                        <div className="mt-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Message</label>
                                            <textarea
                                                value={settings.general.maintenanceMode.message}
                                                onChange={(e) => handleChange('general', 'maintenanceMode', e.target.value, 'message')}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                rows="2"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => handleSave('general')}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Payment Settings */}
                    {activeSection === 'payment' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <CreditCard size={20} className="text-blue-600" />
                                Payment & Fees Configuration
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3">Application Fees (₹)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Volunteering</label>
                                            <input
                                                type="number"
                                                value={settings.payment.fees.volunteering}
                                                onChange={(e) => handleChange('payment', 'fees', parseFloat(e.target.value), 'volunteering')}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Internship</label>
                                            <input
                                                type="number"
                                                value={settings.payment.fees.internship}
                                                onChange={(e) => handleChange('payment', 'fees', parseFloat(e.target.value), 'internship')}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Certification</label>
                                            <input
                                                type="number"
                                                value={settings.payment.fees.certification}
                                                onChange={(e) => handleChange('payment', 'fees', parseFloat(e.target.value), 'certification')}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3">Razorpay Configuration</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Key ID</label>
                                            <input
                                                type="text"
                                                value={settings.payment.razorpay.keyId}
                                                onChange={(e) => handleChange('payment', 'razorpay', e.target.value, 'keyId')}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="rzp_test_..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Key Secret</label>
                                            <input
                                                type="password"
                                                value={settings.payment.razorpay.keySecret}
                                                onChange={(e) => handleChange('payment', 'razorpay', e.target.value, 'keySecret')}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h3 className="font-medium text-gray-800">Refunds</h3>
                                            <p className="text-sm text-gray-500">Allow users to request refunds</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={settings.payment.refunds.enabled}
                                                onChange={(e) => handleChange('payment', 'refunds', e.target.checked, 'enabled')}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    {settings.payment.refunds.enabled && (
                                        <div className="mt-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Refund Rules</label>
                                            <textarea
                                                value={settings.payment.refunds.rules}
                                                onChange={(e) => handleChange('payment', 'refunds', e.target.value, 'rules')}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                rows="2"
                                                placeholder="E.g., Refunds allowed within 24 hours..."
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => handleSave('payment')}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Certificate Settings */}
                    {activeSection === 'certificate' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Award size={20} className="text-blue-600" />
                                Certificate Rules
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Volunteering Hours Required</label>
                                    <input
                                        type="number"
                                        value={settings.certificate.minHours}
                                        onChange={(e) => handleChange('certificate', 'minHours', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Hours Before Purchase Required</label>
                                    <input
                                        type="number"
                                        value={settings.certificate.maxHoursBeforePurchase}
                                        onChange={(e) => handleChange('certificate', 'maxHoursBeforePurchase', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div className="flex items-center justify-between py-2 border-b">
                                    <div>
                                        <h3 className="font-medium text-gray-800">Allow Partial Hours</h3>
                                        <p className="text-sm text-gray-500">Count hours even if activity not fully completed</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.certificate.allowPartial}
                                            onChange={(e) => handleChange('certificate', 'allowPartial', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <h3 className="font-medium text-gray-800">Allow Hour Transfer</h3>
                                        <p className="text-sm text-gray-500">Transfer hours between different NGOs</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.certificate.allowTransfer}
                                            onChange={(e) => handleChange('certificate', 'allowTransfer', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => handleSave('certificate')}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Notification Settings */}
                    {activeSection === 'notifications' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Bell size={20} className="text-blue-600" />
                                Notification Settings
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b">
                                    <span className="font-medium text-gray-800">Email Notifications</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.email}
                                            onChange={(e) => handleChange('notifications', 'email', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b">
                                    <span className="font-medium text-gray-800">SMS Notifications</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.sms}
                                            onChange={(e) => handleChange('notifications', 'sms', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b">
                                    <span className="font-medium text-gray-800">Web Push Notifications</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.web}
                                            onChange={(e) => handleChange('notifications', 'web', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="pt-4">
                                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3">Message Templates</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Success Message</label>
                                            <input
                                                type="text"
                                                value={settings.notifications.templates.success}
                                                onChange={(e) => handleChange('notifications', 'templates', e.target.value, 'success')}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Approval Message</label>
                                            <input
                                                type="text"
                                                value={settings.notifications.templates.approval}
                                                onChange={(e) => handleChange('notifications', 'templates', e.target.value, 'approval')}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Message</label>
                                            <input
                                                type="text"
                                                value={settings.notifications.templates.rejection}
                                                onChange={(e) => handleChange('notifications', 'templates', e.target.value, 'rejection')}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => handleSave('notifications')}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeSection === 'security' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Shield size={20} className="text-blue-600" />
                                Security & Access Control
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b">
                                    <div>
                                        <h3 className="font-medium text-gray-800">Require OTP Verification</h3>
                                        <p className="text-sm text-gray-500">Force OTP check for sensitive actions</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.security.otpRequired}
                                            onChange={(e) => handleChange('security', 'otpRequired', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Re-upload Interval (Months)</label>
                                    <input
                                        type="number"
                                        value={settings.security.documentReuploadInterval}
                                        onChange={(e) => handleChange('security', 'documentReuploadInterval', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">IP Restriction List (Optional)</label>
                                    <input
                                        type="text"
                                        value={settings.security.ipRestriction}
                                        onChange={(e) => handleChange('security', 'ipRestriction', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Comma separated IP addresses"
                                    />
                                </div>

                                <div className="pt-4 mt-4 border-t">
                                    <h3 className="text-red-600 font-medium mb-2">Danger Zone</h3>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to force logout all users? This will invalidate all active sessions.')) {
                                                showToast('All users have been logged out', 'success');
                                            }
                                        }}
                                        className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        Force Log Out All Users
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => handleSave('security')}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
