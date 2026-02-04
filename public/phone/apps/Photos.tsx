import React, { useState } from 'react';
import { Trash2, Share, Heart, CheckCircle2, Circle, ChevronLeft, Info } from 'lucide-react';

const INITIAL_PHOTOS = Array.from({ length: 24 }).map((_, i) => ({
  id: i,
  url: `https://picsum.photos/seed/${i + 100}/800/1200`,
  date: 'Today',
  time: '10:42 AM'
}));

const Photos: React.FC = () => {
  const [photos, setPhotos] = useState(INITIAL_PHOTOS);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [viewingPhotoId, setViewingPhotoId] = useState<number | null>(null);

  const toggleSelection = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const deleteSelected = () => {
    setPhotos(photos.filter(p => !selectedIds.has(p.id)));
    setSelectedIds(new Set());
    setIsSelecting(false);
  };

  const deleteSingle = (id: number) => {
    setPhotos(photos.filter(p => p.id !== id));
    setViewingPhotoId(null);
  };

  const viewingPhoto = photos.find(p => p.id === viewingPhotoId);

  // Full Screen Detail View
  if (viewingPhoto) {
      return (
          <div className="h-full bg-black flex flex-col relative animate-in fade-in duration-200">
              {/* Top Bar */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent z-20 flex items-end pb-4 px-4 justify-between">
                  <button onClick={() => setViewingPhotoId(null)} className="text-white flex items-center gap-1">
                      <ChevronLeft size={30} /> 
                  </button>
                  <div className="text-white font-semibold text-sm">
                      {viewingPhoto.date} {' • '} {viewingPhoto.time}
                  </div>
                  <button className="text-white opacity-0">
                      <ChevronLeft size={30} /> 
                  </button>
              </div>

              {/* Image Container */}
              <div className="flex-1 flex items-center justify-center overflow-hidden">
                  <img 
                      src={viewingPhoto.url} 
                      className="max-w-full max-h-full object-contain"
                      alt="Detail"
                  />
              </div>

              {/* Bottom Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent z-20 flex items-center justify-between px-8 pb-6">
                  <Share className="text-blue-500" size={24} />
                  <Heart className="text-white" size={24} />
                  <Info className="text-white" size={24} />
                  <Trash2 
                    className="text-white" 
                    size={24} 
                    onClick={() => deleteSingle(viewingPhoto.id)}
                  />
              </div>
          </div>
      )
  }

  return (
    <div className="h-full bg-white dark:bg-black overflow-y-auto flex flex-col">
      <div className="pt-12 pb-2 px-4 bg-white/90 dark:bg-black/80 backdrop-blur-lg sticky top-0 z-20 flex justify-between items-end border-b border-gray-100 dark:border-neutral-800">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vision Log</h1>
        </div>
        <button 
            onClick={() => {
                setIsSelecting(!isSelecting);
                setSelectedIds(new Set());
            }}
            className="text-blue-500 text-base font-medium px-2 py-1 active:opacity-50"
        >
            {isSelecting ? 'Cancel' : 'Select'}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {photos.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                <p>No Photos</p>
            </div>
        ) : (
            <div className="grid grid-cols-3 gap-0.5 pb-24">
                {photos.map((photo) => {
                const isSelected = selectedIds.has(photo.id);
                return (
                    <div 
                        key={photo.id} 
                        className="aspect-square bg-gray-200 dark:bg-gray-800 relative group overflow-hidden cursor-pointer"
                        onClick={() => {
                            if (isSelecting) {
                                toggleSelection(photo.id);
                            } else {
                                setViewingPhotoId(photo.id);
                            }
                        }}
                    >
                        <img 
                            src={photo.url} 
                            alt="Gallery Item" 
                            className={`w-full h-full object-cover transition-all duration-300 ${isSelecting && isSelected ? 'scale-90 opacity-80' : ''}`}
                            loading="lazy" 
                        />
                        {isSelecting && (
                            <div className="absolute bottom-1 right-1">
                                {isSelected ? (
                                    <CheckCircle2 className="text-blue-500 fill-white" size={20} />
                                ) : (
                                    <Circle className="text-white/70 drop-shadow-md" size={20} />
                                )}
                            </div>
                        )}
                    </div>
                );
                })}
            </div>
        )}
        
        <div className="p-4 text-center pb-8">
            <p className="text-gray-500 text-xs font-medium">{photos.length} Photos • 0 Videos</p>
        </div>
      </div>

      {/* Bottom Toolbar for Selection Mode */}
      {isSelecting && (
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-neutral-800 p-4 pb-8 flex justify-between items-center z-30 px-8">
              <button className="text-blue-500 disabled:text-gray-400">
                  <Share size={24} />
              </button>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {selectedIds.size > 0 ? `${selectedIds.size} Selected` : 'Select Items'}
              </div>
              <button 
                className="text-red-500 disabled:text-gray-400 active:opacity-50 transition-opacity"
                disabled={selectedIds.size === 0}
                onClick={deleteSelected}
              >
                  <Trash2 size={24} />
              </button>
          </div>
      )}
    </div>
  );
};

export default Photos;