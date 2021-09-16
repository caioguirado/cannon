import { ActionType } from "../action-types";
import {Action, MoveCellAction} from '../actions';

export const moveCell = (from: string, to: string) => {
    return {
        type: ActionType.MOVE_CELL,
        payload: {
                    from, 
                    to
                }
    }
};

export const dragCell = () => {
    return {
        type: ActionType.DRAG_CELL,
        payload: {}
    }
};

export const deSelectCell = () => {
    return {
        type: ActionType.DESELECT_CELL,
        payload: {}
    }
};