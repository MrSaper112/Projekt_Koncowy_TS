attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
varying vec4 vLight;

uniform vec4 colorArray[2];

void main(void) {
    gl_Position =  uModelViewMatrix * aVertexPosition;
    vec4 multiply = vec4(0,0,0,0);
    for(int i = 0 ; i < 2 ; i ++ ){
        multiply = multiply.xyzw + colorArray[i].xyzw;
    }
    multiply.x /2.0 ;
    multiply.y /2.0 ;
    multiply.z /2.0 ;
    multiply.w /2.0 ;
    vLight = multiply;
}