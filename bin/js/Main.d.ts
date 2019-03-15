declare namespace Utils {
    /**
     * 四方矩阵类
     */
    class Matrix4 {
        elements: Float32Array;
        constructor(opt_src: Matrix4 | null);
        /**
         * 设置单位矩阵
         */
        setIdentity(): this;
        /**
         * 通过一个四方矩阵设置一个新矩阵
         * @param src 源四方矩阵
         */
        set(src: Matrix4): this;
        /**
         * 右乘一个四方矩阵
         * @param other 需要右乘的四方矩阵
         */
        concat(other: Matrix4): this;
        /**
         * 右乘一个四方矩阵
         * @param other 需要右乘的四方矩阵
         */
        multiply(other: Matrix4): this;
        /**
         * 右乘一个三维矩阵，返回三维向量
         * @param pos 右乘的三维矩阵
         */
        mutiplyVector3(pos: Vector3): Vector3;
        /**
         * 右乘一个四维向量，返回四维向量
         * @param pos 右乘的四维向量
         */
        multiplyVector4(pos: Vector4): Vector4;
        /**
         * 转置矩阵本身
         */
        transpose(): Matrix4;
        /**
         * 返回一个源四方矩阵的逆矩阵
         * @param other 源四方矩阵
         */
        setInverseOf(other: Matrix4): Matrix4;
        /**
         * 设置正交投影矩阵，定义盒状可视空间，变量范围在[-1.0,1.0]
         * @param left 剪裁面的左边界
         * @param right 剪裁面的右边界
         * @param bottom 剪裁面的下边界
         * @param top 剪裁面的上边界
         * @param near 剪裁面的近边界
         * @param far 剪裁面的远边界
         */
        setOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number): this;
        /**
         * 设置透视投影矩阵
         * @param fovy 视锥体上下两侧的角度
         * @param aspect 视锥体的横纵比，使用canvas.width/canvas.height
         * @param near 视点到近剪裁面的距离，为正值
         * @param far 视点到源建材面的距离，为正值
         */
        setPerspective(fovy: number, aspect: number, near: number, far: number): this;
        /**
         * 设置缩放矩阵，一般new一个四方矩阵来存储
         * @param x x方向上的缩放比例
         * @param y y方向上的缩放比例
         * @param z z方向上的缩放比例
         */
        setScale(x: number, y: number, z: number): this;
        scale(x: number, y: number, z: number): this;
        /**
         * 设置移动矩阵，一般new一个四方矩阵来存储
         * @param x x方向上的位移
         * @param y y方向上的位移
         * @param z z方向上的位移
         */
        setTranslate(x: number, y: number, z: number): this;
        /**
         * 将当前矩阵右乘一个平移矩阵
         * @param x x方向上的位移
         * @param y y方向上的位移
         * @param z z方向上的位移
         */
        translate(x: number, y: number, z: number): this;
        /**
         * 设置绕轴旋转矩阵
         * @param angle 绕轴旋转角度
         * @param x 为1则表示绕x轴旋转
         * @param y 为1则表示绕y轴旋转
         * @param z 为1则表示绕z轴旋转
         */
        setRotate(angle: number, x: number, y: number, z: number): this;
        rotate(angle: number, x: number, y: number, z: number): this;
        /**
         *
         * @param eyeX 视点x坐标
         * @param eyeY 视点y坐标
         * @param eyeZ 视点z坐标
         * @param centerX 参考点x坐标
         * @param centerY 参考点y坐标
         * @param centerZ 参考点坐标
         * @param upX 是否是上方向
         * @param upY 是否是上方向
         * @param upZ 是否是上方向
         */
        setLookAt(eyeX: number, eyeY: number, eyeZ: number, centerX: number, centerY: number, centerZ: number, upX: number, upY: number, upZ: number): this;
        lookAt(eyeX: number, eyeY: number, eyeZ: number, centerX: number, centerY: number, centerZ: number, upX: number, upY: number, upZ: number): this;
        /**
         * 将顶点投影到平面的矩阵从右侧相乘。
         * @param plane 平面方程"Ax+By+Cz+D=0"的系数数组
         * @param light 存储灯光坐标的数组。如果light[3]=0，则视为平行光。
         */
        dropShadow(plane: number[], light: number[]): this;
        dropShadowDirectionally(normX: number, normY: number, normZ: number, planeX: number, planeY: number, planeZ: number, lightX: number, lightY: number, lightZ: number): this;
    }
    /**
     * 三维向量类
     */
    class Vector3 {
        elements: Float32Array;
        constructor(opt_src: Vector3 | null);
        /**
         * 标准化三维向量
         */
        normalize(): this;
    }
    /**
     * 四维向量类
     */
    class Vector4 {
        elements: Float32Array;
        constructor(opt_src: Vector4 | null);
    }
}
declare namespace Utils {
    class ObjParser {
        fileName: any;
        mtls: any;
        objects: any;
        vertices: any;
        normals: any;
        constructor();
        parse(fileString: string, scale: any, reverse: any): boolean;
        parseMtllib(sp: StringParser, fileName: string): void;
    }
    class StringParser {
        str: any;
        index: any;
        constructor(str: string);
        init(str: string): void;
        skipDelimiters(): void;
        skipToNextWord(): void;
        getWord(): any;
        getInt(): number;
        getFloat(): number;
    }
    class MTLDoc {
        complete: any;
        materials: any;
        constructor();
        parseNewmtl(sp: StringParser): any;
        parseRGB(sp: StringParser, name: any): Material;
    }
    class Material {
        name: any;
        color: any;
        constructor(name: any, r: any, g: any, b: any, a: any);
    }
    class Color {
        r: any;
        g: any;
        b: any;
        a: any;
        constructor(r: any, g: any, b: any, a: any);
    }
    class Vertex {
        x: any;
        y: any;
        z: any;
        constructor(x: any, y: any, z: any);
    }
    class Normal {
        x: any;
        y: any;
        z: any;
        constructor(x: any, y: any, z: any);
    }
    class OBJObject {
        name: any;
        faces: any;
        numIndices: any;
        constructor(name: any);
        addFace(face: any): void;
    }
    class Face {
        materialName: any;
        vIndices: any;
    }
}
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
        initShaders(gl: WebGLRenderingContext, vshader: string, fshader: string): {
            status: boolean;
            program: WebGLProgram;
        };
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
declare namespace Core {
    class Nebula {
        GL: WebGLRenderingContext;
        canvas: HTMLCanvasElement;
        projectMatrix: Matrix4;
        eye: {
            x: number;
            y: number;
            z: number;
        };
        center: {
            x: number;
            y: number;
            z: number;
        };
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
        setEyePoint(x: number, y: number, z: number): void;
        setAtCenter(x: number, y: number, z: number): void;
        /**
         * 设置透视摄像机
         */
        setPerspectiveCamera(fovy: number, near: number, far: number): void;
        /**
         * 设置正视摄像机
         */
        setOrthoCamera(): void;
        setLightTypeColorPoint(type: number, color: Vector4, point: Vector3): void;
        /**
         * 引擎生命周期
         */
        _OnLoad(): void;
        _OnUpdate(): void;
        _OnDestroy(): void;
    }
    class Event {
        constructor();
        emit(): void;
        listen(): void;
        /**
         * 鼠标事件
         */
        onMouseMove(): void;
        onMouseDown(): void;
        onMouseUp(): void;
        onMouseClick(): void;
    }
}
declare namespace Core {
    class SceneInfo {
        static instanceCount: number;
        SceneInfo: SceneInfo;
        LigthColor: Float32Array;
        LigthPoint: Float32Array;
        AmbientLight: Float32Array;
        projViewMatrix: Matrix4;
        constructor();
        initScene(): void;
    }
}
declare namespace shader {
    /**
     * 所有３维物体的子类，实现基本方法
     */
    class NEObject {
        coordinate: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
        };
        scale: {
            x: number;
            y: number;
            z: number;
        };
        private _modelMatrix;
        private _mvpMatrix;
        private _normalMatrix;
        constructor();
        onload(): void;
        onUpdate(): void;
        _draw(): void;
        _loop(): void;
        onDestroy(): void;
        setTranslate(x: number, y: number, z: number): void;
        setScale(x: number, y: number, z: number): void;
        setRotation(x: number, y: number, z: number): void;
        getModelMatrix(): Matrix4;
        getMvpMatrix(): Matrix4;
        getNormalMatrix(): Matrix4;
        onClick(): void;
        onDrag(): void;
        /**
 * 初始化各缓存区
 * @param gl 上下文
 * @param data 源数据
 * @param num 单位数据长度
 * @param type 单位类型
 */
        initArrayBufferForLaterUse(gl: WebGLRenderingContext, data: Float32Array, num: number, type: number): {
            buffer: any;
            num: any;
            type: any;
        };
        /**
         * 初始化索引数组
         * @param gl 上下文
         * @param data 源数据
         * @param type 索引源数据类型
         */
        initElementArrayBufferForLaterUse(gl: WebGLRenderingContext, data: Uint8Array, type: number): {
            buffer: any;
            type: any;
        };
        /**
         * 分配缓冲区对象并且激活分配
         * @param gl 上下文
         * @param a_attribute 属性名
         * @param buffer 缓冲区数据
         */
        initAttributeVariable(gl: WebGLRenderingContext, a_attribute: any, bufferObj: any): void;
    }
}
declare namespace shader {
    class Cube extends NEObject {
        private vertex;
        private fragment;
        vertices: Float32Array;
        colors: Float32Array;
        indices: Uint8Array;
        normals: Float32Array;
        gl: WebGLRenderingContext;
        program: WebGLProgram;
        shadertool: shaderUtils;
        u_ModelMatrix: WebGLUniformLocation;
        u_MvpMatrix: WebGLUniformLocation;
        u_NormalMatrix: WebGLUniformLocation;
        u_LightColor: WebGLUniformLocation;
        u_LightPosition: WebGLUniformLocation;
        u_AmbientLight: WebGLUniformLocation;
        cube: any;
        constructor();
        /**
         * 生命周期函数
         */
        _draw(): void;
        getVertex(): string;
        getFragment(): string;
        /**
         * 生成单位立方体，位于原点
         */
        initCubeInfo(): void;
        /**
         * 初始化obj数据，全局只需绑定一次
         * @param vertices 顶点矩阵
         * @param colors 颜色矩阵
         * @param normals 法向量矩阵
         * @param program　对应的着色器程序
         * @param indices 索引矩阵
         */
        initVertexBuffer(vertices: Float32Array, colors: Float32Array, normals: Float32Array, program: WebGLProgram, indices: Uint8Array): {
            vertex: any;
            color: any;
            normal: any;
            index: any;
            numIndices: any;
        };
    }
}
import Nebula = Core.Nebula;
import SceneInfo = Core.SceneInfo;
import shaderUtils = Utils.ShaderUtils;
import Matrix4 = Utils.Matrix4;
import Vector3 = Utils.Vector3;
import Vector4 = Utils.Vector4;
import cube = shader.Cube;
import NEObject = shader.NEObject;
declare const shaderTool: shaderUtils;
declare var GL: WebGLRenderingContext;
declare var sceneInfo: SceneInfo;
declare const canvas: {
    width: number;
    height: number;
};
declare function main(): void;
declare namespace Core {
    class Camera {
        constructor();
    }
}
declare namespace Core {
    class Render {
        constructor();
    }
}
