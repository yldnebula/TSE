/**
 * 单例着色器工具类
 */
declare namespace Utils {
    class ShaderUtils {
        static instanceCount: number;
        shaderUtils: any;
        constructor();
        /**
         * 通过着色器代码生成shader
         * @param gl 上下文
         * @param vshader 顶点着色器
         * @param fshader 片元着色器
         */
        initShaders(gl: WebGLRenderingContext, vshader: string, fshader: string): boolean;
        /**
         * 生成着色器程序
         * @param gl 上下文
         * @param vshader 顶点着色器
         * @param fshader 片元着色器
         */
        createProgram(gl: WebGLRenderingContext, vshader: string, fshader: string): WebGLProgram;
        /**
         * 加载着色器
         * @param gl 上下文
         * @param type 着色器类型
         * @param shader_source 着色器源码
         */
        loadShader(gl: WebGLRenderingContext, type: number, shader_source: string): WebGLShader;
    }
}
declare namespace Engine {
    class Nebula {
        GL: WebGLRenderingContext;
        canvas: HTMLCanvasElement;
        constructor(id: string, width: number, height: number);
        /**
         * 创建一个画布
         * @param id 画布id
         * @param width 画布宽度
         * @param height 画布高度
         */
        private getCanvasByID;
        /**
         * 通过canvas获取gl上下文,兼容各浏览器
         * @param canvas 页面canvas元素
         */
        private create3DContext;
    }
}
import Nebula = Engine.Nebula;
import shaderUtils = Utils.ShaderUtils;
declare var ne: Nebula;
declare var shaderTool: shaderUtils;
declare var shaderTool: shaderUtils;
declare var shaderTool: shaderUtils;
