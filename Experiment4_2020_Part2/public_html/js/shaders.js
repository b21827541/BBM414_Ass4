const vs = `#version 300 es
  in  vec4 vPosition;
  in  vec4 vColor;
  
  uniform float sx, sy, sz;
  uniform float angle;
  uniform float scale;
  uniform vec4 u_Translation;

  out vec4 fColor;
 
  void main() {
    float cosin = cos(angle);
    float sinus = sin(angle);
    mat4 projMat = mat4(1.0, 0.0, 0.0, 0.0,
                        0.0, 1.0, 0.0, 0.0,
                        0.0, 0.0, 1.0, scale,
                        0.0, 0.0, 0.0, scale
    );
    mat4 rotMatrixX = mat4(cosin, 0, -sinus, 0,
      0, 1, 0, 0,
      sinus, 0, cosin, 0,
      0, 0, 0, 1);
    mat4 scaleMatrix = mat4(sx, 0.0, 0.0, 0.0,
                                0.0, sy, 0.0, 0.0,
                                0.0, 0.0, sz, 0.0,
                                0.0, 0.0, 0.0, 1.0
        );
    gl_Position = projMat * rotMatrixX * vPosition * scaleMatrix + u_Translation;
    fColor = vColor;
  }
`;
 
const fs = `#version 300 es
  precision highp float;
 
  in vec4 fColor;
  out vec4 outColor;
 
  void main () {
    outColor = fColor;
  }
`;