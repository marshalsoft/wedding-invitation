"use client"
import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas-pro';
// Interfaces for Snap/Photo Data
interface Photo {
  id: number;
  url: string;
  caption: string;
  category: 'Court Marraige' | 'couples' | 'candid';
  date: string;
}

// Interfaces for Form State
interface FormData {
  name: string;
  attending: 'attending' | 'absent' | 'undecided';
  guestCount: 'single'|'couple' | 'family' | 'friend';
  mobile:string;
  firstName:string;
  lastName:string;
}

// Interfaces for Countdown Timer
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isMarried: boolean;
}

// Interfaces for RSVP Contacts
interface Contact {
  name: string;
  phone: string;
  tel: string;
}
import px1 from "./assets/pre-wedding/1.jpeg";
import px2 from "./assets/pre-wedding/2.jpeg";
import px3 from "./assets/pre-wedding/3.jpeg";
import px4 from "./assets/pre-wedding/4.jpeg";
import PhoneInput from './components/PhoneInput';

export default function App(): React.JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  
  // RSVP Form State
  const [rsvpSubmitted, setRsvpSubmitted] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    attending: 'attending',
    guestCount: 'single',
    mobile:'',
    firstName:'',
    lastName:''
  });

  // Photo Gallery / Snap Gallery State
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const photos: Photo[] = [
    {
      id: 0,
      url: px1.src,
      caption: 'The Beginning of Our Story',
      category: 'Court Marraige',
      date: 'Jan 2026'
    },
    {
      id: 1,
      url: px2.src,
      caption: 'Unforgettable Moments & Laughter',
      category: 'Court Marraige',
      date: 'Feb 2026'
    },
    {
      id: 2,
      url: px4.src,
      caption: 'Golden Hour Together',
      category: 'Court Marraige',
      date: 'Mar 2026'
    },
    {
      id: 3,
      url: px3.src,
      caption: 'Hand in Hand, Heart to Heart',
      category: 'Court Marraige',
      date: 'Apr 2026'
    }
  ];

  const filteredPhotos: Photo[] = activeCategory === 'all' 
    ? photos 
    : photos.filter(p => p.category === activeCategory);


  const openLightbox = (index: number): void => {
    setLightboxIndex(index);
  };

  const nextLightbox = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
    }
  };

  const prevLightbox = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };
   const [iso2, setIso2] = useState('US');
   const [dialCode, setDialCode] = useState('+1');
  const [number, setNumber] = useState('');
  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, isMarried: false });

  useEffect(() => {
    // Dec 5, 2026 10:00:00
    const weddingDate: number = new Date('December 5, 2026 10:00:00').getTime();

    const updateTimer = (): void => {
      const now: number = new Date().getTime();
      const difference: number = weddingDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
          isMarried: false
        });
      } else {
        setTimeLeft(prev => ({ ...prev, isMarried: true }));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);
const [isGenerating, setIsGenerating] = useState(false);
const [downloadSuccess, setDownloadSuccess] = useState(false);
const cardCanvasRef = useRef<HTMLCanvasElement | null>(null);
const [passId,setPassId] = useState<string>("");
const [loading,setLoading] = useState<boolean>(false);
const venue = "Merry Makers Event Center 702 Kashim Ibrahim Wy, Wuse 2, Abuja 900288, Federal Capital Territory";
const addToCalendar = (): void => {
    const title: string = encodeURIComponent("Bridget & Brown Wedding Celebration");
    const details: string = encodeURIComponent("Celebration of Love - Bridget & Brown (#BrizzyBrownEverAfter)");
    const location: string = encodeURIComponent(venue);
    const startDate: string = "20261205T100000";
    const endDate: string = "20261205T180000";

    const googleCalUrl: string = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  const copyToClipboard = (text: string): void => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const tempInput = document.createElement('input');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleRsvpSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setLoading(true);
    const payload = {...formData,mobile:`${dialCode}${parseInt(formData.mobile)}`,name:`${formData.firstName} ${formData.lastName}`} as any;
    delete payload.firstName;
    delete payload.lastName;
    fetch("https://api.propfindaplus.com/v1.0/bridget-brown",{
      method:"POST",
      body: JSON.stringify(payload),
      headers: {
      "Content-Type": "application/json",
      }
    }).then((res)=>res.json()).then((res)=>{
        setLoading(false);
        if(res.status && res?.data?.passId)
        {
          setRsvpSubmitted(true);
          setPassId(res?.data?.passId);
          setShowQrModal(true);
        }else{
          alert(res.message);
        }
    })
  };

  const rsvpContacts: Contact[] = [
    { name: 'Obed', phone: '+234 803 110 1331', tel: '+2348031101331' },
    { name: 'Sister Chalya', phone: '+234 703 225 9899', tel: '+2347032259899' },
    { name: 'Eti-Usen', phone: '+234 802 667 2138', tel: '+2348026672138' }
  ];

const divRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
const downloadAccessCard = async (fileName = 'access-pass.png') => {
    if (!divRef.current) {
      console.error('The div reference is not attached.');
      return;
    }

    setIsCapturing(true);
    try {
      // 1. Convert the div to a canvas
      const canvas = await html2canvas(divRef.current, {
        useCORS: true, // Necessary if your div contains cross-origin images
        allowTaint: true,
        backgroundColor: null, // Keeps transparency if your div has it
        scale: 2, // Higher scale for better quality (2x resolution)
      });

      // 2. Convert the canvas to a data URL (base64 image)
      const imageDataUrl = canvas.toDataURL('image/png', 1.0);

      // 3. Create a temporary anchor element to download the image
      const link = document.createElement('a');
      link.href = imageDataUrl;
      link.download = fileName; // Set the desired file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error capturing the div:', error);
    } finally {
      setIsCapturing(false);
    }
  };
useEffect(()=>{
  const bbPass = `BB-PASS-${Date.now()}`;   
  setPassId(bbPass);
},[])

function formatName(input:string) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[^\p{L}\s]/gu, '')   // remove anything that's not a letter or whitespace
    .trim()
    .replace(/\s+/g, ' ')          // collapse whitespace to a single space
    .toLowerCase()
    .replace(/\p{L}+/gu, w => w[0].toUpperCase() + w.slice(1));
}

  return (
    <div className="font-sans bg-[#fdfbf7] text-slate-800 antialiased selection:bg-[#6b7a4a] selection:text-white min-h-screen">
      
      {/* FontAwesome & Fonts Loading */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&family=Great+Vibes&display=swap" rel="stylesheet" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 bg-[#1a2012]/90 backdrop-blur-md text-white border-b border-[#3d472a]">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <a href="#" className="font-['Great_Vibes'] text-2xl md:text-3xl text-[#b8c49e] font-bold hover:text-white transition-colors">B & B</a>
          
          <div className="hidden md:flex space-x-8 text-xs uppercase tracking-widest font-light">
            <a href="#hero" className="hover:text-[#b8c49e] transition-colors">Home</a>
            <a href="#party" className="hover:text-[#b8c49e] transition-colors">The Wedding Party</a>
            <a href="#photos" className="hover:text-[#b8c49e] transition-colors">Photos</a>
            <a href="#gifts" className="hover:text-[#b8c49e] transition-colors">Gifts</a>
            <a href="#gate-access" className="hover:text-[#b8c49e] transition-colors">Gate Access / RSVP</a>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#b8c49e] focus:outline-none" aria-label="Toggle Menu">
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1a2012] px-6 py-6 border-b border-[#3d472a] transition-all">
            <div className="flex flex-col space-y-4 text-center font-serif text-lg tracking-wider">
              <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#b8c49e] border-b border-[#2b331f]">Home</a>
              <a href="#party" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#b8c49e] border-b border-[#2b331f]">The Wedding Party</a>
              <a href="#photos" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#b8c49e] border-b border-[#2b331f]">Photos</a>
              <a href="#gifts" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#b8c49e] border-b border-[#2b331f]">Gifts</a>
              <a href="#gate-access" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[#b8c49e] font-bold">Gate Access / RSVP</a>
            </div>
          </div>
        )}
      </nav>

      {/* PAGE 1: HERO SECTION */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center text-center overflow-hidden bg-[#1a2012] pt-20">
        <div className="absolute inset-0 z-0">
          <img src={px3.src} 
               alt="Wedding Background" 
               className="w-full min-h-screen object-cover object-center opacity-40 scale-105" />
          <div className="absolute min-h-screen inset-0 bg-gradient-to-b from-[#1a2012]/70 to-[#1a2012]/92"></div>
        </div>
        <div className="relative z-10 px-6 max-w-4xl mx-auto text-white py-12">
          <p className="font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-[#b8c49e] mb-4 font-medium">
            Join Our Families In The
          </p>
          <h2 className="font-['Cormorant_Garamond'] italic text-2xl md:text-3xl font-light text-stone-200 mb-2">
            Celebration of Love
          </h2>
          <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-7xl lg:text-8xl font-normal leading-tight mb-4 tracking-wide [text-shadow:0_0_15px_rgba(184,196,158,0.3)]">
            Bridget <span className="font-['Great_Vibes'] text-[#b8c49e] text-6xl md:text-8xl lowercase px-2">&</span> Brown
          </h1>
          <div className="w-24 h-0.5 bg-[#b8c49e] mx-auto my-6"></div>
          
          <p className="font-sans tracking-widest uppercase text-base md:text-lg font-semibold text-stone-200 mb-8">
            Saturday, 5th December 2026
          </p>

          {/* Countdown Timer */}
          <div className="max-w-3xl mx-auto my-8">
            {timeLeft.isMarried ? (
              <h2 className="font-['Cormorant_Garamond'] text-3xl text-[#b8c49e]">We Are Married! 🎉</h2>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#2b331f]/80 p-4 rounded-2xl border border-[#526037]/50 backdrop-blur-sm">
                  <span className="font-['Cormorant_Garamond'] text-4xl md:text-5xl font-bold text-[#b8c49e] block">{String(timeLeft.days).padStart(2, '0')}</span>
                  <span className="text-xs uppercase tracking-widest text-stone-300 mt-1 block">Days</span>
                </div>
                <div className="bg-[#2b331f]/80 p-4 rounded-2xl border border-[#526037]/50 backdrop-blur-sm">
                  <span className="font-['Cormorant_Garamond'] text-4xl md:text-5xl font-bold text-[#b8c49e] block">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-xs uppercase tracking-widest text-stone-300 mt-1 block">Hours</span>
                </div>
                <div className="bg-[#2b331f]/80 p-4 rounded-2xl border border-[#526037]/50 backdrop-blur-sm">
                  <span className="font-['Cormorant_Garamond'] text-4xl md:text-5xl font-bold text-[#b8c49e] block">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-xs uppercase tracking-widest text-stone-300 mt-1 block">Minutes</span>
                </div>
                <div className="bg-[#2b331f]/80 p-4 rounded-2xl border border-[#526037]/50 backdrop-blur-sm">
                  <span className="font-['Cormorant_Garamond'] text-4xl md:text-5xl font-bold text-[#b8c49e] block">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-xs uppercase tracking-widest text-stone-300 mt-1 block">Seconds</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <button onClick={addToCalendar} className="w-full sm:w-auto px-8 py-3.5 bg-[#6b7a4a] hover:bg-[#526037] text-white font-semibold text-xs uppercase tracking-wider rounded-full transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer">
              <i className="fa-regular fa-calendar-plus"></i> Add to Calendar
            </button>
            <a href="#gate-access" className="w-full sm:w-auto px-8 py-3.5 border border-[#b8c49e] text-[#b8c49e] hover:bg-[#2b331f]/60 font-semibold text-xs uppercase tracking-wider rounded-full transition-all">
              Register / RSVP
            </a>
          </div>
          
          <p className="text-xs text-[#b8c49e] mt-8 font-medium tracking-widest uppercase">#BrizzyBrownEverAfter</p>
        </div>

        <a href="#party" className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 text-[#b8c49e] animate-bounce">
          <i className="fa-solid fa-chevron-down text-xl"></i>
        </a>
      </section>

      {/* PAGE 2: ESPRESSO - THE WEDDING PARTY */}
      <section id="party"  className="py-24 min-h-screen bg-[#170e0a] text-stone-100 relative border-t border-[#3d281d]">
             <img src={px1.src} 
               alt="Wedding Background" 
               className="w-full h-full mt-[-64px] object-cover object-center opacity-10 scale-105 absolute" />
        <div className="w-full h-full mx-auto top-[0px] text-center ">
          <p className="font-['Cormorant_Garamond'] text-lg md:text-xl text-[#c4a482] mb-2 italic">
            Together with Chief and Mrs Andrew Machief (Turakin Shagau) and Late Deac. & Mrs Alph-Brown Enang
          </p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-6xl font-bold mb-4 uppercase tracking-wide text-white">
            JOIN THE WEDDING PARTY
          </h2>
          <p className="text-stone-300 uppercase tracking-widest text-xs md:text-sm font-semibold mb-10">
            Honor us at our wedding party
          </p>

          <div className="bg-[#261810]/80 p-8 md:p-12 rounded-3xl border border-[#3d281d] shadow-2xl max-w-2xl mx-auto mb-12">
            <div className="space-y-6">
              <div>
                <span className="text-[#c4a482] text-xs font-semibold uppercase tracking-widest block mb-1">Date</span>
                <p className="font-['Cormorant_Garamond'] text-3xl font-bold text-white">Saturday, 5th DECEMBER 2026</p>
              </div>

              <div className="w-12 h-0.5 bg-[#5c4033] mx-auto"></div>
              <div className="text-[#c4a482] text-xs font-semibold uppercase tracking-widest block mb-1">Solemnization of holy matrimony at the <span className='font-bold text-orange-500'>Love Garden</span> by </div>
              <div className="w-12 h-0.5 bg-[#5c4033] mx-auto"></div>
              <div>
                <div className="text-[#c4a482] text-xs font-semibold uppercase tracking-widest block mb-1">Time</div>
                <p className="font-['Cormorant_Garamond'] text-2xl font-semibold text-white">10:00 AM</p>
              </div>

              <div className="w-12 h-0.5 bg-[#5c4033] mx-auto"></div>
              <div className="text-[#c4a482] text-xs font-semibold uppercase tracking-widest block mb-1">Wedding Party at <span className='font-bold text-orange-500'>Amber Marquee Tent</span></div>
              <div className="w-12 h-0.5 bg-[#5c4033] mx-auto"></div>
             <p className="font-['Cormorant_Garamond'] text-2xl font-semibold text-white">2PM Prompt</p>
              <div>
                <span className="text-[#c4a482] text-xs font-semibold uppercase tracking-widest block mb-1">Venue</span>
                <p className="font-['Cormorant_Garamond'] text-2xl font-medium text-white italic">{venue}</p>
                <p className="text-xs text-stone-400 mt-2">Reception follows at the same venue</p>
              </div>

              <div className="pt-4">
                <a href={`https://www.google.com/maps/search/?api=1&query=${String(venue).replace(" ","+")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#3d281d] hover:bg-[#5c4033] text-stone-200 text-xs font-semibold uppercase tracking-wider rounded-full border border-[#c4a482]/30 transition-all">
                  <i className="fa-solid fa-map-pin text-[#c4a482]"></i> View Location (Map Link)
                </a>
              </div>
            </div>
          </div>

          {/* Colours of the Day */}
          <div className="mb-12">
            <h3 className="font-['Cormorant_Garamond'] text-2xl text-white font-semibold mb-6">Colours of the Day</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-[#261810]/60 p-4 rounded-2xl border border-[#3d281d] flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#121212] border border-stone-600 mb-2 shadow-md"></div>
                <span className="text-xs font-semibold text-white">Jet Black</span>
                <span className="text-[10px] font-mono text-stone-400">#121212</span>
              </div>
              <div className="bg-[#261810]/60 p-4 rounded-2xl border border-[#3d281d] flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#5c4033] border border-stone-600 mb-2 shadow-md"></div>
                <span className="text-xs font-semibold text-white">Espresso</span>
                <span className="text-[10px] font-mono text-stone-400">#5C4033</span>
              </div>
              <div className="bg-[#261810]/60 p-4 rounded-2xl border border-[#3d281d] flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#c4a482] border border-stone-600 mb-2 shadow-md"></div>
                <span className="text-xs font-semibold text-white">Brown Nude</span>
                <span className="text-[10px] font-mono text-stone-400">#C4A482</span>
              </div>
              <div className="bg-[#261810]/60 p-4 rounded-2xl border border-[#3d281d] flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#526037] border border-stone-600 mb-2 shadow-md"></div>
                <span className="text-xs font-semibold text-white">Olive Green</span>
                <span className="text-[10px] font-mono text-stone-400">#526037</span>
              </div>
            </div>
          </div>

          <div className="max-w-2xl  mx-auto border-t border-[#3d281d] pt-8">
            <blockquote className="font-['Cormorant_Garamond'] italic text-lg text-[#c4a482] leading-relaxed">
              "Two are better than one, because they have a good reward for their toil... a threefold cord is not quickly broken.”
            </blockquote>
            <cite className="text-xs font-semibold text-stone-400 uppercase tracking-widest mt-2 block font-sans">
              — Ecclesiastes 4:9-12
            </cite>
          </div>

        </div>
      </section>

      {/* GALLERY / SNAP GALLERY SECTION */}
      <section id="photos" className="py-24 bg-[#f6f7f2] border-t border-[#e3e7d7]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="font-['Great_Vibes'] text-3xl text-[#526037]">Capturing Our Moments</span>
          <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl font-bold text-[#1a2012] mt-1 mb-2">Snap Gallery</h2>
          <p className="text-slate-600 text-xs md:text-sm uppercase tracking-widest font-semibold mb-6">Explore snaps from our love journey</p>
          <div className="w-16 h-0.5 bg-[#6b7a4a] mx-auto mb-10"></div>
          {/* Filter Categories */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10">
            {[
              { id: 'all', label: 'All Snaps' },
              { id: 'Court Marraige', label: 'Court Marraige' },
              { id: 'prewedding', label: 'Pre-Wedding' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.id 
                    ? 'bg-[#3d472a] text-white shadow-md' 
                    : 'bg-white text-slate-700 hover:bg-[#e3e7d7] border border-[#e3e7d7]'
                }`}
              >
              {cat.label}
              </button>
            ))}
          </div>

          {/* Snap Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((photo, idx) => (
              <div 
                key={photo.id} 
                onClick={() => openLightbox(idx)}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-[#e3e7d7] cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <img 
                    src={photo.url} 
                    alt={photo.caption} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a2012]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 text-white flex items-center justify-center text-lg">
                      <i className="fa-solid fa-expand"></i>
                    </span>
                  </div>
                </div>

                {/* Card Footer Info */}
                <div className="p-4 flex items-center justify-between text-left bg-white">
                  <div>
                    <h4 className="font-['Cormorant_Garamond'] text-lg font-bold text-[#1a2012] truncate max-w-[170px]">{photo.caption}</h4>
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">#{photo.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close Button */}
          <button 
            onClick={() => setLightboxIndex(null)} 
            className="absolute top-6 right-6 text-white/80 hover:text-white text-3xl z-10 p-2 focus:outline-none"
            aria-label="Close Lightbox"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          {/* Prev Button */}
          <button 
            onClick={prevLightbox} 
            className="absolute left-4 md:left-8 text-white/80 hover:text-white text-2xl md:text-4xl z-10 p-3 bg-black/40 hover:bg-black/70 rounded-full transition-all focus:outline-none"
            aria-label="Previous Photo"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          {/* Main Lightbox Content */}
          <div 
            className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center relative"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <img 
              src={filteredPhotos[lightboxIndex].url} 
              alt={filteredPhotos[lightboxIndex].caption} 
              className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
            />
            
            <div className="mt-4 text-center text-white space-y-2">
              <h3 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl font-bold">
                {filteredPhotos[lightboxIndex].caption}
              </h3>
            </div>
          </div>

          {/* Next Button */}
          <button 
            onClick={nextLightbox} 
            className="absolute right-4 md:right-8 text-white/80 hover:text-white text-2xl md:text-4xl z-10 p-3 bg-black/40 hover:bg-black/70 rounded-full transition-all focus:outline-none"
            aria-label="Next Photo"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* PAGE 3: GIFTS */}
      <section id="gifts" className="py-24 bg-[#3d472a] text-white relative">
        <div className="max-w-3xl mx-auto px-6 text-center">
          
          <div className="inline-block p-4 bg-[#526037]/80 rounded-full mb-6">
            <i className="fa-solid fa-gift text-3xl text-[#b8c49e]"></i>
          </div>
          
          <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl font-bold mb-4">Gifts</h2>
          <div className="w-16 h-0.5 bg-[#b8c49e] mx-auto mb-8"></div>
          <p className="font-['Cormorant_Garamond'] text-xl md:text-2xl text-[#e3e7d7] italic mb-6">
            "No gifts can replace your presence. Thank you for honoring us."
          </p>

          <div className="bg-[#1a2012] p-8 rounded-3xl border border-[#6b7a4a] shadow-xl max-w-xl mx-auto mb-8 text-left">
            <p className="text-stone-300 text-sm leading-relaxed mb-6 font-light">
              Kindly note: there will be no physical gift. We will appreciate the monetization of your gift into the account below:
            </p>

            <div className="bg-[#3d472a]/90 p-6 rounded-2xl border border-[#6b7a4a] space-y-3">
              <div className="flex justify-between items-center text-xs text-[#b8c49e] uppercase tracking-widest font-semibold">
                <span>Account Name</span>
                <span className="text-white">GTBANK</span>
              </div>
              <p className="font-['Cormorant_Garamond'] text-2xl font-bold text-white tracking-wide">Bridget Machief Andrew</p>
              
              <div className="flex items-center justify-between bg-[#1a2012] p-3.5 rounded-xl border border-[#3d472a] mt-3">
                <span className="font-mono text-xl text-[#b8c49e] font-bold tracking-widest">0128646442</span>
                <button onClick={() => copyToClipboard('0128646442')} className="text-xs bg-[#6b7a4a] hover:bg-[#526037] text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer">
                  <i className="fa-regular fa-copy hidden lg:block"></i> Copy
                </button>
              </div>
            </div>

            <p className="text-xs text-amber-200/80 mt-4 italic font-light flex items-center gap-2">
              <i className="fa-solid fa-circle-info text-[#b8c49e]"></i> Note: kindly send money to only the account above.
            </p>
          </div>

          <p className="font-['Cormorant_Garamond'] text-2xl text-[#b8c49e] italic">
            Thank you immensely for your show of Love!
          </p>

          {copied && (
            <div className="mt-6 inline-block bg-[#b8c49e] text-[#1a2012] px-6 py-2.5 rounded-full text-xs font-bold transition-opacity shadow-lg">
              Account number copied to clipboard!
            </div>
          )}

        </div>
      </section>

      {/* PAGE 4: GATE ACCESS & RSVP */}
      <section id="gate-access" className="py-24 px-6 bg-[#fdfbf7]">
        <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-stone-200">
          <div className="text-center mb-8">
            <span className="font-['Great_Vibes'] text-3xl text-[#526037]">Registration</span>
            <h2 className="font-['Cormorant_Garamond'] text-4xl font-bold text-[#1a2012] mt-1">Gate Access</h2>
            <p className="text-slate-600 text-sm mt-2 font-medium">Kindly Respond. Register to attend.</p>
          </div>

          {!rsvpSubmitted ? (
            <form 
            onSubmit={handleRsvpSubmit} 
            className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">First name *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. John"
                  value={formData.firstName}
                  maxLength={40}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, firstName: formatName(e.target.value)})}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#6b7a4a] focus:ring-1 focus:ring-[#6b7a4a] transition-all text-sm" 
                />
              </div>
               <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Last name *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Doe"
                  value={formData.lastName}
                  maxLength={40}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, lastName: formatName(e.target.value)})}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#6b7a4a] focus:ring-1 focus:ring-[#6b7a4a] transition-all text-sm" 
                />
              </div>
<div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Phone number *</label>
            <PhoneInput
              countryIso2={iso2}
              nationalNumber={number}
              error={""}
              label=''
              required
              onChange={({ country, nationalNumber, isValid, e164 }) => {
                setIso2(country.iso2);
                setDialCode(country.dialCode);
                setNumber(String(parseInt(nationalNumber)));
                setFormData({...formData,mobile:nationalNumber});
              }}
            />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Will you Join us? *</label>
                <div className="space-y-3">
                  {[
                    { value: 'attending', label: 'I will be at the wedding party.' },
                    { value: 'absent', label: 'I will be Unavoidably Absent (I have sent my gift).' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center p-3.5 border border-slate-200 rounded-xl hover:bg-[#f6f7f2] cursor-pointer transition-colors text-sm">
                      <input 
                        type="radio" 
                        name="attending" 
                        value={option.value} 
                        checked={formData.attending === option.value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, attending: e.target.value as FormData['attending']})}
                        required 
                        className="text-[#526037] focus:ring-[#6b7a4a]" 
                      />
                      <span className="ml-3 text-slate-800 font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">How many guests?</label>
                <select 
                  value={formData.guestCount}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, guestCount: e.target.value as FormData['guestCount']})}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#6b7a4a] focus:ring-1 focus:ring-[#6b7a4a] transition-all text-sm bg-white"
                >
                  <option value="single">Single</option>
                  <option value="couple">Couple</option>
                  <option value="family">I and my whole family</option>
                  <option value="friend">Me and a friend</option>
                </select>
              </div>

              <button 
              type="submit" 
              disabled={loading}
              className="w-full gap-2 flex items-center justify-center py-4 bg-[#3d472a] hover:bg-[#1a2012] text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg cursor-pointer">
                {loading?<LoadingSpinner size='md' color='text-white' label='' />:<span>Submit Registration</span>}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#e3e7d7] text-[#3d472a] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                <i className="fa-solid fa-check"></i>
              </div>
              <h3 className="font-['Cormorant_Garamond'] text-3xl font-bold text-[#1a2012] mb-2">Thank You, {formData.name || 'Guest'}!</h3>
              <p className="text-slate-600 text-sm mb-6">Your gate access response has been saved. We look forward to celebrating with you!</p>
              
              <button 
                onClick={() => setShowQrModal(true)} 
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#3d472a] hover:bg-[#1a2012] text-white font-semibold text-xs uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer"
              >
                <i className="fa-solid fa-qrcode text-base"></i> View Gate Access Pass (QR Code)
              </button>
            </div>
          )}
        <button onClick={addToCalendar} className="w-full m-auto mt-5 sm:w-auto px-8 py-3.5 bg-[#6b7a4a] hover:bg-[#526037] text-white font-semibold text-xs uppercase tracking-wider rounded-full transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer">
              <i className="fa-regular fa-calendar-plus"></i> Add to Calendar
            </button>
          {/* RSVP Contacts */}
          <div className="mt-12 pt-8 border-t border-slate-200 text-center">
            <h3 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#1a2012] mb-4">RSVP Contacts</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-6">Call / WhatsApp</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rsvpContacts.map((contact, idx) => (
                <a key={idx} href={`tel:${contact.tel}`} className="p-4 rounded-2xl bg-[#f6f7f2] hover:bg-[#e3e7d7] border border-[#e3e7d7] transition-colors flex flex-col items-center">
                  <span className="font-bold text-[#2b331f] text-sm">{contact.name}</span>
                  <span className="text-xs text-slate-600 mt-1 font-mono">{contact.phone}</span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a2012] text-white py-12 border-t border-[#3d472a] text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-['Cormorant_Garamond'] text-3xl font-bold text-[#b8c49e] mb-2">Welcome to the Wedding Party</h2>
          <p className="font-['Great_Vibes'] text-3xl text-stone-300 mb-4">Love lives here</p>
          <p className="font-sans font-semibold text-xs tracking-widest uppercase text-[#b8c49e] mb-6">#BrizzyBrownEverAfter</p>
          <p className="text-xs text-stone-500">&copy; 2026 Bridget & Brown. All Rights Reserved.</p>
          <a 
          target='_blank'
          href='https://www.facebook.com/marshalsoft'
          className="text-xs text-stone-500 gap-2 items-center grid justify-center">
            <img 
            src={"https://raw.githubusercontent.com/marshalsoft/my-portfolio/refs/heads/main/app/assets/logo.png"}
            className='h-[30px] w-[30px] rounded-full bg-transparent overflow-hidden m-auto mt-3'
            />
           <span className='m-auto'>Powered by Marshalsoft
           </span>
           </a>
        </div>
      </footer>

      {/* QR CODE GATE ACCESS MODAL */}
      {showQrModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowQrModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-sm w-full p-6 md:p-8 text-center shadow-2xl relative border border-stone-200 transform transition-all animate-in fade-in zoom-in duration-300"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 text-xl focus:outline-none"
              aria-label="Close QR Pass Modal"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div 
            ref={divRef}
            className='p-3 rounded-[20px] bg-white'
            >
            <div className="inline-block px-3 py-1 bg-[#f6f7f2] rounded-full text-[10px] font-semibold uppercase tracking-widest text-[#526037] mb-2">
              Official Pass
            </div>
            
            <h3 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#1a2012]">
              Gate Access Pass
            </h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">Present this QR code at the entrance</p>

            {/* QR Code Container */}
            <div className="bg-[#fdfbf7] p-6 rounded-2xl border border-dashed border-[#6b7a4a]/40 inline-block mb-6 shadow-inner">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://${window.location.host+"?passId="+passId}`} 
                alt="Gate Access QR Code " 
                className="w-44 h-44 mx-auto rounded-lg shadow-sm"
              />
              <p className="font-mono text-[11px] font-bold text-[#1a2012] mt-3 tracking-wider">
              {passId}
              </p>
            </div>

            {/* Pass Details */}
            <div 
            
            className="text-left bg-[#f6f7f2] p-4 rounded-xl space-y-2 text-xs border border-slate-200/80 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Guest Name:</span>
                <span className="font-bold text-slate-800">{formData.name || 'Valued Guest'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Party Size:</span>
                <span className="font-bold text-slate-800 capitalize">{formData.guestCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Event:</span>
                <span className="font-bold text-[#526037]">Bridget & Brown Wedding</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Date:</span>
                <span className="font-bold text-slate-800">Dec 5, 2026</span>
              </div>
            </div>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  downloadAccessCard(`${passId}.png`);
                }}
                className="w-full py-3 bg-[#3d472a] hover:bg-[#1a2012] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <i className="fa-solid fa-download"></i> Download Access Card
              </button>
              
              <button 
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 bg-transparent hover:bg-slate-100 text-slate-600 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


const LoadingSpinner = ({ size = 'md', color = 'text-blue-600', label = '' }) => {
  // Size mapping
  const sizeClasses:any = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 " role="status">
      <div
        className={`animate-spin rounded-full border-solid border-current border-r-transparent ${sizeClasses[size] || sizeClasses.md} ${color}`}
      />
      {label && <span className={`text-sm font-medium ${color}`}>{label}</span>}
    </div>
  );
};
