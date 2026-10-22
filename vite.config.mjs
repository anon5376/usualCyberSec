import {defineConfig} from 'vite';
export default defineConfig({build:{rolldownOptions:{onwarn(warning,defaultHandler){if(warning.code==='MODULE_LEVEL_DIRECTIVE')return;defaultHandler(warning);}}}});
