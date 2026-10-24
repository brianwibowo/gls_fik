export async function prepareCategoryCover(file: File): Promise<string> {
  if (file.size > 20 * 1024 * 1024) throw new Error('Ukuran gambar maksimal 20 MB sebelum diperkecil.');
  const source = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = source;
    try { await image.decode(); } catch { throw new Error('Gambar tidak dapat dibaca. Gunakan format gambar yang didukung browser, seperti JPG, PNG, WebP, GIF, atau SVG.'); }
    if (!image.naturalWidth || !image.naturalHeight) throw new Error('Gambar tidak memiliki ukuran yang valid.');
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 1280 / Math.max(image.naturalWidth, image.naturalHeight));
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Browser belum mendukung pengolahan gambar.');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.84, 0.7, 0.5, 0.3]) {
      const data = canvas.toDataURL('image/webp', quality);
      if (data.length <= 699000) return data;
    }
    throw new Error('Gambar masih terlalu besar. Pilih gambar dengan ukuran atau detail yang lebih kecil.');
  } finally { URL.revokeObjectURL(source); }
}
