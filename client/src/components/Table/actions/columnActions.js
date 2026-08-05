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
 * INSERT_COLUMN
 *
 * - Finds target sheet to add column to
 * - Adds column to index before or after referenced column
 * @param {Object} currentState
 * @param {Object} payload
 * @returns Updated state with new column assigned to affected sheet
 */
export function insertColumn(currentState, payload) {
  const { sheetId, colIndex, direction } = payload;

  const targetSheet = currentState.sheets.find((sheet) => sheet.id === sheetId);

  if (!targetSheet) {
    return currentState;
  }

  const insertAt = direction === "left" ? colIndex : colIndex + 1;

  const updatedColWidths = [...targetSheet.colWidths];
  updatedColWidths.splice(insertAt, 0, 96);

  const updatedCellMap = new Map();

  currentState.cells.forEach((cell, cellId) => {
    const parsedCellId = parseCellId(cellId);

    if (
      parsedCellId.sheetId === targetSheet.id &&
      parsedCellId.column >= insertAt
    ) {
      const updatedColIndex = parsedCellId.column + 1;

      const updatedCellId = buildCellId(
        parsedCellId.sheetId,
        parsedCellId.row,
        updatedColIndex,
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
        colWidths: updatedColWidths,
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
 * DELETE_COLUMN
 *
 * - Finds target sheet to delete column from
 * - Deletes column at selected index
 * @param {Object} currentState
 * @param {Object} payload
 * @returns Updated state excluding column that was deleted
 */
export function deleteColumn(currentState, payload) {
  const { sheetId, colIndex } = payload;

  const targetSheet = currentState.sheets.find((sheet) => sheet.id === sheetId);

  if (!targetSheet) {
    return currentState;
  }

  const updatedColWidths = [...targetSheet.colWidths];
  updatedColWidths.splice(colIndex, 1);

  const updatedCellMap = new Map();

  currentState.cells.forEach((cell, cellId) => {
    const parsedCellId = parseCellId(cellId);

    if (
      parsedCellId.sheetId === targetSheet.id &&
      parsedCellId.column > colIndex
    ) {
      const updatedColIndex = parsedCellId.column - 1;

      const updatedCellId = buildCellId(
        parsedCellId.sheetId,
        parsedCellId.row,
        updatedColIndex,
      );

      updatedCellMap.set(updatedCellId, cell);
    } else if (
      parsedCellId.sheetId === targetSheet.id &&
      parsedCellId.column === colIndex
    ) {
      // Cell is in deleted column; omit from updatedCellMap
    } else {
      updatedCellMap.set(cellId, cell);
    }
  });

  const updatedSheets = currentState.sheets.map((sheet) => {
    if (sheet.id === sheetId) {
      return {
        ...sheet,
        colWidths: updatedColWidths,
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
 * RESIZE_COLUMN
 *
 * - Finds target sheet that contains targeted column
 * - Resizes the target column
 * @param {Object} currentState
 * @param {Object} payload
 * @returns
 */
export function resizeColumn(currentState, payload) {
  const { sheetId, colIndex, width } = payload;

  const targetSheet = currentState.sheets.find((sheet) => sheet.id === sheetId);

  if (!targetSheet) {
    return currentState;
  }

  if (colIndex < 0 || colIndex >= targetSheet.colWidths.length) {
    return currentState;
  }

  if (width < 1 || targetSheet.colWidths[colIndex] === width) {
    return currentState;
  }

  const updatedColWidths = [...targetSheet.colWidths];

  updatedColWidths[colIndex] = width;

  const updatedSheets = currentState.sheets.map((sheet) => {
    if (sheet.id === sheetId) {
      return {
        ...sheet,
        colWidths: updatedColWidths,
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
 * MOVE_COLUMN
 *
 * - Checks target sheet exists
 * - Checks if either source or destination column are out of bounds
 * - Moves column from source to destination
 * @param {Object} currentState
 * @param {Object} payload
 * @returns
 */
export function moveColumn(currentState, payload) {
  const { sheetId, sourceCol, destinationCol } = payload;

  const targetSheet = currentState.sheets.find((sheet) => sheet.id === sheetId);

  if (!targetSheet) {
    return currentState;
  }

  const outOfBounds =
    sourceCol < 0 ||
    sourceCol >= targetSheet.colWidths.length ||
    destinationCol < 0 ||
    destinationCol >= targetSheet.colWidths.length;

  if (outOfBounds || sourceCol === destinationCol) {
    return currentState;
  }

  // Reorder column widths

  const updatedColWidths = [...targetSheet.colWidths];

  const [movedWidth] = updatedColWidths.splice(sourceCol, 1);
  updatedColWidths.splice(destinationCol, 0, movedWidth);

  // Rebuild cell map

  const updatedCellMap = new Map();

  currentState.cells.forEach((cell, cellId) => {
    const parsedCellId = parseCellId(cellId);

    if (parsedCellId.sheetId !== sheetId) {
      updatedCellMap.set(cellId, cell);
      return;
    }

    let updatedCol = parsedCellId.column;

    if (sourceCol < destinationCol) {
      // Moving right

      if (parsedCellId.column === sourceCol) {
        updatedCol = destinationCol;
      } else if (
        parsedCellId.column > sourceCol &&
        parsedCellId.column <= destinationCol
      ) {
        updatedCol = parsedCellId.column - 1;
      }
    } else {
      // Moving left

      if (parsedCellId.column === sourceCol) {
        updatedCol = destinationCol;
      } else if (
        parsedCellId.column >= destinationCol &&
        parsedCellId.column < sourceCol
      ) {
        updatedCol = parsedCellId.column + 1;
      }
    }

    const updatedCellId = buildCellId(
      parsedCellId.sheetId,
      parsedCellId.row,
      updatedCol,
    );

    updatedCellMap.set(updatedCellId, cell);
  });

  const updatedSheets = currentState.sheets.map((sheet) => {
    if (sheet.id === sheetId) {
      return {
        ...sheet,
        colWidths: updatedColWidths,
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
