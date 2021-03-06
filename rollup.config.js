import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';

export default {
  entry: 'src/main.js',
  format: 'umd',
  moduleName: 'UcarWheel',
  plugins: [
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    filesize()
  ],
  dest: 'dist/index.js'
};