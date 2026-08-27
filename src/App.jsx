import React, { useState, useEffect } from 'react';
import { useWindowSize } from './hooks/useWindowSize';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useTimeBasedGreeting } from './hooks/useTimeBasedGreeting';
import { secretsData } from './data/secretsData';
import {
  getCurrentUser,
  isUserAuthenticated,
  isEntryPointAuthenticated,
  getEntryPointUser,
  restoreUserSession,
  logoutUser,
} from './lib/auth';
import { supabase } from './lib/supabase';

// 3D Background Canvas & Animations
import { DreamCanvas } from './components/3d/DreamCanvas';
import { SparkleTrail } from './components/animations/SparkleTrail';
import { HeartBalloonPopOpening } from './components/animations/HeartBalloonPopOpening';
import { MusicPlayer } from './components/common/MusicPlayer';
import { DiscoveryModal } from './components/common/DiscoveryModal';
import { ProgressNav } from './components/common/ProgressNav';

// User Login, Heart Check-in, Mood History, Timeline, Memory Jar, Surprise Me, Digital Hug, Secret Unlock, Constellation, Just For You & Admin Dashboard
import { UserLoginModal } from './components/common/UserLoginModal';
import { HeartCheckInModal } from './components/common/HeartCheckInModal';
import { MoodHistoryModal } from './components/common/MoodHistoryModal';
import { MemoryTimelineModal } from './components/common/MemoryTimelineModal';
import { MemoryJarModal } from './components/common/MemoryJarModal';
import { SurpriseMeModal } from './components/common/SurpriseMeModal';
import { DigitalHugModal } from './components/common/DigitalHugModal';
import { SecretUnlockModal } from './components/common/SecretUnlockModal';
import { ConstellationModal } from './components/common/ConstellationModal';
import { JustForYouModal } from './components/common/JustForYouModal';
import { MoodCheckInModal } from './components/common/MoodCheckInModal';
import { AdminDashboard } from './pages/AdminDashboard';

// Interactive Modules
import { SecretVaultTrigger } from './components/common/SecretVaultTrigger';
import { SecretVaultModal } from './components/common/SecretVaultModal';
import { SweetMessageModal } from './components/common/SweetMessageModal';
import { InteractiveGardenOverlay } from './components/common/InteractiveGardenOverlay';
import { GardenDiscoveryToast } from './components/common/GardenDiscoveryToast';
import { JournalModal } from './components/common/JournalModal';
import { OpenWhenModal } from './components/common/OpenWhenModal';

import { LogOut, User, Heart, Sparkles, Archive, Gift, Moon, Lock, Compass, Mail } from 'lucide-react';

// Phase 1 & 2 Sections
import { Section01Hero } from './components/sections/Section01Hero';
import { Section02Welcome } from './components/sections/Section02Welcome';
import { Section03WhyThisExists } from './components/sections/Section03WhyThisExists';

// Phase 3 Sections
import { Section04TheFeeling } from './components/sections/Section04TheFeeling';
import { Section05YouAreDifferent } from './components/sections/Section05YouAreDifferent';
import { Section06LittleThings } from './components/sections/Section06LittleThings';
import { Section07PhotoFrame } from './components/sections/Section07PhotoFrame';
import { Section08WhatYouMean } from './components/sections/Section08WhatYouMean';
import { Section09OurConnection } from './components/sections/Section09OurConnection';

// Phase 4 Sections (SOULMATE × SOULBOUND)
import { Section10Soulmate } from './components/sections/Section10Soulmate';
import { Section11TwoSouls } from './components/sections/Section11TwoSouls';
import { Section12Soulbound } from './components/sections/Section12Soulbound';
import { Section13SoulmateXSoulbound } from './components/sections/Section13SoulmateXSoulbound';
import { Section14AmritaConnection } from './components/sections/Section14AmritaConnection';

// Phase 5 Sections (SERENDIPITY)
import { Section15Serendipity } from './components/sections/Section15Serendipity';
import { Section16TwoPaths } from './components/sections/Section16TwoPaths';
import { Section17TheMoment } from './components/sections/Section17TheMoment';
import { Section18Destiny } from './components/sections/Section18Destiny';
import { Section19AmritaSerendipity } from './components/sections/Section19AmritaSerendipity';
import { Section20SerendipityFinal } from './components/sections/Section20SerendipityFinal';

// Phase 6 Sections (50 REASONS WHY YOU ARE SPECIAL)
import { Section21ReasonsHero } from './components/sections/Section21ReasonsHero';
import { Section22ReasonsDiscovery } from './components/sections/Section22ReasonsDiscovery';
import { Section23Reason50Reveal } from './components/sections/Section23Reason50Reveal';

// Phase 7 Sections (THE SECRET DREAM WORLD)
import { Section24SecretDoor } from './components/sections/Section24SecretDoor';
import { Section25SecretGarden } from './components/sections/Section25SecretGarden';
import { Section26SecretGardenCenter } from './components/sections/Section26SecretGardenCenter';
import { Section27FinalSecretReveal } from './components/sections/Section27FinalSecretReveal';

// Phase 8 Sections (THE LETTER & WORDS I NEVER SAID)
import { Section28LetterEntrance } from './components/sections/Section28LetterEntrance';
import { Section29TheLetter } from './components/sections/Section29TheLetter';
import { Section30WordsINeverSaid } from './components/sections/Section30WordsINeverSaid';
import { Section31UnsentWords } from './components/sections/Section31UnsentWords';
import { Section32AmritaLetterPhoto } from './components/sections/Section32AmritaLetterPhoto';
import { Section33FinalLetterPage } from './components/sections/Section33FinalLetterPage';

// Phase 9 Sections (THE PROMISE & THE PLACE THAT STAYS)
import { Section34AfterTheLetter } from './components/sections/Section34AfterTheLetter';
import { Section35ThePath } from './components/sections/Section35ThePath';
import { Section36ThePlaceThatStays } from './components/sections/Section36ThePlaceThatStays';
import { Section37MemoryLights } from './components/sections/Section37MemoryLights';
import { Section38AmritaTreePhoto } from './components/sections/Section38AmritaTreePhoto';
import { Section39ThePromise } from './components/sections/Section39ThePromise';
import { Section40OneSpecialPlace } from './components/sections/Section40OneSpecialPlace';
import { Section41TheFinalPath } from './components/sections/Section41TheFinalPath';

// Phase 10 Sections (THE FINAL REVEAL — FOR AMRITA)
import { Section42JourneyRecap } from './components/sections/Section42JourneyRecap';
import { Section43EverythingLeadsHere } from './components/sections/Section43EverythingLeadsHere';
import { Section44FinalAmritaPhoto } from './components/sections/Section44FinalAmritaPhoto';
import { Section45FinalMessage } from './components/sections/Section45FinalMessage';
import { Section46MostImportantMessage } from './components/sections/Section46MostImportantMessage';
import { Section47SoulmateCallback } from './components/sections/Section47SoulmateCallback';
import { Section48WhiteLotusFinale } from './components/sections/Section48WhiteLotusFinale';
import { Section49FinalDedication } from './components/sections/Section49FinalDedication';
import { Section50FinalControls } from './components/sections/Section50FinalControls';

export default function App() {
  const { isMobile } = useWindowSize();
  const audioState = useAudioPlayer('/music/song.mp3');
  const { atmosphereClass } = useTimeBasedGreeting();

  const [authLoading, setAuthLoading] = useState(true);
  const [enterGlow, setEnterGlow] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [discoveredIds, setDiscoveredIds] = useState([]);
  const [selectedSecret, setSelectedSecret] = useState(null);

  // Strictly Isolated User & Admin Role States
  const [currentUser, setCurrentUser] = useState(() => getEntryPointUser('world'));
  const [isHeartCheckInDone, setIsHeartCheckInDone] = useState(false);

  // Active Entry Point Gate for Multi-User Isolated Login
  const [activeEntryPointGate, setActiveEntryPointGate] = useState(null);

  const [isJustForYouOpen, setIsJustForYouOpen] = useState(false);
  const [isConstellationOpen, setIsConstellationOpen] = useState(false);
  const [isSecretUnlockOpen, setIsSecretUnlockOpen] = useState(false);
  const [isDigitalHugOpen, setIsDigitalHugOpen] = useState(false);
  const [isSurpriseMeOpen, setIsSurpriseMeOpen] = useState(false);
  const [isMemoryJarOpen, setIsMemoryJarOpen] = useState(false);
  const [isMemoryTimelineOpen, setIsMemoryTimelineOpen] = useState(false);
  const [isMoodHistoryOpen, setIsMoodHistoryOpen] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isSweetMsgOpen, setIsSweetMsgOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isOpenWhenOpen, setIsOpenWhenOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(
    window.location.pathname === '/admin' || window.location.search.includes('admin=true')
  );

  // Interactive Garden Discoveries
  const [gardenDiscoveries, setGardenDiscoveries] = useState([]);
  const [activeGardenDiscovery, setActiveGardenDiscovery] = useState(null);

  // Restore World Session on Startup & Setup Listener
  useEffect(() => {
    let authSubscription = null;

    async function initSession() {
      try {
        console.log('[Auth Init] Restoring user session on app launch...');
        const usr = await restoreUserSession('world');
        console.log('[Auth Init] Session check complete. User active:', Boolean(usr));
        if (usr) {
          setCurrentUser(usr);
          const uId = usr.userId || 'amritayadav';
          const isDone = Boolean(
            localStorage.getItem(`amrita_heart_checkin_completed_${uId}`) ||
            sessionStorage.getItem(`amrita_heart_checkin_completed_${uId}`) ||
            sessionStorage.getItem('amrita_heart_checkin_completed')
          );
          setIsHeartCheckInDone(isDone);
        }
      } catch (e) {
        console.warn('[App] Session init warning:', e);
      } finally {
        setAuthLoading(false);
      }
    }

    initSession();

    if (supabase && supabase.auth && typeof supabase.auth.onAuthStateChange === 'function') {
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const usr = getCurrentUser();
          if (usr) setCurrentUser(usr);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setIsHeartCheckInDone(false);
        }
      });
      authSubscription = listener?.subscription;
    }

    return () => {
      if (authSubscription) authSubscription.unsubscribe();
    };
  }, []);

  // Entry Point Access Helper: Ensures every protected entry point requires its own authorization gate
  const handleOpenEntryPoint = (entryPoint, openModalCallback) => {
    if (isEntryPointAuthenticated(entryPoint)) {
      openModalCallback();
    } else {
      setActiveEntryPointGate({ entryPoint, onGranted: openModalCallback });
    }
  };

  // Track scroll position across all 51 sections
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.innerHeight;
      const windowH = window.innerHeight;
      const sectionIndex = Math.min(50, Math.floor((scrollY + windowH * 0.4) / windowH));
      setCurrentSection(sectionIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEnterWorld = () => {
    setEnterGlow(true);
    audioState.startAudio();

    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });

    setTimeout(() => setEnterGlow(false), 2500);
  };

  const handleSelectSecret = (secretId) => {
    const secretObj = secretsData.find((s) => s.id === secretId);
    if (secretObj) {
      setSelectedSecret(secretObj);
      if (!discoveredIds.includes(secretId)) {
        setDiscoveredIds((prev) => [...prev, secretId]);
      }
    }
  };

  const handleTriggerGardenDiscovery = (item) => {
    setActiveGardenDiscovery(item);
    if (!gardenDiscoveries.includes(item.id)) {
      setGardenDiscoveries((prev) => [...prev, item.id]);
    }
  };

  const handleContinueToPhase10 = () => {
    const windowH = window.innerHeight;
    window.scrollTo({
      top: 41 * windowH,
      behavior: 'smooth',
    });
  };

  const handleUserLogout = async () => {
    const uId = currentUser?.userId || 'amritayadav';
    await logoutUser('world');
    setCurrentUser(null);
    setIsHeartCheckInDone(false);
    localStorage.removeItem(`amrita_heart_checkin_completed_${uId}`);
    sessionStorage.removeItem(`amrita_heart_checkin_completed_${uId}`);
    sessionStorage.removeItem('amrita_heart_checkin_completed');
  };

  const handleHeartCheckInComplete = () => {
    const uId = currentUser?.userId || 'amritayadav';
    localStorage.setItem(`amrita_heart_checkin_completed_${uId}`, 'true');
    sessionStorage.setItem(`amrita_heart_checkin_completed_${uId}`, 'true');
    sessionStorage.setItem('amrita_heart_checkin_completed', 'true');
    setIsHeartCheckInDone(true);
  };

  // ROUTE GUARD 0: Authentication Session Restoration Loader
  if (authLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/40 backdrop-blur-lg select-none">
        <div className="glass-panel p-8 rounded-3xl max-w-sm w-full border-2 border-pink-300 shadow-2xl bg-white/95 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto shadow-inner animate-spin">
            <Sparkles size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-extrabold text-xl text-pink-950">
              Restoring Session...
            </h3>
            <p className="text-xs font-semibold text-pink-700 animate-pulse">
              Connecting to your little world ✨
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ROUTE GUARD 1: Private Admin View (Checks dedicated Admin PIN inside AdminDashboard)
  if (isAdminOpen) {
    return (
      <AdminDashboard
        onExit={() => {
          setIsAdminOpen(false);
          if (window.location.pathname === '/admin') {
            window.history.replaceState(null, '', '/');
          }
        }}
      />
    );
  }

  // ROUTE GUARD 2: Primary Entry Point Login Gate ("world")
  if (!currentUser || !isEntryPointAuthenticated('world')) {
    return (
      <UserLoginModal
        entryPoint="world"
        onLoginSuccess={(usr) => {
          setCurrentUser(usr);
          const uId = usr.userId || 'amritayadav';
          const isDone = Boolean(
            localStorage.getItem(`amrita_heart_checkin_completed_${uId}`) ||
            sessionStorage.getItem(`amrita_heart_checkin_completed_${uId}`) ||
            sessionStorage.getItem('amrita_heart_checkin_completed')
          );
          setIsHeartCheckInDone(isDone);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />
    );
  }

  // PHASE 21 OVERLAY: Pre-entry Heart Check-in Screen
  if (!isHeartCheckInDone) {
    return (
      <HeartCheckInModal
        currentUser={currentUser}
        onComplete={handleHeartCheckInComplete}
      />
    );
  }

  return (
    <div className={`relative min-h-screen ${atmosphereClass} transition-colors duration-1000 text-pink-950 font-body select-none overflow-x-hidden`}>
      {/* Initial 4-6 second Heart Balloon Pop Opening Animation */}
      <HeartBalloonPopOpening />

      {/* Interactive Cursor Sparkle Trail */}
      <SparkleTrail isMobile={isMobile} />

      {/* Top Left User Profile Badge & Quick Menu Buttons */}
      <div className="fixed top-6 left-6 z-40 select-none flex items-center space-x-2">
        <div className="glass-panel px-4 py-2 rounded-full border border-pink-200 shadow-md bg-white/80 flex items-center space-x-3 text-xs font-bold text-pink-950">
          <div className="flex items-center space-x-1.5 text-pink-700">
            <User size={14} />
            <span>{currentUser.displayName || currentUser.userId}</span>
          </div>

          <button
            onClick={() => handleOpenEntryPoint('justforyou', () => setIsJustForYouOpen(true))}
            className="pl-2 border-l border-pink-200 text-[11px] text-pink-600 hover:text-pink-900 font-bold tracking-wider flex items-center space-x-1 focus:outline-none cursor-pointer"
            title="Open Just For You"
          >
            <span>💌 Just For You</span>
          </button>

          <button
            onClick={() => handleOpenEntryPoint('sky', () => setIsConstellationOpen(true))}
            className="pl-2 border-l border-pink-200 text-[11px] text-pink-600 hover:text-pink-900 font-bold tracking-wider flex items-center space-x-1 focus:outline-none cursor-pointer"
            title="Open Interactive Constellation Sky"
          >
            <span>🌌 Sky</span>
          </button>

          <button
            onClick={() => handleOpenEntryPoint('secrets', () => setIsSecretUnlockOpen(true))}
            className="pl-2 border-l border-pink-200 text-[11px] text-pink-600 hover:text-pink-900 font-bold tracking-wider flex items-center space-x-1 focus:outline-none cursor-pointer"
            title="Open Secret Unlock Milestones"
          >
            <span>🔐 Secrets</span>
          </button>

          <button
            onClick={() => handleOpenEntryPoint('hug', () => setIsDigitalHugOpen(true))}
            className="pl-2 border-l border-pink-200 text-[11px] text-pink-600 hover:text-pink-900 font-bold tracking-wider flex items-center space-x-1 focus:outline-none cursor-pointer"
            title="Receive a Digital Hug"
          >
            <span>🤗 Hug</span>
          </button>

          <button
            onClick={() => handleOpenEntryPoint('surprise', () => setIsSurpriseMeOpen(true))}
            className="pl-2 border-l border-pink-200 text-[11px] text-pink-600 hover:text-pink-900 font-bold tracking-wider flex items-center space-x-1 focus:outline-none cursor-pointer"
            title="Trigger a Random Surprise"
          >
            <span>🎁 Surprise</span>
          </button>

          <button
            onClick={() => handleOpenEntryPoint('jar', () => setIsMemoryJarOpen(true))}
            className="pl-2 border-l border-pink-200 text-[11px] text-pink-600 hover:text-pink-900 font-bold tracking-wider flex items-center space-x-1 focus:outline-none cursor-pointer"
            title="Open Memory Jar"
          >
            <span>🫙 Jar</span>
          </button>

          <button
            onClick={() => handleOpenEntryPoint('memories', () => setIsMemoryTimelineOpen(true))}
            className="pl-2 border-l border-pink-200 text-[11px] text-pink-600 hover:text-pink-900 font-bold tracking-wider flex items-center space-x-1 focus:outline-none cursor-pointer"
            title="Open Memory Timeline"
          >
            <span>❤️ Timeline</span>
          </button>

          <button
            onClick={() => handleOpenEntryPoint('moods', () => setIsMoodHistoryOpen(true))}
            className="pl-2 border-l border-pink-200 text-[11px] text-pink-600 hover:text-pink-900 font-bold tracking-wider flex items-center space-x-1 focus:outline-none cursor-pointer"
            title="Open Mood History"
          >
            <span>🌸 Moods</span>
          </button>

          <button
            onClick={handleUserLogout}
            className="pl-2 border-l border-pink-200 text-rose-600 hover:text-rose-800 font-bold flex items-center space-x-1 focus:outline-none cursor-pointer"
            title="Log Out"
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Entry Point Gate Modal for Protected Links */}
      {activeEntryPointGate && (
        <UserLoginModal
          entryPoint={activeEntryPointGate.entryPoint}
          onLoginSuccess={(usr) => {
            const callback = activeEntryPointGate.onGranted;
            setActiveEntryPointGate(null);
            if (callback) callback();
          }}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      )}

      {/* 3D Dynamic Dream Canvas */}
      <DreamCanvas section={currentSection} isMobile={isMobile} />

      {/* Continuous Looping Audio Soundtrack */}
      <MusicPlayer audioState={audioState} />

      {/* Floating Progress Sidebar / Dots Navigation */}
      <ProgressNav
        currentSection={currentSection}
        totalSections={51}
        onNavigate={(sec) => {
          const windowH = window.innerHeight;
          window.scrollTo({
            top: sec * windowH,
            behavior: 'smooth',
          });
        }}
      />

      {/* Master 51-Section Romantic Journey across 10 Slides */}
      <main className="relative z-10 w-full">
        {/* Phase 1 & 2 */}
        <Section01Hero onEnterWorld={handleEnterWorld} enterGlow={enterGlow} />
        <Section02Welcome />
        <Section03WhyThisExists />

        {/* Phase 3 */}
        <Section04TheFeeling />
        <Section05YouAreDifferent />
        <Section06LittleThings />
        <Section07PhotoFrame />
        <Section08WhatYouMean />
        <Section09OurConnection />

        {/* Phase 4 */}
        <Section10Soulmate />
        <Section11TwoSouls />
        <Section12Soulbound />
        <Section13SoulmateXSoulbound />
        <Section14AmritaConnection />

        {/* Phase 5 */}
        <Section15Serendipity />
        <Section16TwoPaths />
        <Section17TheMoment />
        <Section18Destiny />
        <Section19AmritaSerendipity />
        <Section20SerendipityFinal />

        {/* Phase 6 */}
        <Section21ReasonsHero />
        <Section22ReasonsDiscovery onSelectSecret={handleSelectSecret} discoveredIds={discoveredIds} />
        <Section23Reason50Reveal />

        {/* Phase 7 */}
        <Section24SecretDoor />
        <Section25SecretGarden />
        <Section26SecretGardenCenter />
        <Section27FinalSecretReveal />

        {/* Phase 8 */}
        <Section28LetterEntrance />
        <Section29TheLetter />
        <Section30WordsINeverSaid />
        <Section31UnsentWords />
        <Section32AmritaLetterPhoto />
        <Section33FinalLetterPage />

        {/* Phase 9 */}
        <Section34AfterTheLetter onContinue={handleContinueToPhase10} />
        <Section35ThePath />
        <Section36ThePlaceThatStays />
        <Section37MemoryLights />
        <Section38AmritaTreePhoto />
        <Section39ThePromise />
        <Section40OneSpecialPlace />
        <Section41TheFinalPath />

        {/* Phase 10 */}
        <Section42JourneyRecap />
        <Section43EverythingLeadsHere />
        <Section44FinalAmritaPhoto />
        <Section45FinalMessage />
        <Section46MostImportantMessage />
        <Section47SoulmateCallback />
        <Section48WhiteLotusFinale />
        <Section49FinalDedication />
        <Section50FinalControls />
      </main>

      {/* Phase 29: Just For You Modal Overlay */}
      <JustForYouModal
        isOpen={isJustForYouOpen}
        onClose={() => setIsJustForYouOpen(false)}
        currentUser={getEntryPointUser('justforyou') || currentUser}
        audioState={audioState}
        onTriggerHug={() => {
          setIsJustForYouOpen(false);
          handleOpenEntryPoint('hug', () => setIsDigitalHugOpen(true));
        }}
        onTriggerSurprise={() => {
          setIsJustForYouOpen(false);
          handleOpenEntryPoint('surprise', () => setIsSurpriseMeOpen(true));
        }}
      />

      {/* Phase 28: Interactive Constellation Modal Overlay */}
      <ConstellationModal
        isOpen={isConstellationOpen}
        onClose={() => setIsConstellationOpen(false)}
        currentUser={getEntryPointUser('sky') || currentUser}
      />

      {/* Phase 27: Secret Unlock System Modal Overlay */}
      <SecretUnlockModal
        isOpen={isSecretUnlockOpen}
        onClose={() => setIsSecretUnlockOpen(false)}
        currentUser={getEntryPointUser('secrets') || currentUser}
      />

      {/* Phase 26: Digital Hug Modal Overlay */}
      <DigitalHugModal
        isOpen={isDigitalHugOpen}
        onClose={() => setIsDigitalHugOpen(false)}
        currentUser={getEntryPointUser('hug') || currentUser}
        audioState={audioState}
      />

      {/* Phase 25: Surprise Me Modal Overlay */}
      <SurpriseMeModal
        isOpen={isSurpriseMeOpen}
        onClose={() => setIsSurpriseMeOpen(false)}
        currentUser={getEntryPointUser('surprise') || currentUser}
        audioState={audioState}
      />

      {/* Phase 24: Memory Jar Modal Overlay */}
      <MemoryJarModal
        isOpen={isMemoryJarOpen}
        onClose={() => setIsMemoryJarOpen(false)}
        currentUser={getEntryPointUser('jar') || currentUser}
      />

      {/* Phase 23: Memory Timeline Modal Overlay */}
      <MemoryTimelineModal
        isOpen={isMemoryTimelineOpen}
        onClose={() => setIsMemoryTimelineOpen(false)}
      />

      {/* Phase 22: Daily Mood History Modal Overlay */}
      <MoodHistoryModal
        isOpen={isMoodHistoryOpen}
        onClose={() => setIsMoodHistoryOpen(false)}
        currentUser={getEntryPointUser('moods') || currentUser}
        onUpdateToday={() => {
          setIsMoodHistoryOpen(false);
          setIsHeartCheckInDone(false);
        }}
      />

      {/* Phase 19: Open When Modal Overlay */}
      <OpenWhenModal
        isOpen={isOpenWhenOpen}
        onClose={() => setIsOpenWhenOpen(false)}
      />

      {/* Phase 18: Personal Journal Modal Overlay */}
      <JournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
      />

      {/* Phase 17: Garden Discovery Toast & Progress Pill */}
      <GardenDiscoveryToast
        activeDiscovery={activeGardenDiscovery}
        onDismiss={() => setActiveGardenDiscovery(null)}
        discoveredList={gardenDiscoveries}
      />

      {/* Phase 14: Sweet Message Modal Overlay */}
      <SweetMessageModal
        isOpen={isSweetMsgOpen}
        onClose={() => setIsSweetMsgOpen(false)}
      />

      {/* Phase 13: Secret Vault Discovery Trigger & Modal */}
      <SecretVaultTrigger onOpenVault={() => handleOpenEntryPoint('vault', () => setIsVaultOpen(true))} />
      <SecretVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
      />

      {/* Phase 12: Daily Mood Check-in Overlay Modal */}
      <MoodCheckInModal
        isOpen={isMoodModalOpen}
        onClose={() => setIsMoodModalOpen(false)}
      />

      {/* Secret Discovery Modal */}
      <DiscoveryModal
        secret={selectedSecret}
        onClose={() => setSelectedSecret(null)}
      />
    </div>
  );
}
