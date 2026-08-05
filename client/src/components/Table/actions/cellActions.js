/**
 * SELECT_CELL
 * - Selects the clicked cell
 * @param {Object} currentState Current state of cell data
 * @param {Object} payload Coordinates of cell
 * @returns Updated state with destructured payload
 */
export function selectCell(currentState, payload) {
  const { sheetId, row, column } = payload;

  return {
    ...currentState,
    selection: {
      sheetId,
      anchorRow: row,
      anchorColumn: column,
      activeRow: row,
      activeColumn: column,
    },
  };
}

export function moveSelection(currentState, payload) {
  const { sheetId, direction } = payload;

  const targetSheet = currentState.sheets.find((sheet) => sheet.id === sheetId);

  if (!targetSheet || !currentState.selection) {
    return currentState;
  }

  let newRow = currentState.selection.activeRow;
  let newColumn = currentState.selection.activeColumn;

  if (direction === "up") {
    newRow -= 1;
  } else if (direction === "down") {
    newRow += 1;
  } else if (direction === "left") {
    newColumn -= 1;
  } else if (direction === "right") {
    newColumn += 1;
  } else {
    return currentState;
  }

  if (
    newRow < 0 ||
    newRow >= targetSheet.rowHeights.length ||
    newColumn < 0 ||
    newColumn >= targetSheet.colWidths.length
  ) {
    return currentState;
  }

  return {
    ...currentState,
    selection: {
      sheetId,
      anchorRow: newRow,
      anchorColumn: newColumn,
      activeRow: newRow,
      activeColumn: newColumn,
    },
  };
}

export function extendSelection(currentState, payload) {
  const { sheetId, direction } = payload;

  const targetSheet = currentState.sheets.find((sheet) => sheet.id === sheetId);

  if (!targetSheet || !currentState.selection) {
    return currentState;
  }

  let newActiveRow = currentState.selection.activeRow;
  let newActiveColumn = currentState.selection.activeColumn;

  if (direction === "up") {
    newActiveRow -= 1;
  } else if (direction === "down") {
    newActiveRow += 1;
  } else if (direction === "left") {
    newActiveColumn -= 1;
  } else if (direction === "right") {
    newActiveColumn += 1;
  } else {
    return currentState;
  }

  if (
    newActiveRow < 0 ||
    newActiveRow >= targetSheet.rowHeights.length ||
    newActiveColumn < 0 ||
    newActiveColumn >= targetSheet.colWidths.length
  ) {
    return currentState;
  }

  return {
    ...currentState,
    selection: {
      ...currentState.selection,
      activeRow: newActiveRow,
      activeColumn: newActiveColumn,
    },
  };
}

/**
 * START_EDITING
 * - Opens input for cell
 * @param {Object} currentState Current state of cell data
 * @param {Object} payload Coordinates of cell
 * @returns Updated state where cell is now in editing mode
 */
export function startEditing(currentState, payload) {
  const { sheetId, row, column } = payload;

  const cellId = `${sheetId}:${row}:${column}`;
  const cell = currentState.cells.get(cellId);

  return {
    ...currentState,
    editing: {
      sheetId,
      row,
      column,
    },
    editingOriginalValue: cell?.value ?? "",
  };
}

/**
 * STOP_EDITING
 * - Closes input for cell
 * @param {Object} currentState Current state of cell data
 * @param {Object} payload Coordinates of cell
 * @returns Updated state where cell is no longer in editing mode
 */
export function stopEditing(currentState) {
  return {
    ...currentState,
    editing: null,
  };
}

export function cancelEditing(currentState) {
  if (!currentState.editing) {
    return currentState;
  }

  const { sheetId, row, column } = currentState.editing;

  const cellId = `${sheetId}:${row}:${column}`;
  const existingCell = currentState.cells.get(cellId);

  const updatedCellMap = new Map(currentState.cells);

  updatedCellMap.set(cellId, {
    value: currentState.editingOriginalValue,
    formatting: existingCell?.formatting ?? {},
  });

  return {
    ...currentState,
    cells: updatedCellMap,
    editing: null,
    editingOriginalValue: null,
  };
}

/**
 * EDIT_CELL
 * - Updates cell value
 * - Preserves cell format
 * - Marks cell dirty
 * @param {Object} currentState Current state of cell data
 * @param {Object} payload Change to cell value
 * @returns Updated state with change to cell value
 */
export function editCell(currentState, payload) {
  const { cellId, value } = payload;
  const dirtyCells = new Set(currentState.dirty);
  const existingCell = currentState.cells.get(cellId);
  const updatedCellMap = new Map(currentState.cells);

  updatedCellMap.set(cellId, {
    value,
    formatting: existingCell?.formatting ?? {},
  });

  dirtyCells.add(cellId);
  const updatedState = {
    ...currentState,
    cells: updatedCellMap,
    dirty: dirtyCells,
  };
  return updatedState;
}

/**
 * FORMAT_CELL
 * - Preserves cell value
 * - Updates cell format
 * - Marks cell dirty
 * @param {Object} currentState Current state of cell data
 * @param {Object} payload Change to cell format
 * @returns Updated state with change to cell format
 */
export function formatCell(currentState, payload) {
  const { cellId, formatting } = payload;

  const dirtyCells = new Set(currentState.dirty);

  const existingCell = currentState.cells.get(cellId);
  const existingFormatting = existingCell?.formatting ?? {};
  const updatedCellMap = new Map(currentState.cells);

  updatedCellMap.set(cellId, {
    value: existingCell?.value ?? "",
    formatting: { ...existingFormatting, ...formatting },
  });

  dirtyCells.add(cellId);
  const updatedState = {
    ...currentState,
    cells: updatedCellMap,
    dirty: dirtyCells,
  };
  return updatedState;
}

/**
 * CLEAR_CELL
 * - Clears cell value
 * - Preserves cell format
 * - Marks cell dirty
 * @param {Object} currentState Current state of cell data
 * @param {Object} payload `cellId` of cell to be cleared
 * @returns Updated state with change to cell value
 */
export function clearCell(currentState, payload) {
  const { cellId } = payload;

  const dirtyCells = new Set(currentState.dirty);

  const existingCell = currentState.cells.get(cellId);
  const updatedCellMap = new Map(currentState.cells);

  updatedCellMap.set(cellId, {
    value: "",
    formatting: existingCell?.formatting ?? {},
  });

  dirtyCells.add(cellId);
  const updatedState = {
    ...currentState,
    cells: updatedCellMap,
    dirty: dirtyCells,
  };
  return updatedState;
}

/**
 * CLEAR_FORMATTING
 * - Preserves cell value
 * - Clears cell format
 * - Marks cell dirty
 * @param {Object} currentState Current state of cell data
 * @param {Object} payload `cellId` of cell to be updated
 * @returns Updated state with change to cell formatting
 */
export function clearFormatting(currentState, payload) {
  const { cellId } = payload;

  const dirtyCells = new Set(currentState.dirty);

  const existingCell = currentState.cells.get(cellId);
  const updatedCellMap = new Map(currentState.cells);

  updatedCellMap.set(cellId, {
    value: existingCell?.value ?? "",
    formatting: {},
  });

  dirtyCells.add(cellId);
  const updatedState = {
    ...currentState,
    cells: updatedCellMap,
    dirty: dirtyCells,
  };
  return updatedState;
}

/**
 * BULK_EDIT_CELLS
 *
 * Payload:
 * ```json
 * {
 *  updates: [
 *    {
 *      cellId: "...",
 *      value: "...",
 *    }
 *  ]
 * }
 * ```
 * @param {Object} currentState Current state of selected cell data
 * @param {Object} payload List of updates contain the `cellId` and each cell's updated value
 * @returns Updated state of selected cell data
 */
export function bulkEditCells(currentState, payload) {
  const { updates } = payload;

  const dirtyCells = new Set(currentState.dirty);
  const updatedCellMap = new Map(currentState.cells);

  for (const update of updates) {
    const cellId = update.cellId;
    const existingCell = currentState.cells.get(cellId);
    updatedCellMap.set(cellId, {
      value: update.value,
      formatting: existingCell?.formatting ?? {},
    });

    dirtyCells.add(cellId);
  }

  const updatedState = {
    ...currentState,
    cells: updatedCellMap,
    dirty: dirtyCells,
  };

  return updatedState;
}
