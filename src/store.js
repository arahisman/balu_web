import { applyMiddleware, createStore, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./redux/reducers/rootReducer";
import loggerMiddleware from "./redux/middleware/logger";
import monitorReducerEnhancer from "./redux/enhancers/monitorReducer";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
const persistConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewareEnhancer = applyMiddleware(loggerMiddleware, thunkMiddleware);
const composedEnhancers = compose(middlewareEnhancer, monitorReducerEnhancer);

export const store = createStore(
  persistedReducer,
  undefined,
  composedEnhancers
);

export default store;
export const persistor = persistStore(store);
