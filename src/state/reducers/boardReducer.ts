import {ActionType} from '../action-types';
import {Action} from '../actions';
import produce from 'immer';
import {boardConfig} from '../../boardConfig';
import {BoardCell, boardCells} from '../../boardCells';

interface BoardState {
    isDragging: boolean;
    playState: string; // own type later
    boardConfig: BoardCell[]; // own type later
    boardCells: BoardCell[];
    testInt: number
}

const initialState: BoardState = {
    isDragging: false,
    playState: 'placement',
    boardConfig,
    boardCells,
    testInt: 5
}

const reducer = produce(
    (state: BoardState | undefined = initialState, action: Action): BoardState  => {
        switch (action.type){
            case ActionType.MOVE_CELL:

                // Find index of FROM and empty its value
                const fromIndex = state.boardConfig.findIndex(cell => cell.id === action.payload.from);
                state.boardConfig[fromIndex].value = 'none';
                
                // Find index of TO and change its value
                const toIndex = state.boardConfig.findIndex(cell => cell.id === action.payload.to);
                console.log(state.boardConfig[toIndex].value, action.payload.value);
                state.boardConfig[toIndex].value = action.payload.value;

                return state;

            case ActionType.DRAG_CELL:
                state.isDragging = true;
                return state;

            case ActionType.DESELECT_CELL:
                state.isDragging = false;
                return state;

            default: 
                return state;
        }
    }, 
    initialState
);

export default reducer;