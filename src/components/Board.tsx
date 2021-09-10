import React from 'react';
import {Cell} from './Cell';
import {Piece} from './Piece';
import {useDrop} from 'react-dnd';
import {indexToNotation} from '../gameUtils';
import {LateralMarks} from './LateralMarks';

type BoardProps = {
    nCells: number;
    pieces: React.ComponentProps<typeof Piece>[];
    boardCells: React.ComponentProps<typeof Piece>[];
};

export const Board = (props: BoardProps) => {
    return (
            <div id='outerBoard' className='outerBoard'>
                <LateralMarks/>
                <div id='board' className='board'>
                    {
                        props.boardCells.map((piece, index) => {
                            return <Cell 
                                        id={index.toString()} 
                                        key={index} 
                                        // content={piece.value}
                                        content='none'
                                        position={indexToNotation(index)}
                                    />
                        })
                    }
                </div>
                <div className="pieceBoard">
                {
                        props.pieces.map((piece, index) => {
                            return <Cell 
                                        id={index.toString()} 
                                        cname='outerCell'
                                        key={index} 
                                        content={piece.value}
                                        // content='none'
                                        position={indexToNotation(index)}
                                    />
                        })
                    }
                </div>
                
            </div>
            )
};