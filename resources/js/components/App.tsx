import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import ScrollToTop from './ScrollToTop';
import Header from './Header';
import Hero from './Hero';
import EventList from './EventList';
import EventDetail from './EventDetail';
import EventListing from './EventListing';
import ApiDocs from './ApiDocs';
import About from './About';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import HelpCenter from './HelpCenter';
import ContactUs from './ContactUs';
import EventGuidelines from './EventGuidelines';
import CommunityRules from './CommunityRules';
import SubmitEvent from './SubmitEvent';
import MobileApp from './MobileApp';
import Login from './Login';
import Register from './Register';
import UserPreferences from './UserPreferences';
import SpeakerApplication from './SpeakerApplication';
import SavedEvents from './SavedEvents';
import AdminDashboard from './AdminDashboard';
import CTA from './CTA';
import Footer from './Footer';

const HomePage: React.FC = () => (
    <>
        <Hero />
        <EventList />
        <CTA />
    </>
);

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                <ScrollToTop />
                <div 
                    className="min-h-screen"
                    style={{ 
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        fontFamily: "'JetBrains Mono', 'SF Mono', 'Monaco', 'Cascadia Code', monospace"
                    }}
                >
                    <Header />
                    <main>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/events" element={<EventListing />} />
                            <Route path="/event/:id" element={<EventDetail />} />
                            <Route path="/api" element={<ApiDocs />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/privacy" element={<PrivacyPolicy />} />
                            <Route path="/terms" element={<TermsOfService />} />
                            <Route path="/help" element={<HelpCenter />} />
                            <Route path="/contact" element={<ContactUs />} />
                            <Route path="/guidelines" element={<EventGuidelines />} />
                            <Route path="/community-rules" element={<CommunityRules />} />
                            <Route path="/submit" element={<SubmitEvent />} />
                            <Route path="/mobile" element={<MobileApp />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/preferences" element={<UserPreferences />} />
                            <Route path="/speaker-application" element={<SpeakerApplication />} />
                            <Route path="/saved-events" element={<SavedEvents />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;