import React from 'react';
import {useDrag} from 'react-dnd';
import whitePieceSVG from '../assets/whitePiece.svg';

type PieceProps = {
    id: string;
    value: string;
};

export const Piece = (props: PieceProps) => {
    
    const [collected, drag, dragPreview]: [any, any, any] = useDrag(() => ({
        type: 'piece',
        item: { id: props.id },
        collect: (monitor) => { return {isDragging: monitor.isDragging()} }
    }));

    // const img = require('../assets/piece.svg');

    return (
        <div 
            id={props.id}
            style={{opacity: collected.isDragging ? 0 : 1}}
            {...collected}
            className=''>                
                {/* {props.value} */}
                <img src={whitePieceSVG} ref={drag}  alt='piece'/>
        </div>
    )
};