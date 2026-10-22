declare module '*.mjs';
declare module '*.module.css' { const classes: Record<string,string>; export default classes; }
declare module '*.css';
declare module '*?worker&url' { const url: string; export default url; }
