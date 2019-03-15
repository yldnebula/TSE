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
var draw = null;
//************ */
main();
function main(){
    var ne = new Nebula('canvas', canvas.width, canvas.height);//gl作为全局变量
    GL = ne.GL;
    ne.setPerspectiveCamera(30,1,100);
    sceneInfo.initScene();

    

    var Cube = new cube(); 
    Cube.setScale(1,1,1);
    Cube._draw();
    var cube2 = new cube();
    cube2.setTranslate(0,3,0);
    cube2._draw();
    draw = function(){
        cube2._draw();
        Cube._draw();
    }
    // tick();
    console.log(Cube.program == cube2.program)
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
            
            var factor = 50/canvas.height;
            var dx = factor*(x - lastX);
            var dy = factor*(y - lastY);
            Cube.setRotation(0, dx,0);
            // Cube._draw();
        }
        lastX = x;
        lastY = y;
    }

}
function tick(){
    draw();
    requestAnimationFrame(tick);
}


