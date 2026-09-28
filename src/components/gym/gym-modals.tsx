import React from "react";
import { X, FileText, Eye, ChevronLeft, ChevronRight } from "lucide-react";

interface GymCertificationsModalProps {
  images: string[] | null;
  onClose: () => void;
}

export function GymCertificationsModal({ images, onClose }: GymCertificationsModalProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in">
      <div className="relative bg-card border border-border w-full max-w-[600px] rounded-3xl p-6 flex flex-col text-foreground">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition z-10"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Diplomas y Certificaciones
        </h3>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 overflow-y-auto max-h-[400px]">
          {images.map((url, index) => (
            <div
              key={index}
              className="border border-border rounded-xl overflow-hidden aspect-video bg-muted relative group"
            >
              <img
                src={url}
                alt={`Diploma ${index}`}
                className="h-full w-full object-cover"
              />
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white text-xs font-bold gap-1"
              >
                <Eye className="h-4 w-4" /> Ver pantalla completa
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface GymLightboxModalProps {
  isOpen: boolean;
  images: string[];
  activeIndex: number;
  gymName: string;
  onClose: () => void;
  onSelectIndex: (index: number | ((prev: number) => number)) => void;
}

export function GymLightboxModal({
  isOpen,
  images,
  activeIndex,
  gymName,
  onClose,
  onSelectIndex,
}: GymLightboxModalProps) {
  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex flex-col justify-between p-6 z-50 animate-fade-in text-white">
      {/* Top Bar */}
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        <span className="text-xs font-mono text-zinc-400">
          Foto {activeIndex + 1} de {images.length}
        </span>
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white transition border border-zinc-800"
          aria-label="Cerrar vista completa"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Large Image view */}
      <div className="flex-1 flex items-center justify-between w-full max-w-7xl mx-auto relative my-4">
        <button
          onClick={() => onSelectIndex((v) => (v - 1 + images.length) % images.length)}
          className="p-2 sm:p-3.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white transition shrink-0 border border-zinc-800 mr-2"
          aria-label="Foto anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="flex-1 h-full max-h-[72vh] flex items-center justify-center p-2">
          <img
            src={images[activeIndex]}
            alt={gymName}
            className="max-w-full max-h-full object-contain rounded-xl select-none"
          />
        </div>

        <button
          onClick={() => onSelectIndex((v) => (v + 1) % images.length)}
          className="p-2 sm:p-3.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white transition shrink-0 border border-zinc-800 ml-2"
          aria-label="Foto siguiente"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Bottom Thumbnails strip */}
      <div className="w-full max-w-4xl mx-auto overflow-x-auto py-2 flex justify-center gap-2">
        {images.map((src, i) => (
          <button
            key={src + i}
            onClick={() => onSelectIndex(i)}
            className={`relative h-12 w-16 rounded-lg overflow-hidden shrink-0 transition ${
              activeIndex === i
                ? "ring-2 ring-primary opacity-100"
                : "opacity-40 hover:opacity-100"
            }`}
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
