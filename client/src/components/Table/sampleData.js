export const sampleTable = {
  id: "demo",
  name: "Demo Table",
  activeSheetId: "s1",
  sheets: [
    {
      id: "s1",
      name: "Sheet 1",
      position: 0,
      colWidths: Array(10).fill(96),
      rowHeights: Array(20).fill(24),
    },
  ],

  cells: new Map([
    ["s1:0:0", { value: "Hello", formatting: { bold: true } }],
    ["s1:1:0", { value: "World", formatting: {} }],
    ["s1:0:1", { value: "42", formatting: { align: "right" } }],
  ]),
};
