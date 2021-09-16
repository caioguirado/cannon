import React from 'react';
import { Piece } from './Piece';
import {getCellColor} from '../gameUtils';
import pointSVG from '../assets/point.svg';
import {useActions} from '../hooks/use-actions';
import {useDrag, useDrop, DragPreviewImage} from 'react-dnd';
import { useTypedSelector } from '../hooks/use-typed-selector';


type CellProps = {
    id: string;
    content: string;
    position?: string;
    cname?: string;
};

export const Cell = (props: CellProps) => {

    const {moveCell, deSelectCell} = useActions();

    const {isDragging} = useTypedSelector(({board: {isDragging}}) => {
        return {isDragging}
    });

    const [collectedProps, drop] = useDrop({
        accept: 'piece',
        drop: (item: any) => {
            console.log(item, props);
            
            // Check if move is allowed

            // If so change board state
            
            moveCell(item.id, props.id, item.value);
            deSelectCell();
        }
    });

    const color = '#f9dfa4';
    return (
        <div 
            className={props.cname ? props.cname : 'cell' }
            ref={drop} 
            style={{backgroundColor: color}}>

                {/* <DragPreviewImage connect={dragPreview} src={img.default}/> */}
                {/* <div id={props.id} style={{opacity: collected.isDragging ? 0 : 1}} ref={drag} {...collected} className=''>{props.piece}</div> */}
                {
                    props.content !== 'none' ?
                        <Piece id={props.id} value={props.content}/> : null
                }
                {
                    props.cname === 'outerCell' && isDragging ? 
                        <img className='point' src={pointSVG} alt='point'/> : null
                }
                
        </div>
    )
};  