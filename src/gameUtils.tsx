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

export const allowedMoves = (item: any, boardConfig: any) => {

    let allowedMoves = [];

    // A soldier may move one step forward or diagonally forward to an adjacent empty point
    allowedMoves.push(...getStepCells(item));

    return allowedMoves
};
