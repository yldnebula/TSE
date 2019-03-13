/**
 * 单例着色器工具类
 */
namespace Utils{
    export class ShaderUtils{
        static instanceCount = 0;
        shaderUtils = null;
        constructor(){
            if(ShaderUtils.instanceCount == 0){
                ShaderUtils.instanceCount++;
                this.shaderUtils = new ShaderUtils();
                return this.shaderUtils;
            }else{
                return this.shaderUtils;
            }
        }
        /**
         * 通过着色器代码生成shader
         * @param gl 上下文
         * @param vshader 顶点着色器
         * @param fshader 片元着色器
         */
        initShaders(gl:WebGLRenderingContext, vshader:string, fshader:string) {//tools for webGL
            let program = this.createProgram(gl, vshader, fshader);
            if(!program){
                console.log("cannot create program\n");
                return false;
            }
            gl.useProgram(program);
            // gl.program = program;//在js里可以正确编译，但是ts里的声明文件没有这个变量
    
            return true;
        }
        /**
         * 生成着色器程序
         * @param gl 上下文
         * @param vshader 顶点着色器
         * @param fshader 片元着色器
         */
        createProgram(gl:WebGLRenderingContext, vshader:string, fshader:string) {
            let vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vshader);
            let fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    
            if(!vertexShader || !fragmentShader){
                return null;
            }
    
            let program = gl.createProgram();
            if(!program){
                console.log("failed to create Program");
                return null;
            }
    
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
    
            gl.linkProgram(program);
    
            let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
            if(!linked){
                console.log("cannot link program："+gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
                gl.deleteShader(fragmentShader);
                gl.deleteShader(vertexShader);
                return null;
            }
            return program;
        }
        /**
         * 加载着色器
         * @param gl 上下文
         * @param type 着色器类型
         * @param shader_source 着色器源码
         */
        loadShader(gl:WebGLRenderingContext, type:number, shader_source:string) {
            let shader = gl.createShader(type);
            if(shader ==null){
                console.log("cannot create shader\n");
                return null;
            }
    
            gl.shaderSource(shader, shader_source);
            gl.compileShader(shader);
    
            let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compiled) {
                console.log('Failed to compile shader: ' + gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
    
            return shader;
        }
    }
}