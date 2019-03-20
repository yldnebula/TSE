///<reference path="./core/Engine.ts" />
///<reference path="./core/Scene.ts" />
///<reference path="./core/Render.ts" />
///<reference path="../lib/shader-utils/shaderUtils.ts" />
///<reference path="../lib/matrix-utils/matrixUtils.ts" />
///<reference path="./shader/Cube.ts" />
///<reference path="./shader/Cylinder.ts" />
///<reference path="../lib/parse-utils/objParse.ts" />

import Nebula = Core.Nebula;
import Scene = Core.Scene;
import shaderUtils = Utils.ShaderUtils;
import Matrix4 = Utils.Matrix4;
import Vector3 = Utils.Vector3;
import Vector4 = Utils.Vector4;
import cube = shader.Cube;
import Cylinder = shader.Cylinder;
import NEObject = shader.NEObject;
import OBJParser = Utils.ObjParser;
import Render   =Core.Render;

//************全局变量Global****************** */

const shaderTool = new shaderUtils();
var GL:WebGLRenderingContext = null;
const canvas={
    width:1200,
    height:800,
}
var ne = new Nebula('canvas', canvas.width, canvas.height);//gl作为全局变量
GL = ne.GL;

var sceneInfo = new Scene(0);
ne.addScene(sceneInfo);
ne.setScene(0);

ne.setPerspectiveCamera(30,1,100);
sceneInfo.initScene();

var render = new Render();
//************ */
main();
function main(){
    var Cube = new cube(); 
    Cube.setTranslate(3,0,0);
    var cylinder = new Cylinder();


    cylinder.setParent(ne.getScene());
    Cube.setParent(cylinder);

    render.render(sceneInfo);

    render.stopped = false;//将来可以改变为资源加载完成后自动改为false，开始update
    render.main();


    var ca = document.getElementById('canvas');

    var isDrag:boolean = false;
    var lastX:number = -1;
    var lastY:number = -1;
    var currentAngle:number[] = [0.0, 0.0];
    var isPick = 0;
    ca.onmousedown=function(ev){
        var x = ev.layerX,y = ev.layerY;
        if(ev.layerX <= canvas.width && ev.layerX >= 0 && ev.layerY >=0 && ev.layerY <=canvas.height){
            isDrag = true;
        }

        lastX = x;
        lastY = y;
        var pixels = new Uint8Array(4);
        GL.readPixels(x, y, 1, 1, GL.RGBA, GL.UNSIGNED_BYTE, pixels);//tap点像素颜色测试
        console.log(pixels);        
        if(pixels[0] == 255){
            isPick = 1;
            console.log("pick");
        }
    }
    ca.onmouseup=function(ev){
        var x = ev.clientX,y = ev.clientY;
        isDrag = false;
    }
    ca.onmousemove=function(ev){
        var x = ev.clientX,y=ev.clientY;
        // console.log(ev.target)
        if(!isDrag)return;
        if(ev.layerX <= canvas.width && ev.layerX >= 0 && ev.layerY >=0 && ev.layerY <=canvas.height){
            
            var factor = 300/canvas.height;
            var dx = factor*(x - lastX);
            var dy = factor*(y - lastY);
            Cube.setRotation(0, dx,0);
            cylinder.setTranslate(0, -dy/40,0);
            // cylinder.setScale(1,Math.max(1,Math.min(2,dx/10)),1)
        }
        lastX = x;
        lastY = y;
    }
    
}
