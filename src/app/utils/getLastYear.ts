export function getLastYearDate() {
  const now = new Date()
  return new Date(now.getFullYear() - 1, now.getMonth(), 1)
}
