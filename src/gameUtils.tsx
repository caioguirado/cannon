import { BoardCell } from "./boardCells";
import { TurnType } from "./state/reducers/gameReducer";

export const indexToXY = (index: number): {x: number, y: number} => {
    let x = index % 10;
    let y = Math.abs(Math.floor(index / 10) - 9);
    return {x, y}
};

export const isWhite = (index: number): boolean => {
    const {x, y} = indexToXY(index);
    return (x + y) % 2 === 0;
};

export const indexToNotation = (index: number): string => {
    const {x, y} = indexToXY(index);
    const row = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'][x]
    return `${row}${y + 1}`
};

export const getCellColor = (index: number) => {
    const {x, y} = indexToXY(index);
    return (x + y) % 2 === 1 ? 'black' : 'white'
};

// const checkMove = (item, props, boardConfig) => {

// };

export const getStepCells = (item: any, backwards: boolean = false, double: boolean = false) => {
    const depth = double ? 2 : 1;
    const correction = (depth - 1) * 4;
    const reverse = backwards ? -1 * depth : 1;
    const fromItem = parseInt(item.id);
    if (item.value === 'w'){
        if (fromItem <= 9) { return [] } // Off board
        if (fromItem % 10 === 0) {return [fromItem - (10 * reverse), fromItem - (9 * reverse - correction)]} // First in row
        if ((fromItem + 1) % 10 === 0) {return [fromItem - (11 * reverse + correction), fromItem - (10 * reverse)]} // Last in row
        return [fromItem - (11 * reverse + correction), fromItem - (10 * reverse), fromItem - (9 * reverse - correction)]
    } else {
        if (fromItem >= 90) { return [] } // Off board
        if (fromItem % 10 === 0) {return [fromItem + (10 * reverse), fromItem + (11 * reverse + correction)]} // First in row
        if ((fromItem + (1 * reverse)) % 10 === 0) {return [fromItem + (9 * reverse - correction), fromItem + (10 * reverse)]} // Last in row
        return [fromItem + (9 * reverse - correction), fromItem + (10 * reverse), fromItem + (11 * reverse + correction)]
    }
};

export const checkSideCell = (item: BoardCell, boardConfig: BoardCell[], side: string) => {
    const fromItem = parseInt(item.id);
    const opponent: {[key: string]: string} = {'w': 'b', 'b': 'w'};
    const cellSide: {[key: string]: number} = {left: -1, right: +1};
    const sideItem = fromItem + cellSide[side];

    return boardConfig[sideItem].value === opponent[item.value] ? [sideItem] : []
};

export const getOccupiedSideCells = (item: BoardCell, boardConfig: BoardCell[]) => {
    const fromItem = parseInt(item.id);
    const allowedCells: number[] = [];

    // Check board edges
    if (fromItem % 10 === 0){
        // Check if right adj is occupied by enemy
        const rightItem = checkSideCell(item, boardConfig, 'right');
        return [...allowedCells, ...rightItem]
    } else if ((fromItem + 1) % 10 === 0) {
        // Check if left adj is occupied by enemy
        const leftItem = checkSideCell(item, boardConfig, 'left');
        return [...allowedCells, ...leftItem]
    } else {
        // Not edge, check right and left
        const rightItem = checkSideCell(item, boardConfig, 'right');
        const leftItem = checkSideCell(item, boardConfig, 'left');
        return [...allowedCells, ...rightItem, ...leftItem]
    }
};

export const getOccupiedStepCells = (
    item: BoardCell, 
    boardConfig: BoardCell[], 
    backwards: boolean = false,
    double: boolean = false,
    byOpponent: boolean = false
) => {
    const opponent: {[key: string]: string} = {'w': 'b', 'b': 'w'};
    const occupiedStepCells = getStepCells(item, backwards, double).filter(stepCell => {
        if (byOpponent){
            if (boardConfig[stepCell].value === opponent[item.value]){
                return stepCell
            }
        } else {
            if (boardConfig[stepCell].value !== 'none'){
                return stepCell
            }
        }}
    );

    return occupiedStepCells
};

export const getRetreatCells = (item: BoardCell, boardConfig: BoardCell[]) => {
    const fromItem = parseInt(item.id);
    const occupiedStepCellsByOpponent = getOccupiedStepCells(item, boardConfig, false, false, true);
    const occupiedSideCellsByOpponent = getOccupiedSideCells(item, boardConfig);
    const occupiedAdjCellsByOpponent = [...occupiedStepCellsByOpponent, ...occupiedSideCellsByOpponent];

    // Check if it is adjacent to an enemy soldier
    if (occupiedAdjCellsByOpponent.length > 0) {
        // Target and intermediate spots are empty
        const retreatCandidates = getStepCells(item, true, true);
        const stepBackCells = getStepCells(item, true, false);
        const freeMapping = stepBackCells.sort().map(cell => boardConfig[cell].value !== 'none' ? false : true);

        return retreatCandidates.filter((cell, index) => freeMapping[index])
    } else {
        return []
    }
};

export const isCannon = (item: BoardCell, boardConfig: BoardCell[]) => {
    /*
        Cannon types: 
            1. \    2. |    3.  /   4. --
                \      |       /
    */
    const cannonTypeOffsets: {[key: string]: number[]} = {1: [-11, 11], 
                                                            2: [-10, 10], 
                                                            3: [-9, 9],
                                                            4: [-1, 1]};
    // Check all four line options
    const typesFound = Object.keys(cannonTypeOffsets).forEach(ctype => {
        const fromItem = parseInt(item.id);
        const [ofst1, ofst2] = cannonTypeOffsets[ctype];
        if (boardConfig[fromItem + ofst1].value !== 'none' 
                && 
            boardConfig[fromItem + ofst2].value !== 'none' ) {
                return ctype
        }
    });



};

export const getCannonShootCells = (item: BoardCell, boardConfig: BoardCell[]) => {
    // Check if it's a cannon, otherwise, return empty


};

export const allowedMoves = (item: any, boardConfig: any, tType: any) => {

    let allowedMoves: number[] = [];

    if (tType === TurnType.PLACEMENT_P1){

        return Array.from(Array(100).keys()).slice(90, 100)

    } else if (tType === TurnType.PLACEMENT_P2){

        return Array.from(Array(100).keys()).slice(0, 10)

    } else if (tType === TurnType.START_GAME) {

        return allowedMoves;

    } else {

        // A soldier may move one step forward or diagonally forward to an adjacent empty point
        allowedMoves.push(...getStepCells(item));
        
        // A soldier may capture an enemy piece (a soldier or the Town) standing on an adjacent 
        // point by moving one step sideways, forward or diagonally forward:
        allowedMoves.push(...getOccupiedSideCells(item, boardConfig));
        
        // A soldier can retreat two points backwards or diagonally backwards if it is adjacent 
        // to an enemy soldier and if the target and intermediate spots are empty:
        allowedMoves.push(...getRetreatCells(item, boardConfig));
        
        // Cannon shoot
        // allowedMoves.push(...getCannonShootCells(item, boardConfig));
        
        return allowedMoves
    }
};
