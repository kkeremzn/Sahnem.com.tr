import { useEffect, useMemo, useRef, useState } from 'react';
import { ZoomIn } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface AvatarCropperProps {
  file: File | null;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}

const VIEW_SIZE = 260;
const OUTPUT_SIZE = 480;
const MAX_ZOOM = 3;

// Kırpma alanına sığdırıp gerçek boyutta sıkıştırılmış (JPEG ~0.88 kalite) bir
// kare üretir — orijinal telefon fotoğrafı 5-8 MB olsa bile yüklenen dosya
// birkaç yüz KB'a iner. Yavaş yükleme şikayetinin asıl kaynağı buydu: kullanıcı
// bağlantısı üzerinden orijinal boyutlu dosya taşınıyordu.
export function AvatarCropper({ file, onCancel, onConfirm }: AvatarCropperProps) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    if (!objectUrl) return;
    const image = new Image();
    image.onload = () => {
      setImg(image);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    };
    image.src = objectUrl;
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  const baseScale = img ? VIEW_SIZE / Math.min(img.naturalWidth, img.naturalHeight) : 1;
  const scale = baseScale * zoom;
  const dispW = img ? img.naturalWidth * scale : 0;
  const dispH = img ? img.naturalHeight * scale : 0;

  function clamp(p: { x: number; y: number }, w: number, h: number) {
    const minX = Math.min(0, VIEW_SIZE - w);
    const minY = Math.min(0, VIEW_SIZE - h);
    return {
      x: Math.max(minX, Math.min(0, p.x)),
      y: Math.max(minY, Math.min(0, p.y)),
    };
  }

  useEffect(() => {
    if (!img) return;
    setPan((p) => {
      const centered = { x: (VIEW_SIZE - dispW) / 2, y: (VIEW_SIZE - dispH) / 2 };
      const target = dragRef.current ? p : centered;
      return clamp(target, dispW, dispH);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, img]);

  function handlePointerDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPan(clamp({ x: dragRef.current.panX + dx, y: dragRef.current.panY + dy }, dispW, dispH));
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    setZoom((z) => Math.max(1, Math.min(MAX_ZOOM, z - e.deltaY * 0.0015)));
  }

  function handleConfirm() {
    if (!img) return;
    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const canvasScale = OUTPUT_SIZE / VIEW_SIZE;
    ctx.drawImage(
      img,
      pan.x * canvasScale,
      pan.y * canvasScale,
      dispW * canvasScale,
      dispH * canvasScale,
    );
    canvas.toBlob((blob) => { if (blob) onConfirm(blob); }, 'image/jpeg', 0.88);
  }

  return (
    <Modal open={!!file} onClose={onCancel} title="Fotoğrafı konumlandır" maxWidth="max-w-sm">
      <div className="flex flex-col items-center">
        <div
          ref={viewportRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onWheel={handleWheel}
          className="relative overflow-hidden rounded-full border-2 border-border bg-deep touch-none"
          style={{ width: VIEW_SIZE, height: VIEW_SIZE, cursor: dragRef.current ? 'grabbing' : 'grab' }}
        >
          {img && (
            <img
              src={img.src}
              alt=""
              draggable={false}
              className="absolute select-none"
              style={{ left: pan.x, top: pan.y, width: dispW, height: dispH, maxWidth: 'none' }}
            />
          )}
        </div>
        <p className="mt-3 text-center text-xs text-text-faint">Sürükleyerek konumlandır, kaydırıcıyla yakınlaştır.</p>
        <div className="mt-3 flex w-full items-center gap-2.5">
          <ZoomIn size={15} className="shrink-0 text-text-faint" />
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-gold"
          />
        </div>
        <div className="mt-5 flex w-full gap-2.5">
          <Button variant="secondary" full onClick={onCancel}>Vazgeç</Button>
          <Button full onClick={handleConfirm}>Kaydet</Button>
        </div>
      </div>
    </Modal>
  );
}
