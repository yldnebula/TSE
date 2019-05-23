///<reference path="../lib/AssetLoader.ts" />s
import Loader = Lib.AssetsLoader;
namespace Core{
    export class Render{
        public  stopped     = true;
        public  currentFPS  = 0;
        public  duration    = 0;
        public frameRate    = 1000 / 60;
        public  startTime   = 0;

        //Timer计时器，引擎时间线
        public  renderQueue = [];
        public  loadQueue = [];

        public loader = new Loader();
        //单例类,懒得做了，一般不会瞎操作这个类的吧orz
        constructor(){
            // requestAnimationFrame(this.main.bind(this));
        }
        /**
         *加载已经注册到render的onLoad函数
         *对于GLIF来说使用的文件大多都是重复的文件，所以可以使用缓存来提高加载速度，现在没有实现－－－实现方法，localStorage类
         */
        public loadAsset(){
            for (const loadCommand of this.loadQueue) {
                loadCommand();
            }
        }
        /**
         * 主控函数，控制生命周期和帧刷新，这里有个需求就是onstart函数要在这里面运行一次
         */
        public main(){
            if (this.stopped) {
                return;
            }
            const now = Date.now();
            for (const renderCommand of this.renderQueue) {
                renderCommand(this.frameRate);
            }
            const delta = now - this.duration - this.startTime;
            this.currentFPS = 1000 / delta;
            this.duration = now - this.startTime;
            requestAnimationFrame(this.main.bind(this));
        }
        /**
         * 渲染函数，将所有帧更新函数加入渲染队列,如果需要渲染几个场景，可以将scene改为Scene[]
         */
        // public render(scene:Scene){//旧版收集NEobject的update函数
        //     //渲染场景，

        //     //更新函数
        //     scene.traverseScene(scene._root,function(o){
        //         scene.addUpdateEvents(o.onUpdate.bind(o));
        //         render.stopped = false;
        //     })

        //     this.renderQueue.push(scene.initScene.bind(scene))
        //     this.renderQueue.push(scene._update.bind(scene));
            
        // }
        public renderScene(scene:Scene){//重构nenode之后的收集函数
            var that = this;
            scene.traverseScene(scene._root,function(o){
                scene.addUpdateEvents(o.onUpdate.bind(o));
                that.loadQueue.push(o.onLoad.bind(o))//收集onLoad函数
                render.stopped = false;
            })

            this.renderQueue.push(scene.initScene.bind(scene))
            this.renderQueue.push(scene._update.bind(scene));
        }
        /**
         * async Load
         */
        public async onLoad(obj:Cube) {
            await obj.onLoad();
        }
    }
}