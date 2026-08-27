import { useRef, useState, type DragEvent } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { resolveAssetUrl } from '@/lib/apiClient';

interface FileDropzoneProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  // Dosyayı gerçekten sunucuya yükleyip kalıcı (relative) URL'i döndürür —
  // bileşen bunu beklemeden önizleme göstermez, base64'ü hiç saklamaz.
  onUpload: (file: File) => Promise<string>;
  shape?: 'circle' | 'rect';
  className?: string;
  label?: string;
}

export function FileDropzone({ value, onChange, onUpload, shape = 'rect', className, label = 'Görsel yükle' }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file?: File) {
    if (!file || !file.type.startsWith('image/')) return;
    setError(null);
    setUploading(true);
    try {
      const url = await onUpload(file);
      onChange(url);
    } catch {
      setError('Görsel yüklenemedi, tekrar dene.');
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    void handleFile(e.dataTransfer.files?.[0]);
  }

  const previewSrc = resolveAssetUrl(value);

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center overflow-hidden border-2 border-dashed border-border bg-deep text-center transition-colors hover:border-gold/50',
          shape === 'circle' ? 'h-28 w-28 rounded-full' : 'aspect-video w-full rounded-md',
          dragging && 'border-gold bg-gold/5',
          uploading && 'pointer-events-none opacity-70',
          className,
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />
        {uploading ? (
          <Loader2 className="animate-spin text-gold" size={20} />
        ) : previewSrc ? (
          <>
            <img src={previewSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(undefined); }}
              className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
            >
              <X size={13} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 px-3 text-text-faint">
            <ImagePlus size={20} />
            <span className="text-xs">{label}</span>
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
