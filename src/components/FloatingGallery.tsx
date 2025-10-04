import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, X, ChevronLeft, ChevronRight, ZoomIn, Download } from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description?: string;
}

interface FloatingGalleryProps {
  className?: string;
}

const FloatingGallery: React.FC<FloatingGalleryProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Gallery images from the available ComfyUI images
  const galleryImages: GalleryImage[] = [
    {
      id: '1',
      src: '/images/ComfyUI_00001_.png',
      alt: 'AI Generated Art 1',
      title: 'Digital Synthesis',
      description: 'Exploring the intersection of AI and creativity'
    },
    {
      id: '2',
      src: '/images/ComfyUI_00002_.png', 
      alt: 'AI Generated Art 2',
      title: 'Neural Patterns',
      description: 'Visualizing machine learning concepts'
    },
    {
      id: '3',
      src: '/images/ComfyUI_00003_.png',
      alt: 'AI Generated Art 3', 
      title: 'Algorithmic Beauty',
      description: 'Where code meets artistic expression'
    },
    {
      id: '4',
      src: '/images/ComfyUI_00004_.png',
      alt: 'AI Generated Art 4',
      title: 'Tech Aesthetic',
      description: 'Modern digital art exploration'
    },
    {
      id: '5',
      src: '/images/ComfyUI_00005_.png',
      alt: 'AI Generated Art 5',
      title: 'Data Visualization',
      description: 'Artistic interpretation of data flows'
    },
    {
      id: '6',
      src: '/images/ComfyUI_00006_.png',
      alt: 'AI Generated Art 6',
      title: 'Creative Code',
      description: 'Programming meets visual design'
    }
  ];

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') {
      setIsFullscreen(false);
      setSelectedImage(null);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2.5, type: 'spring' }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-chad-black/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-chad-red/50 hover:border-chad-red hover:bg-chad-red/10 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Image className="w-6 h-6 text-chad-red" />
        </motion.button>
      </motion.div>

      {/* Floating Gallery */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, x: -100, y: 100 }}
            animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
            exit={{ scale: 0, opacity: 0, x: -100, y: 100 }}
            className="fixed bottom-24 left-6 z-40 bg-chad-black/95 backdrop-blur-md border border-chad-red/30 rounded-xl p-4 w-80 shadow-2xl max-h-96 overflow-hidden"
          >
              {/* Drag Handle & Close */}
              <div className="drag-handle flex justify-between items-center mb-3 cursor-move">
                <h3 className="text-chad-white font-semibold text-sm">Gallery</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-chad-white/60 hover:text-chad-red transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-3 gap-6 max-h-80 overflow-y-auto p-6">
                {galleryImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    className="aspect-square bg-chad-white/10 rounded-lg overflow-hidden cursor-pointer group relative"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-chad-black/0 group-hover:bg-chad-black/20 transition-colors duration-300 flex items-center justify-center">
                      <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Image Viewer */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Navigation Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-chad-black/50 hover:bg-chad-red/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-chad-black/50 hover:bg-chad-red/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-chad-black/50 hover:bg-chad-red/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[80vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
              
              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h4 className="text-white font-semibold text-lg mb-1">
                  {galleryImages[selectedImage].title}
                </h4>
                {galleryImages[selectedImage].description && (
                  <p className="text-white/80 text-sm">
                    {galleryImages[selectedImage].description}
                  </p>
                )}
                
                {/* Download Button */}
                <div className="mt-3 flex justify-end">
                  <a
                    href={galleryImages[selectedImage].src}
                    download={galleryImages[selectedImage].title}
                    className="flex items-center space-x-2 text-chad-red hover:text-chad-red/80 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Download</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-chad-black/50 rounded-full px-4 py-2 text-white text-sm">
              {selectedImage + 1} / {galleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingGallery;