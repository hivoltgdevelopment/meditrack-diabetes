export function isNameValid(name: string): boolean {
  return name.trim().length > 0;
}

export function isDateValid(date: string): boolean {
  return date === "" || /^\d{4}-\d{2}-\d{2}$/.test(date);
}
