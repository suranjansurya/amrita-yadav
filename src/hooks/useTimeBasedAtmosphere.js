import { useState, useEffect } from 'react';

export function useTimeBasedAtmosphere() {
  const [atmosphere, setAtmosphere] = useState(getAtmosphere);

  function getAtmosphere() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeInMinutes = hours * 60 + minutes;

    // 7 Time Periods
    // 05:00 - 07:59 (300 to 479 mins)  -> SUNRISE
    // 08:00 - 11:59 (480 to 719 mins)  -> MORNING
    // 12:00 - 15:59 (720 to 959 mins)  -> DAY
    // 16:00 - 17:59 (960 to 1079 mins) -> GOLDEN HOUR
    // 18:00 - 19:59 (1080 to 1199 mins)-> DUSK
    // 20:00 - 23:59 (1200 to 1439 mins)-> NIGHT
    // 00:00 - 04:59 (0 to 299 mins)    -> DEEP NIGHT

    let period = 'DAY';
    let bgClass = 'bg-gradient-to-b from-[#FFFFFF] via-[#FFF5F8] to-[#FDE8E9]';
    let ambientColor = '#FFF0F5';
    let ambientIntensity = 1.2;
    let dirColor = '#FFE4E1';
    let dirIntensity = 1.5;
    let pointColor = '#FFD1DC';
    let lotusEmissive = '#FFD1DC';
    let lotusEmissiveIntensity = 0.5;
    let starOpacity = 0.15;
    let moonOpacity = 0.0;
    let particleSpeed = 1.0;

    if (timeInMinutes >= 300 && timeInMinutes < 480) {
      // SUNRISE (05:00 - 07:59)
      period = 'SUNRISE';
      bgClass = 'bg-gradient-to-b from-[#FFF0F5] via-[#FFE4E1] to-[#FDE8E9]';
      ambientColor = '#FFF0F5';
      ambientIntensity = 1.1;
      dirColor = '#F5E1A4';
      dirIntensity = 1.4;
      pointColor = '#FFC0CB';
      lotusEmissive = '#FFE4E1';
      lotusEmissiveIntensity = 0.6;
      starOpacity = 0.2;
      moonOpacity = 0.1;
      particleSpeed = 0.9;
    } else if (timeInMinutes >= 480 && timeInMinutes < 720) {
      // MORNING (08:00 - 11:59)
      period = 'MORNING';
      bgClass = 'bg-gradient-to-b from-[#FFF5F8] via-[#FDE8E9] to-[#F8C3D3]';
      ambientColor = '#FFF5F8';
      ambientIntensity = 1.3;
      dirColor = '#FFE4E1';
      dirIntensity = 1.6;
      pointColor = '#FFD1DC';
      lotusEmissive = '#FFD1DC';
      lotusEmissiveIntensity = 0.4;
      starOpacity = 0.1;
      moonOpacity = 0.0;
      particleSpeed = 1.0;
    } else if (timeInMinutes >= 720 && timeInMinutes < 960) {
      // DAY (12:00 - 15:59)
      period = 'DAY';
      bgClass = 'bg-gradient-to-b from-[#FFFFFF] via-[#FFF5F8] to-[#FDE8E9]';
      ambientColor = '#FFFFFF';
      ambientIntensity = 1.4;
      dirColor = '#FFF5F8';
      dirIntensity = 1.7;
      pointColor = '#FFE4E1';
      lotusEmissive = '#FFF0F5';
      lotusEmissiveIntensity = 0.3;
      starOpacity = 0.05;
      moonOpacity = 0.0;
      particleSpeed = 1.0;
    } else if (timeInMinutes >= 960 && timeInMinutes < 1080) {
      // GOLDEN HOUR (16:00 - 17:59)
      period = 'GOLDEN HOUR';
      bgClass = 'bg-gradient-to-b from-[#FDE8E9] via-[#F8C3D3] to-[#E89BB1]';
      ambientColor = '#FDE8E9';
      ambientIntensity = 1.2;
      dirColor = '#F5E1A4';
      dirIntensity = 1.8;
      pointColor = '#E89BB1';
      lotusEmissive = '#F5E1A4';
      lotusEmissiveIntensity = 0.7;
      starOpacity = 0.3;
      moonOpacity = 0.2;
      particleSpeed = 1.1;
    } else if (timeInMinutes >= 1080 && timeInMinutes < 1200) {
      // DUSK (18:00 - 19:59)
      period = 'DUSK';
      bgClass = 'bg-gradient-to-b from-[#F3D7E4] via-[#E8B4CB] to-[#D9889E]';
      ambientColor = '#F3D7E4';
      ambientIntensity = 0.9;
      dirColor = '#D9889E';
      dirIntensity = 1.2;
      pointColor = '#C9778F';
      lotusEmissive = '#E8B4CB';
      lotusEmissiveIntensity = 0.8;
      starOpacity = 0.6;
      moonOpacity = 0.5;
      particleSpeed = 0.9;
    } else if (timeInMinutes >= 1200 || timeInMinutes < 300) {
      if (timeInMinutes >= 1200) {
        // NIGHT (20:00 - 23:59)
        period = 'NIGHT';
        bgClass = 'bg-gradient-to-b from-[#3B2533] via-[#5C3A4F] to-[#8C5877]';
        ambientColor = '#5C3A4F';
        ambientIntensity = 0.7;
        dirColor = '#8C5877';
        dirIntensity = 0.9;
        pointColor = '#FFD1DC';
        lotusEmissive = '#FFB6C1';
        lotusEmissiveIntensity = 0.9;
        starOpacity = 0.9;
        moonOpacity = 0.9;
        particleSpeed = 0.8;
      } else {
        // DEEP NIGHT (00:00 - 04:59)
        period = 'DEEP NIGHT';
        bgClass = 'bg-gradient-to-b from-[#2A1824] via-[#452839] to-[#6E425B]';
        ambientColor = '#452839';
        ambientIntensity = 0.5;
        dirColor = '#6E425B';
        dirIntensity = 0.7;
        pointColor = '#E5A9B4';
        lotusEmissive = '#FFD1DC';
        lotusEmissiveIntensity = 1.0;
        starOpacity = 1.0;
        moonOpacity = 1.0;
        particleSpeed = 0.6;
      }
    }

    return {
      period,
      bgClass,
      ambientColor,
      ambientIntensity,
      dirColor,
      dirIntensity,
      pointColor,
      lotusEmissive,
      lotusEmissiveIntensity,
      starOpacity,
      moonOpacity,
      particleSpeed,
    };
  }

  useEffect(() => {
    // Check time every minute
    const interval = setInterval(() => {
      setAtmosphere(getAtmosphere());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return atmosphere;
}
