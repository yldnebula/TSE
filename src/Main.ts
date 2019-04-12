///<reference path="./core/Engine.ts" />
///<reference path="./core/Scene.ts" />
///<reference path="./core/Camera.ts" />
///<reference path="./core/Render.ts" />
///<reference path="./lib/RayCaster.ts" />
///<reference path="./lib/BoundingBox.ts" />
///<reference path="../lib/shader-utils/shaderUtils.ts" />
///<reference path="../lib/matrix-utils/matrixUtils.ts" />
///<reference path="./shader/Cube.ts" />
///<reference path="./shader/Pipe.ts" />
///<reference path="./shader/Cylinder.ts" />
///<reference path="../lib/parse-utils/objParse.ts" />
///<reference path="../lib/parse-utils/GLIFParser.ts" />


import Nebula       = Core.Nebula;
import Scene        = Core.Scene;
import Camera       = Core.Camera;
import shaderUtils  = Utils.ShaderUtils;
import Matrix4      = Utils.Matrix4;
import Vector3      = Utils.Vector3;
import Vector4      = Utils.Vector4;
import Quat      = Utils.Quat;
import cube         = shader.Cube;
import Cylinder     = shader.Cylinder;
import NEObject     = shader.NEObject;
import OBJParser    = Utils.ObjParser;
import Render       =Core.Render;
import RayCaster    = Lib.RayCaster;
import BoundingBox  = Lib.BoundingBox;
import GLIFParser   = Utils.GLIFParser;
import Pipe         = shader.Pipe;
import Tee          = shader.Tee;
import Elbow        = shader.Elbow;
import Valve        = shader.Valve;
import GLIFNode     = shader.GLIFNode;

//************全局变量Global****************** */

const shaderTool = new shaderUtils();
var GL:WebGLRenderingContext = null;
const canvas={
    width:1200,
    height:800,
}
var ne = new Nebula('canvas', canvas.width, canvas.height);//gl作为全局变量
GL = ne.GL;
//场景信息
var sceneInfo = new Scene(0);
ne.addScene(sceneInfo);
ne.setScene(0);
sceneInfo.initScene();
//摄像机信息
var camera = new Camera(85,canvas.width/canvas.height,1,1000)
//初始化主控渲染器
var render = new Render();
//初始化GLIF解析器
var gp = new GLIFParser(ne.getScene());
gp.readGilfFile('./glif/inp1.TXT',"");

//******************************************* */
var Cube = new Pipe(1,-1,-1,new Vector3([0,0,0])); 
// var Cube = new Tee();

main();
function main(){
    // Cube.setLocalScale(2,1,1);
    // Cube.setRotationFromAxis(new Vector3(0,0,1),90,false)
    // Cube.rotateFromAxis(new Vector3(0,0,1),-90,false)
    // Cube.setRotation(new Quat(0,0,Math.sqrt(2)/2,Math.sqrt(2)/2))
    // Cube.setLocalScale(4,1,1)
    // Cube.setLocalPosition(new Vector3(3,5,0))
    // Cube.translate(new Vector3(-3,-5,0))
    Cube.setParent(ne.getScene());


    render.render(sceneInfo);

    render.stopped = false;//将来可以改变为资源加载完成后自动改为false，开始update
    render.main();
    // Pipe1.setParent(ne.getScene())

    var RayCaster1 = new RayCaster();

    var ca = document.getElementById('canvas');

    var isDrag:boolean = false;
    var lastX:number = -1;
    var lastY:number = -1;

    var cameraMove = false;

    //被选中的物体
    var objClicked = null;
    var setX = false;
    var setY = false;
    var setZ = false;

    //rotateCamera
    var rotateCamera = false;
    var testCamera = false;
    ca.onmousedown=function(ev){
        var x = ev.layerX,y = ev.layerY;
        if(ev.layerX <= canvas.width && ev.layerX >= 0 && ev.layerY >=0 && ev.layerY <=canvas.height){
            if(ev.button == 1){
                cameraMove = true;
            }else if(ev.button == 0){
                isDrag = true;
                var _mousex = ( ev.layerX / canvas.width ) * 2 - 1;
                var _mousey = - ( ev.layerY / canvas.height ) * 2 + 1;
                // console.log(_mousex,_mousey);
                var pointOnCanvasToNear = new Vector4([_mousex,_mousey,-1.0,1.0]);
                var positionN = new Matrix4(null).setInverseOf(camera.projViewMatrix).multiplyVector4(pointOnCanvasToNear);
                RayCaster1.initCameraRay(camera.coordinate.x,camera.coordinate.y,camera.coordinate.z,positionN.elements[0],positionN.elements[1],positionN.elements[2],100);
                var obj =RayCaster1.intersectObjects(ne.getScene().Child,true);
                if(!!obj){
                    objClicked = obj;
                }else{
                    objClicked = null;
                }
                console.log(obj)
            }
        }

        lastX = x;
        lastY = y;
    }
    ca.onmouseup=function(ev){
        isDrag = false;
        cameraMove = false;

    }
    ca.onmousemove=function(ev){

        var x = ev.layerX,y=ev.layerY;
        // console.log(ev.target)
        var factor = 300/canvas.height;
        var dx = factor*(x - lastX);
        var dy = factor*(y - lastY);
        if(isDrag){
            if(ev.layerX <= canvas.width && ev.layerX >= 0 && ev.layerY >=0 && ev.layerY <=canvas.height){
                if(!!objClicked){
                    if(setX){
                        objClicked.translate(dx/20, 0,0);
                    }else if(setY){
                        objClicked.translate(0, -dy/20,0);
                    }else if(setZ){
                        objClicked.translate(0, 0,dy/20);
                    }
                }
            }
        }else if(cameraMove){
            camera.setCenter(camera.center.x-dx/20,camera.center.y+dy/20,camera.center.z);
            camera.setCoordinatePoint(camera.coordinate.x-dx/20,camera.coordinate.y+dy/20,camera.coordinate.z)
            camera.setPerspectiveCamera(camera.fovy,camera.aspect,camera.near,camera.far);
        }


        lastX = x;
        lastY = y;
    }
    
    // ca.onkeydown= function(e){
    //     console.log(e)
    // }
    //此处需要考虑不同浏览器的兼容性
    window.onmousewheel = function (e) {
        var factor = 0.1;
        if(e.deltaY < 0){//zoom in
            camera.updateGLIFCamera(-factor);
        }else{//zoom out
            camera.updateGLIFCamera(factor);
        }

    };//IE/Opera/Chrome/Safari
    //暂时使用键位来设置空间xyz位移
    window.onkeyup=function(e){
        switch(e.code){
            case "AltLeft":rotateCamera = false;
                break;
        }
    }
    window.onkeydown = function(e){
        console.log(e.code)
        switch(e.code){
            case "KeyZ":setX = true;setY = false;setZ = false;
                break;
            case "KeyX":setY = true;setZ = false; setX = false;
                break;
            case "KeyC":setZ = true;setY = false;setX = false;
                break;
            // case "KeyQ":Cube.setScale(Cube.scale.x,Cube.scale.y+0.01,Cube.scale.z)
                break;
            // case "KeyE":Cube.setScale(Cube.scale.x,Cube.scale.y-0.01,Cube.scale.z)
                // break;
            // case "KeyW":Cube.setScale(1,1,1)
                // break;
            case "AltLeft":rotateCamera = true;
                break;
        }
    }
}
