precision mediump float;

varying vec4 vColor;

void main(void) {
    float r = float(vColor[0])/ 255.0;
    float g = float(vColor[1]) / 255.0;
    float b = float(vColor[2]) / 255.0;;

    gl_FragColor = vec4(vec3(r,g,b),vColor[3]);
}