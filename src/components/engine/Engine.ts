import {sort} from "../../../node_modules/fast-sort/dist/sort.min";
import {Figure} from "./components/primitives/Figure";
import {programArray, WebGlWProgram} from "./addons/interfaces/WebglExtender";
import webGLutils, {Shader} from "./addons/webGLutils";
// import FirstPersonCamera from "./components/cameras/FirstPersonCamera";
import FreeMoveCamera from "./components/cameras/FPSCamera";
import Materials from "./components/Materials";
import Block from "./components/primitives/Block";
import Cone from "./components/primitives/Cone";
import {mat4, vec3, vec4} from "./math/gl-matrix";
import Particle from "./components/primitives/Particles";
import Light from "./components/lights/Light";

export abstract class Engine {
    public _cnv: HTMLCanvasElement
    public _program: programArray
    public _webGLutils: webGLutils
    public static _gl: WebGlWProgram
    public static _light: Array<Light>
    public lightOptions: {
        wasBefore: boolean
    }
    previuseRender: {
        material: Materials
        item: string
    }
    time: number

    constructor(plane: HTMLCanvasElement) {
        this._cnv = plane
        Engine._gl = new WebGlWProgram();
        this.lightOptions = {wasBefore: false}
        this.previuseRender = {
            material: undefined,
            item: ""
        }
        this._webGLutils
        this.time = 0
        this.createCanvas()
        console.log("LOGGED2 ")
    }

    async createCanvas() {
        let body = document.querySelectorAll("body")[0].children as HTMLCollection
        for (let x = 0; x < body.length; x++) {
            body[x].classList.add("display")
        }
        this._cnv.style.display = "block"
        this._cnv.style.cursor = "none"

        this._cnv.width = window.innerWidth;
        this._cnv.height = window.innerHeight;
        window.addEventListener("resize", () => {
            this._cnv.width = window.innerWidth;
            this._cnv.height = window.innerHeight;
            this.draw()
        }, false)

        await this.draw()
    }

    async draw() {
        if (this._cnv) {
            //Get context from webgl!
            const gl = this._cnv.getContext("webgl2", {antialias: false, premultipliedAlpha: false});
            // Only continue if WebGL is available and working
            if (gl === null) {
                alert("Unable to initialize WebGL. Your browser or machine may not support it.");
                return;
            }

            this._webGLutils = new webGLutils()
            // const sliderMan = new sliderManager()    
            Engine._gl.gl = gl
            Engine._gl.shaders = this._webGLutils.newProgram(gl)

            Engine._gl.gl.enable(Engine._gl.gl.BLEND);
            Engine._gl.gl.blendFunc(Engine._gl.gl.SRC_ALPHA, Engine._gl.gl.ONE_MINUS_SRC_ALPHA);


        }
    }

    engineRender(camera: FreeMoveCamera, items?: any, particles?: Array<Particle>, light?: Array<Light>) {
        Engine._light = light
        for (let i = 0; i < items.length; i++) {
            let fig = items[i]
            if (this.isAABBVisible(fig.boxBounding, camera.frustumPlanes)) {
                switch (fig._material._type) {
                    case "color":
                        if (!fig._material._light) {
                            Engine._gl.gl.useProgram(Engine._gl.shaders.color._prg)

                            fig.assignCamera(camera)
                            fig.drawColor(this.previuseRender.item)
                        } else {
                            Engine._gl.gl.useProgram(Engine._gl.shaders.colorLights._prg)
                            if (i == 0 && this.previuseRender.material == undefined && fig._material._type == "color") this.assignLight(Engine._gl.shaders.colorLights)
                            if (fig._material._type == "color" && this.previuseRender.material != undefined && !this.previuseRender.material._light) this.assignLight(Engine._gl.shaders.colorLights)

                            fig.assignCamera(camera)
                            if (fig._type != this.previuseRender.item) fig.drawColorLights(this.previuseRender.item, true)
                            else fig.drawColorLights(this.previuseRender.item, true)
                        }
                        this.previuseRender.material = fig._material
                        this.previuseRender.item = fig._type

                        break;
                    case "texture":
                        if (!fig._material._light) {
                            Engine._gl.gl.useProgram(Engine._gl.shaders.texture._prg)
                            fig.assignCamera(camera)
                            fig.drawTexture(this.previuseRender.item)
                        } else {
                            Engine._gl.gl.useProgram(Engine._gl.shaders.textureLights._prg)
                            if (i == 0 && this.previuseRender.material == undefined && fig._material._type == "texture") this.assignLight(Engine._gl.shaders.textureLights)
                            if (fig._material._type == "texture" && this.previuseRender.material != undefined && !this.previuseRender.material._light) this.assignLight(Engine._gl.shaders.textureLights)

                            fig.assignCamera(camera)
                            if (fig._type != this.previuseRender.item) fig.drawTextureLights(this.previuseRender.item, true)
                            else fig.drawTextureLights(this.previuseRender.item, true)

                        }
                        this.previuseRender.material = fig._material
                        this.previuseRender.item = fig._type


                        break
                }
            }
            // if (fig._material.type == this.previouseMaterial._type) continue
            // else {
            //
            // }
        }
        // particles.forEach((cube: Particle) => {
        //     if (this.isAABBVisible(cube.boxBounding, camera.frustumPlanes) && (true || !cube._material._wireframe)) {
        //         visibleItems += 1
        //         cube.draw(camera)
        //     }
        //     // cube.draw(camera)
        //
        // })
        // coneArray.forEach((cube: Figure) => {
        //     if (this.isAABBVisible(cube.boxBounding, camera.frustumPlanes)) {
        //         visibleItems += 1
        //         console.log('cube', cube)
        //         cube.draw(camera)

        //     }
        // })
        // console.log("Total items: " + totalItems + " visible items: " + visibleItems)


        // requestAnimationFrame(() => this.render(new Date().getTime()))

    }

    isAABBVisible(aabb: any, planes: Array<vec4>) {
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

    private assignLight(uniformLocation: Shader) {
        let dirI = 0, pI = 0, spotI = 0
        for (let light of Engine._light) {

            if (light.type == "dirLight") dirI++
            if (light.type == "pointLight") pI++
            if (light.type == "spotLight") spotI++
        }
        Engine._gl.gl.uniform1i(uniformLocation._uniforms.amountOfPointLight, pI)
        Engine._gl.gl.uniform1i(uniformLocation._uniforms.amountOfSpotLight, spotI)
        Engine._gl.gl.uniform1i(uniformLocation._uniforms.amountOfDirLight, dirI)

        dirI = 0
        pI = 0
        spotI = 0
        for (let light of Engine._light) {

            if (light.type == "dirLight") {
                Engine._gl.gl.uniform3fv(uniformLocation._uniforms[`dirLights[${dirI}].direction`], light.direction);

                Engine._gl.gl.uniform1f(uniformLocation._uniforms[`dirLights[${dirI}].intensity`], light.intensity);

                Engine._gl.gl.uniform3fv(uniformLocation._uniforms[`dirLights[${dirI}].ambient`], light.ambient);
                Engine._gl.gl.uniform3fv(uniformLocation._uniforms[`dirLights[${dirI}].diffuse`], light.diffuse);
                Engine._gl.gl.uniform3fv(uniformLocation._uniforms[`dirLights[${dirI}].specular`], light.specular)
                dirI++
            }
            if (light.type == "pointLight") {

                Engine._gl.gl.uniform3fv(uniformLocation._uniforms[`pointLights[${pI}].position`], light.position);

                Engine._gl.gl.uniform1f(uniformLocation._uniforms[`pointLights[${pI}].constant`], light.constant);
                Engine._gl.gl.uniform1f(uniformLocation._uniforms[`pointLights[${pI}].linear`], light.linear);
                Engine._gl.gl.uniform1f(uniformLocation._uniforms[`pointLights[${pI}].quadratic`], light.quadratic);
                Engine._gl.gl.uniform1f(uniformLocation._uniforms[`pointLights[${pI}].intensity`], light.intensity);

                Engine._gl.gl.uniform3fv(uniformLocation._uniforms[`pointLights[${pI}].ambient`], light.ambient);
                Engine._gl.gl.uniform3fv(uniformLocation._uniforms[`pointLights[${pI}].diffuse`], light.diffuse);
                Engine._gl.gl.uniform3fv(uniformLocation._uniforms[`pointLights[${pI}].specular`], light.specular);
                pI++
            }
            if (light.type == "spotLight") {
                Engine._gl.gl.uniform3fv(uniformLocation._uniforms[`spotLights[${spotI}].position`], light.position);
                Engine._gl.gl.uniform3fv(uniformLocation._uniforms[`spotLights[${spotI}].direction`], light.direction);

                Engine._gl.gl.uniform1f(uniformLocation._uniforms[`spotLights[${spotI}].intensity`], light.intensity);
                Engine._gl.gl.uniform1f(uniformLocation._uniforms[`spotLights[${spotI}].cutOff`], light.cutOff);
                Engine._gl.gl.uniform1f(uniformLocation._uniforms[`spotLights[${spotI}].outerCutOff`], light.outerCutOff);

                Engine._gl.gl.uniform1f(uniformLocation._uniforms[`spotLights[${spotI}].constant`], light.constant);
                Engine._gl.gl.uniform1f(uniformLocation._uniforms[`spotLights[${spotI}].linear`], light.linear);
                Engine._gl.gl.uniform1f(uniformLocation._uniforms[`spotLights[${spotI}].quadratic`], light.quadratic);

                Engine._gl.gl.uniform3fv(uniformLocation._uniforms[`spotLights[${spotI}].ambient`], light.ambient);
                Engine._gl.gl.uniform3fv(uniformLocation._uniforms[`spotLights[${spotI}].diffuse`], light.diffuse);
                Engine._gl.gl.uniform3fv(uniformLocation._uniforms[`spotLights[${spotI}].specular`], light.specular);
                spotI++
            }
        }
    }
}

let f = () => {
    return Math.floor(Math.random() * (50 + 10 + 1) - 10)
}