import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Building2, MapPin, Languages, Clock, Users } from 'lucide-react';
import { ReelScene } from '../types';
import ParticleField from './ParticleField';

interface ReelPreviewProps {
  scenes: ReelScene[];
  isPlaying: boolean;
}

const SCENE_DURATION = 3000;

const IconRow = ({ accent }: { accent: string }) => (
  <div className="absolute bottom-8 flex gap-8 animate-fade-in">
    {[Building2, MapPin, Languages, Clock, Users].map((Icon, i) => (
      <div 
        key={i} 
        className={`relative p-4 bg-black/50 rounded-full border border-${accent}-500/30 backdrop-blur-xl
          transform transition-all duration-500 hover:scale-110 hover:border-${accent}-400`}
      >
        <Icon className={`w-8 h-8 text-${accent}-400`} />
      </div>
    ))}
  </div>
);

const ReelPreview: React.FC<ReelPreviewProps> = ({ scenes, isPlaying }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % scenes.length);
    }, SCENE_DURATION);

    return () => clearInterval(interval);
  }, [isPlaying, scenes.length]);

  const currentScene = scenes[currentIndex];

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-br 
          from-${currentScene.accent}-400/20 via-violet-500/20 to-amber-400/20 
          animate-gradient-xy`} 
        />
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      <ParticleField />

      {/* Scene Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute inset-0 flex flex-col items-center justify-center p-8"
        >
          <div className="relative mb-8">
            <Sparkles 
              className={`w-16 h-16 text-${currentScene.accent}-400 animate-pulse`}
            />
            <div className="absolute inset-0 animate-ping-slow opacity-50">
              <Sparkles className={`w-16 h-16 text-${currentScene.accent}-400`} />
            </div>
          </div>

          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-5xl font-bold mb-4 text-${currentScene.accent}-400
              animate-text-glow text-center`}
          >
            {currentScene.title}
          </motion.h1>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-4xl font-bold mb-4 bg-gradient-to-r 
              from-${currentScene.accent}-400 to-violet-500 
              text-transparent bg-clip-text text-center animate-text-reveal`}
          >
            {currentScene.subtitle}
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-2xl text-gray-300 text-center mb-16 animate-fade-in"
          >
            {currentScene.description}
          </motion.p>

          <IconRow accent={currentScene.accent} />
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {scenes.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'bg-cyan-400 w-8' : 'bg-gray-600 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ReelPreview;