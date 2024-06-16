import {combineReducers} from 'redux';
import {app} from './app';
import {usr} from './usr';
import {chats} from './chats';
import {groups} from './groups';

const LOG_OUT = 'LOG_OUT';

const appReducer = combineReducers({
    app,
    usr,
    chats,
    groups
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};
export default rootReducer;
