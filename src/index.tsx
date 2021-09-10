import {boardCells} from './boardCells';
import {boardConfig} from './boardConfig';
import ReactDOM from 'react-dom';
import {DndProvider} from 'react-dnd';
import {Board} from './components/Board';
import {Container} from './components/Container';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './App.scss';
import { GameArea } from './components/GameArea';

const App = () => {
    return  <GameArea>
                <Container>
                    <DndProvider backend={HTML5Backend}> 
                        <Board nCells={20} pieces={boardConfig} boardCells={boardCells}/>
                    </DndProvider>
                </Container>
            </GameArea>
}

ReactDOM.render(<App />, document.getElementById('root'));