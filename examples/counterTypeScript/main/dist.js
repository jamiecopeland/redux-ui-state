// import * as React from 'react';
// import { connect } from 'react-redux';
// import * as React from 'react';
// import { compose } from 'redux';
// import rootReducer from './reducers/index';
// import CounterAutoConnect from './components/CounterAutoConnect';
// import CounterUtilConnect from './components/CounterUtilConnect';
// import CounterManualConnect from './components/CounterManualConnect';
// const store = createStore(rootReducer, {}, applyMiddleware(createLogger({ collapsed: true })));
// const rootEl = document.getElementById('root');
// function render() {
//   ReactDOM.render(
//     <Provider store={store}>
//       <div>
//         <h1>Connect automatically</h1>
//         <CounterAutoConnect />
//         <h1>Connect using utility</h1>
//         <CounterUtilConnect />
//         <h1>Connect manually</h1>
//         <CounterManualConnect />
//       </div>
//     </Provider>,
//     rootEl
//   );
// }
// render();
// store.subscribe(render);
const path = require('path');
const webpack = require('webpack');
module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        './src/index.tsx',
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/',
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loaders: ['ts-loader'],
                exclude: /node_modules/,
                include: __dirname,
            },
        ],
    },
};
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config');
const app = new (require('express'))();
const port = 3000;
const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));
app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`));
app.listen(port, error => {
    if (error) {
        console.error(error);
    }
    else {
        console.log(`Server running at:\n\nhttp://localhost:${port}\n`);
    }
});
//# sourceMappingURL=dist.js.map