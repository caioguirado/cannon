import { combineReducers } from "redux";
import gameReducer from './gameReducer';

const reducers = combineReducers({
    game: gameReducer
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;