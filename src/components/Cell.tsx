import React from 'react';
import { Piece, PieceType } from './Piece';
import {getCellColor} from '../gameUtils';
import pointSVG from '../assets/point.svg';
import redPointSVG from '../assets/shotPoint.svg'
import {useActions} from '../hooks/use-actions';
import {useDrag, useDrop, DragPreviewImage} from 'react-dnd';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { TurnType } from '../state/reducers/gameReducer';
import {store} from '../state/store'

type CellProps = {
    id: string;
    content: string;
    position?: string;
    cname?: string;
};

export const Cell = (props: CellProps) => {

    const {moveCell, deSelectCell, placeTower, shootCell, AIMakeMove} = useActions();

    const {isDragging, allowedPositions, allowedShots, turnType} = useTypedSelector(({game: {board: {isDragging, allowedPositions, allowedShots}, turnType}}) => {
        return {isDragging, allowedPositions, allowedShots, turnType}
    });

    let state: any;
    store.subscribe(() => {
        state = store.getState();
    });
    

    const AI = () => {
        const formattedBoard = state.game.board.boardConfig.map((item: any) => item.value);
        AIMakeMove(formattedBoard, state.game.turnType);
    }

    const [collectedProps, drop] = useDrop({
        accept: 'piece',
        drop: (item: any) => {
            console.log(item, props);
            
            const toCell = parseInt(props.id);

            // Check if move is allowed
            // If so change board state
            if (!allowedPositions.includes(toCell)){
                deSelectCell();
                return
            }

            // Tower placement phase
            if (!item.id){
                placeTower(item, props.id);
                deSelectCell();
                // AI();
                return
            }
            
            // Check if move is shooting or normal move
            if (allowedShots.includes(toCell)){
                shootCell(toCell);
                deSelectCell();
            } else {
                moveCell(item.id, props.id, item.value);
                deSelectCell();
            }

            // AI();
        }
    });

    const getPointCell = (props: any, turnType: any, isDragging: any, allowedPositions: any, allowedShots: any) => {
        if (isDragging && allowedShots.includes(parseInt(props.id))){

            return <img className='point' src={redPointSVG} alt='point'/> 

        } else if ( (props.cname === 'outerCell' || turnType.includes('placement')) 
                        && isDragging 
                        && allowedPositions.includes(parseInt(props.id)) 
                    ){
            
            return <img className='point' src={pointSVG} alt='point'/> 
        } else {
            return null
        }
    };

    const color = '#f9dfa4';
    return (
        <div 
            className={props.cname ? props.cname : 'cell'}
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
                    getPointCell(props, turnType, isDragging, allowedPositions, allowedShots)
                }
                
        </div>
    )
};  