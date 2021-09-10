export const indexToXY = (index: number): {x: number, y: number} => {
    let x = index % 8;
    let y = Math.abs(Math.floor(index / 8) - 7);
    return {x, y}
};

export const isWhite = (index: number): boolean => {
    const {x, y} = indexToXY(index);
    return (x + y) % 2 === 0;
};

export const indexToNotation = (index: number): string => {
    const {x, y} = indexToXY(index);
    const row = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x]
    return `${row}${y + 1}`
};

export const getCellColor = (index: number) => {
    const {x, y} = indexToXY(index);
    return (x + y) % 2 === 1 ? 'black' : 'white'
};
