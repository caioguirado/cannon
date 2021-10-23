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
    payload: {
        item: BoardCell;
    }
};

export interface DeSelectCellAction {
    type: ActionType.DESELECT_CELL,
    payload: {}
};

export interface StartGameAction {
    type: ActionType.START_GAME,
    payload: {}
};

export interface PlaceTowerAction {
    type: ActionType.PLACE_TOWER,
    payload: {
        item: any;
        to: string;
    }
};

export interface ShootCellAction {
    type: ActionType.SHOOT_CELL,
    payload: {
        item: any;
    }
};

export interface AIMoveAction {
    type: ActionType.AI,
    payload: {
        
    }
};

export type Action = MoveCellAction 
                    | DragCellAction 
                    | DeSelectCellAction
                    | StartGameAction 
                    | PlaceTowerAction
                    | ShootCellAction
                    | AIMoveAction;