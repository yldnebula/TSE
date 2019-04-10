///<reference path="./Object.ts" />
namespace shader{
    //始末端焊缝参数
    export interface ISIE{
        IS:number;
        IE:number;
    }
    /**
     * 4弯头
     * 3三通
     * 2阀门
     * 1管道
     */
    export class Pipe extends NEObject implements ISIE{
        IS:number;
        IE:number;
        position:Vector3 = new Vector3([0,0,0]);
        direct:Vector3;
        length:number;
        constructor(x:number, y:number, z:number, startPoint:Vector3){
            super();
            this.initShader(this);
            this.initOBJInfo(this,'./resources/1/pipe.obj',function(){
                this.length = Math.sqrt(x*x+y*y+z*z);
                //this.calculate(x, y, z, startPoint);
                //this.setScale(this.length,1,1)

            }.bind(this));
        }
        onLoad(){
            this.name = 'Pipe';
        }

        calculate(x:number, y:number, z:number, startPoint:Vector3):Vector3{
            this.direct = new Vector3([x,y,z]);
            
            this.setPosition(startPoint.elements[0],startPoint.elements[1],startPoint.elements[2]);
            // this.setScale(1,1,1)
            var endPoint = this.direct.add(startPoint);
            var angle1:number;
            var angle2:number;
            if(x!=0.000 && y != 0.000 && z != 0.000){
                angle1 = Math.atan(y/x);
                angle2 = Math.atan(z/(Math.sqrt(x*x+y*y)));
                //计算基准轴向，ｘｙ向量的法向量
                var axis = new Vector3([-y/x,1,0]).normalize();

                this.rotateByQuaternion(new Vector3([0,0,1]),angle1,true);
                this.rotateByQuaternion(axis,-angle2,true);

            }else if(x==0.000 && y != 0.000 && z != 0.000){
                // console.log("1");
                angle1 = y>0?Math.PI/2:-Math.PI/2;
                angle2 = Math.atan(y/z);

                this.rotateByQuaternion(new Vector3([0,0,1]),angle1,true);
                this.rotateByQuaternion(new Vector3([0,1,0]),-angle2,true);//这个地方注意一下，旋转是按照本地坐标系旋转的,但是设置规模却是按照世界坐标系来的

                // console.log(angle1,angle2)
            }else if(x!=0.000 && y == 0.000 && z != 0.000){
                angle1 = Math.atan(z/x);
                this.rotateByQuaternion(new Vector3([0,1,0]),-angle1,true);

            }else if(x!=0.000 && y != 0.000 && z == 0.000){
                angle1 = Math.atan(y/x);
                this.rotateByQuaternion(new Vector3([0,0,1]),angle1,true);

            }else if(x==0.000 && y != 0.000 && z == 0.000){
                this.rotateByQuaternion(new Vector3([0,0,1]),Math.PI/2,true);

            }else if(x!=0.000 && y == 0.000 && z == 0.000){
                //nothing
            }else if(x==0.000 && y == 0.000 && z != 0.000){
                this.rotateByQuaternion(new Vector3([0,1,0]),-Math.PI/2,true);
            }else if(x==0.000 && y == 0.000 && z == 0.000){
                //nothing
            }
            console.log(startPoint.elements[0],startPoint.elements[1],startPoint.elements[2]);

            return endPoint;
        }
        /**
         * 设置轴朝向
         * @param which　哪个轴为朝向，暂不实现，先用四元数
         */
        setAxisDirection(which){

        }
        onUpdate(dt){
            this._draw(this.program,this.OBJInfo);
        }
    }
    
    export class Tee extends NEObject implements ISIE{
        IS:number;
        IE:number;
        constructor(){
            super();
        }
        onLoad(){
            this.name = 'Tee';
            this.initShader(this);
            this.initOBJInfo(this,'./resources/1/tee.obj',null);
        }
        onUpdate(dt){
            this._draw(this.program,this.OBJInfo);
        }
        calculate(){

        }
    }
    export class Elbow extends NEObject implements ISIE{
        IS:number;
        IE:number;
        RR:number;//弯曲半径
        RA:number;//弯曲角度
        IA:number;//弯单元种类
        constructor(){
            super();
        }
        onLoad(){
            this.name = 'Elbow';
            this.initShader(this);
            this.initOBJInfo(this,'./resources/1/elbow.obj',null);
        }
        onUpdate(dt){
            this._draw(this.program,this.OBJInfo);
        }
        
    }
    export class Valve extends NEObject implements ISIE{
        IS:number;
        IE:number;
        constructor(){
            super();
        }
        onLoad(){
            this.name = 'Valve';
            this.initShader(this);
            this.initOBJInfo(this,'./resources/1/valve.obj',null);
        }
        onUpdate(dt){
            this._draw(this.program,this.OBJInfo);
        } 
    }
    export class GLIFNode {
        ISN:number;//分支开始节点号
        IEN:number;//分支结束节点号
        ITY:number;//分支节点约束类型
        
        UnitPool:NEObject[]=[];
        startPoint = [];//存储该节点的开始位置
        constructor(isn,ien,ity){
            this.IEN = ien;
            this.ISN = isn;
            this.ITY = ity;
        }
    }
}