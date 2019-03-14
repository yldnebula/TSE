///<reference path="./core/Engine.ts" />
///<reference path="../lib/shader-utils/shaderUtils.ts" />
///<reference path="../lib/matrix-utils/matrixUtils.ts" />
///<reference path="./shader/Cube.ts" />

import Nebula = Engine.Nebula;
import SceneInfo = Engine.SceneInfo;
import shaderUtils = Utils.ShaderUtils;
import Matrix4 = Utils.Matrix4;
import Vector3 = Utils.Vector3;
import Vector4 = Utils.Vector4;
import cube = shader.Cube;
import NEObject = shader.NEObject;

//************全局变量Global****************** */
const shaderTool = new shaderUtils();
var GL:WebGLRenderingContext = null;
var sceneInfo = new SceneInfo();
const canvas={
    width:400,
    height:400,
}
//https://blog.csdn.net/charlee44/article/details/87553067#4_421
//************ */
main();
function main(){
    var ne = new Nebula('canvas', canvas.width, canvas.height);//gl作为全局变量
    GL = ne.GL;
    ne.setPerspectiveCamera(30,1,100);
    sceneInfo.initScene();

    

    var Cube = new cube(); 
    Cube.setScale(4,4,4);
    Cube.update(0);
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

        var pixels = new Uint8Array(4);
        GL.readPixels(x, y, 1, 1, GL.RGBA, GL.UNSIGNED_BYTE, pixels);
        console.log(pixels);        
        if(pixels[0] == 255){
            isPick = 1;
            console.log("pick");
            Cube.update(isPick);
        }
    }
    ca.onmouseup=function(ev){
        var x = ev.clientX,y = ev.clientY;
        isDrag = false;
    }
    ca.onmousemove=function(ev){
        var x = ev.clientX,y=ev.clientY;
        if(!isDrag)return;
        if(ev.layerX <= canvas.width && ev.layerX >= 0 && ev.layerY >=0 && ev.layerY <=canvas.height){
            
            var factor = 0.01/canvas.height;
            var dx = factor*(x - lastX);
            var dy = factor*(y - lastY);
            currentAngle[0] = Math.max(Math.min(currentAngle[0]+dy, 90), -90);
            currentAngle[1] = currentAngle[1]+dx;
            Cube.setRotation(currentAngle[0], currentAngle[1],0);
            Cube.update(isPick);
        }
        lastX = x;
        lastY = y;
    }
    
}


