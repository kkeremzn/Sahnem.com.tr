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
      {/* Dış sarmalayıcı kırpma yapmıyor — X butonu bu yüzden shape="circle"
          durumunda dairesel maskeyle kesilmiyor, kare sınırın köşesinde tam görünüyor. */}
      <div className={cn('relative', shape === 'rect' && 'w-full', className)}>
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
            <img src={previewSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1.5 px-3 text-text-faint">
              <ImagePlus size={20} />
              <span className="text-xs">{label}</span>
            </div>
          )}
        </div>
        {previewSrc && !uploading && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(undefined); }}
            className="absolute -right-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-danger text-white hover:bg-danger/80"
          >
            <X size={13} />
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
