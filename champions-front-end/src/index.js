import React, { Component } from 'react';
import ReactDOM from 'react-dom';
//import './scss/index.scss';
//import Login from './Login';
//import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import appReducer from './reducers'
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk'

import Routes from './routes/Routes'
// import registerServiceWorker from './registerServiceWorker';

import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import ru from 'react-intl/locale-data/ru';

addLocaleData(en);
addLocaleData(ru);

const logger = createLogger({
    predicate: (getState, action) => process.env.NODE_ENV === 'production' ? false : true
});

export var store = createStore(appReducer, {}, applyMiddleware(logger, thunk))

export default class DemoApp extends Component {
    render() {
        return (
            <Provider store={store}>
                <Routes />
            </Provider>
        )
    }
}

ReactDOM.render(
    <DemoApp />,
    document.getElementById('root'));
