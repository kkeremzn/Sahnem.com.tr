import { useRef, useState, type DragEvent } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface FileDropzoneProps {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  shape?: 'circle' | 'rect';
  className?: string;
  label?: string;
}

export function FileDropzone({ value, onChange, shape = 'rect', className, label = 'Görsel yükle' }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file?: File) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'relative flex cursor-pointer flex-col items-center justify-center overflow-hidden border-2 border-dashed border-border bg-deep text-center transition-colors hover:border-gold/50',
        shape === 'circle' ? 'h-28 w-28 rounded-full' : 'aspect-video w-full rounded-md',
        dragging && 'border-gold bg-gold/5',
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <>
          <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
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
  );
}
