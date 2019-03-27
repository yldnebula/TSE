namespace Core{
    export class Nebula{
        GL:WebGLRenderingContext = null;
        canvas:HTMLCanvasElement = null;
        projectMatrix:Matrix4    = null;
        eye = {
            x:0,
            y:0,
            z:14
        };
        center = {
            x:0,
            y:0,
            z:0
        }
        private scene:Scene[] =[];
        private nowScene:Scene = null;
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
        /**
         * 导演函数director
         */
        getScene():Scene{
            if(this.nowScene == null){
                return null;
            }else{
                return this.nowScene;
            }
        }
        /**
         * 添加一个场景
         * @param scene 场景对象
         */
        addScene(scene:Scene){
            this.scene.push(scene);
        }
        /**
         * 删除一个场景
         * @param scene 场景对象
         */
        deleteScene(scene:Scene):boolean{
            if(this.scene.indexOf(scene) == -1)return false
            this.scene.splice(this.scene.indexOf(scene),1);
            return true;
        }
        /**
         * 设置当前场景
         * @param scene 场景对象
         * @param index 场景索引
         */
        setScene(id:number){
            for(var i = 0; i < this.scene.length; i++){
                if(this.scene[i].sceneID == id){
                    this.nowScene = this.scene[i];
                    return true;
                }
            }
            console.log("cannot set a scene");
            return false
        }
        /**
         * 引擎生命周期
         */
        _OnLoad(){

        }
        _OnUpdate(){

        }
        _OnDestroy(){

        }
    }
}