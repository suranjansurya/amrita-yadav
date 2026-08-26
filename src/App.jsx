import React, { useState, useEffect } from 'react';
import { useWindowSize } from './hooks/useWindowSize';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { secretsData } from './data/secretsData';

// 3D Background Canvas & Animations
import { DreamCanvas } from './components/3d/DreamCanvas';
import { SparkleTrail } from './components/animations/SparkleTrail';
import { HeartBalloonPopOpening } from './components/animations/HeartBalloonPopOpening';
import { MusicPlayer } from './components/common/MusicPlayer';
import { DiscoveryModal } from './components/common/DiscoveryModal';
import { ProgressNav } from './components/common/ProgressNav';

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

  const [enterGlow, setEnterGlow] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [discoveredIds, setDiscoveredIds] = useState([]);
  const [selectedSecret, setSelectedSecret] = useState(null);

  // Track scroll position across all 51 sections
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
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

  const handleContinueToPhase10 = () => {
    const windowH = window.innerHeight;
    window.scrollTo({
      top: 41 * windowH,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative min-h-screen bg-pink-base text-pink-950 font-body select-none overflow-x-hidden">
      {/* Initial 4-6 second Heart Balloon Pop Opening Animation */}
      <HeartBalloonPopOpening />

      {/* Interactive Cursor Sparkle Trail */}
      <SparkleTrail isMobile={isMobile} />

      {/* Side Journey Progress Navigation (52 Sections) */}
      <ProgressNav currentSection={currentSection} totalSections={52} />

      {/* 3D Background Canvas with Dynamic Lotus Bloom */}
      <DreamCanvas
        isMobile={isMobile}
        enterGlow={enterGlow}
        currentSection={currentSection}
        onSelectSecret={handleSelectSecret}
        discoveredIds={discoveredIds}
      />

      {/* Complete 51-Section Master Cinematic Journey (Phase 1 to 10) */}
      <main className="relative z-10 space-y-12 sm:space-y-24">
        {/* Phase 1 & 2 */}
        <Section01Hero onEnter={handleEnterWorld} enterGlow={enterGlow} />
        <Section02Welcome />
        <Section03WhyThisExists />

        {/* Phase 3 */}
        <Section04TheFeeling />
        <Section05YouAreDifferent />
        <Section06LittleThings
          onSelectSecret={handleSelectSecret}
          discoveredIds={discoveredIds}
        />
        <Section07PhotoFrame />
        <Section08WhatYouMean />
        <Section09OurConnection />

        {/* Phase 4: SOULMATE × SOULBOUND */}
        <Section10Soulmate />
        <Section11TwoSouls />
        <Section12Soulbound />
        <Section13SoulmateXSoulbound />
        <Section14AmritaConnection />

        {/* Phase 5: SERENDIPITY */}
        <Section15Serendipity />
        <Section16TwoPaths />
        <Section17TheMoment />
        <Section18Destiny />
        <Section19AmritaSerendipity />
        <Section20SerendipityFinal />

        {/* Phase 6: 50 REASONS WHY YOU ARE SPECIAL */}
        <Section21ReasonsHero />
        <Section22ReasonsDiscovery />
        <Section23Reason50Reveal />

        {/* Phase 7: THE SECRET DREAM WORLD */}
        <Section24SecretDoor />
        <Section25SecretGarden />
        <Section26SecretGardenCenter />
        <Section27FinalSecretReveal />

        {/* Phase 8: THE LETTER & WORDS I NEVER SAID */}
        <Section28LetterEntrance />
        <Section29TheLetter />
        <Section30WordsINeverSaid />
        <Section31UnsentWords />
        <Section32AmritaLetterPhoto />
        <Section33FinalLetterPage />

        {/* Phase 9: THE PROMISE & THE PLACE THAT STAYS */}
        <Section34AfterTheLetter />
        <Section35ThePath />
        <Section36ThePlaceThatStays />
        <Section37MemoryLights />
        <Section38AmritaTreePhoto />
        <Section39ThePromise />
        <Section40OneSpecialPlace />
        <Section41TheFinalPath onContinueToPhase10={handleContinueToPhase10} />

        {/* Phase 10: THE FINAL REVEAL — FOR AMRITA */}
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

      {/* Master Footer */}
      <footer className="relative z-10 py-12 text-center text-xs font-semibold text-pink-700/80 border-t border-pink-200/50 backdrop-blur-sm">
        <p className="font-script text-2xl text-pink-800 mb-1">Amrita Yadav</p>
        <p>A little world made for one special soul • All 10 Phases 100% Complete</p>
      </footer>

      {/* Audio Controller */}
      <MusicPlayer audioState={audioState} />

      {/* Secret Discovery Modal */}
      <DiscoveryModal
        secret={selectedSecret}
        onClose={() => setSelectedSecret(null)}
      />
    </div>
  );
}
