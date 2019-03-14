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

        }
        init(){

        }
        setTranslate(x:number,y:number,z:number){
            this.coordinate.x +=x;
            this.coordinate.y +=y;
            this.coordinate.z +=z;
            this._modelMatrix.translate(x,y,z);

            this._mvpMatrix = sceneInfo.projViewMatrix.multiply(this._modelMatrix);
            this._normalMatrix.setInverseOf(this._modelMatrix);
            this._normalMatrix.transpose();
        }
        setScale(x:number,y:number,z:number){
            this.scale.x =x;
            this.scale.y =y;
            this.scale.z =z;
            this._modelMatrix.scale(x,y,z);
            
            this._mvpMatrix = sceneInfo.projViewMatrix.multiply(this._modelMatrix);
            this._normalMatrix.setInverseOf(this._modelMatrix);
            this._normalMatrix.transpose();
        }
        setRotation(x:number,y:number,z:number){
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
            this._mvpMatrix = sceneInfo.projViewMatrix.multiply(this._modelMatrix);
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

        onDestroy(){

        }
    }
}
