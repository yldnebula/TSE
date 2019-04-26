///<reference path="../core/NEnode.ts" />
///<reference path="../shader/shader.ts" />
import NEnode = Core.NEnode;
import Shader = shader.Shader;
namespace NE3D{
    export class Cube extends NEnode{
        shader:Shader = new Shader();

        vertices:Float32Array = null;
        colors:Float32Array = null;
        normals:Float32Array = null;
        indices:Float32Array = null;

        info = null;
        boundingBox = null;
        constructor(){
            super();
            this.onUpdate();
            this.onLoad();
        }
        onLoad(){
            var obp = new OBJParser('./resources/cube.obj');
            obp.readOBJFile('./resources/cube.obj',1,true,function(){
                this.info = obp.getDrawingInfo();
                this.vertices = this.info.vertices;
                this.normals  = this.info.normals;
                this.colors   = this.info.colors;
                this.indices  = this.info.indices;
                this.shader.OBJ = this.shader.initVertexBuffer(this.vertices,this.colors,this.normals,this.indices);  
                // this.boundingBox = new BoundingBox(this);
                // console.log(this.info);
            }.bind(this));
        }
        onUpdate(){
            this.shader.calculateMatrix(this.localPosition,this.localRotation,this.localScale)
            this.shader.draw();
        }

    }
}