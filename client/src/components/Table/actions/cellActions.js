export function selectCell(currentState, payload) {
  return { ...currentState, selection: payload };
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
