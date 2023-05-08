import { Engine } from '../../Engine';
import Texture from './Texture';
export default class ShadowMap {

    public static SHADOW_MAP_WIDTH = 1024;

    public static SHADOW_MAP_HEIGHT = 1024;

    private depthMapFBO: number;

    private depthMap: Texture;

    public ShadowMap() {
        let gl = Engine._gl.gl
        const depthTexture = gl.createTexture();
        const depthTextureSize = 512;
        gl.bindTexture(gl.TEXTURE_2D, depthTexture);
        gl.texImage2D(
            gl.TEXTURE_2D,      // target
            0,                  // mip level
            gl.DEPTH_COMPONENT32F, // internal format
            depthTextureSize,   // width
            depthTextureSize,   // height
            0,                  // border
            gl.DEPTH_COMPONENT, // format
            gl.FLOAT,           // type
            null);              // data
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        const depthFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,       // target
            gl.DEPTH_ATTACHMENT,  // attachment point
            gl.TEXTURE_2D,        // texture target
            depthTexture,         // texture
            0);                   // mip level
    }

    public getDepthMapTexture(): Texture {
        return this.depthMap;
    }

    public getDepthMapFBO() {
        return this.depthMapFBO;
    }

    public cleanup() {
        Engine._gl.gl.deleteFramebuffer(this.depthMapFBO);
    }
}