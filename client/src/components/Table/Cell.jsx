import { memo, useEffect, useRef } from "react";
import styles from "./Table.module.css";

function Cell({
  cell,
  sheetId,
  row,
  column,
  selected,
  active,
  editing,
  dispatch,
}) {
  const f = cell?.formatting ?? {};

  const cellRef = useRef(null);

  useEffect(() => {
    if (active && !editing) {
      cellRef.current?.focus();
    }
  }, [active, editing]);

  const style = {
    backgroundColor: f.bgColor,
    color: f.color,
    fontWeight: f.bold ? "bold" : undefined,
    fontStyle: f.italic ? "italic" : undefined,
    textAlign: f.align,
    fontSize: f.fontSize,
  };

  function handleMouseDown() {
    dispatch({
      type: "SELECT_CELL",
      payload: {
        sheetId,
        row,
        column,
      },
    });
  }

  function handleDoubleClick() {
    dispatch({
      type: "START_EDITING",
      payload: {
        sheetId,
        row,
        column,
      },
    });
  }

  function handleKeyDown(event) {
    console.log("KEY:", event.key);

    const directions = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    };

    let direction = directions[event.key];

    if (event.shiftKey && direction) {
      dispatch({
        type: "EXTEND_SELECTION",
        payload: {
          sheetId,
          direction,
        },
      });
      return;
    }

    if (
      !editing &&
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      event.preventDefault();

      dispatch({
        type: "START_EDITING",
        payload: {
          sheetId,
          row,
          column,
        },
      });

      dispatch({
        type: "EDIT_CELL",
        payload: {
          cellId: `${sheetId}:${row}:${column}`,
          value: event.key,
        },
      });

      return;
    }

    if (event.key === "Escape") {
      dispatch({
        type: "CANCEL_EDITING",
      });
      return;
    }

    if (event.key === "Enter") {
      dispatch({
        type: "STOP_EDITING",
      });
      direction = "down";
    }

    if (event.key === "Tab") {
      direction = event.shiftKey ? "left" : "right";
    }

    if (!direction) {
      return;
    }

    event.preventDefault();

    dispatch({
      type: "MOVE_SELECTION",
      payload: {
        sheetId,
        row,
        column,
        direction,
      },
    });
  }

  console.log(`${sheetId}:${row}:${column}`, "editing:", editing);

  return (
    <td
      ref={cellRef}
      className={`${styles.cell} ${selected ? styles.selectedCell : ""}`}
      style={style}
      tabIndex={selected ? 0 : -1}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
    >
      {editing ? (
        <input
          className={styles.cellInput}
          type="text"
          value={cell?.value ?? ""}
          autoFocus
          onChange={(event) => {
            dispatch({
              type: "EDIT_CELL",
              payload: {
                cellId: `${sheetId}:${row}:${column}`,
                value: event.target.value,
              },
            });
          }}
          onBlur={() => {
            dispatch({
              type: "STOP_EDITING",
            });
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              dispatch({
                type: "STOP_EDITING",
              });
            }
          }}
        />
      ) : (
        cell?.value ?? ""
      )}
    </td>
  );
}

export default memo(Cell);
