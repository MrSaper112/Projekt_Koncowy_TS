#version 300 es

in vec4 aVertexPosition;
in vec3 aNormals;
in vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uWorldMatrix;
uniform mat4 uNormalMatrix;

uniform vec3 uPosition;
uniform vec3 uCameraPosition;

out vec3 BlockPosition;
out vec3 Normal;
out vec4 VertexColor;
out vec4 TransformedNormal;
out vec3 FragPos;
void main(void) {
    Normal = mat3(transpose(inverse(uWorldMatrix))) * aNormals;
    BlockPosition = uPosition;
    VertexColor = aVertexColor;
    FragPos = vec3(uModelViewMatrix * aVertexPosition);

    //    TransformedNormal = (uNormalMatrix * aNormals).xyz;
    TransformedNormal = uNormalMatrix * vec4(aNormals, 1.0);

    gl_Position = uModelViewMatrix * aVertexPosition;
//    //ALBO TU
//    vec3 normal = normalize((uNormalMatrix * aNormals).xyz); // Normalized surface normal
//
//    vec3 surfaceWorldPosition = (uNormalMatrix * aVertexPosition).xyz;
//    vSurfaceToLight = uLightWorldPosition - surfaceWorldPosition + dase ;


}

