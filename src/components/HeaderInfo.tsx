import {useActions} from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';
import whiteTowerSVG from '../assets/whiteTower.svg';
import blackTowerSVG from '../assets/blackTower.svg';
import { Piece, PieceType } from './Piece';
import { TurnType } from '../state/reducers/gameReducer';

export const HeaderInfo = () => {
    const {turnType} = useTypedSelector(({game: {turnType}}) => {
        return {turnType}
    });

    const {startGame} = useActions();

    const towerPieces = (turnType: TurnType) => {
        if (turnType === TurnType.START_GAME || turnType === TurnType.PLACEMENT_P1){
            return (<>
                    <Piece value='w' isDraggable={true} type={PieceType.TOWER}/>
                    <Piece value='b' isDraggable={true} type={PieceType.TOWER}/>
                    </>)
        } else if (turnType === TurnType.PLACEMENT_P2) {
            return <Piece value='b' isDraggable={true} type={PieceType.TOWER}/>
        } else { 
            return null 
        }
    };

    return <div className='headerInfo'>{turnType} 
                <button onClick={startGame}>Start</button> 
                {
                    towerPieces(turnType)
                }

            </div>
};