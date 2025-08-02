import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/main.jsx', // Entry point of your application
  output: {
    file: 'dist/bundle.js', // Output file
    format: 'iife', // Immediately Invoked Function Expression format for browser
    sourcemap: true, // Enable source maps
  },
  plugins: [
    resolve(), // Resolves node modules
    commonjs(), // Converts CommonJS modules to ES6
    terser(), // Minifies the bundle
  ],
};