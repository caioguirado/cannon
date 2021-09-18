import { BoardCell } from "./boardCells";

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

export const getStepCells = (item: any) => {
    const fromItem = parseInt(item.id);
    if (item.value === 'w'){
        if (fromItem % 10 === 0) {return [fromItem - 10, fromItem - 9]} // First in row
        if ((fromItem + 1) % 10 === 0) {return [fromItem - 11, fromItem - 10]} // Last in row
        return [fromItem - 11, fromItem - 10, fromItem - 9]
    } else {
        if (fromItem % 10 === 0) {return [fromItem + 10, fromItem + 11]} // First in row
        if ((fromItem + 1) % 10 === 0) {return [fromItem + 9, fromItem + 10]} // Last in row
        return [fromItem + 9, fromItem + 10, fromItem + 11]
    }
};

export const checkSideCell = (item: BoardCell, boardConfig: BoardCell[], side: string) => {
    const fromItem = parseInt(item.id);
    const opponent: {[key: string]: string} = {'w': 'b', 'b': 'w'};
    const cellSide: {[key: string]: number} = {left: -1, right: +1};
    const sideItem = fromItem + cellSide[side];
    console.log(boardConfig, sideItem)
    return boardConfig[sideItem].value === opponent[item.value] ? [sideItem] : []
};

export const getOccupiedAdjCells = (item: BoardCell, boardConfig: BoardCell[]) => {
    const fromItem = parseInt(item.id);
    const allowedCells: number[] = [];

    // Check board edges
    if (fromItem % 10 === 0){
        // Check if right adj is occupied by enemy
        const rightItem = checkSideCell(item, boardConfig, 'right');
        return [...allowedCells, ...rightItem]
    } else if ((fromItem + 1) % 10 === 0) {
        // Check if left adj is occupied by enemy
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

export const allowedMoves = (item: any, boardConfig: any) => {

    let allowedMoves = [];

    // A soldier may move one step forward or diagonally forward to an adjacent empty point
    allowedMoves.push(...getStepCells(item));
    
    // A soldier may capture an enemy piece (a soldier or the Town) standing on an adjacent 
    // point by moving one step sideways, forward or diagonally forward:
    allowedMoves.push(...getOccupiedAdjCells(item, boardConfig));

    return allowedMoves
};
