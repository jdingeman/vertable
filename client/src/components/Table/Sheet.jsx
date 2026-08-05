import ColumnHeader from "./ColumnHeader";
import RowHeader from "./RowHeader";
import Cell from "./Cell";
import styles from "./Table.module.css";

export default function Sheet({ sheet, cells, selection, editing, dispatch }) {
  const numRows = sheet.rowHeights.length;
  const numCols = sheet.colWidths.length;

  const selectionBounds = selection
    ? {
        minRow: Math.min(selection.anchorRow, selection.activeRow),
        maxRow: Math.max(selection.anchorRow, selection.activeRow),
        minColumn: Math.min(selection.anchorColumn, selection.activeColumn),
        maxColumn: Math.max(selection.anchorColumn, selection.activeColumn),
      }
    : null;

  return (
    <table className={styles.grid}>
      <colgroup>
        <col style={{ width: 40 }} />

        {sheet.colWidths.map((w, i) => (
          <col key={i} style={{ width: w }} />
        ))}
      </colgroup>

      <thead>
        <tr>
          <th className={styles.corner} />

          {Array.from({ length: numCols }, (_, c) => (
            <ColumnHeader key={c} col={c} />
          ))}
        </tr>
      </thead>

      <tbody>
        {Array.from({ length: numRows }, (_, r) => (
          <tr key={r} style={{ height: sheet.rowHeights[r] }}>
            <RowHeader row={r} />

            {Array.from({ length: numCols }, (_, c) => {
              const cellId = `${sheet.id}:${r}:${c}`;
              const cell = cells.get(cellId);

              const selected =
                selectionBounds &&
                selection.sheetId === sheet.id &&
                r >= selectionBounds.minRow &&
                r <= selectionBounds.maxRow &&
                c >= selectionBounds.minColumn &&
                c <= selectionBounds.maxColumn;

              const active =
                selection?.sheetId === sheet.id &&
                selection.activeRow === r &&
                selection.activeColumn === c;

              const isEditing =
                editing?.sheetId === sheet.id &&
                editing?.row === r &&
                editing?.column === c;

              return (
                <Cell
                  key={c}
                  cell={cell}
                  sheetId={sheet.id}
                  row={r}
                  column={c}
                  selected={selected}
                  active={active}
                  editing={isEditing}
                  dispatch={dispatch}
                />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
