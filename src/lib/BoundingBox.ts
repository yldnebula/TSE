namespace Lib{
    export class BoundingBox{//包含aabb包围盒和obb包围盒,暂时先实现aabb
        vertices:Float32Array = null;
        indices:Uint16Array = null;
        target:NEnode = null;
        maxX:number = null;
        maxY:number = null;
        maxZ:number = null;
        minX:number = null;
        minY:number = null;
        minZ:number = null;
        constructor(object:NEnode, vertices:Float32Array){
            this.target = object;
            if(this.target == null)return;
            this.handleObject(vertices);
            this.setVertices(this.maxX,this.minX,this.maxY,this.minY,this.maxZ,this.minZ);
            this.updateBoundingBox();
        }
        updateBoundingBox(){
            if(this.target == null)return;
            this.generateTestTriangle();
        }
        handleObject(vertices){
            var flag = 0;//0-x,1-y,2-z(三维坐标)
            var vertices = vertices;
            for(var i = 0; i < vertices.length; i++){
                if(flag == 0){
                    if(this.maxX == null)this.maxX = vertices[i];
                    if(this.minX == null)this.minX = vertices[i];
                    if(vertices[i] > this.maxX){
                        this.maxX = vertices[i];
                    }
                    if(vertices[i] < this.minX){
                        this.minX = vertices[i];
                    }
                }else if(flag == 1){
                    if(this.maxY == null)this.maxY = vertices[i];
                    if(this.minY == null)this.minY = vertices[i];
                    if(vertices[i] > this.maxY){
                        this.maxY = vertices[i];
                    }
                    if(vertices[i] < this.minY){
                        this.minY = vertices[i];
                    }
                }else{
                    if(this.maxZ == null)this.maxZ = vertices[i];
                    if(this.minZ == null)this.minZ = vertices[i];
                    if(vertices[i] > this.maxZ){
                        this.maxZ = vertices[i];
                    }
                    if(vertices[i] < this.minZ){
                        this.minZ = vertices[i];
                    }
                }
                if(flag == 2){
                    flag = 0;
                }else{
                    flag++;
                }
            }
        }
        setVertices(maxX,minX,maxY,minY,maxZ,minZ){
            this.vertices = new Float32Array([
                maxX,maxY,maxZ, minX,maxY,maxZ, minX,minY,maxZ, maxX,minY,maxZ,//前面
                maxX,maxY,maxZ, maxX,minY,maxZ, maxX,minY,minZ, maxX,maxY,minZ,
                maxX,maxY,maxZ, minX,maxY,maxZ, minX,minY,maxZ, maxX,minY,maxZ,
                minX,maxY,maxZ, minX,maxY,minZ, minX,minY,minZ, minX,minY,maxZ,
                minX,minY,minZ, maxX,minY,minZ, maxX,minY,maxZ, maxX,minY,maxZ,
                maxX,minY,minZ, minX,minY,minZ, minX,maxY,minZ, maxX,maxY,minZ//背面
            ])
            this.indices = new Uint16Array([
                0, 1, 2,   0, 2, 3,    // front
                4, 5, 6,   4, 6, 7,    // right
                8, 9,10,   8,10,11,    // up
                12,13,14,  12,14,15,    // left
                16,17,18,  16,18,19,    // down
                20,21,22,  20,22,23     // back
            ])
            
        }
        generateTestTriangle(){
            var ret = [];
            var modelMatrix = this.target.getWorldTransform();
            var vertices = this.vertices;
            var indices = this.indices;
            for(var i = 0; i < indices.length; i+=3){
                ret.push([modelMatrix.multiplyVector4(new Vector4([
                    vertices[indices[i]*3+0],
                    vertices[indices[i]*3+1],
                    vertices[indices[i]*3+2],
                    1,
                ])),modelMatrix.multiplyVector4(new Vector4([
                    vertices[(indices[i+1])*3+0],
                    vertices[(indices[i+1])*3+1],
                    vertices[(indices[i+1])*3+2],
                    1
                ])),modelMatrix.multiplyVector4(new Vector4([
                    vertices[(indices[i+2])*3+0],
                    vertices[(indices[i+2])*3+1],
                    vertices[(indices[i+2])*3+2],
                    1
                ]))])
            }
            // console.log(ret)
            return ret;
        }
    }
}