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
        constructor(){
            super();
        }
        onLoad(){
            this.name = 'Pipe';
            this.initShader(this);
            this.initOBJInfo(this,'./resources/1/1.obj');
        }
        /**
         * 根据输入数据计算管道长度
         * 再知道起点即可绘制空间管道
         */
        calculate(x:number, y:number, z:number){
            this.length = Math.sqrt(x*x+y*y+z*z);
            this.direct = new Vector3([x,y,z]).normalize();
            
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
            this.initOBJInfo(this,'./resources/1/3.obj');
        }
        onUpdate(dt){
            this._draw(this.program,this.OBJInfo);
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
            this.initOBJInfo(this,'./resources/1/4.obj');
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
            this.initOBJInfo(this,'./resources/1/2.obj');
        }
        onUpdate(dt){
            this._draw(this.program,this.OBJInfo);
        } 
    }
    export class GLIFNode {
        ISN:number;//分支开始节点号
        IEN:number;//分支结束节点号
        ITY:number;//分支节点约束类型
        
        constructor(isn,ien,ity){
            this.IEN = ien;
            this.ISN = isn;
            this.ITY = ity;
        }
    }
}