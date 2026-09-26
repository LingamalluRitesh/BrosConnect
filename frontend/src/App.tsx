import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { DevelopersDirectory } from './pages/public/DevelopersDirectory';
import { DeveloperProfilePage } from './pages/public/DeveloperProfilePage';
import { ProjectsDirectory } from './pages/public/ProjectsDirectory';
import { ProjectDetailPage } from './pages/public/ProjectDetailPage';
import { ContactPage } from './pages/public/ContactPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Dashboard & Authenticated Pages
import { DeveloperDashboard } from './pages/dashboard/DeveloperDashboard';
import { MyProjectsPage } from './pages/dashboard/MyProjectsPage';
import { InquiriesPage } from './pages/dashboard/InquiriesPage';
import { CommunityChatPage } from './pages/dashboard/CommunityChatPage';
import { DirectMessagesPage } from './pages/dashboard/DirectMessagesPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

const AppShell: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 selection:bg-black/10 selection:text-black">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/developers" element={<DevelopersDirectory />} />
          <Route path="/developers/:username" element={<DeveloperProfilePage />} />
          <Route path="/projects" element={<ProjectsDirectory />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Dashboard & Workspace Routes */}
          <Route path="/dashboard" element={<DeveloperDashboard />} />
          <Route path="/dashboard/my-projects" element={<MyProjectsPage />} />
          <Route path="/dashboard/inquiries" element={<InquiriesPage />} />
          <Route path="/community" element={<CommunityChatPage />} />
          <Route path="/messages" element={<DirectMessagesPage />} />

          {/* Executive Administration */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <WebSocketProvider>
          <AppShell />
        </WebSocketProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
