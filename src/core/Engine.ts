namespace Engine{
    export class Nebula{
        GL:WebGLRenderingContext = null;
        canvas:HTMLCanvasElement = null;
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
    }
}