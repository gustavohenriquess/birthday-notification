export function formatDate(date: Date): string {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  });

  return formatter.format(date);
}

export function getOld(year: number): number {
  const date = new Date();
  return date.getFullYear() - year;
}
