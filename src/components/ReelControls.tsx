import React from 'react';
import { Play, Pause, Plus, Download, Trash2, Video } from 'lucide-react';
import { ReelScene } from '../types';

interface ReelControlsProps {
  scenes: ReelScene[];
  isPlaying: boolean;
  isRecording: boolean;
  isExporting: boolean;
  recordingProgress: number;
  onPlay: () => void;
  onPause: () => void;
  onAdd: () => void;
  onUpdate: (scene: ReelScene) => void;
  onDelete: (id: number) => void;
  onExportImage: () => void;
  onExportVideo: () => void;
}

const ReelControls: React.FC<ReelControlsProps> = ({
  scenes,
  isPlaying,
  isRecording,
  isExporting,
  recordingProgress,
  onPlay,
  onPause,
  onAdd,
  onUpdate,
  onDelete,
  onExportImage,
  onExportVideo
}) => {
  return (
    <div className="space-y-6">
      {/* Playback Controls */}
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 
            rounded-lg text-white font-medium transition-colors"
          disabled={isExporting}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 
            rounded-lg text-white font-medium transition-colors"
          disabled={isExporting}
        >
          <Plus className="w-5 h-5" />
          Add Scene
        </button>

        <button
          onClick={onExportImage}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 
            rounded-lg text-white font-medium transition-colors"
          disabled={isExporting}
        >
          <Download className="w-5 h-5" />
          Export Image
        </button>

        <button
          onClick={onExportVideo}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 
            rounded-lg text-white font-medium transition-colors"
          disabled={isExporting}
        >
          <Video className="w-5 h-5" />
          Export MP4
        </button>
      </div>

      {/* Recording Progress */}
      {isExporting && (
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-white">Recording in progress...</span>
            <span className="text-white">{Math.round(recordingProgress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-violet-500 h-2.5 rounded-full" 
              style={{ width: `${recordingProgress}%` }}
            ></div>
          </div>
          <p className="text-gray-400 mt-2 text-sm">
            Please select the reel area in the screen sharing dialog. The video will automatically export when complete.
          </p>
        </div>
      )}

      {/* Scene List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Scenes</h2>
        <div className="space-y-3">
          {scenes.map((scene) => (
            <div
              key={scene.id}
              className="bg-gray-800 rounded-lg p-4 flex items-start justify-between"
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={scene.title}
                  onChange={(e) => onUpdate({ ...scene, title: e.target.value })}
                  className="bg-transparent text-white font-bold text-lg w-full mb-2 
                    focus:outline-none focus:ring-1 focus:ring-violet-500 rounded px-1"
                  disabled={isExporting}
                />
                <input
                  type="text"
                  value={scene.subtitle}
                  onChange={(e) => onUpdate({ ...scene, subtitle: e.target.value })}
                  className="bg-transparent text-gray-300 w-full mb-2
                    focus:outline-none focus:ring-1 focus:ring-violet-500 rounded px-1"
                  disabled={isExporting}
                />
                <textarea
                  value={scene.description}
                  onChange={(e) => onUpdate({ ...scene, description: e.target.value })}
                  className="bg-transparent text-gray-400 w-full resize-none
                    focus:outline-none focus:ring-1 focus:ring-violet-500 rounded px-1"
                  rows={2}
                  disabled={isExporting}
                />
              </div>
              <button
                onClick={() => onDelete(scene.id)}
                className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                disabled={isExporting}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReelControls;