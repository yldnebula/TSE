namespace Core{
    export class Camera{
        coordinate={
            x:0,y:8,z:14
        };
        center={
            x:0,y:0,z:0
        };
        projectMatrix = new Matrix4(null);
        projViewMatrix = new Matrix4(null);
        constructor(fovy:number,aspect:number, near:number, far:number){
            this.setPerspectiveCamera(fovy,aspect,near,far);
        }
        setCoordinatePoint(x:number,y:number,z:number){
            this.coordinate.x = x;
            this.coordinate.y = y;
            this.coordinate.z = z;
        }
        setCenter(x:number,y:number,z:number){
            this.center.x = x;
            this.center.y = y;
            this.center.z = z;
        }
        /**
         * 设置透视摄像机
         */
        setPerspectiveCamera(fovy:number,aspect:number, near:number, far:number){
            this.projectMatrix = new Matrix4(null);
            this.projectMatrix.setPerspective(fovy,aspect,near,far);
            this.projectMatrix.lookAt(this.coordinate.x, this.coordinate.y, this.coordinate.z,this.center.x,this.center.y,this.center.z,0,1,0);
            this.projViewMatrix = this.projectMatrix; 
        }
        updateGLIFCamera(factor){
            var nowN = camera.getSightDirection(1);
            nowN = camera.getSightDirection(1+factor);

            camera.setCoordinatePoint(camera.center.x-nowN[0],camera.center.y-nowN[1],camera.center.z-nowN[2])
            camera.setPerspectiveCamera(85,canvas.width/canvas.height,1,100)
        }
        /**
         * 设置正视摄像机,暂时不用开发
         */
        setOrthoCamera(){

        }
        /**
         * 获取视线方向向量
         * @param ratio 对方向向量的扩大缩小比率，不改为１
         */
        getSightDirection(ratio:number):number[]{
            var ret = [];
            ret[0] = (this.center.x -this.coordinate.x)*ratio;
            ret[1] = (this.center.y -this.coordinate.y)*ratio;
            ret[2] = (this.center.z -this.coordinate.z)*ratio;
            return ret;
        }
    }
}