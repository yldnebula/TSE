declare namespace Utils {
    const generateUUID: () => string;
    function arrayRemove<T>(arr: Array<T>, elm: T): void;
    function intToBytes24(i: any): any[];
    function intToBytes32(i: any): any[];
    function bytesToInt24(r: any, g: any, b: any): number;
    function bytesToInt32(r: any, g: any, b: any, a: any): number;
}
declare namespace Utils {
    const DEG_TO_RAD: number;
    const RAD_TO_DEG: number;
    const INV_LOG2: number;
    /**
     * 四方矩阵类
     */
    class Matrix4 {
        elements: Float32Array;
        constructor();
        constructor(v0: number, v1: number, v2: number, v3: number, v4: number, v5: number, v6: number, v7: number, v8: number, v9: number, v10: number, v11: number, v12: number, v13: number, v14: number, v15: number);
        constructor(v0: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]);
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
        mul2(lhs: Matrix4, rhs: Matrix4): this;
        /**
         * 左乘一个四方矩阵
         */
        leftMultiply(other: Matrix4): Matrix4;
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
        copy(rhs: Matrix4): this;
        /**
         * 修改自身，逆矩阵
         *
         * @returns {this} this
         * @memberof Mat4
         */
        invert(): this;
        /**
 * 移动到某个点
 *
 * @param {Vec3} vec
 * @param {Vec3} [res] ref
 * @returns {Vec3} res
 * @memberof Mat4
 */
        transformPoint(vec: Vector3, res?: Vector3): Vector3;
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
         * @param far 视点到远剪裁面的距离，为正值
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
         * 四元数设置旋转矩阵
         * @param axis  轴向
         * @param angle 绕轴旋转角度
         */
        setRotateFromQuaternion1(axis: Vector3, angle: number, isRadian: boolean): this;
        setRotateFromQuaternion(axis: Vector3, angle: number, isRadian: boolean): this;
        /**
         * 四元数旋转矩阵
         */
        rotateByQuaternion(axis: Vector3, angle: number, isRadian: boolean): this;
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
        setTRS(t: Vector3, r: Quat, s: Vector3): this;
        getEulerAngles: (eulers?: Vector3) => Vector3;
        getScale: (scale?: Vector3) => Vector3;
        getTranslation(t?: Vector3): Vector3;
        getX(x?: Vector3): Vector3;
        getY(y?: Vector3): Vector3;
        getZ(z?: Vector3): Vector3;
    }
    /**
     * 三维向量类
     */
    class Vector3 {
        elements: Float32Array;
        constructor();
        constructor(x: number, y: number, z: number);
        constructor(x: [number, number, number]);
        /**
         * 标准化三维向量
         */
        normalize(): this;
        /**
         * 得到三维空间法向量,以原点为起点
         */
        getNormal(): void;
        /**
         * 三维向量乘以一个数
         */
        mutiply(m: number): this;
        mul2(lhs: Vector3, rhs: Vector3): this;
        clone(): Vector3;
        /**
         * 三维向量减去另一个三维向量
         */
        minus(m: Vector3): this;
        /**
         * 三维向量加上另一个三维向量
         */
        add(m: Vector3): this;
        copy(x: Vector3): this;
        set(x: any, y: any, z: any): this;
        scale(scalar: number): this;
        x: number;
        y: number;
        z: number;
    }
    /**
     * 四维向量类
     */
    class Vector4 {
        elements: Float32Array;
        constructor();
        constructor(x: number, y: number, z: number, w: number);
        constructor(x: [number, number, number, number]);
        x: number;
        y: number;
        z: number;
        w: number;
    }
    /**
     * 四元数类
     */
    class Quat {
        x: number;
        y: number;
        z: number;
        w: number;
        constructor(x: number, y: number, z: number, w: number);
        constructor(x: [number, number, number, number]);
        constructor();
        clone(): Quat;
        conjugate(): this;
        copy({ x, y, z, w }: Quat): this;
        equals({ x, y, z, w }: Quat): boolean;
        getAxisAngle(axis: Vector3): number;
        getEulerAngles(eulers?: Vector3): Vector3;
        invert(): this;
        length(): number;
        lengthSq(): number;
        mul({ x, y, z, w }: Quat): this;
        mul2(lhs: Quat, rhs: Quat): Quat;
        normalize(): this;
        set(x: number, y: number, z: number, w: number): this;
        setFromAxisAngle({ x, y, z }: Vector3, angle: number): this;
        setFromEulerAngles(ex: number, ey: number, ez: number): this;
        setFromMat4(mat: Matrix4): this;
        slerp(lhs: Quat, rhs: Quat, alpha: number): this;
        transformVector(vec: Vector3, res?: Vector3): Vector3;
        static readonly TEMP: Quat;
        static readonly IDENTITY: Quat;
        static readonly ZERO: Quat;
    }
}
declare namespace Utils {
    class GLIFParser {
        startPoint: Vector3;
        IWD: number;
        Node: any;
        Scene: any;
        constructor(scene: Scene);
        readGilfFile(fileName: any, callback: any): void;
        onReadFile(fileString: any): void;
        parse(fileString: string): boolean;
        /**
         * 解析弯单元信息
         */
        parseBentUnitInfo(line: string[]): void;
        /**
         * 解析空间起始位置
         */
        parseStartPoint(line: string[]): void;
        /**
         * 从第一个10开始的所有空间节点数据
         */
        parse3DInfo(nodeInfo: string[][]): any[];
        /**
         * 判定当前行是否是节点内的内容，60,61可以出现在节点内
         */
        isNodeInfo(nowLine: string[]): boolean;
        /**
         * 10开头的一段数据,期望参数为整段数据,或者为260,70,90开头的数据
         * 10,7,8,81
                1,1,1,0.000,-0.441,-0.066
                0,1,1,0.457,81.494,1
                1,1,1,0.000,0.000,-2.618
                4,1,1,0.000,0.000,-0.500,477.9,0.000
                1,1,1,0.000,0.000,-0.700
         *　例子
         */
        parseNode(lines: string[][]): void;
        /**
         * 60,61开头的一段数据
         */
        parsePipeInfo(line: string[]): void;
        /**
         * 处理直单元
         * @param info
         */
        parseDirectUnit(info: string[], scene: Scene): Pipe;
        /**
         * 处理弯单元
         */
        parseBendingUnit(info: any, scene: any, direct: any): Elbow;
        /**
         * 自定义输出
         * @param val
         */
        parseLog(val: any): void;
    }
}
declare namespace Utils {
    class ObjParser {
        fileName: any;
        mtls: any;
        objects: any;
        vertices: any;
        normals: any;
        g_objDoc: any;
        g_drawingInfo: any;
        constructor(fileName: any);
        parse(fileString: string, scale: any, reverse: any): boolean;
        parseMtllib(sp: StringParser, fileName: string): string;
        /**
         * parseObjectName
         */
        parseObjectName(sp: StringParser): OBJObject;
        /**
         * parseVertex
         */
        parseVertex(sp: any, scale: any): Vertex;
        /**
         * parseNormal
         */
        parseNormal(sp: StringParser): Normal;
        /**
         * parseUsemtl
         */
        parseUsemtl(sp: StringParser): any;
        /**
         * parseFace
         */
        parseFace(sp: any, materialName: any, vertices: any, reverse: any): Face;
        /**
         * isMTLComplete
         */
        isMTLComplete(): boolean;
        /**
         * findColor
         */
        findColor(name: any): any;
        /**
         * getDrawingInfo
         */
        getDrawingInfo(): DrawingInfo;
        readOBJFile(fileName: any, scale: any, reverse: any, callback: any): void;
        onReadOBJFile(fileString: any, fileName: any, scale: any, reverse: any): void;
        onReadMTLFile(fileString: any, mtl: any): void;
        onReadComplete(gl: any, model: any, objDoc: any): any;
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
        materials: any[];
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
        nIndices: any;
        normal: any;
        numIndices: any;
        constructor(materialName: any);
    }
    class DrawingInfo {
        vertices: any;
        normals: any;
        colors: any;
        indices: any;
        constructor(vertices: any, normals: any, colors: any, indices: any);
    }
}
/**
 * 通用工具类
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
        private scene;
        private nowScene;
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
        /**
         * 导演函数director
         */
        getScene(): Scene;
        /**
         * 添加一个场景
         * @param scene 场景对象
         */
        addScene(scene: Scene): void;
        /**
         * 删除一个场景
         * @param scene 场景对象
         */
        deleteScene(scene: Scene): boolean;
        /**
         * 设置当前场景
         * @param scene 场景对象
         * @param index 场景索引
         */
        setScene(id: number): boolean;
        /**
         * 引擎生命周期
         */
        _OnLoad(): void;
        _OnUpdate(): void;
        _OnDestroy(): void;
    }
}
declare namespace Core {
    class Scene {
        static instanceCount: number;
        Scene: Scene;
        sceneID: number;
        LigthColor: Float32Array;
        LigthPoint: Float32Array;
        AmbientLight: Float32Array;
        projViewMatrix: Matrix4;
        _root: NEnode;
        private updateEvents;
        constructor(id: number);
        /**
         * 初始化场景,这个函数必须在每帧一开始调用，并且每帧只能调用一次
         */
        initScene(): void;
        /**
         *
         * @param type 光照种类
         * @param color 光照颜色
         * @param point 光照起始点
         */
        setLightTypeColorPoint(type: number, color: Vector4, point: Vector3): void;
        /**
         * 为场景添加一个孩子
         */
        addChild(object: NEnode): void;
        addChild1(object: NEnode): void;
        /**
         * 删除一个孩子
         */
        deleteChild(object: NEnode): void;
        /**
         * 场景更新函数，最终交由render管理
         * @param dt 帧间隔时间
         */
        _update(dt: number): void;
        /**
         * 添加update函数到更新队列
         * @param listener 添加一个update函数
         */
        addUpdateEvents(listener: (deltaTime: number) => void): void;
        /**
         * 删除一个update函数从队列当中
         * @param listener update函数
         */
        removeUpdateEvents(listener: (deltaTime: number) => void): void;
        /**
         * 递归遍历场景子节点,自顶向下行为
         * //也可以考虑在每个NEObject中定义注册函数，形成自下而上的行为
         * 旧版暂时不用
         */
        /**
         * 重构之后的遍历
         * @param parent
         * @param callBack
         */
        traverseScene(parent: NEnode, callBack: (parent: NEnode) => void): void;
    }
}
declare namespace Core {
    class Camera {
        coordinate: {
            x: number;
            y: number;
            z: number;
        };
        center: {
            x: number;
            y: number;
            z: number;
        };
        fovy: number;
        aspect: number;
        near: number;
        far: number;
        projectMatrix: Matrix4;
        projViewMatrix: Matrix4;
        constructor(fovy: number, aspect: number, near: number, far: number);
        setCoordinatePoint(x: number, y: number, z: number): void;
        setCenter(x: number, y: number, z: number): void;
        /**
         * 设置透视摄像机
         */
        setPerspectiveCamera(fovy: number, aspect: number, near: number, far: number): void;
        updateGLIFCamera(factor: any): void;
        /**
         * 设置正视摄像机,暂时不用开发
         */
        setOrthoCamera(): void;
        /**
         * 获取视线方向向量
         * @param ratio 对方向向量的扩大缩小比率，不改为１
         */
        getSightDirection(ratio: number): number[];
    }
}
declare namespace Lib {
    /**
     * 资源加载类
     */
    class AssetsLoader {
        assets: {};
        constructor();
        static loadAssets(assets: {
            [s: string]: Promise<any>;
        }): Promise<AssetsLoader>;
        get<T = any>(assetName: string): T;
        private set;
    }
}
import Loader = Lib.AssetsLoader;
declare namespace Core {
    class Render {
        stopped: boolean;
        currentFPS: number;
        duration: number;
        frameRate: number;
        startTime: number;
        renderQueue: any[];
        loadQueue: any[];
        loader: Loader;
        constructor();
        /**
         *加载已经注册到render的onLoad函数
         *对于GLIF来说使用的文件大多都是重复的文件，所以可以使用缓存来提高加载速度，现在没有实现－－－实现方法，localStorage类
         */
        loadAsset(): void;
        /**
         * 主控函数，控制生命周期和帧刷新，这里有个需求就是onstart函数要在这里面运行一次
         */
        main(): void;
        /**
         * 渲染函数，将所有帧更新函数加入渲染队列,如果需要渲染几个场景，可以将scene改为Scene[]
         */
        renderScene(scene: Scene): void;
        /**
         * async Load
         */
        onLoad(obj: Cube): Promise<void>;
    }
}
import generateUUID = Utils.generateUUID;
declare namespace Core {
    class NElement {
        uuid: string;
        name: string;
        tag: string[];
        enabled: boolean;
    }
}
declare namespace script {
    /**
     * 生命周期函数抽象类，NEnode和Component的生命周期都要实现这个类
     * load表示渲染之前的准备
     * start开始渲染的第一帧，在onstart之后
     * update每帧更新
     * destroy被销毁之前进行的操作，下一帧进行销毁
     */
    abstract class Script {
        onLoad?(): void;
        onStart?(): void;
        onUpdate?(dt: number): void;
        onDestroy?(): void;
    }
}
import Script = script.Script;
import arrayRemove = Utils.arrayRemove;
import NElement = Core.NElement;
declare namespace Core {
    class NEnode extends NElement implements Script {
        scale: Vector3;
        rotation: Quat;
        position: Vector3;
        eulerAngles: Vector3;
        worldTransform: Matrix4;
        localPosition: Vector3;
        localRotation: Quat;
        localScale: Vector3;
        localEulerAngles: Vector3;
        localTransform: Matrix4;
        private _up;
        private _right;
        private _forward;
        parent: NEnode;
        children: NEnode[];
        boundingBox: any;
        shader: Shader;
        constructor();
        onLoad(): void;
        onStart(): void;
        onUpdate(dt: any): void;
        onDestroy(): void;
        setColor(color: Color): void;
        addChild(child: NEnode): void;
        removeChild(child: NEnode): void;
        setPosition(x: Vector3): this;
        setPosition(x: number, y: number, z: number): this;
        /**
         * 获取父物体下的坐标
         * @returns
         */
        getPosition(): Vector3;
        setLocalEulerAngles(x: Vector3): this;
        setLocalEulerAngles(x: number, y: number, z: number): this;
        getLocalEulerAngles(): Vector3;
        setEulerAngles(x: Vector3): this;
        setEulerAngles(x: number, y: number, z: number): this;
        getEulerAngles(): Vector3;
        setLocalPosition(x: Vector3): this;
        setLocalPosition(x: number, y: number, z: number): this;
        getLocalPosition(): Vector3;
        /**
         * local
         * @param {Quat} x
         * @returns {this}
         * @memberof NEnode
         */
        setRotation(x: Quat): this;
        setRotation(x: number, y: number, z: number, w: number): this;
        getRotation(): Quat;
        setLocalScale(x: Vector3): this;
        setLocalScale(x: number, y: number, z: number): this;
        getLocalScale(): Vector3;
        rotate(x: Vector3): this;
        rotate(x: number, y: number, z: number): this;
        rotateLocal(x: Vector3): this;
        rotateLocal(x: number, y: number, z: number): this;
        rotateFromAxis(axis: Vector3, angle: number, isRadian: boolean): this;
        translate(x: Vector3): this;
        translate(x: number, y: number, z: number): this;
        translateLocal(x: Vector3): this;
        translateLocal(x: number, y: number, z: number): this;
        getLocalTransform(): Matrix4;
        getWorldTransform(): Matrix4;
        private _sync;
        readonly root: NEnode;
        readonly up: Vector3;
        readonly forward: Vector3;
        readonly right: Vector3;
    }
}
declare namespace shader {
    class Shader {
        vertex: string;
        fragment: string;
        private _modelMatrix;
        private _mvpMatrix;
        private _normalMatrix;
        program: WebGLProgram;
        a_Position: number;
        a_Color: number;
        a_Normal: number;
        u_ModelMatrix: WebGLUniformLocation;
        u_MvpMatrix: WebGLUniformLocation;
        u_NormalMatrix: WebGLUniformLocation;
        u_LightColor: WebGLUniformLocation;
        u_LightPosition: WebGLUniformLocation;
        u_AmbientLight: WebGLUniformLocation;
        u_colorSet: WebGLUniformLocation;
        OBJ: any;
        constructor();
        draw(): void;
        calculateMatrix(worldMatrix: Matrix4): void;
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
        initElementArrayBufferForLaterUse(gl: WebGLRenderingContext, data: Uint16Array, type: number): {
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
        /**
         * 初始化obj数据，全局只需绑定一次
         * @param vertices 顶点矩阵
         * @param colors 颜色矩阵
         * @param normals 法向量矩阵
         * @param program　对应的着色器程序
         * @param indices 索引矩阵
         */
        initVertexBuffer(vertices: Float32Array, colors: Float32Array, normals: Float32Array, indices: Uint16Array): {
            vertex: any;
            color: any;
            normal: any;
            index: any;
            numIndices: any;
        };
        initShader(target: any): void;
    }
}
import NEnode = Core.NEnode;
import Shader = shader.Shader;
declare namespace NE3D {
    class Cube extends NEnode {
        shader: Shader;
        vertices: Float32Array;
        colors: Float32Array;
        normals: Float32Array;
        indices: Float32Array;
        info: any;
        boundingBox: any;
        constructor();
        onLoad(): void;
        onUpdate(dt: any): void;
    }
}
declare namespace Lib {
    class RayCaster {
        start: number[];
        end: number[];
        constructor();
        test2(): any[];
        /**
         * 初始化射线,可以通过摄像机位置和屏幕触点，或者任意射线都可以
         */
        initCameraRay(sx: any, sy: any, sz: any, ex: any, ey: any, ez: any, far: any): void;
        /**
         * 射线相交的物体
         * @param objects 检查的物体
         * @param testChild 是否检查子物体
         */
        intersectObjects(objects: NEnode[], testChild: boolean): NEnode[];
        /**
         * 判断点在面中
         * @param pA 三角形a点
         * @param pB 三角形b点
         * @param pC 三角形c点
         * @param endA 线段a点
         * @param endB 线段b点
         * @param out 交点，如果有
         */
        intersectSurfaceLine(pA: any, pB: any, pC: any, endA: any, endB: any, out: any): boolean;
        /**
         * 获取法向量
         * @param pA a点
         * @param pB b点
         * @param out 计算后的法向量
         */
        getNormal(pA: any, pB: any, out: any): void;
        getBaseScale(nAB: any): any;
        intersect(nSurface: any, point: any, nLine: any, linePoint: any, baseScale: any, out: any): boolean;
        xBaseInsect(nSurface: any, point: any, nLine: any, linePoint: any, out: any): boolean;
        yBaseInsect(nSurface: any, point: any, nLine: any, linePoint: any, out: any): boolean;
        zBaseInsect(nSurface: any, point: any, nLine: any, linePoint: any, out: any): boolean;
        surfacePointInSurface(pA: any, pB: any, pC: any, point: any): boolean;
        xyPointInSurface2D(pA: any, pB: any, pC: any, p: any): boolean;
        yzPointInSurface2D(pA: any, pB: any, pC: any, p: any): boolean;
        xzPointInSurface2D(pA: any, pB: any, pC: any, p: any): boolean;
        pointInSurface2D(pA: any, pB: any, pC: any, p: any): boolean;
        cross(out: any, a: any, b: any): any;
        rayPickLog(val: any): void;
    }
}
declare namespace Lib {
    class BoundingBox {
        vertices: Float32Array;
        indices: Uint16Array;
        target: NEnode;
        maxX: number;
        maxY: number;
        maxZ: number;
        minX: number;
        minY: number;
        minZ: number;
        constructor(object: NEnode, vertices: Float32Array);
        updateBoundingBox(): void;
        handleObject(vertices: any): void;
        setVertices(maxX: any, minX: any, maxY: any, minY: any, maxZ: any, minZ: any): void;
        generateTestTriangle(): any[];
    }
}
declare namespace shader {
    /**
     * 所有３维物体的子类，实现基本方法
     * 停用，使用NEnode.ts类来实现基本
     */
    class NEObject {
        vertex: string;
        fragment: string;
        private _modelMatrix;
        private _mvpMatrix;
        private _normalMatrix;
        scale: Vector3;
        rotation: Quat;
        position: Vector3;
        color: Vector4;
        program: WebGLProgram;
        OBJInfo: any;
        vertices: any;
        name: string;
        Child: any[];
        parent: NEObject;
        boundingBox: BoundingBox;
        constructor();
        onLoad(): void;
        onStart(): void;
        /**
         * 帧刷新函数，每帧调用
         */
        onUpdate(dt: number): void;
        _draw(program: any, OBJ: any): void;
        _loop(dt: any): void;
        onDestroy(): void;
        /**
         * 父子层级函数
         * 添加孩子,需要判断是否添加了自己上级或自身
         */
        addChild(object: NEObject): void;
        /**
         * 设置父节点
         */
        setParent(object: NEObject): void;
        getParent(): NEObject;
        setRotation(x: Quat): this;
        setRotation(x: number, y: number, z: number, w: number): this;
        setRotationFromAxis(axis: Vector3, angle: number, isRadian: boolean): this;
        rotateLocal(x: Vector3): this;
        rotateLocal(x: number, y: number, z: number): this;
        rotateFromAxis(axis: Vector3, angle: number, isRadian: boolean): this;
        setLocalEulerAngles(x: Vector3): this;
        setLocalEulerAngles(x: number, y: number, z: number): this;
        setLocalPosition(x: Vector3): this;
        setLocalPosition(x: number, y: number, z: number): this;
        setLocalScale(x: Vector3): this;
        setLocalScale(x: number, y: number, z: number): this;
        translate(x: Vector3): this;
        translate(x: number, y: number, z: number): this;
        /**
         * 模型变换函数
         */
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
        initElementArrayBufferForLaterUse(gl: WebGLRenderingContext, data: Uint16Array, type: number): {
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
        /**
         * 初始化obj数据，全局只需绑定一次
         * @param vertices 顶点矩阵
         * @param colors 颜色矩阵
         * @param normals 法向量矩阵
         * @param program　对应的着色器程序
         * @param indices 索引矩阵
         */
        initVertexBuffer(vertices: Float32Array, colors: Float32Array, normals: Float32Array, indices: Uint16Array): {
            vertex: any;
            color: any;
            normal: any;
            index: any;
            numIndices: any;
        };
        initShader(target: any): void;
        initOBJInfo(target: NEObject, path: any, callBack: any): void;
    }
}
declare namespace shader {
    interface ISIE {
        IS: number;
        IE: number;
    }
    /**
     * 4弯头
     * 3三通
     * 2阀门
     * 1管道
     */
    class Pipe extends NEnode implements ISIE {
        IS: number;
        IE: number;
        direct: Vector3;
        length: number;
        shader: Shader;
        constructor(x: number, y: number, z: number, startPoint: Vector3);
        onLoad(): void;
        onUpdate(dt: any): void;
        calculate1(x: number, y: number, z: number, startPoint: Vector3): Vector3;
    }
    class Tee extends NEnode implements ISIE {
        IS: number;
        IE: number;
        constructor();
        onLoad(): void;
        onUpdate(dt: any): void;
        calculate(): void;
    }
    class Elbow extends NEnode implements ISIE {
        IS: number;
        IE: number;
        RR: number;
        RA: number;
        IA: number;
        shader: Shader;
        constructor(startPoint: Vector3, direct: Vector3, nextDirect?: Vector3);
        onLoad(): void;
        onUpdate(dt: any): void;
        initSphere(startPoint: Vector3): void;
        calculate(startPoint: Vector3, direct: Vector3, nextDirect: Vector3): void;
    }
    class Valve extends NEnode implements ISIE {
        IS: number;
        IE: number;
        constructor();
        onLoad(): void;
        onUpdate(dt: any): void;
    }
    class GLIFNode {
        ISN: number;
        IEN: number;
        ITY: number;
        UnitPool: NEnode[];
        startPoint: any[];
        constructor(isn: any, ien: any, ity: any);
    }
}
declare namespace shader {
    class Sphere extends NEObject {
        info: any;
        colors: any;
        normals: any;
        indices: any;
        constructor();
        constructor();
        onLoad(): void;
        onUpdate(dt: any): void;
    }
}
import Nebula = Core.Nebula;
import Scene = Core.Scene;
import Camera = Core.Camera;
import shaderUtils = Utils.ShaderUtils;
import Matrix4 = Utils.Matrix4;
import Vector3 = Utils.Vector3;
import Vector4 = Utils.Vector4;
import Quat = Utils.Quat;
import NEObject = shader.NEObject;
import OBJParser = Utils.ObjParser;
import Render = Core.Render;
import RayCaster = Lib.RayCaster;
import BoundingBox = Lib.BoundingBox;
import GLIFParser = Utils.GLIFParser;
import Pipe = shader.Pipe;
import Tee = shader.Tee;
import Elbow = shader.Elbow;
import Valve = shader.Valve;
import GLIFNode = shader.GLIFNode;
import Sphere = shader.Sphere;
import Cube = NE3D.Cube;
declare const shaderTool: shaderUtils;
declare var GL: WebGLRenderingContext;
declare const canvas: {
    width: number;
    height: number;
};
declare var ne: Nebula;
declare var sceneInfo: Scene;
declare var camera: Camera;
declare var render: Render;
declare var gp: GLIFParser;
declare function main(): void;
import intToBytes32 = Utils.intToBytes32;
import intToBytes24 = Utils.intToBytes24;
declare namespace Core {
    class Color {
        buffer: ArrayBuffer;
        data: Float32Array;
        constructor(r?: number, g?: number, b?: number, a?: number);
        clone(): Color;
        copy({ data }: Color): this;
        set(r: number, g: number, b: number, a?: number): this;
        fromString(hex: any): this;
        toString(alpha: any): string;
        r: number;
        g: number;
        b: number;
        a: number;
    }
}
declare const zero_guard = 0.00001;
declare function rayPickLog(val: any): void;
declare function test1(): void;
declare function test2(): void;
declare function intersectSurfaceLine(pA: any, pB: any, pC: any, endA: any, endB: any, out: any): boolean;
declare function getNormal(pA: any, pB: any, out: any): void;
declare function getBaseScale(nAB: any): any;
declare function intersect(nSurface: any, point: any, nLine: any, linePoint: any, baseScale: any, out: any): boolean;
declare function xBaseInsect(nSurface: any, point: any, nLine: any, linePoint: any, out: any): boolean;
declare function yBaseInsect(nSurface: any, point: any, nLine: any, linePoint: any, out: any): boolean;
declare function zBaseInsect(nSurface: any, point: any, nLine: any, linePoint: any, out: any): boolean;
declare function surfacePointInSurface(pA: any, pB: any, pC: any, point: any): boolean;
declare function xyPointInSurface2D(pA: any, pB: any, pC: any, p: any): boolean;
declare function yzPointInSurface2D(pA: any, pB: any, pC: any, p: any): boolean;
declare function xzPointInSurface2D(pA: any, pB: any, pC: any, p: any): boolean;
declare function pointInSurface2D(pA: any, pB: any, pC: any, p: any): boolean;
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
declare function cross(out: any, a: any, b: any): any;
declare namespace shader {
    class Plane extends NEnode {
        info: any;
        colors: any;
        normals: any;
        indices: any;
        constructor();
        constructor();
        initPlane(): void;
        onUpdate(dt: any): void;
    }
}
