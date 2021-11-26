attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

uniform mat4 countOfPointLights;
uniform vec4 uMaterialDiffuse;
uniform vec3 uLightPosition[countOfPointLights];

varying vec3 vNormal;
varying vec3 vLightRay[countOfPointLights];

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

void main(void)
{
    highp ve3 trans = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

    //Calculate light ray per each light
    for (int i = 0; i < countOfPointLights; i++)
    {
        vec4 lightPosition = transformedNormal * vec4(uLightPosition[i], 1.0);
        vLightRay[i] = trans.xyz - lightPosition.xyz;
    }

    gl_Position = trans;
    vTextureCoord = aTextureCoord;

    // highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    // highp vec3 directionalLightColor = vec3(1, 1, 1);
    // highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
    // highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    // vLighting = ambientLight + (directionalLightColor * directional);
}