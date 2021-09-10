import React from 'react';
import {Cell} from './Cell';
import {Piece} from './Piece';
import {useDrop} from 'react-dnd';
import {indexToNotation} from '../gameUtils';
import {LateralMarks} from './LateralMarks';

type BoardProps = {
    nCells: number;
    pieces: React.ComponentProps<typeof Piece>[];
};

export const Board = (props: BoardProps) => {
    return (
            <div id='outerBoard' className='outerBoard'>
                <LateralMarks/>
                <div id='board' className='board'>
                    {
                        props.pieces.map((piece, index) => {
                            return <Cell 
                                        id={index.toString()} 
                                        key={index} 
                                        content={piece.value}
                                        position={indexToNotation(index)}
                                    />
                        })
                    }
                </div>
                
            </div>
            )
};