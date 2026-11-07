import React from 'react';
import { X, Trash2, ArrowRight, Calendar, Sparkles, Layers } from 'lucide-react';
import { CampaignData } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: CampaignData[];
  onSelectCampaign: (campaign: CampaignData) => void;
  onDeleteCampaign: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  campaigns,
  onSelectCampaign,
  onDeleteCampaign,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-slate-100 text-sm">Campaign Draft History</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {campaigns.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="p-6 flex-1 overflow-y-auto space-y-3">
            {campaigns.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-xs">
                No past campaigns saved yet. Your generated campaigns will appear here automatically.
              </div>
            ) : (
              campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-indigo-300">
                      {camp.campaignTitle || 'Untitled Campaign'}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCampaign(camp.id);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded"
                      title="Delete draft"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {camp.originalIdea}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(camp.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => {
                        onSelectCampaign(camp);
                        onClose();
                      }}
                      className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                    >
                      <span>Load Studio</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {campaigns.length > 0 && (
            <div className="p-4 border-t border-slate-800 flex justify-between items-center bg-slate-950/50">
              <span className="text-xs text-slate-500">Auto-saved to device</span>
              <button
                onClick={onClearAll}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium"
              >
                Clear All History
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
