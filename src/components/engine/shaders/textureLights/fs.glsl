#version 300 es
precision mediump float;
struct PointLight {
    vec3 position;

    float constant;
    float linear;
    float quadratic;

    float intensity;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

struct SpotLight {
    vec3 position;
    vec3 direction;
    float cutOff;
    float outerCutOff;

    float constant;
    float linear;
    float quadratic;
    float intensity;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};


struct DirLight {
    vec3 direction;
    float intensity;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};


out vec4 outColor;
//const vec3 BlockPosition = vec3(0,1,10);
in vec2 vTextureCoord;
in vec3 BlockPosition;
in vec3 Normal;
in vec4 TransformedNormal;
in vec3 FragPos;

uniform sampler2D uSampler;
uniform vec3 uReverseLightDirection;

uniform int amountOfPointLight;
uniform int amountOfSpotLight;
uniform int amountOfDirLight;
uniform PointLight pointLights[32];
uniform DirLight dirLights[32];
uniform SpotLight spotLights[32];
uniform vec3 uViewWorldPosition;



vec3 CalcPointLight(PointLight light, vec3 normal, vec3 viewDir, vec4 color)
{
    vec3 lightDir = normalize(light.position - BlockPosition);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 1.0);
    // attenuation
    float distance = length(light.position - BlockPosition);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));
    // combine results
    vec3 ambient = light.ambient * light.intensity * vec3(texture(uSampler,vTextureCoord)) * 1000.0;
    vec3 diffuse = light.diffuse* light.intensity * diff * vec3(texture(uSampler,vTextureCoord))*1000.0;
    vec3 specular = light.specular* light.intensity * spec * vec3(texture(uSampler,vTextureCoord))*1000.0;
    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;
    return (ambient + diffuse + specular);
}





vec3 CalcDirLight(DirLight light, vec3 normal, vec3 viewDir, vec4 color)
{
    vec3 lightDir = normalize(light.direction);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(lightDir, normal);
    //    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // combine results
    vec3 ambient  = light.ambient* light.intensity  * vec3(texture(uSampler,vTextureCoord));
    vec3 diffuse  = light.diffuse* light.intensity  * diff *  vec3(texture(uSampler,vTextureCoord));
    //    vec3 specular = light.specular * spec * vec3(texture(uSampler,vTextureCoord));
    return (ambient * diffuse);
}


// calculates the color when using a spot light.
vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 viewDir, vec4 color)
{
    vec3 lightDir = normalize(light.position - BlockPosition);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 1.0);
    // attenuation
    float distance = length(light.position - BlockPosition);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));
    // spotlight intensity
    float theta = dot(lightDir, normalize(light.direction));
    float epsilon = light.cutOff - light.outerCutOff;
    float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);
    // combine results
    vec3 ambient = light.ambient* vec3(texture(uSampler,vTextureCoord));
    vec3 diffuse = light.diffuse * diff * vec3(texture(uSampler,vTextureCoord));
    vec3 specular = light.specular* spec * vec3(texture(uSampler,vTextureCoord));
    ambient *= attenuation * intensity;
    diffuse *= attenuation * intensity;
    specular *= attenuation * intensity;
    return (ambient + diffuse + specular);
}

void main(void) {
    vec4 texelColor = texture(uSampler,vTextureCoord);
//    texture(uSampler, vTextureCoord)
    vec3 norm = normalize(Normal);
    vec3 viewDir = normalize(uViewWorldPosition - FragPos);


    vec3 result = vec3(0, 0, 0);
    vec3 result1 = vec3(0, 0, 0);
    vec3 result2 = vec3(0, 0, 0);

    for (int i = 0; i < amountOfPointLight; i++)result += CalcPointLight(pointLights[i], norm, viewDir, texelColor);
    for (int i = 0; i < amountOfSpotLight;i++)result1 += CalcSpotLight(spotLights[i], norm, viewDir, texelColor);
    for (int i = 0; i < amountOfDirLight; i++)result2 += CalcDirLight(dirLights[i], norm, viewDir, texelColor);

    outColor = (vec4(result, 1.0)) + (vec4(result1, 1.0)) + (vec4(result2, 1.0));
}