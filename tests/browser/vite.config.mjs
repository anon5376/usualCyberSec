import {defineConfig,mergeConfig} from 'vite';
import {resolve} from 'node:path';
import baseConfig from '../../vite.config.mjs';

export default mergeConfig(baseConfig,defineConfig({build:{outDir:'releases/c2pa-probe',rolldownOptions:{input:{app:resolve(import.meta.dirname,'../../index.html'),c2paProbe:resolve(import.meta.dirname,'c2pa-probe.html')}}}}));
