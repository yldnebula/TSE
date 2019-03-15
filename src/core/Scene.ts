namespace Core{
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
            GL.clear(GL.COLOR_BUFFER_BIT|GL.DEPTH_BUFFER_BIT);
            GL.enable(GL.DEPTH_TEST);
        }
    }
}