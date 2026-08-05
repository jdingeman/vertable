import { useReducer } from "react";
import * as cellActions from "../actions/cellActions.js";
import * as sheetActions from "../actions/sheetActions.js";
import * as rowActions from "../actions/rowActions.js";
import * as columnActions from "../actions/columnActions.js";

function createInitialState(seed) {
  return {
    id: seed.id,
    name: seed.name,
    activeSheetId: seed.activeSheetId,
    sheets: seed.sheets,
    cells: new Map(seed.cells),
    selection: null,
    editing: null,
    editingOriginalValue: null,
    dirty: new Set(),
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "LOAD":
      return createInitialState(action.payload);
    case "UNDO":
      return undo(state, action.payload);
    case "REDO":
      return redo(state, action.payload);
    case "SELECT_CELL":
      return cellActions.selectCell(state, action.payload);
    case "EXTEND_SELECTION":
      return cellActions.extendSelection(state, action.payload);
    case "MOVE_SELECTION":
      return cellActions.moveSelection(state, action.payload);
    case "START_EDITING":
      return cellActions.startEditing(state, action.payload);
    case "STOP_EDITING":
      return cellActions.stopEditing(state, action.payload);
    case "CANCEL_EDITING":
      return cellActions.cancelEditing(state);
    case "EDIT_CELL":
      return cellActions.editCell(state, action.payload);
    case "FORMAT_CELL":
      return cellActions.formatCell(state, action.payload);
    case "CLEAR_CELL":
      return cellActions.clearCell(state, action.payload);
    case "CLEAR_FORMATTING":
      return cellActions.clearFormatting(state, action.payload);
    case "BULK_EDIT_CELLS":
      return cellActions.bulkEditCells(state, action.payload);
    case "ADD_SHEET":
      return sheetActions.addSheet(state, action.payload);
    case "DELETE_SHEET":
      return sheetActions.deleteSheet(state, action.payload);
    case "RENAME_SHEET":
      return sheetActions.renameSheet(state, action.payload);
    case "REORDER_SHEETS":
      return sheetActions.reorderSheets(state, action.payload);
    case "SET_ACTIVE_SHEET":
      return sheetActions.setActiveSheet(state, action.payload);
    case "INSERT_ROW":
      return rowActions.insertRow(state, action.payload);
    case "DELETE_ROW":
      return rowActions.deleteRow(state, action.payload);
    case "RESIZE_ROW":
      return rowActions.resizeRow(state, action.payload);
    case "MOVE_ROW":
      return rowActions.moveRow(state, action.payload);
    case "INSERT_COLUMN":
      return columnActions.insertColumn(state, action.payload);
    case "DELETE_COLUMN":
      return columnActions.deleteColumn(state, action.payload);
    case "RESIZE_COLUMN":
      return columnActions.resizeColumn(state, action.payload);
    case "MOVE_COLUMN":
      return columnActions.moveColumn(state, action.payload);
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export function useTable(seed) {
  const [state, dispatch] = useReducer(reducer, seed, createInitialState);
  return { state, dispatch };
}
