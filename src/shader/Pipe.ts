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
        direct:Vector3;
        length:number;
        constructor(x:number, y:number, z:number, startPoint:Vector3){
            super();
            this.initShader(this);
            this.initOBJInfo(this,'./resources/1/pipe.obj',function(){
                this.length = Math.sqrt(x*x+y*y+z*z);
                this.calculate1(x, y, z, startPoint);
                this.setLocalScale(this.length,1,1);

            }.bind(this));
        }
        onLoad(){
            this.name = 'Pipe';
        }

        calculate1(x:number, y:number, z:number, startPoint:Vector3):Vector3{
            this.direct = new Vector3(x,y,z);
            this.setLocalPosition(startPoint.elements[0],startPoint.elements[1],startPoint.elements[2]);
            
            var endPoint = this.direct.clone().add(startPoint);
            var angle1:number;
            var angle2:number;
            if(x!=0.000 && y != 0.000 && z != 0.000){
                
                // angle1 = x>0?Math.atan(z/x):Math.atan(z/x)-Math.PI;
                // angle2 = Math.atan(y/(Math.sqrt(x*x+z*z)));
                // //计算基准轴向，ｘｙ向量的法向量
                // var axis = new Vector3([-z/x,0,1]).normalize();

                // this.rotateFromAxis(new Vector3([0,1,0]),-angle1,true);
                // this.rotateFromAxis(axis,angle2,true);
                angle1 = x>0?Math.atan(y/x):Math.atan(y/x)+Math.PI;
                angle2 = Math.atan(z/(Math.sqrt(x*x+y*y)));
                // var axis = new Vector3([-y/x,1,0]).normalize();
                this.rotateFromAxis(new Vector3([0,0,1]),angle1,true);

                // this.rotateFromAxis(axis,-angle2,true);
                this.rotateFromAxis(new Vector3([0,1,0]),-angle2,true);//注意：第二次四元数旋转是按照旋转之后的本地轴再旋转的
                console.log(this.rotation)
            }else if(x==0.000 && y != 0.000 && z != 0.000){
                // console.log("1");
                angle1 = y>0?Math.PI/2:-Math.PI/2;
                angle2 = y>0?Math.atan(z/y):-Math.atan(z/y);

                this.rotateFromAxis(new Vector3([0,0,1]),angle1,true);
                
                this.rotateFromAxis(new Vector3([0,1,0]),-angle2,true);//这个地方注意一下，旋转是按照本地坐标系也要动

                // console.log(angle1,angle2)
            }else if(x!=0.000 && y == 0.000 && z != 0.000){
                angle1 = x>0?Math.atan(z/x):-Math.PI+Math.atan(z/x);
                this.rotateFromAxis(new Vector3([0,1,0]),-angle1,true);

            }else if(x!=0.000 && y != 0.000 && z == 0.000){
                angle1 = x>0?Math.atan(y/x):Math.PI+Math.atan(y/x);
                console.log(angle1/Math.PI*180);
                this.rotateFromAxis(new Vector3([0,0,1]),angle1,true);

            }else if(x==0.000 && y != 0.000 && z == 0.000){
                if(y>0){
                    this.rotateFromAxis(new Vector3([0,0,1]),Math.PI/2,true);
                }else{
                    this.rotateFromAxis(new Vector3([0,0,1]),-Math.PI/2,true);
                }
            }else if(x!=0.000 && y == 0.000 && z == 0.000){
                if(x<0){
                    this.rotateFromAxis(new Vector3([0,1,0]),Math.PI,true);
                }
                //nothing
            }else if(x==0.000 && y == 0.000 && z != 0.000){
                if(z > 0){
                    this.rotateFromAxis(new Vector3([0,1,0]),-Math.PI/2,true);
                }else{
                    this.rotateFromAxis(new Vector3([0,1,0]),Math.PI/2,true);
                }
            }else if(x==0.000 && y == 0.000 && z == 0.000){
                //nothing
            }

            return endPoint;
        }
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
        IS:number;//弯曲半径和弯曲角度有时候不是标准的90度，如何弄？
        IE:number;
        RR:number;//弯曲半径
        RA:number;//弯曲角度
        IA:number;//弯单元种类
        constructor(startPoint:Vector3,direct:Vector3,nextDirect?:Vector3){
            super();
            this.initShader(this);
            this.initOBJInfo(this,'./resources/sphere.obj',function(){
                this.initSphere(startPoint);
            }.bind(this));
        }
        onLoad(){
            this.name = 'Elbow';

        }
        initSphere(startPoint:Vector3){
            this.setLocalScale(12.35,12.35,12.35)    
            this.setLocalPosition(startPoint); 

        }
        calculate(startPoint:Vector3,direct:Vector3,nextDirect:Vector3){
            this.setLocalPosition(startPoint.x,startPoint.y,startPoint.z);
            //思路：
            //１．是否可以把弯头定义为多个物体的组合，然后通过不同的弯头数据进行修改
            //这个方法的难度在于如何去设置弯头弯曲的地方
            //２．直接修改shader，修改弯头的顶点来达到预期效果，这个就很难了
            //可能要去知道整个弯头顶点生成的过程，来确定修改哪些顶点
            //3.骨骼动画思路：感觉实现结果跟需求很相似－－－待研究，但是可以确定的是，它需要很高的处理器性能
            //
            var x = direct.x;
            var y = direct.y;
            var z = direct.z;
            var angle1,angle2,angle3;
            if(x!=0.000 && y != 0.000 && z != 0.000){
                
                // angle1 = x>0?Math.atan(z/x):Math.atan(z/x)-Math.PI;
                // angle2 = Math.atan(y/(Math.sqrt(x*x+z*z)));
                // //计算基准轴向，ｘｙ向量的法向量
                // var axis = new Vector3([-z/x,0,1]).normalize();

                // this.rotateFromAxis(new Vector3([0,1,0]),-angle1,true);
                // this.rotateFromAxis(axis,angle2,true);
                angle1 = x>0?Math.atan(y/x):Math.atan(y/x)+Math.PI;
                angle2 = Math.atan(z/(Math.sqrt(x*x+y*y)));
                // var axis = new Vector3([-y/x,1,0]).normalize();
                this.rotateFromAxis(new Vector3([0,0,1]),angle1,true);

                // this.rotateFromAxis(axis,-angle2,true);
                this.rotateFromAxis(new Vector3([0,1,0]),-angle2,true);//注意：第二次四元数旋转是按照旋转之后的本地轴再旋转的
                console.log(this.rotation)
            }else if(x==0.000 && y != 0.000 && z != 0.000){
                // console.log("1");
                angle1 = y>0?Math.PI/2:-Math.PI/2;
                angle2 = y>0?Math.atan(z/y):-Math.atan(z/y);

                this.rotateFromAxis(new Vector3([0,0,1]),angle1,true);
                
                this.rotateFromAxis(new Vector3([0,1,0]),-angle2,true);//这个地方注意一下，旋转是按照本地坐标系也要动

                // console.log(angle1,angle2)
            }else if(x!=0.000 && y == 0.000 && z != 0.000){
                angle1 = x>0?Math.atan(z/x):-Math.PI+Math.atan(z/x);
                this.rotateFromAxis(new Vector3([0,1,0]),-angle1,true);

            }else if(x!=0.000 && y != 0.000 && z == 0.000){
                angle1 = x>0?Math.atan(y/x):Math.PI+Math.atan(y/x);
                console.log(angle1/Math.PI*180);
                this.rotateFromAxis(new Vector3([0,0,1]),angle1,true);

            }else if(x==0.000 && y != 0.000 && z == 0.000){
                if(y>0){
                    this.rotateFromAxis(new Vector3([0,0,1]),Math.PI/2,true);
                }else{
                    this.rotateFromAxis(new Vector3([0,0,1]),-Math.PI/2,true);
                }
            }else if(x!=0.000 && y == 0.000 && z == 0.000){
                if(x<0){
                    this.rotateFromAxis(new Vector3([0,1,0]),Math.PI,true);
                }
                //nothing
            }else if(x==0.000 && y == 0.000 && z != 0.000){
                if(z > 0){
                    this.rotateFromAxis(new Vector3([0,1,0]),-Math.PI/2,true);
                }else{
                    this.rotateFromAxis(new Vector3([0,1,0]),Math.PI/2,true);
                }
            }else if(x==0.000 && y == 0.000 && z == 0.000){
                //nothing
            }

            // if(z == 0.000){

            // }
            // angle3 = Math.atan(y/z)

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