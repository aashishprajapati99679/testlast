import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/public/Login';
import Signup from './pages/public/Signup';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';
import ProtectedRoute from './components/auth/ProtectedRoute';
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import MyApplications from './pages/student/MyApplications';
import HoursTracking from './pages/student/HoursTracking';
import VolunteeringOpportunities from './pages/student/VolunteeringOpportunities';
import QRScanner from './pages/student/QRScanner';

import NGOLayout from './layouts/NGOLayout';
import NGODashboard from './pages/ngo/NGODashboard';
import CreateOpportunity from './pages/ngo/CreateOpportunity';
import MyOpportunities from './pages/ngo/MyOpportunities';
import ApplicantReview from './pages/ngo/ApplicantReview';
import HoursApproval from './pages/ngo/HoursApproval';
import AdminInternships from './pages/admin/AdminInternships';
import AdminCreateInternship from './pages/admin/AdminCreateInternship';
import AdminInternshipApplications from './pages/admin/AdminInternshipApplications';
import VerifyNGOs from './pages/admin/VerifyNGOs';
import WaitingForApproval from './pages/ngo/WaitingForApproval';

import InternshipList from './pages/student/InternshipList';
import InternshipDetail from './pages/student/InternshipDetail';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOpportunities from './pages/admin/AdminOpportunities';
import AdminPayments from './pages/admin/AdminPayments';
import StudentPayments from './pages/student/StudentPayments';
import ManageCertifications from './pages/admin/ManageCertifications';
import CertificationListing from './pages/public/CertificationListing';
import CertificationDetail from './pages/student/CertificationDetail';
import MyCertificates from './pages/student/MyCertificates';
import ManageNGOs from './pages/admin/ManageNGOs';
import ManageStudents from './pages/admin/ManageStudents';
import AdminApplications from './pages/admin/AdminApplications';
import AdminSettings from './pages/admin/AdminSettings';
import Support from './pages/common/Support';
import AdminSupport from './pages/admin/AdminSupport';

import LandingPage from './pages/public/LandingPage';

function App() {
    return (
        <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <div className="app-container">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />


                        {/* Student Routes */}
                        <Route path="/student" element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <StudentLayout />
                            </ProtectedRoute>
                        }>
                            <Route path="dashboard" element={<StudentDashboard />} />
                            <Route path="volunteering" element={<VolunteeringOpportunities />} />
                            <Route path="profile" element={<StudentProfile />} />
                            <Route path="applications" element={<MyApplications />} />
                            <Route path="hours" element={<HoursTracking />} />
                            <Route path="scan-qr" element={<QRScanner />} />
                            <Route path="internships" element={<InternshipList />} />
                            <Route path="internships/:id" element={<InternshipDetail />} />
                            <Route path="certifications" element={<CertificationListing />} />
                            <Route path="certifications/:id" element={<CertificationDetail />} />
                            <Route path="certificates" element={<MyCertificates />} />
                            <Route path="payments" element={<StudentPayments />} />
                            <Route path="support" element={<Support />} />
                            <Route index element={<Navigate to="dashboard" replace />} />
                        </Route>

                        {/* NGO Routes */}
                        <Route path="/ngo" element={
                            <ProtectedRoute allowedRoles={['ngo']}>
                                <NGOLayout />
                            </ProtectedRoute>
                        }>
                            <Route path="dashboard" element={<NGODashboard />} />
                            <Route path="opportunities/create" element={<CreateOpportunity />} />
                            <Route path="opportunities" element={<MyOpportunities />} />
                            <Route path="opportunities/:id/applications" element={<ApplicantReview />} />
                            <Route path="hours" element={<HoursApproval />} />
                            <Route path="support" element={<Support />} />
                            <Route index element={<Navigate to="dashboard" replace />} />

                        </Route>

                        <Route path="/ngo/waiting-for-approval" element={
                            <ProtectedRoute allowedRoles={['ngo']}>
                                <WaitingForApproval />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin" element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminLayout />
                            </ProtectedRoute>
                        }>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="analytics" element={<AdminDashboard />} /> {/* Reusing Dashboard for now or create separate */}

                            <Route path="verify-ngos" element={<VerifyNGOs />} />
                            <Route path="ngos" element={<ManageNGOs />} />
                            <Route path="students" element={<ManageStudents />} />
                            <Route path="opportunities" element={<AdminOpportunities />} />

                            <Route path="internships" element={<AdminInternships />} />
                            <Route path="internships/create" element={<AdminCreateInternship />} />
                            <Route path="internships/:id/applications" element={<AdminInternshipApplications />} />
                            <Route path="certifications" element={<ManageCertifications />} />
                            <Route path="applications" element={<AdminApplications />} />
                            <Route path="payments" element={<AdminPayments />} />
                            <Route path="support" element={<AdminSupport />} />
                            <Route path="settings" element={<AdminSettings />} />
                            <Route index element={<Navigate to="dashboard" replace />} />
                        </Route>


                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
