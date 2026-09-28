import { Eye, FileText, X } from "lucide-react";

interface DiplomasViewerModalProps {
  images: string[] | null;
  onClose: () => void;
}

export function DiplomasViewerModal({ images, onClose }: DiplomasViewerModalProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in">
      <div className="relative bg-card border border-border w-full max-w-[600px] rounded-3xl p-6 flex flex-col shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition z-10 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Diplomas y Certificaciones
        </h3>

        <div className="grid gap-3 grid-cols-2 overflow-y-auto max-h-[400px] custom-scrollbar">
          {images.map((url, index) => (
            <div
              key={index}
              className="border border-border rounded-xl overflow-hidden aspect-video bg-muted relative group"
            >
              <img src={url} alt={`Diploma ${index}`} className="h-full w-full object-cover" />
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
