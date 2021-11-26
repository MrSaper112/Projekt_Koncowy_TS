// Fragment shader program
precision mediump int;
precision mediump float;

varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;

// Light model
struct light_info
{
    highp vec3 position;
    highp vec3 color;
};

// An array of 2 lights

vec3 ligPos = vec3(0.0, 0.0, 0.0);
vec3 ligColor = vec3(0.0, 0.0, 0.0);

// Ambient lighting
vec3 u_Ambient_intensities = vec3(0.30, 0.30, 0.30);

// Attenuation constants for 1/(1 + c1*d + c2*d^2)
float u_c1 = 0.0;
float u_c2 = 0.0;

// Model surfaces' shininess
float u_Shininess = 32.0;

// Data coming from the vertex shader
varying vec3 vVertex;
varying vec3 aVertexNormal;

//-------------------------------------------------------------------------
// Given a normal vector and a light,
// calculate the fragment's color using diffuse and specular lighting.
vec3 light_calculations(vec3 fragment_normal, vec4 v_Color)
{

    vec3 specular_color;
    vec3 diffuse_color;
    vec3 to_light;
    float distance_from_light;
    vec3 reflection;
    vec3 to_camera;
    float cos_angle;
    float attenuation;
    vec3 color;

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // General calculations needed for both specular and diffuse lighting

    // Calculate a vector from the fragment location to the light source
    to_light = ligPos - vVertex;
    distance_from_light = length(to_light);
    to_light = normalize(to_light);

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // DIFFUSE  calculations

    // Calculate the cosine of the angle between the vertex's normal
    // vector and the vector going to the light.
    cos_angle = dot(fragment_normal, to_light);
    cos_angle = clamp(cos_angle, 0.0, 1.0);

    // Scale the color of this fragment based on its angle to the light.
    diffuse_color = vec3(v_Color) * ligColor * cos_angle;

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // SPECULAR  calculations

    // Calculate the reflection vector
    reflection = 2.0 * dot(fragment_normal, to_light) * fragment_normal - to_light;
    reflection = normalize(reflection);

    // Calculate a vector from the fragment location to the camera.
    // The camera is at the origin, so just negate the fragment location
    to_camera = -1.0 * vVertex;
    to_camera = normalize(to_camera);

    // Calculate the cosine of the angle between the reflection vector
    // and the vector going to the camera.
    cos_angle = dot(reflection, to_camera);
    cos_angle = clamp(cos_angle, 0.0, 1.0);
    cos_angle = pow(cos_angle, u_Shininess);

    // If this fragment gets a specular reflection, use the light's color,
    // otherwise use the objects's color
    specular_color = ligColor * cos_angle;

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // ATTENUATION  calculations

    attenuation = 1.0 /
                  (1.0 + u_c1 * distance_from_light + u_c2 * pow(distance_from_light, 2.0));

    // Combine and attenuate the colors from this light source
    color = attenuation * (diffuse_color + specular_color);
    color = clamp(color, 0.0, 1.0);

    return color;
}

//-------------------------------------------------------------------------
void main()
{
    vec3 fragment_normal;

    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
    vec4 v_Color = texelColor;

    vec3 color;
    color = u_Ambient_intensities * vec3(v_Color);

    fragment_normal = normalize(aVertexNormal);

    color = color + light_calculations(fragment_normal, v_Color);

    color = clamp(color, 0.0, 1.0);

    gl_FragColor = vec4(texelColor.rgb * color, 1.0);
}

