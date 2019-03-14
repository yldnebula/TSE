///<reference path="./Object.ts" />
namespace shader{
    export class Cube extends NEObject{
        private vertex:string    = ''+
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
        '   if(u_Clicked){'+
        '       v_Color = vec4(1.0, 1.0, 0.0, 1.0);'+
        '   }else{'+
        '       v_Color = a_Color;'+
        '   }'+
        '   v_Position = vec3(u_ModelMatrix * a_Position);\n' +
        '   v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
        '   v_Color = a_Color;\n' +
        '}\n';
        private fragment:string  = ''+
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
        constructor(){
            super();

            this.shadertool = new shaderUtils();
            this.gl = GL;
            var obj = this.shadertool.initShaders(GL,this.vertex,this.fragment);
            if(!obj.status){
                console.log("failed to init shader");
                return;
            }
            this.program = obj.program;
            
            this.initCubeInfo();
            this.update(0);
        }
        update(isClicked:number){
            var n = this.initVertexBuffer();

            var u_ModelMatrix   = this.gl.getUniformLocation(this.program, 'u_ModelMatrix');
            var u_MvpMatrix     = this.gl.getUniformLocation(this.program, 'u_MvpMatrix');
            var u_NormalMatrix  = this.gl.getUniformLocation(this.program, 'u_NormalMatrix');
            var u_LightColor    = this.gl.getUniformLocation(this.program, 'u_LightColor');
            var u_LightPosition = this.gl.getUniformLocation(this.program, 'u_LightPosition');
            var u_AmbientLight  = this.gl.getUniformLocation(this.program, 'u_AmbientLight');
            var u_Clicked       = this.gl.getUniformLocation(this.program, 'u_Clicked');

            if (!u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition　|| !u_AmbientLight || !u_Clicked) {
                console.log('Failed to get the storage location');
                return;
            }

            this.gl.uniform1i(u_Clicked, isClicked);

            // Set the light color (white)
            this.gl.uniform3fv(u_LightColor,sceneInfo.LigthColor);
            // Set the light direction (in the world coordinate)
            this.gl.uniform3fv(u_LightPosition,sceneInfo.LigthPoint);
            // Set the ambient light
            this.gl.uniform3fv(u_AmbientLight,sceneInfo.AmbientLight);

            // Pass the model matrix to u_ModelMatrix
            this.gl.uniformMatrix4fv(u_ModelMatrix, false, this.getModelMatrix().elements);
            // Pass the model view projection matrix to u_MvpMatrix
            this.gl.uniformMatrix4fv(u_MvpMatrix, false, this.getMvpMatrix().elements);
            // Pass the matrix to transform the normal based on the model matrix to u_NormalMatrix
            this.gl.uniformMatrix4fv(u_NormalMatrix, false, this.getNormalMatrix().elements);
    
            // Clear color and depth buffer
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            // Draw the cube
            this.gl.drawElements(this.gl.TRIANGLES, n, this.gl.UNSIGNED_BYTE, 0);
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
        initCubeInfo(){
            // Create a cube,
            //    v6----- v5        v0-v1-v2-v3 front
            //   /|      /|         v0-v3-v4-v5 right
            //  v1------v0|         v0-v5-v6-v1 up
            //  | |     | |         v1-v6-v7-v2 left
            //  | |v7---|-|v4       v7-v4-v3-v2 down
            //  |/      |/          v4-v7-v6-v5 back
            //  v2------v3

            //初始化顶点数组，六个面逆时针显示
            this.vertices = new Float32Array([
                0.5, 0.5, 0.5,  -0.5, 0.5, 0.5, -0.5, -0.5, 0.5,    0.5, -0.5, 0.5,
                0.5, 0.5, 0.5,  0.5, -0.5, 0.5, 0.5, -0.5, -0.5,    0.5, 0.5, -0.5,
                0.5, 0.5, 0.5,  -0.5, 0.5, 0.5, -0.5, -0.5, 0.5,    0.5, -0.5, 0.5,
                -0.5,0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5,    -0.5, -0.5, 0.5,
                -0.5,-0.5, -0.5,  0.5, -0.5, -0.5, 0.5, -0.5, 0.5,    0.5, -0.5, 0.5,
                0.5,-0.5, -0.5,  -0.5, -0.5, -0.5, -0.5, 0.5, -0.5,    0.5, 0.5, -0.5
            ]);
            //初始化顶点颜色
            this.colors = new Float32Array([
                1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
                1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
                1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
                1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
                1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
                1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　  
            ]);
            //初始化各面法向量
            this.normals = new Float32Array([
                0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
                1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
                0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
                -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
                0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
                0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0
            ]);
            //初始化顶点索引=>按照顶点数组的24个元素来设置,逆时针三角形
            this.indices = new Uint8Array([
                0, 1, 2,   0, 2, 3,    // front
                4, 5, 6,   4, 6, 7,    // right
                8, 9,10,   8,10,11,    // up
                12,13,14,  12,14,15,    // left
                16,17,18,  16,18,19,    // down
                20,21,22,  20,22,23     // back
            ]);
        }
        initVertexBuffer():number{
            if(!this.initArrayBuffer(this.gl,'a_Position',this.vertices, 3, this.gl.FLOAT))return -1;
            if(!this.initArrayBuffer(this.gl,'a_Color',this.colors, 3, this.gl.FLOAT))return -1;
            if(!this.initArrayBuffer(this.gl,'a_Normal',this.normals, 3, this.gl.FLOAT))return -1;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

            var indexBuffer = this.gl.createBuffer();
            if(!indexBuffer){
                console.log("failed to create index buffer of vertex");
                return -1
            }
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.STATIC_DRAW);

            return this.indices.length;
        }
        initArrayBuffer(gl:WebGLRenderingContext, attribute:string, data:Float32Array, num:number, type:number):boolean{
            var buffer = this.gl.createBuffer();
            if(!buffer){
                console.log("failed to create the buffer object!");
                return false
            }
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);

            var a_attribute = gl.getAttribLocation(this.program,attribute);
            if(a_attribute < 0){
                console.log("failed to get location of "+a_attribute);
                return false;
            }
            this.gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
            this.gl.enableVertexAttribArray(a_attribute);

            return true;
        }
    }
        
}