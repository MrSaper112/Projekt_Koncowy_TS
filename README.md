# Simple Web Engine With Basic Shapes
## Installation
```
- download repo
npx webpack serve
- open http://localhost:8080/
```
## How to use
Creating new shapes is done by developing predefined Classes (Plane, Sphere, Camera, Cube). Each shape has to be connected to Material, witch can be either texture or color. If Material is not chosen, the Class assigns it by default. 
```
new Block(gl: WebGLRenderingContext, vector?: Vector3D, scale?: Vector3D, rotation?: Vector3D, material?: Materials)
new Camera(gl: WebGLRenderingContext, data: { fov?: number, aspect?: number, zNear?: number, zFar?: number, acceleration?: number, keys?: Keys, aroundSpeed?: number }, vector?: Vector3D, scale?: Vector3D, rotation?: Vector3D)
new Materials(gl:WebGLRenderingContext , args?: {color?: string, faces?: Array<Array<number>>, alpha?: number, texture?: string, normal?: boolean, repeatTexture?: boolean})
new Plane (gl: WebGLRenderingContext, info?: {vector?: Vector3D, scale?: Vector3D, rotation?: Vector3D}, dat?: { width: number, depth: number, widthSegments: number, depthSegments: number })
new Sphere (gl: WebGLRenderingContext, build: {radius: number, subdivisionsAxis: number, subdivisionsHeight: number}, vector?: Vector3D, scale?: Vector3D, rotation?: Vector3D, material?: Materials)
```
### For Example: 
![image](https://user-images.githubusercontent.com/49322534/152679790-92b3164c-405f-46b6-8065-daca56973adb.png)
![image](https://user-images.githubusercontent.com/49322534/152679797-9be32015-f71a-4db6-bd8e-6183f5efe300.png)
![image](https://user-images.githubusercontent.com/49322534/152679805-dfe141bc-1b0e-4c7f-8aba-ea640e160a57.png)
![image](https://user-images.githubusercontent.com/49322534/152679815-62af6e1c-95b0-431a-abf5-5d575c960382.png)
![image](https://user-images.githubusercontent.com/49322534/152679819-d9e3a8fa-3820-4056-b525-5f33486a9e54.png)
Where this._gl is canvas webgl context created in MainEngine. To use it, you need to extend the main class by  Main Engine.

### Rendering
To render each of our predefined classes, create a new function where the blocks will be called with .draw (this._program, this._camera) and then animate it with requestAnimationFrame(() => this.render(0))
For Example:
![image](https://user-images.githubusercontent.com/49322534/152680025-61c487db-28e8-4e24-a044-6c40bf59c944.png)
This block need to be as default 
```
    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
    this._gl.clearColor(0.0, 0.0, 0.0, 0);  // Clear to black, fully opaque
    this._gl.enable(this._gl.DEPTH_TEST);           // Enable depth testing
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    this._gl.enable(this._gl.CULL_FACE);
    
    this._camera.generateMatrixOfView()
```
calcutaeAndMove is a function which enables us to move around the map.
```
this._camera.calculateAndMove(deltaTime)
```
<!-- ![code](https://github.com/MrSaper112/Projekt_Koncowy_TS/blob/main/images/EasyCreatingShapes.png) -->

## Technologies
- TypeScript
- Webpack
- TypeDoc
