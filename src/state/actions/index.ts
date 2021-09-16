import { BoardCell } from '../../boardCells';
import {ActionType} from '../action-types';

export interface MoveCellAction {
    type: ActionType.MOVE_CELL,
    payload: {
        from: string,
        to: string,
        value: string
    }
};

export interface DragCellAction {
    type: ActionType.DRAG_CELL,
    payload: {}
};

export interface DeSelectCellAction {
    type: ActionType.DESELECT_CELL,
    payload: {}
};

export type Action = MoveCellAction | DragCellAction | DeSelectCellAction;