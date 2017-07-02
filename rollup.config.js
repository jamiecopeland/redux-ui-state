
import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: './src/index.ts',
  moduleName: 'redux-ui-state',
  targets: [{ dest: 'dist/redux-ui-state.min.js', format: 'umd' }],
  plugins: [
    typescript(),
    uglify()
  ],
  exports: 'named',
  external: ['react', 'react-dom', 'redux', 'react-redux', 'reselect'],
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'redux': 'Redux',
    'react-redux': 'ReactRedux',
    'reselect': 'Reselect'
  },
};