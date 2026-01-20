// Web stub so Expo Web can run for screenshots without expo-sqlite.
export async function initDatabase() {
  console.log("[web] initDatabase skipped (no SQLite on web)");
}

export async function resetDatabase() {
  console.log("[web] resetDatabase skipped (no SQLite on web)");
}
