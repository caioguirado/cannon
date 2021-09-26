import {useActions} from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';
import whiteTowerSVG from '../assets/whiteTower.svg';
import blackTowerSVG from '../assets/blackTower.svg';
import { Piece, PieceType } from './Piece';

export const HeaderInfo = () => {
    const {turnType} = useTypedSelector(({game: {turnType}}) => {
        return {turnType}
    });
    const {startGame} = useActions();

    return <div className='headerInfo'>{turnType} 
                <button onClick={startGame}>Start</button> 
                <Piece value='w' isDraggable={true} type={PieceType.TOWER}/>
                <Piece value='b' isDraggable={true} type={PieceType.TOWER}/>
                {/* <img src={whiteTowerSVG} alt="whiteTower" />
                <img src={blackTowerSVG} alt="blackTower" /> */}
            </div>
};