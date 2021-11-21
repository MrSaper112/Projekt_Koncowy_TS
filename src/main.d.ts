declare module '*.jpg';
declare module "*.png"
declare module '*.txt' {
    const content: any;
    export default content;
}