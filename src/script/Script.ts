namespace script{
    /**
     * 生命周期函数抽象类，NEnode和Component的生命周期都要实现这个类
     * load表示渲染之前的准备
     * start开始渲染的第一帧，在onstart之后
     * update每帧更新
     * destroy被销毁之前进行的操作，下一帧进行销毁
     */
    export abstract class Script{
        onLoad?():void;
        onStart?():void;
        onUpdate?(dt: number):void;
        onDestroy?():void; 
    }
}