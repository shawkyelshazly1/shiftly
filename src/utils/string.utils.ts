/**
 * Get initials from a name string
 * @param name - Full name to extract initials from
 * @returns Up to 2 uppercase initials
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
