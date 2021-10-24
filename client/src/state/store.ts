import thunk from 'redux-thunk';
import { boardCells } from '../boardCells';
import { ActionType } from './action-types';
import {createStore, applyMiddleware} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers';

export const store = createStore(reducers, {}, composeWithDevTools(applyMiddleware(thunk)));