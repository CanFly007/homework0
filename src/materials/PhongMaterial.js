class PhongMaterial extends Material
{
    //color:textureSample为0时，diffuse固定颜色。colorMap：漫反射贴图。specular：高光系数。intensity：灯光亮度，随半径衰减
    constructor(color, colorMap, specular, intensity)
    {
        let textureSample = 0;
        if(colorMap != null)
        {
            textureSample = 1;
            super//基类构造函数的四个形参
            (
                {
                    'uTextureSample' : {type: '1i', value: textureSample},
                    'uSampler' : {type: 'texture', value: colorMap},
                    'uKd' : {type: '3fv', value: color},
                    'uks' : {type: '3fv', value: specular},
                    'uLightIntensity' : {type: '1f', value: intensity}
                }, [], PhongVertexShader, PhongFragmentShader
            );
        }
        else
        {
            super
            (
                {
                    'uTextureSample' : {type: '1i', value: textureSample},
                    'uKd' : {type: '3fv', value: color},
                    'uks' : {type: '3fv', value: specular},
                    'uLightIntensity' : {type: '1f', value: intensity}
                }, [], PhongVertexShader, PhongFragmentShader
            );
        }
    }
}