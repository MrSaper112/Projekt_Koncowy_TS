declare module '*.jpg';
declare module "*.png"
declare module '*.txt' {
    const content: any;
    export default content;
}

declare module '*.svg';
declare module '*.glsl' {
    const value: string
    export default value
}