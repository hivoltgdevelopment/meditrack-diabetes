export function isNameValid(name) {
  return name.trim().length > 0;
}

export function isDateValid(date) {
  return date === "" || /^\d{4}-\d{2}-\d{2}$/.test(date);
}
