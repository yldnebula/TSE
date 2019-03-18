namespace Core{
    export class Render{
        stopped     = true;
        currentFPS  = 0;
        duration    = 0;
        frameRate   = 0;
        startTime   = 0;

        renderQueue = [];
        
        constructor(){
            requestAnimationFrame(this.main.bind(this));
        }
        /**
         * 主控函数，控制生命周期和帧刷新
         */
        private main(){
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
    }
}