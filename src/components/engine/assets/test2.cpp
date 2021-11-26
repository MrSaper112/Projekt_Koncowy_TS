varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform number countOfPointLights;
uniform light u_Lights[countOfPointLights];


//object uniforms
uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;

//light uniforms
bool uLightSource = true;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse[countOfPointLights];
float uCutOff = 0.05;

//varyings
varying vec3 vNormal;
varying vec3 vLightRay[countOfPointLights];

void main(void)
{
    
    vec4 Ia = uLightAmbient * uMaterialAmbient; //Ambient component: one for all
    vec4 finalColor = vec4(0.0, 0.0, 0.0, 1.0); //Color that will be assigned to gl_FragColor

    vec3 N = normalize(vNormal);
    vec3 L = vec3(0.0);
    float lambertTerm = 0.0;

    for (int i = 0; i < countOfPointLights; i++)
    { //For each light

        L = normalize(vLightRay[i]); //Calculate reflexion
        lambertTerm = dot(N, -L);

        if (lambertTerm > uCutOff)
        {
            finalColor += uLightDiffuse[i] * uMaterialDiffuse * lambertTerm; //Add diffuse component, one per light
        }
    }

    //Final color
    finalColor += Ia;
    finalColor.a = 1.0;        //Add ambient component: one for all
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
    gl_FragColor = vec4(texelColor.rgb * finalColor, texelColor.a);
}