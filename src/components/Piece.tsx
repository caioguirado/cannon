import React from 'react';
import {useDrag} from 'react-dnd';
import {useActions} from '../hooks/use-actions';
import whitePieceSVG from '../assets/whitePiece.svg';
import blackPieceSVG from '../assets/blackPiece.svg';

type PieceProps = {
    id: string;
    value: string;
};

export const Piece = (props: PieceProps) => {
    
    const {dragCell, deSelectCell} = useActions();

    const [collected, drag, dragPreview]: [any, any, any] = useDrag(() => ({
        type: 'piece',
        item: { id: props.id },
        collect: (monitor) => { 
            return {isDragging: monitor.isDragging()} 
        }
    }));

    const pieceType = props.value === 'w' ? whitePieceSVG : blackPieceSVG;

    const selectPiece = () => {
        dragCell();
    };

    const deSelectPiece = () => {
        deSelectCell();
    };

    return (
        <div 
            id={props.id}
            style={{opacity: collected.isDragging ? 0 : 1}}
            {...collected}
            className=''
            // onMouseDown={selectPiece}
            // onMouseUp={deSelectPiece}
            onDragStart={selectPiece}
        >                
                <img src={pieceType} ref={drag}  alt='piece'/>
        </div>
    )
};