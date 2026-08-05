export function createEmptyTable() {
  return {
    id: crypto.randomUUID(),
    name: "Untitled Table",
    activeSheetId: "s1",
    sheets: [],
    cells: new Map(),
  };
}
