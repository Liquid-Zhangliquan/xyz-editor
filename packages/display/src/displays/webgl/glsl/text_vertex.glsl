precision highp float;

attribute vec3 a_point;
attribute vec2 a_position;
attribute vec2 a_texcoord;

uniform vec2 u_resolution;
uniform mat4 u_matrix;
uniform mat4 u_umatrix;
uniform vec2 u_topLeft;
uniform float u_scale;
uniform float u_rotate;
uniform bool u_alignMap;
uniform float u_atlasScale;

varying vec2 v_texcoord;
varying vec4 vColor;

#define M_PI 3.1415926535897932384626433832795

const float PI_05 = M_PI * 0.5;
const float PI_15 = M_PI * 1.5;
const float TO_RAD = M_PI / 180.0;

vec2 rotate(vec2 point, float rad){
    float s = sin(rad);
    float c = cos(rad);
    return vec2(point.x * c + point.y * s, point.y * c - point.x * s);
}

void main(void){

    float rotation = a_point.z;

    if (rotation <= 360.0){

        v_texcoord = a_texcoord * u_atlasScale;

        if(u_alignMap){
            rotation *= TO_RAD;

            float aRotation = u_rotate + rotation;

            if(aRotation > PI_05 && aRotation < PI_15 ){
                rotation += M_PI;
            }

            vec2 offset = rotate(a_point.xy, -rotation) / u_scale / DEVICE_PIXEL_RATIO;
            gl_Position = u_matrix * vec4(u_topLeft + a_position + offset, 0.0, 1.0);
        }else{
            vec4 cpos = u_matrix * vec4(u_topLeft + a_position, 0.0, 1.0);
            gl_Position = vec4( cpos.xy / cpos.w + vec2(a_point.x, -a_point.y) / DEVICE_PIXEL_RATIO / u_resolution * 2.0 , 0.0, 1.0);
        }
    }
}
