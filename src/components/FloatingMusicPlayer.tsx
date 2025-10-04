import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, X } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  src: string;
}

interface FloatingMusicPlayerProps {
  className?: string;
}

const FloatingMusicPlayer: React.FC<FloatingMusicPlayerProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  // Chad's actual music tracks
  const tracks: Track[] = [
    {
      id: '1',
      title: 'Get To The Choppah',
      artist: 'Chad Keith',
      duration: '4:23',
      src: '/audio/05 Get To The Choppah (2019_03_28 19_46_52 UTC).mp3'
    },
    {
      id: '2', 
      title: 'Return To Mexico',
      artist: 'Chad Keith',
      duration: '3:45',
      src: '/audio/07 Return To Mexico (2019_03_28 19_46_52 UTC).mp3'
    },
    {
      id: '3',
      title: 'Beat It (Michael Jackson Cover)',
      artist: 'Chad Keith',
      duration: '5:12',
      src: '/audio/11 Beat It (Michael Jackson Cover) (2019_03_28 19_46_52 UTC).mp3'
    }
  ];

  // Dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: -(e.clientY - dragStart.y)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleNext);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleNext);
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  const handlePrevious = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring' }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-chad-red/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-chad-red hover:bg-chad-red transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Music className="w-6 h-6 text-white" />
        </motion.button>
      </motion.div>

      {/* Floating Music Player */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={playerRef}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed z-40 bg-chad-black/95 backdrop-blur-md border border-chad-red/30 rounded-xl p-4 w-80 shadow-2xl select-none"
            style={{
              left: `calc(100vw - 24px - 320px + ${position.x}px)`,
              bottom: `calc(24px + 64px + ${position.y}px)`,
              cursor: isDragging ? 'grabbing' : 'auto'
            }}
            onMouseDown={handleMouseDown}
          >
            {/* Drag Handle & Close */}
            <div className="drag-handle flex justify-between items-center mb-3 cursor-grab active:cursor-grabbing">
              <h3 className="text-chad-white font-semibold text-sm">🎵 Chad's Music</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-chad-white/60 hover:text-chad-red transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Track Info */}
            <div className="mb-4">
              <h4 className="text-chad-white font-medium text-sm truncate">
                {tracks[currentTrack].title}
              </h4>
              <p className="text-chad-white/60 text-xs">{tracks[currentTrack].artist}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercentage}
                onChange={handleSeek}
                className="w-full h-1 bg-chad-white/20 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${progressPercentage}%, rgba(255,255,255,0.2) ${progressPercentage}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-chad-white/60 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4 mb-3">
              <button
                onClick={handlePrevious}
                className="text-chad-white/80 hover:text-chad-red transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <motion.button
                onClick={handlePlayPause}
                className="w-10 h-10 bg-chad-red rounded-full flex items-center justify-center text-white hover:bg-chad-red/80 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </motion.button>
              
              <button
                onClick={handleNext}
                className="text-chad-white/80 hover:text-chad-red transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-chad-white/60" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-1 bg-chad-white/20 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
            </div>

            {/* Hidden Audio Element */}
            <audio
              ref={audioRef}
              src={tracks[currentTrack].src}
              onLoadedData={() => {
                if (isPlaying) {
                  audioRef.current?.play().catch(console.error);
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Slider Styles via CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #dc2626;
            cursor: pointer;
            border: 2px solid #ffffff;
          }
          
          .slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #dc2626;
            cursor: pointer;
            border: 2px solid #ffffff;
          }
        `
      }} />
    </>
  );
};

export default FloatingMusicPlayer;