namespace shader{
    export class Sphere extends NEObject{
        info = null;
        colors = null;
        normals= null;
        indices = null;
        constructor();
        constructor();
        constructor(){
            super();
            // this.initSphere();
        }
        // initSphere(){
        //     this.initShader(this);
        //     var obp = new OBJParser('./resources/sphere.obj');
        //     obp.readOBJFile('./resources/sphere.obj',1,true,function(){
        //         this.info = obp.getDrawingInfo();
        //         this.vertices = this.info.vertices;
        //         this.normals  = this.info.normals;
        //         this.colors   = this.info.colors;
        //         this.indices  = this.info.indices;
        //         this.cube = this.initVertexBuffer(this.vertices,this.colors,this.normals,this.indices);  
                
        //         this.boundingBox = new BoundingBox(this);
        //         // console.log(this.info);
        //     }.bind(this));
        //     // this.scale = new Vector3(50,0,50);
        // }
        onLoad(){
            this.name = 'Sphere';
            this.initShader(this);
            this.initOBJInfo(this,'./resources/sphere.obj',null);
        }
        onUpdate(dt){
            this._draw(this.program,this.OBJInfo);
        } 
    }
}