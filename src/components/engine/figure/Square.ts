import { PositionManager, vector3D } from "../addons/positionManager";

export default class Square extends PositionManager {
    public _positionFloat32Array: Float32Array;
    private _position: vector3D;
    constructor(position: vector3D) {
        super()
        if (position.x && position.y && position.z) {
            this._position = position
            let [x, y, z, width] = [this._position.x, this._position.y, this._position.z, this._position.width]
            this._positionFloat32Array = new Float32Array([
                //Front
                // X, Y, Z
                x, y, z,
                x, y + width, z,
                x + width, y, z,

                x, y + width, z,
                x + width, y + width, z,
                x + width, y, z,

                //Back
                x, y, z + width,
                x, y + width, z + width,
                x + width, y, z + width,

                x, y + width, z + width,
                x + width, y + width, z + width,
                x + width, y, z + width,


                //Left
                x, y, z,
                x, y, z + width,
                x, y + width, z + width,

                x, y, z,
                x, y + width, z + width,
                x, y + width, z,

                //Right
                x + width, y, z,
                x + width, y, z + width,
                x + width, y + width, z + width,

                x + width, y, z,
                x + width, y + width, z + width,
                x + width, y + width, z,

                //Bottom
                x, y + width, z,
                x, y + width, z + width,
                x + width, y + width, z + width,
                x, y + width, z,
                x + width, y + width, z + width,
                x + width, y + width, z,

                //Top 
                x, y, z,
                x, y, z + width,
                x + width, y, z + width,
                x, y, z,
                x + width, y, z + width,
                x + width, y, z,
            ])
        }
    }   
    
    renderMe(){

    }
}
