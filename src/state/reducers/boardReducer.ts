import {ActionType} from '../action-types';
import {Action} from '../actions';
import produce from 'immer';
import {boardConfig} from '../../boardConfig';
import {BoardCell, boardCells} from '../../boardCells';
import {allowedMoves} from '../../gameUtils';

interface BoardState {
    isDragging: boolean;
    playState: string; // own type later
    boardConfig: BoardCell[]; // own type later
    boardCells: number[];
    testInt: number;
    allowedPositions: number[];
    currentDragging: BoardCell | null
}

const initialState: BoardState = {
    isDragging: false,
    playState: 'placement',
    boardConfig,
    boardCells,
    testInt: 5,
    allowedPositions: [],
    currentDragging: null
}

const reducer = produce(
    (state: BoardState | undefined = initialState, action: Action): BoardState  => {
        switch (action.type){
            case ActionType.MOVE_CELL:

                const fromIndex = parseInt(action.payload.from);
                const toIndex = parseInt(action.payload.to);
                console.log(action);
                console.log(`fromIndex: ${fromIndex}, toIndex: ${toIndex}`);
                // state.boardConfig[toIndex].value = action.payload.value;
                state.boardConfig[toIndex].value = state.boardConfig[fromIndex].value;
                state.boardConfig[fromIndex].value = 'none';

                return state;

            case ActionType.DRAG_CELL:
                state.isDragging = true;
                console.log(action);
                state.currentDragging = action.payload.item;
                const allowedPositions = allowedMoves(state.currentDragging, state.boardConfig);
                state.allowedPositions = allowedPositions;
                return state;

            case ActionType.DESELECT_CELL:
                state.isDragging = false;
                state.currentDragging = null;
                return state;

            default: 
                return state;
        }
    }, 

    initialState
);

export default reducer;