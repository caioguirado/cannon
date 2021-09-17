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

    const {isDragging, boardConfig, allowedPositions} = useTypedSelector(({board: {isDragging, boardConfig, allowedPositions}}) => {
        return {isDragging, boardConfig, allowedPositions}
    });

    const [collectedProps, drop] = useDrop({
        accept: 'piece',
        drop: (item: any) => {
            console.log(item, props);
            
            // Check if move is allowed
            // const isMoveAllowed = checkMove(item, props, boardConfig);
            if (!allowedPositions.includes(parseInt(props.id))){
                return
            }
            // If so change board state
            
            moveCell(item.id, props.id, item.value);
            deSelectCell();
        }
    });
    // console.log(parseInt(props.id), allowedPositions, parseInt(props.id) in allowedPositions);
    const color = '#f9dfa4';
    return (
        <div 
            className={props.cname ? props.cname : 'cell' }
            ref={drop}
            style={{backgroundColor: color}}
            data-val={props.content}
        >
                {
                    props.content !== 'none' ?
                        <Piece id={props.id} value={props.content}/> : null
                }
                {
                    props.cname === 'outerCell' && isDragging && allowedPositions.includes(parseInt(props.id)) ? 
                        <img className='point' src={pointSVG} alt='point'/> : null
                }
                
        </div>
    )
};  