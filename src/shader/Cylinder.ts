///<reference path="./Object.ts" />
namespace shader{
    export class Cylinder extends NEObject{
        vertex:string    = ''+
        'attribute  vec4 a_Position;\n' +
        'attribute  vec4 a_Color;\n' +
        'attribute  vec4 a_Normal;\n' +
        'uniform    mat4 u_MvpMatrix;\n' +
        'uniform    mat4 u_ModelMatrix;\n' +    // Model matrix
        'uniform    mat4 u_NormalMatrix;\n' +   // Transformation matrix of the normal
        'uniform    bool u_Clicked;\n'+
        'varying    vec4 v_Color;\n' +
        'varying    vec3 v_Normal;\n' +
        'varying    vec3 v_Position;\n' +
        'void main() {\n' +
        '   gl_Position = u_MvpMatrix * a_Position;\n' +
            // Calculate the vertex position in the world coordinate
        '   v_Position = vec3(u_ModelMatrix * a_Position);\n' +
        '   v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
        '   v_Color = a_Color;\n' +
        '}\n';
        fragment:string  = ''+
        '#ifdef GL_ES\n' +
        'precision mediump float;\n' +
        '#endif\n' +
        'uniform vec3 u_LightColor;\n' +     // Light color
        'uniform vec3 u_LightPosition;\n' +  // Position of the light source
        'uniform vec3 u_AmbientLight;\n' +   // Ambient light color
        'varying vec3 v_Normal;\n' +
        'varying vec3 v_Position;\n' +
        'varying vec4 v_Color;\n' +
        'void main() {\n' +
        // Normalize the normal because it is interpolated and not 1.0 in length any more
        '  vec3 normal = normalize(v_Normal);\n' +
        // Calculate the light direction and make its length 1.
        '  vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
        // The dot product of the light direction and the orientation of a surface (the normal)
        '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
        // Calculate the final color from diffuse reflection and ambient reflection
        '  vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n' +
        '  vec3 ambient = u_AmbientLight * v_Color.rgb;\n' +
        '  gl_FragColor = vec4(diffuse + ambient, v_Color.a);\n' +
        '}\n';
        
        vertices    :Float32Array   = null;
        colors      :Float32Array   = null;
        indices     :Uint8Array     = null;
        normals     :Float32Array   = null;
        gl          :WebGLRenderingContext=null;
        program     :WebGLProgram = null;
        shadertool  :shaderUtils = null;

        //变量类型
        u_ModelMatrix:WebGLUniformLocation = null;
        u_MvpMatrix :WebGLUniformLocation  = null;
        u_NormalMatrix:WebGLUniformLocation= null;
        u_LightColor:WebGLUniformLocation  = null;
        u_LightPosition:WebGLUniformLocation=null;
        u_AmbientLight:WebGLUniformLocation =null;

        //
        Cylinder = null;
        info = null;
        constructor(){
            super();
            this.name = 'cylinder';

            this.shadertool = new shaderUtils();
            this.gl = GL;
            var obj = this.shadertool.initShaders(GL,this.vertex,this.fragment);
            if(!obj.status){
                console.log("failed to init shader");
                return;
            }
            this.program = obj.program;
            this.initCylinderInfo();
        }
        /**
         * 生命周期函数
         */
        // onload(){
        // }
        onUpdate(dt){
            this._draw();
        }
        _draw(){
            if(this.program && this.info){
                GL.useProgram(this.program);

                var a_Position      = GL.getAttribLocation(this.program, 'a_Position');
                var a_Color         = GL.getAttribLocation(this.program, 'a_Color');
                var a_Normal        = GL.getAttribLocation(this.program, 'a_Normal');
    
                var u_ModelMatrix   = GL.getUniformLocation(this.program, 'u_ModelMatrix');
                var u_MvpMatrix     = GL.getUniformLocation(this.program, 'u_MvpMatrix');
                var u_NormalMatrix  = GL.getUniformLocation(this.program, 'u_NormalMatrix');
                var u_LightColor    = GL.getUniformLocation(this.program, 'u_LightColor');
                var u_LightPosition = GL.getUniformLocation(this.program, 'u_LightPosition');
                var u_AmbientLight  = GL.getUniformLocation(this.program, 'u_AmbientLight');
    
                if (a_Position < 0 || a_Color<0 || a_Normal<0) {
                    console.log('Failed to get the attribute storage location');
                    return;
                }
    
                if (!u_ModelMatrix||!u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition　|| !u_AmbientLight ) {
                    console.log('Failed to get the unifrom storage location');
                    return;
                }
    
                this.initAttributeVariable(GL,a_Position,this.Cylinder.vertex);
                this.initAttributeVariable(GL,a_Color,this.Cylinder.color);
                this.initAttributeVariable(GL,a_Normal,this.Cylinder.normal);
                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.Cylinder.index.buffer)
    
    
    
    
                // Set the light color (white)
                GL.uniform3fv(u_LightColor,sceneInfo.LigthColor);
                // Set the light direction (in the world coordinate)
                GL.uniform3fv(u_LightPosition,sceneInfo.LigthPoint);
                // Set the ambient light
                GL.uniform3fv(u_AmbientLight,sceneInfo.AmbientLight);
    
                // Pass the model matrix to u_ModelMatrix
                GL.uniformMatrix4fv(u_ModelMatrix, false, this.getModelMatrix().elements);
                // Pass the model view projection matrix to u_MvpMatrix
                GL.uniformMatrix4fv(u_MvpMatrix, false, this.getMvpMatrix().elements);
                // Pass the matrix to transform the normal based on the model matrix to u_NormalMatrix
                GL.uniformMatrix4fv(u_NormalMatrix, false, this.getNormalMatrix().elements);
        
                // Draw the Cylinder
                GL.drawElements(GL.TRIANGLES, this.Cylinder.numIndices, GL.UNSIGNED_BYTE, 0);
            }
        }
        getVertex():string{
            return this.vertex;
        }
        getFragment():string{
            return this.fragment;
        }
        /**
         * 生成单位立方体，位于原点
         */
        initCylinderInfo(){
            var obp = new OBJParser('./resources/cylinder.obj');
            obp.readOBJFile('./resources/cylinder.obj',1,true,function(){
                this.info = obp.getDrawingInfo();
                this.vertices = this.info.vertices;
                this.normals  = this.info.normals;
                this.colors   = this.info.colors;
                this.indices  = this.info.indices;
                this.Cylinder = this.initVertexBuffer(this.vertices,this.colors,this.normals,this.program,this.indices);  
                console.log(this.info);
            }.bind(this));
        }
        /**
         * 初始化obj数据，全局只需绑定一次
         * @param vertices 顶点矩阵
         * @param colors 颜色矩阵
         * @param normals 法向量矩阵
         * @param program　对应的着色器程序 
         * @param indices 索引矩阵
         */
        initVertexBuffer(vertices:Float32Array, colors:Float32Array,normals:Float32Array,program:WebGLProgram,indices:Uint8Array){
            var CylinderObj = {
                vertex:null,
                color:null,
                normal:null,
                index:null,
                numIndices:null,
            };
            CylinderObj.vertex = this.initArrayBufferForLaterUse(GL,vertices,3,GL.FLOAT);
            CylinderObj.color  = this.initArrayBufferForLaterUse(GL,colors,4,GL.FLOAT);
            CylinderObj.normal = this.initArrayBufferForLaterUse(GL,normals,3,GL.FLOAT);
            CylinderObj.index  = this.initElementArrayBufferForLaterUse(GL,indices,GL.UNSIGNED_BYTE);           
            
            if(!CylinderObj.vertex ||!CylinderObj.color||!CylinderObj.normal||!CylinderObj.index){
                console.log("failed to init buffer");return null;
            }
            CylinderObj.numIndices = indices.length;

            GL.bindBuffer(GL.ARRAY_BUFFER, null);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);

            return CylinderObj;
        }
    }
        
}