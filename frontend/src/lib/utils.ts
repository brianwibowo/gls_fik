// Helper extractor Google Drive file ID dari beragam format link sharing
export function extractDriveFileId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (!trimmed.includes('/') && !trimmed.includes('http')) {
    return trimmed;
  }
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) return fileMatch[1];
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) return idParamMatch[1];
  const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch && dMatch[1]) return dMatch[1];
  return trimmed;
}
