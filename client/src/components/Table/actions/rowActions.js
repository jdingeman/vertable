/**
 * Helper function to parse `cellId` into `sheetId`, `row` and `column`
 * @param {String} cellId
 * @returns An object containing the string of the `sheetId`,
 * and `row` and `column` as integers
 */
function parseCellId(cellId) {
  const parsedCellId = cellId.split(":");

  return {
    sheetId: parsedCellId[0],
    row: parseInt(parsedCellId[1], 10),
    column: parseInt(parsedCellId[2], 10),
  };
}

/**
 * Helper function to build `cellId` from parameters.
 * @param {String} sheetId
 * @param {Number} row
 * @param {Number} col
 * @returns An updated `cellId` key
 */
function buildCellId(sheetId, row, col) {
  return `${sheetId}:${row}:${col}`;
}

/**
 * INSERT_ROW
 *
 * - Finds target sheet to add row to
 * - Adds row to index before or after referenced row
 * @param {Object} currentState
 * @param {Object} payload
 * @returns Updated state with new row assigned to affected sheet
 */
export function insertRow(currentState, payload) {
  const { sheetId, rowIndex, direction } = payload;

  const targetSheet = currentState.sheets.find((sheet) => sheet.id === sheetId);

  if (!targetSheet) {
    return currentState;
  }

  const insertAt = direction === "above" ? rowIndex : rowIndex + 1;

  const updatedRowHeights = [...targetSheet.rowHeights];
  updatedRowHeights.splice(insertAt, 0, 24);

  const updatedCellMap = new Map();

  currentState.cells.forEach((cell, cellId) => {
    const parsedCellId = parseCellId(cellId);

    if (
      parsedCellId.sheetId === targetSheet.id &&
      parsedCellId.row >= insertAt
    ) {
      const updatedRowIndex = parsedCellId.row + 1;

      const updatedCellId = buildCellId(
        parsedCellId.sheetId,
        updatedRowIndex,
        parsedCellId.column,
      );

      updatedCellMap.set(updatedCellId, cell);
    } else {
      updatedCellMap.set(cellId, cell);
    }
  });

  const updatedSheets = currentState.sheets.map((sheet) => {
    if (sheet.id === sheetId) {
      return {
        ...sheet,
        rowHeights: updatedRowHeights,
      };
    }
    return sheet;
  });

  return {
    ...currentState,
    sheets: updatedSheets,
    cells: updatedCellMap,
  };
}

/**
 * DELETE_ROW
 *
 * - Finds target sheet to delete row from
 * - Deletes row at selected index
 * @param {Object} currentState
 * @param {Object} payload
 * @returns Updated state excluding row that was deleted
 */
export function deleteRow(currentState, payload) {
  const { sheetId, rowIndex } = payload;

  const targetSheet = currentState.sheets.find((sheet) => sheet.id === sheetId);

  if (!targetSheet) {
    return currentState;
  }

  const updatedRowHeights = [...targetSheet.rowHeights];
  updatedRowHeights.splice(rowIndex, 1);

  const updatedCellMap = new Map();

  currentState.cells.forEach((cell, cellId) => {
    const parsedCellId = parseCellId(cellId);

    if (
      parsedCellId.sheetId === targetSheet.id &&
      parsedCellId.row > rowIndex
    ) {
      const updatedRowIndex = parsedCellId.row - 1;

      const updatedCellId = buildCellId(
        parsedCellId.sheetId,
        updatedRowIndex,
        parsedCellId.column,
      );

      updatedCellMap.set(updatedCellId, cell);
    } else if (
      parsedCellId.sheetId === targetSheet.id &&
      parsedCellId.row === rowIndex
    ) {
      // Cell is in deleted row; omit from updatedCellMap
    } else {
      updatedCellMap.set(cellId, cell);
    }
  });

  const updatedSheets = currentState.sheets.map((sheet) => {
    if (sheet.id === sheetId) {
      return {
        ...sheet,
        rowHeights: updatedRowHeights,
      };
    }
    return sheet;
  });

  return {
    ...currentState,
    sheets: updatedSheets,
    cells: updatedCellMap,
  };
}

/**
 * RESIZE_ROW
 *
 * - Finds target sheet that contains targeted row
 * - Resizes the target row
 * @param {Object} currentState
 * @param {Object} payload
 * @returns
 */
export function resizeRow(currentState, payload) {
  const { sheetId, rowIndex, height } = payload;

  const targetSheet = currentState.sheets.find((sheet) => sheet.id === sheetId);

  if (!targetSheet) {
    return currentState;
  }

  if (rowIndex < 0 || rowIndex >= targetSheet.rowHeights.length) {
    return currentState;
  }

  if (height < 1 || targetSheet.rowHeights[rowIndex] === height) {
    return currentState;
  }

  const updatedRowHeights = [...targetSheet.rowHeights];

  updatedRowHeights[rowIndex] = height;

  const updatedSheets = currentState.sheets.map((sheet) => {
    if (sheet.id === sheetId) {
      return {
        ...sheet,
        rowHeights: updatedRowHeights,
      };
    }
    return sheet;
  });

  return {
    ...currentState,
    sheets: updatedSheets,
  };
}

/**
 * MOVE_ROW
 *
 * - Checks target sheet exists
 * - Checks if either source or destination row are out of bounds
 * - Moves row from source to destination
 * @param {Object} currentState
 * @param {Object} payload
 * @returns
 */
export function moveRow(currentState, payload) {
  const { sheetId, sourceRow, destinationRow } = payload;

  const targetSheet = currentState.sheets.find((sheet) => sheet.id === sheetId);

  if (!targetSheet) {
    return currentState;
  }

  const outOfBounds =
    sourceRow < 0 ||
    sourceRow >= targetSheet.rowHeights.length ||
    destinationRow < 0 ||
    destinationRow >= targetSheet.rowHeights.length;

  if (outOfBounds || sourceRow === destinationRow) {
    return currentState;
  }

  // Reorder row heights

  const updatedRowHeights = [...targetSheet.rowHeights];

  const [movedHeight] = updatedRowHeights.splice(sourceRow, 1);
  updatedRowHeights.splice(destinationRow, 0, movedHeight);

  // Rebuild cell map

  const updatedCellMap = new Map();

  currentState.cells.forEach((cell, cellId) => {
    const parsedCellId = parseCellId(cellId);

    if (parsedCellId.sheetId !== sheetId) {
      updatedCellMap.set(cellId, cell);
      return;
    }

    let updatedRow = parsedCellId.row;

    if (sourceRow < destinationRow) {
      // Moving downward

      if (parsedCellId.row === sourceRow) {
        updatedRow = destinationRow;
      } else if (
        parsedCellId.row > sourceRow &&
        parsedCellId.row <= destinationRow
      ) {
        updatedRow = parsedCellId.row - 1;
      }
    } else {
      // Moving upward

      if (parsedCellId.row === sourceRow) {
        updatedRow = destinationRow;
      } else if (
        parsedCellId.row >= destinationRow &&
        parsedCellId.row < sourceRow
      ) {
        updatedRow = parsedCellId.row + 1;
      }
    }

    const updatedCellId = buildCellId(
      parsedCellId.sheetId,
      updatedRow,
      parsedCellId.column,
    );

    updatedCellMap.set(updatedCellId, cell);
  });

  const updatedSheets = currentState.sheets.map((sheet) => {
    if (sheet.id === sheetId) {
      return {
        ...sheet,
        rowHeights: updatedRowHeights,
      };
    }

    return sheet;
  });

  return {
    ...currentState,
    sheets: updatedSheets,
    cells: updatedCellMap,
  };
}
