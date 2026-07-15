import ColumnHeader from "./ColumnHeader";
import RowHeader from "./RowHeader";
import Cell from "./Cell";
import styles from "./Table.module.css";

export default function Sheet({ sheet, cells }) {
  const numRows = sheet.rowHeights.length;
  const numCols = sheet.colWidths.length;
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
              const cell = cells.get(`${sheet.id}:${r}:${c}`);
              return <Cell key={c} row={r} col={c} cell={cell} />;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
