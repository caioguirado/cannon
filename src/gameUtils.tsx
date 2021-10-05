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

export const getBoardValue = (id: number, boardConfig: BoardCell[]) => {
    if (id > 99 || id < 0) {
        return -1
    } else {
        return boardConfig[id].value
    }
};

export const isCellOpponent = (item: BoardCell, toCell: number, boardConfig: BoardCell[]) => {
    const opponent: {[key: string]: string[]} = {'w': ['b', 'tb'], 'b': ['w', 'tw']};
    const toCellValue = boardConfig[toCell].value;
    return opponent[item.value].includes(toCellValue);
};

export const checkStepMove = (positions: number[], boardConfig: BoardCell[], itemMoving: BoardCell) => {
    return positions.filter((position, index) => getBoardValue(position, boardConfig) !== itemMoving.value)
};

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
        if ((fromItem + 1) % 10 === 0) {return [fromItem + (9 * reverse - correction), fromItem + (10 * reverse)]} // Last in row
        return [fromItem + (9 * reverse - correction), fromItem + (10 * reverse), fromItem + (11 * reverse + correction)]
    }
};

export const getAllowedStepCells = (item: BoardCell, boardConfig: BoardCell[]) => {
    const stepCells = getStepCells(item);
    const allowedMoves = checkStepMove(stepCells, boardConfig, item);

    return allowedMoves
};

export const checkSideCell = (item: BoardCell, boardConfig: BoardCell[], side: string) => {
    const fromItem = parseInt(item.id);
    const opponent: {[key: string]: string} = {'w': 'b', 'b': 'w'};
    const cellSide: {[key: string]: number} = {left: -1, right: +1};
    const sideItem = fromItem + cellSide[side];

    return isCellOpponent(item, sideItem, boardConfig) ? [sideItem] : []
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
            if (isCellOpponent(item, stepCell, boardConfig)){
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
        const freeMapping = stepBackCells.sort().map(cell => {
            if (boardConfig[cell].value !== 'none' || cell % 10 === 0 || cell % 9 === 0){
                return false
            } else {
                return true
            }
        });

        return retreatCandidates.filter((cell, index) => freeMapping[index] && boardConfig[cell].value !== item.value)
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
    const cannonTypeOffsets: {[key: string]: number} = {1: 11, 
                                                            2: 10, 
                                                            3: 9,
                                                            4: 1}; // offsets
    // Check all four line options
    const typesFound = Object.keys(cannonTypeOffsets).filter(ctype => {
        const fromItem = parseInt(item.id);
        const ofst = cannonTypeOffsets[ctype];
        if (boardConfig[fromItem + ofst].value === item.value
                && 
            boardConfig[fromItem - ofst].value === item.value) {
                return ctype
        }
    });

    return typesFound.length > 0 ? typesFound : null
};

export const calculateSide = (fromItem: number, newPosition: number) => {
    const delta = (newPosition % 10) - (fromItem % 10);
    const side = delta === 0 ? 'center' : (delta > 0 ? 'right' : 'left');

    return side
};

export const filterOffsetPositions = (positions: number[], 
                                        diagMap: {[key: string]: string}, 
                                        coordinateRef: string[],
                                        fromItem: number
) => {
    const allowedPositions = positions.filter((position, index) => {
        const vertical = coordinateRef[index];
        const horizontal = calculateSide(fromItem, position);
        const correct = diagMap[vertical];
        
        return correct === horizontal && position >=0 && position < 100
    });

    return allowedPositions
};

export const validateOffset = (item: BoardCell, ofst: number, ctype: string, boardConfig: BoardCell[]) => {

    const opponent: {[key: string] : string} = {w: 'b', b: 'w'};
    const fromItem = parseInt(item.id);
    // const newPositions = [fromItem + ofst * -3, fromItem + ofst * -4,  fromItem + ofst * 3, fromItem + ofst * 4];
    const newPositions = [];
    if (!isCellOpponent(item, fromItem + ofst * -2, boardConfig)) {newPositions.push(...[fromItem + ofst * -3, fromItem + ofst * -4])}
    if (!isCellOpponent(item, fromItem + ofst * 2, boardConfig)) {newPositions.push(...[fromItem + ofst * 3, fromItem + ofst * 4])}
    // const coordinateRef = ['top', 'top', 'bottom', 'bottom'];
    const coordinateRef = newPositions.map(n => n < fromItem ? 'top' : 'bottom');
    let diagMap: {[key: string]: string};

    if (ctype === '1'){
        diagMap = {bottom: 'right', top: 'left'};
        const allowedPositions = filterOffsetPositions(newPositions, diagMap, coordinateRef, fromItem);

        return allowedPositions

    } else if (ctype === '2'){
        const allowedPositions = newPositions.filter(position => position >= 0 && position <= 99);

        return allowedPositions

    } else if (ctype === '3'){
        diagMap = {bottom: 'left', top: 'right'};
        const allowedPositions = filterOffsetPositions(newPositions, diagMap, coordinateRef, fromItem);

        return allowedPositions

    } else {
        const itemRow = Math.floor(fromItem / 10);
        const allowedPositions = newPositions.filter(position => {
            const positionRow = Math.floor(position / 10);

            return positionRow === itemRow
        });

        return allowedPositions
    }
};

export const getCannonShootCells = (item: BoardCell, boardConfig: BoardCell[], tType: any) => {
    
    if ([TurnType.PLACEMENT_P1, TurnType.PLACEMENT_P2, TurnType.START_GAME].includes(tType)) {return []}

    /*
        Cannon types: 
            1. \    2. |    3.  /   4. --
                \      |       /
    */
    const cannonTypeOffsets: {[key: string]: number} = {1: 11, 
                                                        2: 10, 
                                                        3: 9,
                                                        4: 1}; // offsets

    const opponent: {[key: string]: string} = {'w': 'b', 'b': 'w'};

    // Check if it's a cannon, otherwise, return empty
    const typesFound = isCannon(item, boardConfig);
    if (typesFound){
        let allowedMoves: number[] = [];
        typesFound.forEach(ctype => {
            const ofst = cannonTypeOffsets[ctype];

            allowedMoves.push(...validateOffset(item, ofst, ctype, boardConfig));
        });

        allowedMoves = allowedMoves.filter(position => isCellOpponent(item, position, boardConfig));

        return allowedMoves;
    } else {
        return []
    }
};

export const getCannonMoveCells = (item: BoardCell, boardConfig: BoardCell[]) => {
    // Check if item is cannon edge
    const allowedMoves: number[] = [];
    const cannonEdgeOffsets: {[key: string]: number} = {1: 11, 
                                                        2: 10, 
                                                        3: 9,
                                                        4: 1}; // offsets

    const typesFound = Object.keys(cannonEdgeOffsets).forEach(ctype => {
        const fromItem = parseInt(item.id);
        const ofst = cannonEdgeOffsets[ctype];
        if (getBoardValue(fromItem + ofst * -1, boardConfig) === item.value
                && 
            getBoardValue(fromItem + ofst * -2, boardConfig) === item.value) {

                const movePosition = boardConfig[fromItem + ofst * -3].value === 'none' ? [fromItem + ofst * -3] : [];
                allowedMoves.push(...movePosition);
        } 

        // TODO check if a 3+ size cannon can be splitted

        if (getBoardValue(fromItem + ofst * 1, boardConfig) === item.value
                && 
            getBoardValue(fromItem + ofst * 2, boardConfig) === item.value){

                const movePosition = boardConfig[fromItem + ofst * 3].value === 'none' ? [fromItem + ofst * 3] : [];
                allowedMoves.push(...movePosition);

        }
    });

    return allowedMoves
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
        // allowedMoves.push(...getStepCells(item));
        allowedMoves.push(...getAllowedStepCells(item, boardConfig));
        
        // A soldier may capture an enemy piece (a soldier or the Town) standing on an adjacent 
        // point by moving one step sideways, forward or diagonally forward:
        allowedMoves.push(...getOccupiedSideCells(item, boardConfig));
        
        // A soldier can retreat two points backwards or diagonally backwards if it is adjacent 
        // to an enemy soldier and if the target and intermediate spots are empty:
        allowedMoves.push(...getRetreatCells(item, boardConfig));
        
        // Cannon shoot
        allowedMoves.push(...getCannonShootCells(item, boardConfig, tType));
        
        // Cannon move
        allowedMoves.push(...getCannonMoveCells(item, boardConfig));

        return allowedMoves
    }
};
