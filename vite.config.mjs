import {defineConfig} from 'vite';
export default defineConfig({worker:{format:'es'},build:{assetsInlineLimit:0,rolldownOptions:{onwarn(warning,defaultHandler){if(warning.code==='MODULE_LEVEL_DIRECTIVE')return;defaultHandler(warning);}}}});
