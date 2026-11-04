import { Loader2, Inbox, ImagePlus } from 'lucide-react';

export const Spinner = ({ label = 'Loading' }) => (
  <div className="flex items-center justify-center gap-2 py-12 text-ink-500" role="status">
    <Loader2 className="h-5 w-5 animate-spin" /> {label}…
  </div>
);

export const Empty = ({ title, hint }) => (
  <div className="flex flex-col items-center gap-2 py-12 text-center">
    <Inbox className="h-8 w-8 text-ink-500" />
    <p className="font-medium text-white">{title}</p>
    {hint && <p className="max-w-sm text-sm text-ink-500">{hint}</p>}
  </div>
);

const tones = {
  ONGOING: 'bg-emerald-500/15 text-emerald-300',
  REGISTRATION_OPEN: 'bg-volt/15 text-volt',
  UPCOMING: 'bg-volt/15 text-volt',
  COMPLETED: 'bg-slate-500/20 text-slate-300',
  PENDING: 'bg-amber-500/15 text-amber-300',
};
export const Badge = ({ status }) => (
  <span className={`rounded px-2 py-0.5 text-xs font-semibold ${tones[status] || tones.COMPLETED}`}>
    {status.replaceAll('_', ' ').toLowerCase()}
  </span>
);

export const PageHeader = ({ title, children }) => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <h1 className="text-2xl font-semibold">{title}</h1>
    {children}
  </div>
);

// Image picker with instant preview (the file itself is sent as multipart to the API -> Cloudinary).
export function ImagePicker({ label, preview, onFile, round }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <span className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border border-dashed border-ink-700 bg-ink-950 text-ink-500 ${round ? 'rounded-full' : 'rounded-lg'}`}>
        {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="h-5 w-5" />}
      </span>
      <span className="text-sm">
        <span className="block font-medium text-slate-200">{label}</span>
        <span className="text-ink-500">{preview ? 'Click to replace' : 'PNG or JPG, up to 5 MB'}</span>
      </span>
      <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0] || null)} />
    </label>
  );
}

export const fmtDate = (iso) =>
  new Date(iso).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
