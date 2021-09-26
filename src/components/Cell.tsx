import React from 'react';
import { Piece, PieceType } from './Piece';
import {getCellColor} from '../gameUtils';
import pointSVG from '../assets/point.svg';
import {useActions} from '../hooks/use-actions';
import {useDrag, useDrop, DragPreviewImage} from 'react-dnd';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { TurnType } from '../state/reducers/gameReducer';


type CellProps = {
    id: string;
    content: string;
    position?: string;
    cname?: string;
};

export const Cell = (props: CellProps) => {

    const {moveCell, deSelectCell, placeTower} = useActions();

    const {isDragging, boardConfig, allowedPositions, turnType} = useTypedSelector(({game: {board: {isDragging, boardConfig, allowedPositions}, turnType}}) => {
        return {isDragging, boardConfig, allowedPositions, turnType}
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
            if (!item.id){
                placeTower(item, props.id);
                deSelectCell();
                return
            }
            
            moveCell(item.id, props.id, item.value);
            deSelectCell();
        }
    });

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
                        <Piece id={props.id} 
                                value={props.content.replace('t', '')} 
                                isDraggable={(turnType.includes('p1') && props.content === 'w') 
                                                || (turnType.includes('p2') && props.content === 'b')}
                                type={
                                    props.content.includes('t') ? PieceType.TOWER : PieceType.PAWN
                                }
                        /> : null
                }
                {
                    ( (props.cname === 'outerCell' || turnType.includes('placement')) 
                        && isDragging 
                        && allowedPositions.includes(parseInt(props.id)) 
                    ) ? 
                        <img className='point' src={pointSVG} alt='point'/> 
                        : null
                }
                
        </div>
    )
};  