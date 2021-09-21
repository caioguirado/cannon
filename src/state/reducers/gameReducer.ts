import {ActionType} from '../action-types';
import {Action} from '../actions';
import produce from 'immer';
import {boardConfig} from '../../boardConfig';
import {BoardCell, boardCells} from '../../boardCells';
import {allowedMoves} from '../../gameUtils';

interface BoardState {
    isDragging: boolean;
    boardConfig: BoardCell[];
    boardCells: number[];
    testInt: number;
    allowedPositions: number[];
    currentDragging: BoardCell | null
}

enum TurnType {
    P1 = 'p1',
    P2 = 'p2',
    PLACEMENT_P1 = 'placement_p1',
    PLACEMENT_P2 = 'placement_p2',
    TERMINAL = 'terminal'
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

const placementP1 = new Node(TurnType.PLACEMENT_P1, null);
const placementP2 = new Node(TurnType.PLACEMENT_P2, null);
const p1 = new Node(TurnType.P1, null);
const p2 = new Node(TurnType.P2, null);

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
        currentDragging: null
    },
    turnType: TurnType.PLACEMENT_P1
};

const llFind: any = (node: any, TType: TurnType) => {
    if (node.value === TType){
        return node
    } else {
        return llFind(node.next, TType);
    };
};

const reducer = produce(
    (state: GameState | undefined = initialState, action: Action): GameState => {
        switch (action.type){
            case ActionType.MOVE_CELL:

                const fromIndex = parseInt(action.payload.from);
                const toIndex = parseInt(action.payload.to);
                console.log(action);
                console.log(`fromIndex: ${fromIndex}, toIndex: ${toIndex}`);
                // state.boardConfig[toIndex].value = action.payload.value;
                state.board.boardConfig[toIndex].value = state.board.boardConfig[fromIndex].value;
                state.board.boardConfig[fromIndex].value = 'none';
                
                const currentTurnType = llFind(placementP1, state.turnType);
                state.turnType = currentTurnType.next.value

                return state;

            case ActionType.DRAG_CELL:
                state.board.isDragging = true;
                console.log(action);
                state.board.currentDragging = action.payload.item;
                const allowedPositions = allowedMoves(state.board.currentDragging, state.board.boardConfig);
                state.board.allowedPositions = allowedPositions;
                return state;

            case ActionType.DESELECT_CELL:
                state.board.isDragging = false;
                state.board.currentDragging = null;
                return state;

            default: 
                return state;
        }
    }, 

    initialState
);

export default reducer;