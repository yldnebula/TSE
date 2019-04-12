namespace shader{
    /**
     * 所有３维物体的子类，实现基本方法
     */
    export class NEObject{
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
        private _modelMatrix:Matrix4 = new Matrix4(null);//模型矩阵
        private _mvpMatrix:Matrix4   = new Matrix4(null);//模型视图投影矩阵
        private _normalMatrix:Matrix4= new Matrix4(null);//法向量变换矩阵
     
        scale = new Vector3(1,1,1);
        rotation = new Quat();
        position = new Vector3();

        public program     :WebGLProgram = null;
        public OBJInfo  = null;
        public vertices;
        public name  = '';
        public Child = [];
        public parent:NEObject | Scene = null;
        public boundingBox:BoundingBox = new BoundingBox(null);
        constructor(){
            this.onLoad();
            this.onStart();
        }
        onLoad(){

        }
        onStart(){

        }
        /**
         * 帧刷新函数，每帧调用
         */
        onUpdate(dt:number){
            // this._draw();
        }
        _draw(program,OBJ){
            if(program && OBJ){
                GL.useProgram(program);

                var a_Position      = GL.getAttribLocation(program, 'a_Position');
                var a_Color         = GL.getAttribLocation(program, 'a_Color');
                var a_Normal        = GL.getAttribLocation(program, 'a_Normal');
    
                var u_ModelMatrix   = GL.getUniformLocation(program, 'u_ModelMatrix');
                var u_MvpMatrix     = GL.getUniformLocation(program, 'u_MvpMatrix');
                var u_NormalMatrix  = GL.getUniformLocation(program, 'u_NormalMatrix');
                var u_LightColor    = GL.getUniformLocation(program, 'u_LightColor');
                var u_LightPosition = GL.getUniformLocation(program, 'u_LightPosition');
                var u_AmbientLight  = GL.getUniformLocation(program, 'u_AmbientLight');
    
                if (a_Position < 0 || a_Color<0 || a_Normal<0) {
                    console.log('Failed to get the attribute storage location');
                    return;
                }
    
                if (!u_ModelMatrix||!u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition　|| !u_AmbientLight ) {
                    console.log('Failed to get the unifrom storage location');
                    return;
                }
    
                this.initAttributeVariable(GL,a_Position,OBJ.vertex);
                this.initAttributeVariable(GL,a_Color,OBJ.color);
                this.initAttributeVariable(GL,a_Normal,OBJ.normal);
                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, OBJ.index.buffer)
    
    
    
    
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
                GL.drawElements(GL.TRIANGLES, OBJ.numIndices, GL.UNSIGNED_SHORT, 0);
            }
        }
        _loop(dt){
            this.onUpdate(dt);
            requestAnimationFrame(this._loop.bind(this));
        }
        onDestroy(){

        }
        /**
         * 父子层级函数
         * 添加孩子,需要判断是否添加了自己上级或自身
         */
        addChild(object:NEObject){
            this.Child.push(object);
            object.parent = this;
        }
        /**
         * 设置父节点
         */
        setParent(object:Scene|NEObject){
            if(!!object){
                if(!!this.parent){
                    var idx = this.parent.Child.indexOf(this);//判断是否是第一次设置父节点
                    if(idx != -1){
                        this.parent.Child.splice(idx, 1);
                    }
                }
                object.Child.push(this);
                this.parent = object;
            }else{
                console.error("you can not set a child NEobject to null");
                return;
            }
        }
        getParent(){
            return this.parent;
        }
        setRotation(x: Quat): this;
        setRotation(x: number, y: number, z: number, w: number): this;
        setRotation(x?, y?, z?, w?) {
            let rotation: Quat;
            if (x instanceof Quat) {
                rotation = x;
            } else {
                rotation = new Quat(x, y, z, w);
            }
            this.rotation.copy(rotation);
            return this;
        }
        setRotationFromAxis(axis:Vector3,angle:number,isRadian:boolean):this{
            let rotation: Quat;
            var alpha = isRadian?angle:angle*Math.PI/180;//修改为右手定则
            axis = axis.normalize();
            
            var x= Math.sin(alpha/2)*axis.x;
            var y= Math.sin(alpha/2)*axis.y;
            var z= Math.sin(alpha/2)*axis.z;
            var w= Math.cos(alpha/2)
                
            rotation = new Quat(x, y, z, w);

            this.rotation.copy(rotation);
            return this;
        }
        rotateLocal(x: Vector3): this;
        rotateLocal(x: number, y: number, z: number): this;
        rotateLocal(x?, y?, z?) {
            let quaternion = new Quat();
            if (x instanceof Vector3) {
                quaternion.setFromEulerAngles(x.elements[0], x.elements[1], x.elements[2]);
            } else {
                quaternion.setFromEulerAngles(x, y, z);
            }
    
            this.rotation.mul(quaternion);
            return this;
        }
        rotateFromAxis(axis:Vector3,angle:number,isRadian:boolean){
            let rotation: Quat;
            var alpha = isRadian?angle:angle*Math.PI/180;//修改为右手定则
            axis = axis.normalize();
            
            var x= Math.sin(alpha/2)*axis.x;
            var y= Math.sin(alpha/2)*axis.y;
            var z= Math.sin(alpha/2)*axis.z;
            var w= Math.cos(alpha/2)

            rotation = new Quat(x, y, z, w);
            this.rotation.mul(rotation);
            return this;
        }
        setLocalEulerAngles(x: Vector3): this;
        setLocalEulerAngles(x: number, y: number, z: number): this;
        setLocalEulerAngles(x?, y?, z?) {
            if (x instanceof Vector3) {
                this.rotation.setFromEulerAngles(x.elements[0], x.elements[1], x.elements[2]);
            } else {
                this.rotation.setFromEulerAngles(x, y, z);
            }
            return this;
        }
        setLocalPosition(x: Vector3): this;
        setLocalPosition(x: number, y: number, z: number): this;
        setLocalPosition(x?, y?, z?) {
            if (x instanceof Vector3) {
                this.position.copy(x);
            } else {
                this.position.set(x, y, z);
            }
            return this;
        }
        setLocalScale(x: Vector3): this;
        setLocalScale(x: number, y: number, z: number): this;
        setLocalScale(x?, y?, z?) {
            if (x instanceof Vector3) {
                this.scale.copy(x);
            } else {
                this.scale.set(x, y, z);
            }
            return this;
        }
        translate(x: Vector3): this;
        translate(x: number, y: number, z: number): this;
        translate(x?, y?, z?) {
            let translation: Vector3;
            if (x instanceof Vector3) {
                translation = x.clone();
            } else {
                translation = new Vector3(x, y, z);
            }
            translation.add(this.position);
            this.setLocalPosition(translation);
            return this;
        }

        /**
         * 模型变换函数
         */
        // setPosition(x:number,y:number,z:number){

        // }
        // setRotation(x:number,y:number,z:number){

        // }
        // setRotationFromQuaternion(axis:Vector3,angle:number,isRadian:boolean){//看看能不能做，从旋转矩阵读取当前xyz轴旋转角度?
        //     // this._modelMatrix.setRotateFromQuaternion(axis,angle,isRadian);

        //     this._rotateMatrix.setRotateFromQuaternion(axis,angle,isRadian);

        //     this._modelMatrix =this.setTRS(this._transMatrix,this._rotateMatrix,this._scaleMatrix);

        //     this._mvpMatrix.set(camera.projViewMatrix).multiply(this._modelMatrix);
        //     this._normalMatrix.setInverseOf(this._modelMatrix);
        //     this._normalMatrix.transpose();
        //     this.boundingBox.updateBoundingBox();

        //     for(var child of this.Child){
        //         child.setRotationFromQuaternion(axis,angle,isRadian)
        //     }
        // }
        // rotateByQuaternion(axis:Vector3,angle:number,isRadian:boolean){
        //     // this._modelMatrix.rotateByQuaternion(axis,angle,isRadian);

        //     this._rotateMatrix.rotateByQuaternion(axis,angle,isRadian);
        //     this._modelMatrix =this.setTRS(this._transMatrix,this._rotateMatrix,this._scaleMatrix);


        //     this._mvpMatrix.set(camera.projViewMatrix).multiply(this._modelMatrix);
        //     this._normalMatrix.setInverseOf(this._modelMatrix);
        //     this._normalMatrix.transpose();
        //     this.boundingBox.updateBoundingBox();

        //     for(var child of this.Child){
        //         child.rotateByQuaternion(axis,angle,isRadian)
        //     }
        // }
        // setTranslate(x:number,y:number,z:number){

        //     // this._modelMatrix.translate(x,y,z);
        //     // this._worldMatrix.translate(x,y,z);//保存一下现在的世界坐标矩阵

        //     this._transMatrix.translate(x,y,z);
        //     this._modelMatrix =this.setTRS(this._transMatrix,this._rotateMatrix,this._scaleMatrix);

        //     this._mvpMatrix.set(camera.projViewMatrix).multiply(this._modelMatrix);
        //     this._normalMatrix.setInverseOf(this._modelMatrix);
        //     this._normalMatrix.transpose();

        //     this.boundingBox.updateBoundingBox();

        //     for(var child of this.Child){
        //         child.setTranslate(x,y,z)
        //     }
        // }
        // setScale(x:number,y:number,z:number){

        
        //     this._scaleMatrix.setScale(x,y,z);
        //     this._modelMatrix =this.setTRS(this._transMatrix,this._rotateMatrix,this._scaleMatrix);

        //     this._mvpMatrix.set(camera.projViewMatrix).multiply(this._modelMatrix);
        //     this._normalMatrix.setInverseOf(this._modelMatrix);
        //     this._normalMatrix.transpose();

        //     this.boundingBox.updateBoundingBox();
        // }
        // Rotate(x:number,y:number,z:number){//注意此处的x,y,z是角度增量，而非最终角度，调用时候请注意


        //     if(x != 0){
        //         this._rotateMatrix.rotate(x,1,0,0);
        //     }
        //     if(y != 0){
        //         this._rotateMatrix.rotate(y,0,1,0);
        //     }
        //     if(z != 0){
        //         this._rotateMatrix.rotate(z,0,0,1);
        //     }
        //     this._modelMatrix =this.setTRS(this._transMatrix,this._rotateMatrix,this._scaleMatrix);
            

        //     this._mvpMatrix.set(camera.projViewMatrix).multiply(this._modelMatrix);
        //     this._normalMatrix.setInverseOf(this._modelMatrix);
        //     this._normalMatrix.transpose();

        //     this.boundingBox.updateBoundingBox();

        //     for(var child of this.Child){
        //         child.setRotation(x,y,z)
        //     }
        // }
        // setTRS(T:Matrix4, R:Matrix4, S:Matrix4){
        //     var tr = T.multiply(R);
        //     var ret = tr.multiply(S)
        //     return ret;
        // }

        getModelMatrix():Matrix4{
            this._modelMatrix = new Matrix4(null).setTRS(this.position,this.rotation,this.scale);
            return this._modelMatrix;
        }
        getMvpMatrix():Matrix4{
            this._modelMatrix = new Matrix4(null).setTRS(this.position,this.rotation,this.scale);
            this._mvpMatrix.set(camera.projViewMatrix).multiply(this._modelMatrix);
            return this._mvpMatrix;
        }
        getNormalMatrix():Matrix4{
            this._modelMatrix = new Matrix4(null).setTRS(this.position,this.rotation,this.scale);
            this._normalMatrix = new Matrix4(null).setInverseOf(this._modelMatrix).transpose();
            return this._normalMatrix;
        }
        onClick(){

        }
        onDrag(){

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
        initOBJInfo(target:NEObject,path,callBack){
            var obp = new OBJParser(path);
            obp.readOBJFile(path,1/60,true,function(){
                var info = obp.getDrawingInfo();
                // console.log(target)
                target.vertices = info.vertices;
                target.OBJInfo = target.initVertexBuffer(info.vertices,info.colors,info.normals,info.indices);  
                target.boundingBox = new BoundingBox(target);
                // console.log(this.Pipe);
                if(typeof callBack == "function")callBack();
            }.bind(target));
        }
    }
}
