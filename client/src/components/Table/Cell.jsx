import { memo } from "react";
import styles from "./Table.module.css";

function Cell({ cell }) {
  const f = cell?.formatting ?? {};
  const style = {
    backgroundColor: f.bgColor,
    color: f.color,
    fontWeight: f.bold ? "bold" : undefined,
    fontStyle: f.italic ? "italic" : undefined,
    textAlign: f.align,
    fontSize: f.fontSize,
  };

  return (
    <td className={styles.cell} style={style}>
      {cell?.value ?? ""}
    </td>
  );
}

export default memo(Cell);
