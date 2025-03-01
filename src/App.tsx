import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import RecordRTC from 'recordrtc';
import ReelPreview from './components/ReelPreview';
import ReelControls from './components/ReelControls';
import { ReelScene } from './types';

const DEFAULT_SCENES: ReelScene[] = [
  {
    id: 1,
    title: 'REVOLUTIONIZING',
    subtitle: 'Local Hiring',
    description: "India's First AI-Powered Job Platform",
    accent: 'cyan'
  },
  {
    id: 2,
    title: '5000+ JOBS',
    subtitle: 'Near Your Home',
    description: 'Average Distance < 5km',
    accent: 'violet'
  },
  {
    id: 3,
    title: '10+ LANGUAGES',
    subtitle: 'Your Language',
    description: 'Breaking Language Barriers',
    accent: 'cyan'
  },
  {
    id: 4,
    title: '24HR HIRING',
    subtitle: 'Lightning Fast',
    description: 'From Application to Offer',
    accent: 'violet'
  },
  {
    id: 5,
    title: 'JOIN THE',
    subtitle: 'Revolution',
    description: "Be Part of India's Growth Story",
    accent: 'cyan'
  }
];

const SCENE_DURATION = 3000; // 3 seconds per scene

function App() {
  const [scenes, setScenes] = useState<ReelScene[]>(DEFAULT_SCENES);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const reelRef = useRef<HTMLDivElement>(null);
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const totalDuration = scenes.length * SCENE_DURATION;

  const handleExportImage = async () => {
    if (!reelRef.current) return;
    
    try {
      const dataUrl = await toPng(reelRef.current, {
        quality: 1.0,
        width: 1080,
        height: 1920
      });
      
      const link = document.createElement('a');
      link.download = 'instagram-reel.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export reel:', err);
    }
  };

  const exportVideo = async () => {
    if (!reelRef.current) return;
    setIsExporting(true);

    try {
      // Start the animation
      setIsPlaying(true);
      
      // Request screen capture
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "browser",
          width: 1080,
          height: 1920
        }
      });
      
      streamRef.current = stream;
      recorderRef.current = new RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/mp4',
        bitsPerSecond: 8000000,
        frameInterval: 60,
        quality: 100,
        width: 1080,
        height: 1920
      });
      
      // Start recording
      recorderRef.current.startRecording();
      setIsRecording(true);
      
      // Set up progress tracking
      const updateProgress = () => {
        let elapsed = 0;
        const interval = setInterval(() => {
          elapsed += 100;
          const progress = Math.min((elapsed / totalDuration) * 100, 100);
          setRecordingProgress(progress);
          
          if (elapsed >= totalDuration) {
            clearInterval(interval);
            stopRecording();
          }
        }, 100);
        
        return interval;
      };
      
      const progressInterval = updateProgress();
      
      // Clean up function
      return () => clearInterval(progressInterval);
    } catch (err) {
      console.error('Failed to start recording:', err);
      setIsExporting(false);
      setIsPlaying(false);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!recorderRef.current) return;

    recorderRef.current.stopRecording(() => {
      const blob = recorderRef.current?.getBlob();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'instagram-reel.mp4';
        link.click();
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      setIsRecording(false);
      setIsPlaying(false);
      setIsExporting(false);
      setRecordingProgress(0);
    });
  };

  const addScene = () => {
    const newScene: ReelScene = {
      id: scenes.length + 1,
      title: 'NEW SCENE',
      subtitle: 'Click to Edit',
      description: 'Add your description here',
      accent: scenes.length % 2 ? 'violet' : 'cyan'
    };
    setScenes([...scenes, newScene]);
  };

  const updateScene = (updatedScene: ReelScene) => {
    setScenes(scenes.map(scene => 
      scene.id === updatedScene.id ? updatedScene : scene
    ));
  };

  const deleteScene = (id: number) => {
    setScenes(scenes.filter(scene => scene.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 bg-gradient-to-r from-cyan-400 to-violet-500 text-transparent bg-clip-text">
          Instagram Reel Generator
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Section */}
          <div className="bg-black rounded-lg overflow-hidden aspect-[9/16] relative" ref={reelRef}>
            <ReelPreview 
              scenes={scenes}
              isPlaying={isPlaying}
            />
            
            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/70 px-3 py-1 rounded-full">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-sm">Recording</span>
              </div>
            )}
          </div>

          {/* Controls Section */}
          <div className="space-y-6">
            <ReelControls
              scenes={scenes}
              isPlaying={isPlaying}
              isRecording={isRecording}
              isExporting={isExporting}
              recordingProgress={recordingProgress}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onAdd={addScene}
              onUpdate={updateScene}
              onDelete={deleteScene}
              onExportImage={handleExportImage}
              onExportVideo={exportVideo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;