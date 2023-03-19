import { Vector3D } from "./Figure";
import Matrix4D from "./Matrix4D";


export class FigureExtender {
    public _vector?: Vector3D;
    private _scale?: Vector3D;
    private _rotationInDeg?: Vector3D;
    public _matrix4D?: Matrix4D
    public _modelMatrix?: Array<number>
    constructor() {
        this._vector = { x: 0, y: 0, z: 0 }
        this._scale = { x: 1, y: 1, z: 1 }
        this._rotationInDeg = { x: 0, y: 0, z: 0 }
        this._matrix4D = new Matrix4D();
        this._modelMatrix = this._matrix4D.generateMatrix()
    }

    // Vector Setter And Getters
    get vectorX(): number { return this._vector.x }
    set vectorX(value: number) {
        this._vector.x = value;
        this.updateTransaltionMatrix()
    }

    get vectorY(): number { return this._vector.y }
    set vectorY(value: number) {
        this._vector.y = value;
        this.updateTransaltionMatrix()
    }

    get vectorZ(): number { return this._vector.z }
    set vectorZ(value: number) {
        this._vector.z = value;
        this.updateTransaltionMatrix()
    }

    public getVector() {
        return this._vector
    }
    public setVector(v: Vector3D) {
        this._vector = v
        this.updateTransaltionMatrix()
    }

    // Scale Setter And Getters
    get scaleX(): number { return this._scale.x }
    set scaleX(value: number) {
        this._scale.x = value;
        this.updateScaleMatrix()
    }

    get scaleY(): number { return this._scale.y }
    set scaleY(value: number) {
        this._scale.y = value;
        this.updateScaleMatrix()
    }

    get scaleZ(): number { return this._scale.z }
    set scaleZ(value: number) {
        this._scale.z = value;
        this.updateScaleMatrix()
    }

    public getScale() {
        return this._scale
    }
    public setScale(v: Vector3D) {
        this._scale = v
        this.updateScaleMatrix()
    }

    // Rotation Setter And Getters
    get rotateX(): number { return this._rotationInDeg.x }
    set rotateX(value: number) {
        this._rotationInDeg.x = value;
        this.updateRotationMatrix()
    }

    get rotateY(): number { return this._rotationInDeg.y }
    set rotateY(value: number) {
        this._rotationInDeg.y = value;
        this.updateRotationMatrix()
    }

    get rotateZ(): number { return this._rotationInDeg.z }
    set rotateZ(value: number) {
        this._rotationInDeg.z = value;
        this.updateRotationMatrix()
    }

    public getRotation() {
        return this._rotationInDeg
    }
    public setRotation(v: Vector3D) {
        this._rotationInDeg = v
        this.updateRotationMatrix()
    }


    //Other Operations
    public addToScale(vect: Vector3D): void {
        this._scale.x += vect.x
        this._scale.y += vect.y
        this._scale.z += vect.z
        this.updateMatrix()

    }
    public addToPosition(vect: Vector3D): void {
        this._vector.x += vect.x
        this._vector.y += vect.y
        this._vector.z += vect.z
        this.updateMatrix()

    }
    public addToRotation(vect: Vector3D): void {
        this._rotationInDeg.x += vect.x
        this._rotationInDeg.y += vect.y
        this._rotationInDeg.z += vect.z
        this.updateMatrix()

    }
    public setRotations(vect: Vector3D): void {
        this._rotationInDeg = vect
        this.updateMatrix()
    }
    public updateMatrix(): void {
        let modelMatrix = this._matrix4D.generateMatrix()

        modelMatrix = this._matrix4D.translate(modelMatrix, this._vector.x, this._vector.y, -this._vector.z)
        modelMatrix = this._matrix4D.scale(modelMatrix, this._scale.x, this._scale.y, this._scale.z)
        modelMatrix = this._matrix4D.xRotate(modelMatrix, this._rotationInDeg.x)
        modelMatrix = this._matrix4D.yRotate(modelMatrix, this._rotationInDeg.y)
        modelMatrix = this._matrix4D.zRotate(modelMatrix, this._rotationInDeg.z)
        this._modelMatrix = modelMatrix
    }

    public updateTransaltionMatrix(): void {
        this._modelMatrix = this._matrix4D.translate(this._modelMatrix, this._vector.x, this._vector.y, -this._vector.z)
    }
    public updateScaleMatrix(): void {
        this._modelMatrix = this._matrix4D.scale(this._modelMatrix, this._scale.x, this._scale.y, this._scale.z)
    }
    public updateRotationMatrix(): void {
        this._modelMatrix = this._matrix4D.xRotate(this._modelMatrix, this._rotationInDeg.x)
        this._modelMatrix = this._matrix4D.yRotate(this._modelMatrix, this._rotationInDeg.y)
        this._modelMatrix = this._matrix4D.zRotate(this._modelMatrix, this._rotationInDeg.z)
    }
}