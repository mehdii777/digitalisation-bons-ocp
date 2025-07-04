"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { 
  Beaker, ChevronRight, TestTube, Microscope, 
  FlaskConical, Dna, Atom, Syringe,
  FlaskRound, Magnet, Biohazard
} from 'lucide-react';

const FloatingIcon = ({ icon: Icon, size, color, position, offset, className = '' }) => {
  const [iconPosition, setIconPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIconPosition(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Using client-side only rendering for the floating animations
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only apply these calculations client-side
  const getFloatY = () => {
    if (!isMounted) return 0;
    return Math.sin((iconPosition + offset) * (Math.PI / 180)) * 10;
  };
  
  const getFloatX = () => {
    if (!isMounted) return 0;
    return Math.cos((iconPosition + offset) * (Math.PI / 180)) * 10;
  };
  
  const getRotation = () => {
    if (!isMounted) return 0;
    return Math.sin((iconPosition + offset) * (Math.PI / 180)) * 5;
  };

  const calcPosition = (pos) => {
    if (!pos) return undefined;
    if (!isMounted) return pos;
    const floatValue = getFloatY();
    // Format to fixed precision to ensure consistency
    const formattedFloat = floatValue.toFixed(2);
    return pos.includes('%') ? `calc(${pos} + ${formattedFloat}px)` : pos;
  };

  // Initial static position for server rendering
  const initialStyle = {
    top: position.top,
    left: position.left,
    right: position.right,
    bottom: position.bottom,
    transform: 'rotate(0deg)'
  };

  // Dynamic position for client rendering
  const dynamicStyle = isMounted ? {
    top: calcPosition(position.top),
    left: calcPosition(position.left),
    right: calcPosition(position.right),
    bottom: calcPosition(position.bottom),
    transform: `rotate(${getRotation().toFixed(2)}deg)`
  } : initialStyle;

  return (
    <div 
      className={`absolute opacity-10 ${className}`}
      style={dynamicStyle}
    >
      <Icon size={size} className={color} />
    </div>
  );
};

const Page = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [titleGlow, setTitleGlow] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const glowInterval = setInterval(() => {
      setTitleGlow(prev => !prev);
    }, 2000);
    return () => clearInterval(glowInterval);
  }, []);

  // Lab icons for floating background
  const labIcons = [
    { icon: FlaskConical, size: 120, color: "text-green-800", position: { top: '15%', left: '10%' }, offset: 90 },
    { icon: TestTube, size: 100, color: "text-green-700", position: { top: '60%', left: '80%' }, offset: 45 },
    { icon: Microscope, size: 140, color: "text-green-800", position: { top: '30%', right: '10%' }, offset: 180 },
    { icon: Dna, size: 130, color: "text-green-700", position: { bottom: '15%', left: '25%' }, offset: 270 },
    { icon: Atom, size: 110, color: "text-green-800", position: { bottom: '70%', right: '25%' }, offset: 120 },
    { icon: Syringe, size: 90, color: "text-green-600", position: { top: '50%', right: '80%' }, offset: 30 },
    { icon: FlaskRound, size: 100, color: "text-green-600", position: { bottom: '65%', right: '60%' }, offset: 300 },
    { icon: Magnet, size: 95, color: "text-green-700", position: { top: '40%', right: '40%' }, offset: 150 },
    { icon: Biohazard, size: 110, color: "text-green-800", position: { bottom: '25%', right: '30%' }, offset: 240 }
  ];

  return (
    <div className="bg-green-50 w-full min-h-screen flex justify-center items-center flex-col py-4 sm:py-6 md:py-10 px-4 sm:px-6 relative overflow-hidden">
    {/* Floating background icons */}
    {labIcons.map((iconProps, index) => (
      <FloatingIcon key={index} {...iconProps} />
    ))}
  
    {/* Main content */}
    <div className="relative z-10 w-full max-w-6xl flex flex-col items-center">
      {/* Title section - full width */}
      <div className="w-full mb-6 sm:mb-8 md:mb-12 px-2 sm:px-4">
        <div className="flex items-center justify-center w-full">
          <div className="relative text-center w-full">
            <h1 
              className={`text-center text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase font-extrabold bg-gradient-to-r from-green-800 via-green-600 to-green-700 bg-clip-text text-transparent relative z-10 transition-all duration-1000 ${
                titleGlow && isMounted ? 'drop-shadow-lg' : 'drop-shadow-md'
              }`}
              style={{
                filter: isMounted && titleGlow
                  ? 'drop-shadow(0 0 15px rgba(0, 255, 0, 0.7))'
                  : 'drop-shadow(0 0 8px rgba(0, 255, 0, 0.4))',
                letterSpacing: '1px',
                textShadow: '2px 2px 5px rgba(0, 100, 0, 0.3)',
                color: '#28A745'
              }}
            >
              <span className="inline-block transform hover:scale-110 transition-transform duration-300">L</span>
              <span className="inline-block transform hover:-translate-y-2 transition-transform duration-300">A</span>
              <span className="inline-block transform hover:rotate-12 transition-transform duration-300">B</span>
              <span className="inline-block transform hover:scale-110 transition-transform duration-300">O</span>
              <span className="inline-block transform hover:-translate-y-2 transition-transform duration-300">R</span>
              <span className="inline-block transform hover:rotate-12 transition-transform duration-300">A</span>
              <span className="inline-block transform hover:scale-110 transition-transform duration-300">T</span>
              <span className="inline-block transform hover:-translate-y-2 transition-transform duration-300">O</span>
              <span className="inline-block transform hover:rotate-12 transition-transform duration-300">I</span>
              <span className="inline-block transform hover:scale-110 transition-transform duration-300">R</span>
              <span className="inline-block transform hover:-translate-y-2 transition-transform duration-300">E</span>
              <span className="ml-2 sm:ml-4 md:ml-8 inline-block transform hover:rotate-12 transition-transform duration-300">C</span>
              <span className="inline-block transform hover:scale-110 transition-transform duration-300">E</span>
              <span className="inline-block transform hover:-translate-y-2 transition-transform duration-300">N</span>
              <span className="inline-block transform hover:rotate-12 transition-transform duration-300">T</span>
              <span className="inline-block transform hover:scale-110 transition-transform duration-300">R</span>
              <span className="inline-block transform hover:-translate-y-2 transition-transform duration-300">A</span>
              <span className="inline-block transform hover:rotate-12 transition-transform duration-300">L</span>
            </h1>
          </div>
        </div>
      </div>
  
      {/* Action button */}
      <Link href="/bons" className="mt-4 sm:mt-6 md:mt-8">
        <button 
          className="font-semibold text-white text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 rounded-full bg-gradient-to-r from-green-800 via-green-600 to-green-700 shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-105"
        >
          <Beaker size={18} className="mr-2 animate-pulse" />
          Voir Bons
          <ChevronRight 
            size={18} 
            className="ml-2 transition-transform duration-300 group-hover:translate-x-2" 
          />
        </button>
      </Link>
    </div>
  </div>
  );
};

export default Page;