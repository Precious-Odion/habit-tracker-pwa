export function getHabitSlug(name: string): string {
  return name
    .toLowerCase()                // lowercase
    .trim()                       // remove outer spaces
    .replace(/\s+/g, '-')         // spaces → hyphens
    .replace(/[^a-z0-9-]/g, '')   // remove special chars except hyphen
    .replace(/-+/g, '-');         // collapse multiple hyphens
}