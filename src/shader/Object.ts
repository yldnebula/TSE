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

        private _modelMatrix:Matrix4 = new Matrix4(null);//模型矩阵
        private _mvpMatrix:Matrix4   = new Matrix4(null);//模型视图投影矩阵
        private _normalMatrix:Matrix4= new Matrix4(null);//法向量变换矩阵

        
        constructor(){
            
            this.onload();
            this._loop();

        }
        onload(){

        }
        onUpdate(){
            this._draw();
        }
        _draw(){

        }
        _loop(){
            this.onUpdate();
            requestAnimationFrame(this._loop.bind(this));
        }
        onDestroy(){

        }


        setTranslate(x:number,y:number,z:number){
            this.coordinate.x +=x;
            this.coordinate.y +=y;
            this.coordinate.z +=z;
            this._modelMatrix.translate(x,y,z);

            this._mvpMatrix.set(sceneInfo.projViewMatrix).multiply(this._modelMatrix);
            this._normalMatrix.setInverseOf(this._modelMatrix);
            this._normalMatrix.transpose();
        }
        setScale(x:number,y:number,z:number){
            this.scale.x =x;
            this.scale.y =y;
            this.scale.z =z;
            this._modelMatrix.scale(x,y,z);
            
            this._mvpMatrix.set(sceneInfo.projViewMatrix).multiply(this._modelMatrix);
            this._normalMatrix.setInverseOf(this._modelMatrix);
            this._normalMatrix.transpose();
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
            this._mvpMatrix.set(sceneInfo.projViewMatrix).multiply(this._modelMatrix);
            this._normalMatrix.setInverseOf(this._modelMatrix);
            this._normalMatrix.transpose();
        }
        getModelMatrix():Matrix4{
            return this._modelMatrix;
        }
        getMvpMatrix():Matrix4{
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
        initElementArrayBufferForLaterUse(gl:WebGLRenderingContext, data:Uint8Array, type:number){
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
