import { Route, Switch } from 'react-router-dom';
import React from 'react';

import Navbar from './components/Navbar';
import NoMatch from './pages/NoMatch';
import routes from './routes';
import NormalizeStyle from './components/NormalizeStyle';

const App = () => (
    <div>
        <NormalizeStyle />
        <Navbar />
        <Switch>
            {routes.map(({ path, exact, component: C, ...rest }) => (
                <Route key={path}
                    path={path}
                    exact={exact}
                    render={props => <C {...props} {...rest} />}
                />
            ))}
            <Route render={props => <NoMatch {...props} />} />
        </Switch>
    </div>
);

export default App;