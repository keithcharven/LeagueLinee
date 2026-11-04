import { useEffect, useState } from 'react';

// Returns [file, previewUrl, setFile]; revokes object URLs automatically.
export function useImagePreview() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!file) { setUrl(null); return; }
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return [file, url, setFile];
}
