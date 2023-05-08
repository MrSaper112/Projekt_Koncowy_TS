import Camera from "./components/cameras/Camera";
import { Figure } from "./components/primitives/Figure";
import { vec3 } from "./math/gl-matrix";

self.postMessage("I'm working before postMessage('ali').");

self.onmessage = (event) => {
    let cube = event.data.aabb as Figure
    let camera = event.data.camera as Camera

    if (isAABBVisible(cube.boxBounding, camera.frustumPlanes)) {
        self.postMessage({ block: JSON.parse(JSON.stringify(cube)), camera: JSON.parse(JSON.stringify(camera)) })
    }
    // postMessage(isAABBVisible(cube.boxBounding, event.data.planes));
    // if (event.data !== undefined) {

    // }
};
function isAABBVisible(aabb: any, planes: Array<vec4>) {
    // Transform the eight corner points of the AABB into view space
    if (planes === undefined || aabb == undefined) return true;
    for (let i = 0; i < 6; i++) {
        const plane = planes[i];
        const min = aabb.min;
        const max = aabb.max;
        const x = plane[0] > 0 ? max[0] : min[0];
        const y = plane[1] > 0 ? max[1] : min[1];
        const z = plane[2] > 0 ? max[2] : min[2];
        // console.log(plane[3])
        // console.log('x,y,z', x, y, z, vec3.dot(plane, vec3.fromValues(x, y, z)) + plane[3])
        const distance = vec3.dot(plane, vec3.fromValues(x, y, z)) + plane[3]
        if (distance < 0) {
            // bounding box is fully outside the frustum, return false
            return false;
        }
    }

    // bounding box is either fully or partially inside the frustum, return true
    return true;
}
interface e {
    aabb: Figure,
    planes: Array<vec4>
}