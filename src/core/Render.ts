namespace Core{
    export class Render{
        public  stopped     = true;
        public  currentFPS  = 0;
        public  duration    = 0;
        public frameRate    = 1000 / 60;
        public  startTime   = 0;

        public  renderQueue = [];
        
        //单例类
        constructor(){
            // requestAnimationFrame(this.main.bind(this));
        }
        /**
         * 主控函数，控制生命周期和帧刷新
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
        public render(scene:Scene){
            //渲染场景，

            //更新函数
            ne.getScene().traverseScene(ne.getScene(),function(o){
                ne.getScene().addUpdateEvents(o.onUpdate.bind(o));
                render.stopped = false;
            })

            this.renderQueue.push(scene.initScene.bind(scene))
            this.renderQueue.push(scene._update.bind(scene));
            
        }
    }
}