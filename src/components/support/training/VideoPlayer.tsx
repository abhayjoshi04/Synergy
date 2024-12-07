import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string;
  onClose: () => void;
  onComplete: () => void;
  onProgress: (progress: number) => void;
}

export function VideoPlayer({ videoId, onClose, onComplete, onProgress }: VideoPlayerProps) {
  const playerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return;

      try {
        const data = JSON.parse(event.data);
        
        if (data.event === "onStateChange") {
          // Video ended
          if (data.info === 0) {
            onComplete();
          }
        } else if (data.event === "onReady") {
          // Start tracking progress
          progressInterval = setInterval(() => {
            if (playerRef.current && playerRef.current.contentWindow) {
              playerRef.current.contentWindow.postMessage(
                JSON.stringify({
                  event: "listening",
                  func: "getCurrentTime",
                  args: []
                }),
                "*"
              );
            }
          }, 1000);
        } else if (data.event === "onCurrentTime") {
          // Calculate progress percentage
          const duration = data.total;
          const currentTime = data.time;
          const progress = (currentTime / duration) * 100;
          onProgress(Math.min(progress, 100));
        }
      } catch (error) {
        console.error("Error parsing YouTube message:", error);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [onComplete, onProgress]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Training Video</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="relative pb-[56.25%] h-0">
          <iframe
            ref={playerRef}
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}