import { useState, useEffect } from 'react';

export function useTimeBasedGreeting() {
  const [greetingInfo, setGreetingInfo] = useState(getGreeting);

  function getGreeting() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Format 12-hour clock (e.g. "12:54 PM")
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const liveTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

    let icon = '☀️';
    let text = 'Good Afternoon, Amrita';
    let period = 'daytime';

    if (hours >= 5 && hours < 12) {
      icon = '🌅';
      text = 'Good Morning, Amrita';
      period = 'morning';
    } else if (hours >= 12 && hours < 17) {
      icon = '☀️';
      text = 'Good Afternoon, Amrita';
      period = 'afternoon';
    } else if (hours >= 17 && hours < 20) {
      icon = '🌇';
      text = 'Good Evening, Amrita';
      period = 'evening';
    } else {
      icon = '🌙';
      text = 'Good Night, Amrita';
      period = 'night';
    }

    // Atmosphere color gradient token based on local device time
    let atmosphereClass = 'bg-gradient-to-b from-[#FFFFFF] via-[#FFF5F8] to-[#FDE8E9]';
    if (hours >= 5 && hours < 8) {
      atmosphereClass = 'bg-gradient-to-b from-[#FFF0F5] via-[#FFE4E1] to-[#FDE8E9]';
    } else if (hours >= 8 && hours < 12) {
      atmosphereClass = 'bg-gradient-to-b from-[#FFF5F8] via-[#FDE8E9] to-[#F8C3D3]';
    } else if (hours >= 12 && hours < 16) {
      atmosphereClass = 'bg-gradient-to-b from-[#FFFFFF] via-[#FFF5F8] to-[#FDE8E9]';
    } else if (hours >= 16 && hours < 18) {
      atmosphereClass = 'bg-gradient-to-b from-[#FDE8E9] via-[#F8C3D3] to-[#E89BB1]';
    } else if (hours >= 18 && hours < 20) {
      atmosphereClass = 'bg-gradient-to-b from-[#F3D7E4] via-[#E8B4CB] to-[#D9889E]';
    } else if (hours >= 20 && hours < 24) {
      atmosphereClass = 'bg-gradient-to-b from-[#3B2533] via-[#5C3A4F] to-[#8C5877]';
    } else {
      atmosphereClass = 'bg-gradient-to-b from-[#2A1824] via-[#452839] to-[#6E425B]';
    }

    return { icon, text, period, liveTime, atmosphereClass };
  }

  useEffect(() => {
    // Check local device time once every minute
    const interval = setInterval(() => {
      setGreetingInfo(getGreeting());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return greetingInfo;
}
