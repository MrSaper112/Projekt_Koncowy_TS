#version 300 es
in vec4 aVertexPosition;
in vec2 aTextureCoord;
in vec3 aNormals;

uniform mat4 uModelViewMatrix;
uniform mat4 uWorldMatrix;
uniform mat4 uNormalMatrix;

uniform vec3 uPosition;
uniform vec3 uCameraPosition;

out vec3 vNormal;
out vec2 vTextureCoord;
out vec3 BlockPosition;
out vec3 Normal;
out vec4 TransformedNormal;
out vec3 FragPos;

void main(void) {
    vTextureCoord = aTextureCoord;

    Normal = mat3(transpose(inverse(uWorldMatrix))) * aNormals;
    BlockPosition = uPosition;
    FragPos = vec3(uModelViewMatrix * aVertexPosition);

    //    TransformedNormal = (uNormalMatrix * aNormals).xyz;
    TransformedNormal = uNormalMatrix * vec4(aNormals, 1.0);

    gl_Position = uModelViewMatrix * aVertexPosition;

}