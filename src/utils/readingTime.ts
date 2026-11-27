export function getReadingTime(content: string = ''): number {
  const clean = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*`~\-\[\]()!]/g, ' ');
  const cjkChars = (clean.match(/[\u4e00-\u9fa5]/g) || []).length;
  const latinWords = (clean.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[a-zA-Z0-9_]+/g) || []).length;
  const minutes = Math.ceil((cjkChars / 380) + (latinWords / 220));
  return Math.max(1, minutes);
}

export function formatDotDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

export function formatMonthDay(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}.${d}`;
}
