attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
uniform mat4 uModelViewMatrix;

varying vec4 vColor;

void main(void) {
    gl_Position = uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
}