precision lowp float;

attribute vec2 a_position;

uniform float u_tileScale;
uniform mat4 u_matrix;
uniform vec2 u_topLeft;

void main(void){
    gl_Position = u_matrix * vec4( u_topLeft + a_position * u_tileScale, 0.0, 1.0 );
}
