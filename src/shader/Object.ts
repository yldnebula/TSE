namespace shader{
    /**
     * 所有３维物体的子类，实现基本方法
     */
    export class NEObject{
        coordinate = {
            x:0,
            y:0,
            z:0
        }
        rotation ={
            x:0,
            y:0,
            z:0
        }
        scale = {
            x:1,
            y:1,
            z:1
        }
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

        public vertices;
        public name  = '';
        public Child = [];
        public parent:NEObject | Scene = null;
        public boundingBox:BoundingBox = null;
        constructor(){
            
            this.onLoad();
            this.onStart();
            // var nowScene = ne.getScene();
            // if(!!nowScene){
            //     nowScene.addUpdateEvents(this.onUpdate.bind(this));
            // }
            // this._loop();

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
        _draw(){

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

        /**
         * 模型变换函数
         */
        setTranslate(x:number,y:number,z:number){
            this.coordinate.x +=x;
            this.coordinate.y +=y;
            this.coordinate.z +=z;
            this._modelMatrix.translate(x,y,z);

            this._mvpMatrix.set(camera.projViewMatrix).multiply(this._modelMatrix);
            this._normalMatrix.setInverseOf(this._modelMatrix);
            this._normalMatrix.transpose();

            this.boundingBox.updateBoundingBox();

            for(var child of this.Child){
                child.setTranslate(x,y,z)
            }
        }
        setScale(x:number,y:number,z:number){
            this.scale.x =x;
            this.scale.y =y;
            this.scale.z =z;
            this._modelMatrix.scale(x,y,z);
            
            this._mvpMatrix.set(camera.projViewMatrix).multiply(this._modelMatrix);
            this._normalMatrix.setInverseOf(this._modelMatrix);
            this._normalMatrix.transpose();

            this.boundingBox.updateBoundingBox();

            for(var child of this.Child){
                child.setScale(x,y,z)
            }
        }
        setRotation(x:number,y:number,z:number){//注意此处的x,y,z是角度增量，而非最终角度，调用时候请注意
            this.rotation.x +=x;
            this.rotation.y +=y;
            this.rotation.z +=z;
            if(x != 0){
                this._modelMatrix.rotate(x,1,0,0);
            }
            if(y != 0){
                this._modelMatrix.rotate(y,0,1,0);
            }
            if(z != 0){
                this._modelMatrix.rotate(z,0,0,1);
            }
            this._mvpMatrix.set(camera.projViewMatrix).multiply(this._modelMatrix);
            this._normalMatrix.setInverseOf(this._modelMatrix);
            this._normalMatrix.transpose();

            this.boundingBox.updateBoundingBox();

            for(var child of this.Child){
                child.setRotation(x,y,z)
            }
        }
        getModelMatrix():Matrix4{
            return this._modelMatrix;
        }
        getMvpMatrix():Matrix4{
            this._mvpMatrix.set(camera.projViewMatrix).multiply(this._modelMatrix);
            return this._mvpMatrix;
        }
        getNormalMatrix():Matrix4{
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
    }
}
