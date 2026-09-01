import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { FindGroupPanel } from '../components/FindGroupPanel';

export const LandingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Home');

  const scrollToGroups = () => {
    const el = document.getElementById('find-groups-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const showHowItWorks = () => {
    alert(
      'How StudySphere Study Groups Work:\n\n1. Select your university course or technical subject.\n2. Choose weekly schedule compatibility with verified student peers.\n3. Join collaborative study sessions with integrated audio/video and shared notes.'
    );
  };

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', padding: '16px 0 32px 0' }}>
      <main className="app-viewport">
        {/* Navigation Bar with Find Study Group search & Sign In/Register buttons */}
        <Navbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeTab={activeTab}
          onNavigateTab={setActiveTab}
        />

        {/* Hero Section */}
        <HeroSection
          onExploreClick={scrollToGroups}
          onHowItWorksClick={showHowItWorks}
        />

        {/* Dark Navy Blue Panel: Find Your Ideal Group */}
        <div id="find-groups-section">
          <FindGroupPanel />
        </div>
      </main>
    </div>
  );
};
