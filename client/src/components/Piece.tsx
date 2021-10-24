import React from 'react';
import {useDrag} from 'react-dnd';
import {useActions} from '../hooks/use-actions';
import whitePieceSVG from '../assets/whitePiece.svg';
import blackPieceSVG from '../assets/blackPiece.svg';
import whiteTowerSVG from '../assets/whiteTower.svg';
import blackTowerSVG from '../assets/blackTower.svg';

export enum PieceType {
    PAWN = 'pawn',
    TOWER = 'tower'
};

type PieceProps = {
    id?: string;
    value: string;
    isDraggable: boolean;
    type?: PieceType;
};

export const Piece = (props: PieceProps) => {
    
    const {dragCell, deSelectCell} = useActions();

    const [collected, drag, dragPreview]: [any, any, any] = useDrag(() => ({
        type: 'piece',
        item: () => {return { ...props }},
        collect: (monitor) => { 
            return {isDragging: monitor.isDragging()} 
        }
    }));


    const getPieceType = ({value, type}: PieceProps) => {
        // console.log('getPiecetype', value, type);
        if (type === PieceType.TOWER){
            if (value === 'w'){
                return whiteTowerSVG;
            } else {
                return blackTowerSVG;
            }
        } else {
            if (value === 'w'){
                return whitePieceSVG;
            } else {
                return blackPieceSVG;
            }
        }
    };

    const selectPiece = (item: any) => {
        if (props.isDraggable) {dragCell(item)};
    };

    const deSelectPiece = () => {
        deSelectCell();
    };

    return (
        <div 
            id={props.id}
            style={{opacity: collected.isDragging ? 0 : 1}}
            // {...collected}
            className=''
            // onMouseDown={selectPiece}
            // onMouseUp={deSelectPiece}
            onDragStart={() => selectPiece(props)}
            data-val={props.value}
        >                
                <img src={getPieceType(props)} ref={props.isDraggable ? drag : null}  alt='piece'/>
        </div>
    )
};