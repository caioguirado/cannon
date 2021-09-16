import {boardCells} from './boardCells';
import {boardConfig} from './boardConfig';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {store} from './state';
import {DndProvider} from 'react-dnd';
import {Board} from './components/Board';
import {Container} from './components/Container';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './App.scss';
import { GameArea } from './components/GameArea';

const App = () => {
    return  <Provider store={store}>
                <GameArea>
                    <Container>
                        <DndProvider backend={HTML5Backend}> 
                            <Board/>
                        </DndProvider>
                    </Container>
                </GameArea>
            </Provider>
}

ReactDOM.render(<App />, document.getElementById('root'));