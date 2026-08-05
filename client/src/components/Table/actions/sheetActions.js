/**
 * Helper function to create a new Sheet object
 * @param {Object} sheet
 * @param {Object} sheet.id
 * @param {Object} sheet.name
 * @param {Object} sheet.position
 * @returns New Sheet object with passed parameters.
 */
function createSheet({ id, name, position }) {
  return {
    id,
    name,
    position,
    colWidths: Array(10).fill(96),
    rowHeights: Array(20).fill(24),
  };
}

/**
 * ADD_SHEET
 *
 * - Adds new sheet to sheets
 * @param {Object} currentState
 * @param {Object} payload
 * @returns Updated state with new sheet added to sheets.
 */
export function addSheet(currentState, payload) {
  const { name } = payload;
  const currentSheets = currentState.sheets;
  const newId = "s" + currentSheets.length;
  const position = currentSheets.length;
  const sheetName = name ?? `Sheet ${position + 1}`;

  const newSheet = createSheet({ id: newId, name: sheetName, position });

  const updatedSheets = [...currentSheets, newSheet];

  const updatedState = { ...currentState, sheets: updatedSheets };
  return updatedState;
}

/**
 * DELETE_SHEET
 *
 * - Deletes sheet from sheets
 * @param {Object} currentState
 * @param {Object} payload
 * @returns Updated state with sheets excluding the deleted sheet
 */
export function deleteSheet(currentState, payload) {
  const { sheetId } = payload;

  const updatedSheets = currentState.sheets.filter(
    (sheet) => sheet.id !== sheetId,
  );

  const updatedCellMap = new Map(
    [...currentState.cells.entries()].filter(([key]) => {
      return !key.startsWith(sheetId);
    }),
  );

  let updatedActiveSheetId = currentState.activeSheetId;

  if (currentState.activeSheetId === sheetId) {
    const fallbackSheet = updatedSheets[0];
    updatedActiveSheetId = fallbackSheet ? fallbackSheet.id : null;
  }

  return {
    ...currentState,
    sheets: updatedSheets,
    cells: updatedCellMap,
    activeSheetId: updatedActiveSheetId,
  };
}

/**
 * RENAME_SHEET
 *
 * - Renames sheet
 * @param {Object} currentState
 * @param {Object} payload
 * @returns Updated state with renamed sheet
 */
export function renameSheet(currentState, payload) {
  const { name, sheetId } = payload;

  const newName = name.trim();

  const duplicateExists = currentState.sheets.some(
    (sheet) => sheet.name === newName && sheet.id !== sheetId,
  );

  if (newName === "" || duplicateExists) {
    return currentState;
  }

  const updatedSheets = currentState.sheets.map((sheet) => {
    if (sheet.id === sheetId && sheet.name !== newName) {
      return {
        ...sheet,
        name: newName,
      };
    }

    return sheet;
  });

  return { ...currentState, sheets: updatedSheets };
}

/**
 * REORDER_SHEETS
 *
 * - Changes position of sheet
 * - Dynamically repositions other sheets in state
 * @param {Object} currentState
 * @param {Object} payload
 * @returns Updated state with reordered sheets
 */
export function reorderSheets(currentState, payload) {
  const { sheetId, newPosition } = payload;

  const targetSheet = currentState.sheets.find((sheet) => sheet.id === sheetId);

  if (!targetSheet) {
    return currentState;
  }

  const outOfBounds =
    newPosition > currentState.sheets.length - 1 || newPosition < 0;

  const samePosition = targetSheet.position === newPosition;

  if (outOfBounds || samePosition) {
    return currentState;
  }

  const updatedSheets = [...currentState.sheets];
  updatedSheets.splice(updatedSheets.indexOf(targetSheet), 1);
  updatedSheets.splice(newPosition, 0, targetSheet);

  const reorderedSheets = updatedSheets.map((sheet, index) => {
    return {
      ...sheet,
      position: index,
    };
  });
  return {
    ...currentState,
    sheets: reorderedSheets,
  };
}

/**
 * SET_ACTIVE_SHEET
 *
 * - Sets active sheet
 * @param {Object} currentState
 * @param {Object} payload
 * @returns Updated state with updated active sheet
 */
export function setActiveSheet(currentState, payload) {
  const { sheetId } = payload;

  const sheetExists = currentState.sheets.some((sheet) => sheet.id === sheetId);

  if (!sheetExists || currentState.activeSheetId === sheetId) {
    return currentState;
  }

  return { ...currentState, activeSheetId: sheetId };
}
