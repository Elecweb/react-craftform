import config from './rollup.config.es6';
config.dest = "dest/cf_form.umd.js";
config.format = "umd";
config.moduleName = "react_craftform"
export default config;