const LightCubeVertexShader = `
attribute vec3 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;


void main(void) {

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);

}
`;

const LightCubeFragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform float uLigIntensity;
uniform vec3 uLightColor;

void main(void) {
    
  //gl_FragColor = vec4(1,1,1, 1.0);
  gl_FragColor = vec4(uLightColor, 1.0);
}
`;
const VertexShader = `
attribute vec3 aVertexPosition;
attribute vec3 aNormalPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec3 vFragPos;
varying highp vec3 vNormal;
varying highp vec2 vTextureCoord;

void main(void) {

  vFragPos = aVertexPosition;
  vNormal = aNormalPosition;

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);

  vTextureCoord = aTextureCoord;

}
`;

const FragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform int uTextureSample;
uniform vec3 uKd;
uniform sampler2D uSampler;
uniform vec3 uLightPos;
uniform vec3 uCameraPos;

varying highp vec3 vFragPos;
varying highp vec3 vNormal;
varying highp vec2 vTextureCoord;

void main(void) {
  
  if (uTextureSample == 1) {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
  } else {
    gl_FragColor = vec4(uKd,1);
  }

}
`;

//根据字符串作为PhongMaterial将用到的shader
const PhongVertexShader =`
// attribute vec3 aPos;
// attribute vec3 aNormal;
// attribute vec2 aTexCoord;
attribute vec3 aVertexPosition;//换成别的名称，会报错，传进来的参数名称不对
attribute vec3 aNormalPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;//Material的构造函数获得
uniform mat4 uProjectionMatrix;//Material的构造函数获得

varying highp vec3 vPos;
varying highp vec3 vNormal;
varying highp vec2 vTexCoord;

void main(void)
{
  vPos = aVertexPosition;
  vNormal = aNormalPosition;
  vTexCoord = aTextureCoord;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}
`;
const PhongFragmentShader =`
#ifdef GL_ES
precision mediump float;
#endif

//PhongMaterial构造函数
uniform sampler2D uSampler;//通过应用端传进来的图片，应用端的命名要从uSampler修改成diffuseMap

uniform vec3 uKd;//PhongMaterial构造函数
uniform vec3 uKs;//PhongMaterial构造函数
uniform vec3 uLightPos;//Material的构造函数获得
uniform vec3 uCameraPos;//Material的构造函数获得
uniform float uLightIntensity;//PhongMaterial构造函数
uniform int uTextureSample;//PhongMaterial构造函数

varying highp vec3 vPos;
varying highp vec3 vNormal;
varying highp vec2 vTexCoord;

void main(void)
{
  vec3 color;
  if(uTextureSample == 1)
  {
    color = pow(texture2D(uSampler,vTexCoord).rgb, vec3(2.2));
  }
  else
  {
    color = uKd;
  }

  vec3 ambient =0.05 * color;

  vec3 lightDir = normalize(uLightPos - vPos);
  vec3 normal = normalize(vNormal);
  float atten = uLightIntensity / length(uLightPos - vPos);
  vec3 diffuse = max(dot(lightDir, normal), 0.0) * atten * color;

  vec3 viewDir = normalize(uCameraPos - vPos);
  float spec = 0.0;
  vec3 reflectDir = reflect(-lightDir, normal);
  vec3 specular = uKs * pow(max(dot(viewDir, reflectDir), 0.0), 35.0) * atten;
  gl_FragColor = vec4(pow((ambient + diffuse + specular), vec3(1.0/2.2)), 1.0);
}
`;