namespace shader{
    export class Shader{
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
        // '  vec4 n_color = vec4(1.0,1.0,0.0,1.0);\n' +
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

        private _modelMatrix:Matrix4 = new Matrix4(null);//模型矩阵
        private _mvpMatrix:Matrix4   = new Matrix4(null);//模型视图投影矩阵
        private _normalMatrix:Matrix4= new Matrix4(null);//法向量变换矩阵
        
        program:WebGLProgram = null;
        a_Position  = -1;
        a_Color     = -1;
        a_Normal    = -1;

        u_ModelMatrix:WebGLUniformLocation      = null;
        u_MvpMatrix:WebGLUniformLocation        = null;
        u_NormalMatrix:WebGLUniformLocation     = null;
        u_LightColor:WebGLUniformLocation       = null;
        u_LightPosition:WebGLUniformLocation    = null;
        u_AmbientLight:WebGLUniformLocation     = null;

        OBJ = null;//各类数组
        constructor(){
            this.initShader(this);
            this.a_Position      = GL.getAttribLocation(this.program, 'a_Position');
            this.a_Color         = GL.getAttribLocation(this.program, 'a_Color');
            this.a_Normal        = GL.getAttribLocation(this.program, 'a_Normal');
    
            this.u_ModelMatrix   = GL.getUniformLocation(this.program, 'u_ModelMatrix');
            this.u_MvpMatrix     = GL.getUniformLocation(this.program, 'u_MvpMatrix');
            this.u_NormalMatrix  = GL.getUniformLocation(this.program, 'u_NormalMatrix');
            this.u_LightColor    = GL.getUniformLocation(this.program, 'u_LightColor');
            this.u_LightPosition = GL.getUniformLocation(this.program, 'u_LightPosition');
            this.u_AmbientLight  = GL.getUniformLocation(this.program, 'u_AmbientLight');
        }
        draw(){
            if(this.program && this.OBJ){
                GL.useProgram(this.program);
                if (this.a_Position < 0 || this.a_Color<0 || this.a_Normal<0) {
                    console.log('Failed to get the attribute storage location');
                    return;
                }
    
                if (!this.u_ModelMatrix||!this.u_MvpMatrix || !this.u_NormalMatrix || !this.u_LightColor || !this.u_LightPosition　|| !this.u_AmbientLight ) {
                    console.log('Failed to get the unifrom storage location');
                    return;
                }
    
                this.initAttributeVariable(GL,this.a_Position, this.OBJ.vertex);
                this.initAttributeVariable(GL,this.a_Color, this.OBJ.color);
                this.initAttributeVariable(GL,this.a_Normal, this.OBJ.normal);
                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,  this.OBJ.index.buffer)

                // Set the light color (white)
                GL.uniform3fv(this.u_LightColor,sceneInfo.LigthColor);
                // Set the light direction (in the world coordinate)
                GL.uniform3fv(this.u_LightPosition,sceneInfo.LigthPoint);
                // Set the ambient light
                GL.uniform3fv(this.u_AmbientLight,sceneInfo.AmbientLight);

                // Pass the model matrix to u_ModelMatrix
                GL.uniformMatrix4fv(this.u_ModelMatrix, false, this._modelMatrix.elements);
                // Pass the model view projection matrix to u_MvpMatrix
                GL.uniformMatrix4fv(this.u_MvpMatrix, false, this._mvpMatrix.elements);
                // Pass the matrix to transform the normal based on the model matrix to u_NormalMatrix
                GL.uniformMatrix4fv(this.u_NormalMatrix, false, this._normalMatrix.elements);
        
                // Draw the Cylinder
                GL.drawElements(GL.TRIANGLES,  this.OBJ.numIndices, GL.UNSIGNED_SHORT, 0);
            }
        }
        //每帧绘制之前计算一下当前的矩阵信息
        calculateMatrix(position,rotation,scale){
            this._modelMatrix = new Matrix4(null).setTRS(position, rotation, scale);
            this._mvpMatrix.set(camera.projViewMatrix).multiply(this._modelMatrix);
            this._normalMatrix = new Matrix4(null).setInverseOf(this._modelMatrix).transpose();
        }
        /**
         * 初始化各缓存区
         * @param gl 上下文
         * @param data 源数据
         * @param num 单位数据长度
         * @param type 单位类型
         */
        initArrayBufferForLaterUse(gl:WebGLRenderingContext, data:Float32Array, num:number, type:number){
            var arrBufferObj = {
                buffer:null,
                num:null,
                type:null
            };
            arrBufferObj.num = num;
            arrBufferObj.type = type;

            arrBufferObj.buffer = gl.createBuffer();
            if(!arrBufferObj.buffer){
                console.log("failed to create buffer");return null;
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, arrBufferObj.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

            return arrBufferObj;
        }
        /**
         * 初始化索引数组
         * @param gl 上下文
         * @param data 源数据
         * @param type 索引源数据类型
         */
        initElementArrayBufferForLaterUse(gl:WebGLRenderingContext, data:Uint16Array, type:number){
            var eleBufferObj = {
                buffer:null,
                type:null,
            };
            eleBufferObj.type = type;
            eleBufferObj.buffer = gl.createBuffer();　  // Create a buffer object
            if (!eleBufferObj.buffer) {
              console.log('Failed to create the buffer object');
              return null;
            }
            // Write date into the buffer object
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eleBufferObj.buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
          
            return eleBufferObj;
        }
        /**
         * 分配缓冲区对象并且激活分配
         * @param gl 上下文
         * @param a_attribute 属性名
         * @param buffer 缓冲区数据
         */
        initAttributeVariable(gl:WebGLRenderingContext, a_attribute, bufferObj){
            gl.bindBuffer(gl.ARRAY_BUFFER,bufferObj.buffer);
            gl.vertexAttribPointer(a_attribute, bufferObj.num, bufferObj.type, false, 0,0);
            gl.enableVertexAttribArray(a_attribute);
        }
        /**
         * 初始化obj数据，全局只需绑定一次
         * @param vertices 顶点矩阵
         * @param colors 颜色矩阵
         * @param normals 法向量矩阵
         * @param program　对应的着色器程序 
         * @param indices 索引矩阵
         */
        initVertexBuffer(vertices:Float32Array, colors:Float32Array,normals:Float32Array,indices:Uint16Array){
            var OBJ = {
                vertex:null,
                color:null,
                normal:null,
                index:null,
                numIndices:null,
            };
            OBJ.vertex = this.initArrayBufferForLaterUse(GL,vertices,3,GL.FLOAT);
            OBJ.color  = this.initArrayBufferForLaterUse(GL,colors,4,GL.FLOAT);
            OBJ.normal = this.initArrayBufferForLaterUse(GL,normals,3,GL.FLOAT);
            OBJ.index  = this.initElementArrayBufferForLaterUse(GL,indices,GL.UNSIGNED_SHORT);           
            
            if(!OBJ.vertex ||!OBJ.color||!OBJ.normal||!OBJ.index){
                console.log("failed to init buffer");return null;
            }
            OBJ.numIndices = indices.length;

            GL.bindBuffer(GL.ARRAY_BUFFER, null);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);

            return OBJ;
        }
        initShader(target){
            var shadertool = new shaderUtils();
            var obj = shadertool.initShaders(GL,target.vertex,target.fragment);
            if(!obj.status){
                console.log("failed to init shader");
                return;
            }
            target.program = obj.program;
        }
    }
}