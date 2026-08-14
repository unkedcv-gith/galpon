import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BirthdaysSection } from './components/BirthdaysSection';
import { WorkshopsSection } from './components/WorkshopsSection';
import { DaycareSection } from './components/DaycareSection';
import { FaqSection } from './components/FaqSection';
import { BookingCalendar } from './components/BookingCalendar';
import { ContactFooter } from './components/ContactFooter';
import { VirtualCardModal } from './components/VirtualCardModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { isAdminAuthenticated } from './services/storage';

export default function App() {
  const [isVirtualCardOpen, setIsVirtualCardOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    setIsAdminLoggedIn(isAdminAuthenticated());
  }, []);

  const handleOpenBooking = () => {
    const calendarElement = document.getElementById('reservar');
    if (calendarElement) {
      calendarElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAdminTrigger = () => {
    if (isAdminAuthenticated()) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminDashboardOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#ED3078] selection:text-white antialiased relative">
      
      {/* Main Header */}
      <Header
        onOpenBooking={handleOpenBooking}
        onOpenAdmin={handleOpenAdminTrigger}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenVirtualCard={() => setIsVirtualCardOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        <Hero
          onOpenBooking={handleOpenBooking}
          onOpenVirtualCard={() => setIsVirtualCardOpen(true)}
        />

        <BirthdaysSection
          onOpenBooking={handleOpenBooking}
          onOpenVirtualCard={() => setIsVirtualCardOpen(true)}
        />

        <WorkshopsSection />

        <DaycareSection />

        <FaqSection />

        <BookingCalendar
          onReservationCreated={() => {
            // Callback when a booking is created
          }}
        />
      </main>

      {/* Footer */}
      <ContactFooter
        onOpenBooking={handleOpenBooking}
        onOpenAdmin={handleOpenAdminTrigger}
        onOpenVirtualCard={() => setIsVirtualCardOpen(true)}
      />

      {/* Virtual Card Simulator Modal */}
      <VirtualCardModal
        isOpen={isVirtualCardOpen}
        onClose={() => setIsVirtualCardOpen(false)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Full Screen Admin Dashboard */}
      {isAdminDashboardOpen && (
        <AdminDashboard
          onCloseAdmin={() => {
            setIsAdminDashboardOpen(false);
            setIsAdminLoggedIn(isAdminAuthenticated());
          }}
        />
      )}

    </div>
  );
}
