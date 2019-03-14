namespace Engine{
    export class Nebula{
        GL:WebGLRenderingContext = null;
        canvas:HTMLCanvasElement = null;
        projectMatrix:Matrix4    = null;
        eye = {
            x:6,
            y:6,
            z:14
        };
        center = {
            x:0,
            y:0,
            z:0
        }
        constructor(id:string, width:number, height:number){
            this.canvas =this.getCanvasByID(id, width, height);
            console.log(this.canvas);
            this.GL = this.create3DContext(this.canvas);
        }
        /**
         * 创建一个画布
         * @param id 画布id
         * @param width 画布宽度
         * @param height 画布高度
         */
        private getCanvasByID(id:string, width:number, height:number):HTMLCanvasElement|any{
            var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.createElement('canvas');
            
            if(!canvas){
                console.log("cannot get canvas by id:"+id);
                return null;
            }
            canvas.width = width;
            canvas.height= height;
            canvas.style.margin = "30px auto auto auto";
            canvas.id = id;
            console.log();
            document.body.style.margin = "0px";
            document.body.style.textAlign = "center";
            document.body.appendChild(canvas);

            return canvas;
        }
        /**
         * 通过canvas获取gl上下文,兼容各浏览器
         * @param canvas 页面canvas元素
         */
        private create3DContext(canvas:HTMLCanvasElement):WebGLRenderingContext | any{
            var name:string[] = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            for(var i = 0; i < name.length; i++){
                try{
                    var context:WebGLRenderingContext = <WebGLRenderingContext>this.canvas.getContext(name[i]);
                    if(context){
                        return context;
                    }
                }catch(e){
                    console.log("error"+e);
                    return null;
                }
            }
            return null;
        }
        setEyePoint(x:number,y:number,z:number){
            this.eye.x = x;
            this.eye.y = y;
            this.eye.z = z;
        }
        setAtCenter(x:number,y:number,z:number){
            this.center.x = x;
            this.center.y = y;
            this.center.z = z;
        }
        /**
         * 设置透视摄像机
         */
        setPerspectiveCamera(fovy:number, near:number, far:number){
            this.projectMatrix = new Matrix4(null);
            this.projectMatrix.setPerspective(fovy,canvas.width/canvas.height,near,far);
            this.projectMatrix.lookAt(this.eye.x, this.eye.y, this.eye.z,this.center.x,this.center.y,this.center.z,0,1,0);
            sceneInfo.projViewMatrix = this.projectMatrix;
        }
        /**
         * 设置正视摄像机
         */
        setOrthoCamera(){

        }
        setLightTypeColorPoint(type:number, color:Vector4, point:Vector3){

        }
    }
    export class SceneInfo{
        static instanceCount = 0;

        SceneInfo:SceneInfo = null;
        LigthColor:Float32Array = new Float32Array([1.0,1.0,1.0]);
        LigthPoint:Float32Array = new Float32Array([2.3, 4.0, 3.5]);
        AmbientLight:Float32Array = new Float32Array([0.2, 0.2, 0.2]);;
        projViewMatrix:Matrix4 = null;

        constructor(){
            if(SceneInfo.instanceCount == 0){
                SceneInfo.instanceCount ++;
                this.SceneInfo = new SceneInfo();
                return this.SceneInfo;
            }else{
                return this.SceneInfo;
            }
        }
        initScene(){
            GL.clearColor(0,0,0,1.0);
            GL.enable(GL.DEPTH_TEST);
        }
    }
    export class Event{
        constructor(){

        }
        emit(){

        }
        listen(){

        }
        /**
         * 鼠标事件
         */
        onMouseMove(){

        }
        onMouseDown(){

        }
        onMouseUp(){

        }
        onMouseClick(){

        }
    }
}