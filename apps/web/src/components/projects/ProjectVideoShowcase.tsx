import React, { useState, useRef } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { type ProjectItem, normalizeVideo } from '../../lib/config/site-config.js';
import { ProjectThumbnailFallback } from './ProjectThumbnailFallback.js';

interface ProjectVideoShowcaseProps {
  project: ProjectItem;
}

export const ProjectVideoShowcase: React.FC<ProjectVideoShowcaseProps> = ({ project }) => {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videoConfig = normalizeVideo(project.video);
  const hasActualVideo = Boolean(videoConfig?.url);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="relative w-full h-full min-h-[320px] sm:min-h-[420px] lg:min-h-[520px] rounded-2xl lg:rounded-3xl overflow-hidden select-none bg-slate-900/5">
      {/* ======================================================== */}
      {/* IMMERSIVE MEDIA LAYER (Video or Fallback)                */}
      {/* ======================================================== */}
      <div className="absolute inset-0 w-full h-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.5)_15%,rgba(0,0,0,1)_35%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.5)_15%,rgba(0,0,0,1)_35%)]">
        {hasActualVideo ? (
          /* Actual Video Player */
          <video
            ref={videoRef}
            src={videoConfig?.url}
            poster={videoConfig?.poster || project.heroImage || project.thumbnail}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            className="w-full h-full object-cover object-center filter brightness-[0.95]"
          >
            Your browser does not support HTML5 video.
          </video>
        ) : (
          /* Visual Background Placeholder */
          <div className="relative w-full h-full">
            {project.heroImage ? (
              <img
                src={project.heroImage}
                alt={`${project.title} Preview`}
                className="w-full h-full object-cover object-center filter brightness-[0.92]"
              />
            ) : project.thumbnail ? (
              <img
                src={project.thumbnail}
                alt={`${project.title} Preview`}
                className="w-full h-full object-cover object-center filter brightness-[0.92]"
              />
            ) : (
              <ProjectThumbnailFallback
                id={project.id}
                title={project.title}
                category={project.category}
                accentColor={project.accentColor}
                className="w-full h-full"
              />
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* DIRECTIONAL BLEND MASKS (Fades into cream background)    */}
      {/* ======================================================== */}
      {/* Left-edge soft directional gradient blend */}
      <div className="hidden lg:block absolute inset-y-0 left-0 w-44 bg-gradient-to-r from-[#f8f6f0] via-[#f8f6f0]/70 to-transparent pointer-events-none z-10" />

      {/* Top & bottom subtle feathering */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#f8f6f0]/60 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#f8f6f0]/70 to-transparent pointer-events-none z-10" />

      {/* ======================================================== */}
      {/* SUBTLE INTERACTION CONTROLS / STATUS BADGES              */}
      {/* ======================================================== */}
      {hasActualVideo ? (
        /* Video playback controls */
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            className="p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md border border-white/15 transition-colors shadow-lg cursor-pointer"
          >
            <Play
              className={`w-3.5 h-3.5 fill-white ${isPlaying ? 'opacity-80' : 'opacity-100'}`}
            />
          </button>
          <button
            type="button"
            onClick={toggleAudio}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md border border-white/15 transition-colors shadow-lg cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      ) : (
        /* Polished placeholder badge */
        <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2.5 select-none">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-full bg-slate-950/75 text-slate-300 backdrop-blur-md border border-white/10 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>PRODUCT WALKTHROUGH COMING SOON</span>
          </div>
        </div>
      )}
    </div>
  );
};
