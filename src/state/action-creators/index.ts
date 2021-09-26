import { ActionType } from "../action-types";
import {Action, MoveCellAction} from '../actions';

export const moveCell = (from: string, to: string, value: string) => {
    return {
        type: ActionType.MOVE_CELL,
        payload: {
                    from, 
                    to,
                    value
                }
    }
};

export const dragCell = (item: any) => {
    return {
        type: ActionType.DRAG_CELL,
        payload: {
            item
        }
    }
};

export const deSelectCell = () => {
    return {
        type: ActionType.DESELECT_CELL,
        payload: {}
    }
};

export const startGame = () => {
    return {
        type: ActionType.START_GAME,
        payload: {}
    }
};


export const placeTower = (item: any, to: any) => {
    return {
        type: ActionType.PLACE_TOWER,
        payload: {
            item,
            to
        }
    }
};