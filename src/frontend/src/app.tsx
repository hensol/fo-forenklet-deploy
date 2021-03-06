import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import getStore from './store';
import Routing from './routing';
import InitialDataLoader from './view/initial-data-loader';
import Header from './view/header';

const store = getStore();

function App() {
    return (
        <Provider store={store}>
            <InitialDataLoader fetchData={true} spinnerTeam={true}>
                <Header/>
                <section className="content__wrapper">
                    <InitialDataLoader spinnerDeploy={true}>
                        <BrowserRouter>
                            <Routing />
                        </BrowserRouter>
                    </InitialDataLoader>
                </section>
            </InitialDataLoader>
        </Provider>
    );
}

export default App;
