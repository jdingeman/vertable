import Sheet from "./Sheet";
import { sampleTable } from "./sampleData";
import styles from "./Table.module.css";
import { useTable } from "./hooks/useTable";

export default function Table() {
  const { state } = useTable(sampleTable);
  const table = sampleTable;
  const activeSheet = table.sheets.find((s) => s.id === table.activeSheetId);
  return (
    <div className={styles.table}>
      <Sheet sheet={activeSheet} cells={table.cells} />
    </div>
  );
}
