namespace Core{
    export class Scene{
        static instanceCount = 0;

        Scene:Scene = null;
        sceneID:number = 0;
        LigthColor:Float32Array = new Float32Array([1.0,1.0,1.0]);
        LigthPoint:Float32Array = new Float32Array([99999, 99999, 99999]);
        AmbientLight:Float32Array = new Float32Array([0.2, 0.2, 0.2]);;
        projViewMatrix:Matrix4 = null;

        _root:NEObject = new NEObject();//根节点
        private updateEvents: Array<(deltaTime: number) => void> = [];
        constructor(id:number){
            // if(Scene.instanceCount == 0){//不是单例类，多个场景切换
            //     Scene.instanceCount ++;
            //     this.Scene = new Scene();
            //     return this.Scene;
            // }else{
            //     return this.Scene;
            // }
            this.sceneID = id;
        }
        /**
         * 初始化场景,这个函数必须在每帧一开始调用，并且每帧只能调用一次
         */
        initScene(){
            GL.clearColor(0.0,0,0,1.0);
            GL.clear(GL.COLOR_BUFFER_BIT|GL.DEPTH_BUFFER_BIT);
            GL.enable(GL.DEPTH_TEST);
        }
        /**
         * 
         * @param type 光照种类
         * @param color 光照颜色
         * @param point 光照起始点
         */
        setLightTypeColorPoint(type:number, color:Vector4, point:Vector3){

        }
        /**
         * 为场景添加一个孩子
         */
        addChild(object:NEObject){
            this._root.Child.push(object);
        }
        addChild1(object:NEnode){
            this._root.Child.push(object);

        }
        /**
         * 删除一个孩子
         */
        deleteChild(object:NEObject){
            for(var i = 0; i < this._root.Child.length; i++){
                if(this._root.Child[i] === object){
                    this._root.Child.splice(i,1);
                }
            }
        }
        /**
         * 场景更新函数，最终交由render管理
         * @param dt 帧间隔时间
         */
        _update(dt:number){            
            for(var event of this.updateEvents){
                if(!!event){
                    event(dt);
                }
            }
        }
        /**
         * 添加update函数到更新队列
         * @param listener 添加一个update函数
         */
        addUpdateEvents(listener: (deltaTime: number) => void){
            this.updateEvents.push(listener);
        }
        /**
         * 删除一个update函数从队列当中
         * @param listener update函数
         */
        removeUpdateEvents(listener: (deltaTime: number) => void){
            const index = this.updateEvents.indexOf(listener);
            if (index !== -1){
                // lazy delete
                this.updateEvents[index] = undefined;
            }
        }
        /**
         * 递归遍历场景子节点,自顶向下行为
         * //也可以考虑在每个NEObject中定义注册函数，形成自下而上的行为
         */
        traverseScene(parent:NEObject,callBack:(parent:NEObject)=>void){
            if(parent instanceof NEObject){
                callBack(parent);
            }
            if(!!parent && parent.Child.length>0){
                for(var child of parent.Child){
                    this.traverseScene(child,callBack);
                }
            }
        }
        traverseScene1(parent:NEnode | NEObject,callBack:(parent:NEnode)=>void){
            if(parent instanceof NEObject){
                for(var child of parent.Child){
                    this.traverseScene1(child,callBack)
                }
            }else if(!!parent && parent.children.length>0){
                for(var child1 of parent.children){
                    this.traverseScene1(child1,callBack);
                }
            }
            if(parent instanceof NEnode){
                callBack(parent)
            }
        }
    }
}