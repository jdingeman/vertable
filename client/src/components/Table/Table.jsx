import Sheet from "./Sheet";
import { sampleTable } from "./sampleData";
import styles from "./Table.module.css";
import { useTable } from "./hooks/useTable";

export default function Table() {
  const { state, dispatch } = useTable(sampleTable);
  console.log("editing:", state.editing);
  return (
    <Sheet
      sheet={state.sheets.find((sheet) => sheet.id === state.activeSheetId)}
      cells={state.cells}
      selection={state.selection}
      editing={state.editing}
      dispatch={dispatch}
    />
  );
}
