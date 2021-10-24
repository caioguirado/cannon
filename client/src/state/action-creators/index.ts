import axios from 'axios';
import {store} from '../store'
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

export const shootCell = (item: any) => {
    return {
        type: ActionType.SHOOT_CELL,
        payload: {
            item
        }
    }
};

export const AIMakeMove = (board: any, turnType: any) => {
    return (dispatch: any) => {
        // const state = store.getState();
        // console.log(state);
        axios.post('http://localhost:3050/api/move', {
            "board": board,
            "turnType": turnType
        })
            .then((r:any) => {
                const move : any = r.data;
                console.log('AI Answered move: ', move)
                if (move['moveType'] == 'move' || move['moveType'] == 'capture'){
                    dispatch(moveCell(move['fromPosition'].toString(), 
                                        move['toPosition'].toString(), 
                                        ""));
                } else if (move['moveType'] == 'placement') {
                    dispatch(placeTower({value: 'b'}, move['toPosition'].toString()));
                } else if (move['moveType'] == 'shot'){
                    dispatch(shootCell(move['toPosition']));
                } else {
                    return
                }
            }).catch((err:any) => {
                const errorMessage = err.message;
                console.log(errorMessage);
            })
        
    }
};