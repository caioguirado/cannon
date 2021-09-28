import {ActionType} from '../action-types';
import {Action} from '../actions';
import produce from 'immer';
import {boardConfig} from '../../boardConfig';
import {BoardCell, boardCells} from '../../boardCells';
import {allowedMoves, getCannonShootCells} from '../../gameUtils';

interface BoardState {
    isDragging: boolean;
    boardConfig: BoardCell[];
    boardCells: number[];
    testInt: number;
    allowedPositions: number[];
    allowedShots: number[];
    currentDragging: BoardCell | null
}

export enum TurnType {
    P1 = 'p1',
    P2 = 'p2',
    PLACEMENT_P1 = 'placement_p1',
    PLACEMENT_P2 = 'placement_p2',
    TERMINAL = 'terminal',
    START_GAME = 'start_game'
}

interface GameState {
    board: BoardState;
    turnType: TurnType;
};

interface LLNode {
    value: TurnType;
    next: LLNode
};

interface LLRoot {
    head: LLNode;
};

class Node {
    value: TurnType;
    next: Node | null;

    constructor(value: TurnType, next: LLNode | null){
        this.value = value;
        this.next = next;
    }
};

const start = new Node(TurnType.START_GAME, null);
const placementP1 = new Node(TurnType.PLACEMENT_P1, null);
const placementP2 = new Node(TurnType.PLACEMENT_P2, null);
const p1 = new Node(TurnType.P1, null);
const p2 = new Node(TurnType.P2, null);

start.next = placementP1;
placementP1.next = placementP2;
placementP2.next = p1;
p1.next = p2;
p2.next = p1;

const initialState: GameState = {
    board: {
        isDragging: false,
        boardConfig,
        boardCells,
        testInt: 5,
        allowedPositions: [],
        allowedShots: [],
        currentDragging: null
    },
    turnType: TurnType.START_GAME
};

const llFind: any = (node: any, TType: TurnType) => {
    if (node.value === TType){
        return node
    } else {
        return llFind(node.next, TType);
    };
};

const getNextTurnType = (llHead: any, searchValue: any) => llFind(llHead, searchValue).next.value;

const reducer = produce(
    (state: GameState | undefined = initialState, action: Action): GameState => {
        switch (action.type){
            case ActionType.MOVE_CELL:

                const fromIndex = parseInt(action.payload.from);
                const toIndex = parseInt(action.payload.to);
                
                console.log(`fromIndex: ${fromIndex}, toIndex: ${toIndex}`);

                state.board.boardConfig[toIndex].value = state.board.boardConfig[fromIndex].value;
                state.board.boardConfig[fromIndex].value = 'none';
                state.turnType = getNextTurnType(start, state.turnType);

                return state;

            case ActionType.DRAG_CELL:
                state.board.isDragging = true;
                state.board.currentDragging = action.payload.item;
                state.board.allowedPositions = allowedMoves(state.board.currentDragging, state.board.boardConfig, state.turnType);
                state.board.allowedShots = getCannonShootCells(state.board.currentDragging, state.board.boardConfig, state.turnType);
                return state;

            case ActionType.DESELECT_CELL:
                state.board.isDragging = false;
                state.board.currentDragging = null;
                return state;

            case ActionType.START_GAME:
                const nextTurnType = getNextTurnType(start, state.turnType);
                state.turnType = nextTurnType;
                return state;

            case ActionType.PLACE_TOWER:
                const toPosition = parseInt(action.payload.to);

                state.board.boardConfig[toPosition].value = 't' + action.payload.item.value;
                state.turnType = getNextTurnType(start, state.turnType);

                return state;

            case ActionType.SHOOT_CELL:
                const toCell = action.payload.item;

                state.board.boardConfig[toCell].value = 'none';
                state.turnType = getNextTurnType(start, state.turnType);

                return state;

            default: 
                return state;
        }
    }, 

    initialState
);

export default reducer;