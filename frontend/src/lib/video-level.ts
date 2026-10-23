export function videoLevelLabel(value: string): string {
  const level = value.trim();
  const numbered = level.match(/^(?:level\s*)?(\d+)$/i);
  if (numbered) return `Level ${Number(numbered[1])}`;
  const legacyLevels: Record<string, string> = {
    dasar: 'Level 1', beginner: 'Level 1', foundation: 'Level 1',
    menengah: 'Level 2', intermediate: 'Level 2',
    mahir: 'Level 3', advanced: 'Level 3',
  };
  return legacyLevels[level.toLowerCase()] || level || 'Level belum diatur';
}
