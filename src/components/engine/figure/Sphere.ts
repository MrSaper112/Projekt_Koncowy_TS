import { Vector3D } from "../addons/Figure";
import FigureInterface from "../addons/FiguresInterFace";
import Matrix4D from "../addons/Matrix4D";
import { programArray } from "../addons/webGLutils";
import Camera from "./Camera";
import Materials from "./Materials";

export default class Sphere implements FigureInterface {
    _UUID: string;
    _matrix4D?: Matrix4D;
    _positions?: number[];
    _indices?: number[];
    _gl?: WebGLRenderingContext;
    _vector?: Vector3D;
    _scale?: Vector3D;
    _rotationInDeg?: Vector3D;
    _material?: Materials;
    draw(_prgL: programArray, _camera: Camera): void {
        throw new Error("Method not implemented.");
    }
    scaleMe(vect: Vector3D): void {
        throw new Error("Method not implemented.");
    }
    addToPosition(vect: Vector3D): void {
        throw new Error("Method not implemented.");
    }
    addToRotation(vect: Vector3D): void {
        throw new Error("Method not implemented.");
    }
    setNewCoordinate(vect: Vector3D): void {
        throw new Error("Method not implemented.");
    }
    setNewRotations(vect: Vector3D): void {
        throw new Error("Method not implemented.");
    }
    createSphereVertices(
        radius:number,
        subdivisionsAxis:number,
        subdivisionsHeight: number,
        opt_startLatitudeInRadians: number,
        opt_endLatitudeInRadians: number,
        opt_startLongitudeInRadians: number,
        opt_endLongitudeInRadians: number) {
        if (subdivisionsAxis <= 0 || subdivisionsHeight <= 0) {
            throw Error('subdivisionAxis and subdivisionHeight must be > 0');
        }

        opt_startLatitudeInRadians = opt_startLatitudeInRadians || 0;
        opt_endLatitudeInRadians = opt_endLatitudeInRadians || Math.PI;
        opt_startLongitudeInRadians = opt_startLongitudeInRadians || 0;
        opt_endLongitudeInRadians = opt_endLongitudeInRadians || (Math.PI * 2);

        const latRange = opt_endLatitudeInRadians - opt_startLatitudeInRadians;
        const longRange = opt_endLongitudeInRadians - opt_startLongitudeInRadians;

        // We are going to generate our sphere by iterating through its
        // spherical coordinates and generating 2 triangles for each quad on a
        // ring of the sphere.
        const numVertices = (subdivisionsAxis + 1) * (subdivisionsHeight + 1);
        const positions = this.createAugmentedTypedArray(3, numVertices);
        const normals = this.createAugmentedTypedArray(3, numVertices);
        const texCoords = this.createAugmentedTypedArray(2, numVertices);

        // Generate the individual vertices in our vertex buffer.
        for (let y = 0; y <= subdivisionsHeight; y++) {
            for (let x = 0; x <= subdivisionsAxis; x++) {
                // Generate a vertex based on its spherical coordinates
                const u = x / subdivisionsAxis;
                const v = y / subdivisionsHeight;
                const theta = longRange * u + opt_startLongitudeInRadians;
                const phi = latRange * v + opt_startLatitudeInRadians;
                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);
                const ux = cosTheta * sinPhi;
                const uy = cosPhi;
                const uz = sinTheta * sinPhi;
                positions.push(radius * ux, radius * uy, radius * uz);
                normals.push(ux, uy, uz);
                texCoords.push(1 - u, v);
            }
        }

        const numVertsAround = subdivisionsAxis + 1;
        const indices = this.createAugmentedTypedArray(3, subdivisionsAxis * subdivisionsHeight * 2, Uint16Array);
        for (let x = 0; x < subdivisionsAxis; x++) {
            for (let y = 0; y < subdivisionsHeight; y++) {
                // Make triangle 1 of quad.
                indices.push(
                    (y + 0) * numVertsAround + x,
                    (y + 0) * numVertsAround + x + 1,
                    (y + 1) * numVertsAround + x);

                // Make triangle 2 of quad.
                indices.push(
                    (y + 1) * numVertsAround + x,
                    (y + 0) * numVertsAround + x + 1,
                    (y + 1) * numVertsAround + x + 1);
            }
        }

        return {
            position: positions,
            normal: normals,
            texcoord: texCoords,
            indices: indices,
        };
    }
    createAugmentedTypedArray(numComponents: number, numElements: number, opt_type?: any) {
        const Type = opt_type || Float32Array;
        return this.augmentTypedArray(new Type(numComponents * numElements), numComponents);
    }
    augmentTypedArray(typedArray: any, numComponents: number) {
        let cursor = 0;
        typedArray.push = function () {
            for (let ii = 0; ii < arguments.length; ++ii) {
                const value = arguments[ii];
                if (value instanceof Array || (value.buffer && value.buffer instanceof ArrayBuffer)) {
                    for (let jj = 0; jj < value.length; ++jj) {
                        typedArray[cursor++] = value[jj];
                    }
                } else {
                    typedArray[cursor++] = value;
                }
            }
        };
        typedArray.reset = function (opt_index: any) {
            cursor = opt_index || 0;
        };
        typedArray.numComponents = numComponents;
        Object.defineProperty(typedArray, 'numElements', {
            get: function () {
                return this.length / this.numComponents | 0;
            },
        });
        console.warn(typedArray)
        return typedArray;
    }
}