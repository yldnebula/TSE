namespace shader{
    export class Plane extends NEnode{
        info = null;
        colors = null;
        normals= null;
        indices = null;
        constructor();
        constructor();
        constructor(){
            super();
            this.initPlane();
        }
        initPlane(){
            var obp = new OBJParser('./resources/cube.obj');
            obp.readOBJFile('./resources/cube.obj',1,true,function(){
                this.info = obp.getDrawingInfo();
                this.vertices = this.info.vertices;
                this.normals  = this.info.normals;
                this.colors   = this.info.colors;
                this.indices  = this.info.indices;
                this.cube = this.initVertexBuffer(this.vertices,this.colors,this.normals,this.indices);  
                
                this.boundingBox = new BoundingBox(this,this.vertices);
                // console.log(this.info);
            }.bind(this));
            // this.scale = new Vector3(50,0,50);
        }
        onUpdate(dt){
        }
    }
}