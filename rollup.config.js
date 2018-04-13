
import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';

export default {
  input: './src/index.ts',
  output: {
    name: 'redux-ui-state',
    file: 'dist/redux-ui-state.min.js',
    format: 'umd',
    exports: 'named',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'redux': 'Redux',
      'react-redux': 'ReactRedux',
      'reselect': 'Reselect'
    },
  },
  external: ['react', 'react-dom', 'redux', 'react-redux', 'reselect'],
  plugins: [
    typescript(),
    uglify()
  ],
};
