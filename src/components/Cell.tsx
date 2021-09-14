import React from 'react';
import { Piece } from './Piece';
import {getCellColor} from '../gameUtils';
import {useDrag, useDrop, DragPreviewImage} from 'react-dnd';


type CellProps = {
    id: string;
    content: string;
    position?: string;
    cname?: string;
};

export const Cell = (props: CellProps) => {


    const [collectedProps, drop] = useDrop({
        accept: 'piece',
        drop: (item: any) => console.log(item, props.position) // execute move
    });

    // const color = getCellColor(parseInt(props.id));
    const color = '#f9dfa4';
    console.log(props.cname);
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
        </div>
    )
};  