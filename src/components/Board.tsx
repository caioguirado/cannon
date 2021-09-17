import React from 'react';
import {Cell} from './Cell';
import {Piece} from './Piece';
import {useDrop} from 'react-dnd';
import { RootState } from '../state';
import {useSelector} from 'react-redux';
import {BoardCell} from '../boardCells';
import {indexToNotation} from '../gameUtils';
import {LateralMarks} from './LateralMarks';
import { useTypedSelector } from '../hooks/use-typed-selector';


export const Board = () => {

    const {boardConfig, boardCells} = useTypedSelector(({board: {boardConfig, boardCells}}) => {
        return {boardConfig, boardCells}
    });

    return (
            <div id='outerBoard' className='outerBoard'>
                <LateralMarks/>
                <div id='board' className='board'>
                    {
                        boardCells.map((piece: any, index: any) => {
                            return <Cell 
                                        id={index.toString()} 
                                        key={index}
                                        content='none'
                                        position={indexToNotation(index)}
                                    />
                        })
                    }
                </div>
                <div className="pieceBoard">
                {
                        boardConfig.map((piece: any, index: any) => {
                            return <Cell 
                                        id={index.toString()} 
                                        cname='outerCell'
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