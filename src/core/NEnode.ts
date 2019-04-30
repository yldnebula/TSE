// /<reference path=".././lib/Render.ts" />
///<reference path="../core/elements.ts" />
///<reference path="../../lib/matrix-utils/matrixUtils.ts" />
///<reference path="../script/Script.ts" />

import Script = script.Script;
import arrayRemove = Utils.arrayRemove;
import NElement = Core.NElement

namespace Core{

    export class NEnode extends NElement implements Script{
    
        //world
        scale = new Vector3(1,1,1);
        rotation = new Quat(0,0,0,1);
        position = new Vector3(0,0,0);
        color = new Color(0,0,0,1);
        eulerAngles = new Vector3(0,0,0);
        worldTransform = new Matrix4();


        //local
        localPosition = new Vector3(0, 0, 0);
        localRotation = new Quat(0, 0, 0, 1);
        localScale = new Vector3(1, 1, 1);
        localEulerAngles = new Vector3(0, 0, 0);
        localTransform = new Matrix4();

        private _up = new Vector3();
        private _right = new Vector3();
        private _forward = new Vector3();
    
        parent:NEnode = null;
        children:NEnode[] = [];

        //*****下面的变量有点没想好咋处理，先申明在这里 */
        boundingBox = null;
        shader:Shader = null;
        constructor(){
            super();
        }
        onLoad(){
            
        }
        onStart(){

        }
        onUpdate(dt){

        }
        onDestroy(){

        }
        setColor(color:Color){//我也不知道放这里好不好，但是现在还没有合适的位置;也不太清楚这个是不是最合适的修改颜色的方法,希望多思考一下，必要时可以改动一下架构
            this.color = color;
            // this.shader.OBJ.color = this.shader.initArrayBufferForLaterUse(GL,)
        }
        addChild(child: NEnode) {
            this.children.push(child);
            child.parent = this;

        }
        removeChild(child: NEnode) {
            arrayRemove(this.children, child);
            child.parent = undefined;
        }
        setPosition(x: Vector3): this;
        setPosition(x: number, y: number, z: number): this;
        setPosition(x?, y?, z?) {//与层级结构有关的位置变换
            let position = new Vector3();
            if (x instanceof Vector3) {
                position.copy(x);
            } else {
                position.set(x, y, z);
            }
            this.localPosition = position;

            this._sync();//更新

            return this;
        }
        /**
         * 获取世界坐标
         * @returns
         */
        getPosition() {
            this.getWorldTransform().getTranslation(this.position);
            return this.position;
        }
        setLocalEulerAngles(x: Vector3): this;
        setLocalEulerAngles(x: number, y: number, z: number): this;
        setLocalEulerAngles(x?, y?, z?) {
            if (x instanceof Vector3) {
                this.localRotation.setFromEulerAngles(x.elements[0], x.elements[1], x.elements[2]);
            } else {
                this.localRotation.setFromEulerAngles(x, y, z);
            }

            this.getLocalTransform();//修改本地模型矩阵
            return this;
        }
        getLocalEulerAngles() {
            this.localRotation.getEulerAngles(this.localEulerAngles);
            return this.localEulerAngles;
        }
        setEulerAngles(x: Vector3): this;
        setEulerAngles(x: number, y: number, z: number): this;
        setEulerAngles(x?, y?, z?) {
            if (x instanceof Vector3) {
                this.localRotation.setFromEulerAngles(x.elements[0], x.elements[1], x.elements[2]);
            } else {
                this.localRotation.setFromEulerAngles(x, y, z);
            }

            this._sync();
            return this;
        }
        getEulerAngles() {
            this.getWorldTransform().getEulerAngles(this.eulerAngles);
            return this.eulerAngles;
        }
        setLocalPosition(x: Vector3): this;
        setLocalPosition(x: number, y: number, z: number): this;
        setLocalPosition(x?, y?, z?) {
            if (x instanceof Vector3) {
                this.localPosition.copy(x);
            } else {
                this.localPosition.set(x, y, z);
            }

            this.getLocalTransform();
            return this;
        }
        getLocalPosition() {
            return this.localPosition;
        }
        /**
         * local
         * @param {Quat} x
         * @returns {this}
         * @memberof NEnode
         */
        setRotation(x: Quat): this;
        setRotation(x: number, y: number, z: number, w: number): this;
        setRotation(x?, y?, z?, w?) {
            let rotation: Quat;
            if (x instanceof Quat) {
                rotation = x;
            } else {
                rotation = new Quat(x, y, z, w);
            }
            this.localRotation = rotation;
            this._sync();
            return this;
        }
        getRotation() {
            this.rotation.setFromMat4(this.getWorldTransform());
            return this.rotation;
        }
        setLocalScale(x: Vector3): this;
        setLocalScale(x: number, y: number, z: number): this;
        setLocalScale(x?, y?, z?) {
            if (x instanceof Vector3) {
                this.localScale.copy(x);
            } else {
                this.localScale.set(x, y, z);
            }
            return this;
        }
        getLocalScale() {
            return this.localScale;
        }
        rotate(x: Vector3): this;
        rotate(x: number, y: number, z: number): this;
        rotate(x?, y?, z?) {
            let quaternion = new Quat();
            let invParentRot = new Quat();
            if (x instanceof Vector3) {
                quaternion.setFromEulerAngles(x.elements[0], x.elements[1], x.elements[2]);
            } else {
                quaternion.setFromEulerAngles(x, y, z);
            }
    
            if (this.parent == null) {
                this.localRotation.mul2(quaternion, this.localRotation);
            } else {
                let rot = this.getRotation();
                let parentRot = this.parent.getRotation();
    
                invParentRot.copy(parentRot).invert();
                quaternion.mul2(invParentRot, quaternion);
                this.localRotation.mul2(quaternion, rot);
            }
    
            this._sync();
            return this;
        }
        rotateLocal(x: Vector3): this;
        rotateLocal(x: number, y: number, z: number): this;
        rotateLocal(x?, y?, z?) {
            let quaternion = new Quat();
            if (x instanceof Vector3) {
                quaternion.setFromEulerAngles(x.elements[0], x.elements[1], x.elements[2]);
            } else {
                quaternion.setFromEulerAngles(x, y, z);
            }
    
            this.localRotation.mul(quaternion);
    
            return this;
        }
        rotateFromAxis(axis:Vector3,angle:number,isRadian:boolean){//绕轴旋转，右手定则
            let rotation: Quat;
            var alpha = isRadian?angle:angle*Math.PI/180;//修改为右手定则
            axis = axis.normalize();
            
            var x= Math.sin(alpha/2)*axis.x;
            var y= Math.sin(alpha/2)*axis.y;
            var z= Math.sin(alpha/2)*axis.z;
            var w= Math.cos(alpha/2)

            rotation = new Quat(x, y, z, w);
            this.localRotation.mul(rotation);
            return this;
        }
        translate(x: Vector3): this;
        translate(x: number, y: number, z: number): this;
        translate(x?, y?, z?) {
            let translation: Vector3;
            if (x instanceof Vector3) {
                translation = x.clone();
            } else {
                translation = new Vector3(x, y, z);
            }
            translation.add(this.getPosition());
            this.setPosition(translation);
            return this;
        }
        translateLocal(x: Vector3): this;
        translateLocal(x: number, y: number, z: number): this;
        translateLocal(x?, y?, z?) {
            let translation: Vector3;
            if (x instanceof Vector3) {
                translation = x.clone();
            } else {
                translation = new Vector3(x, y, z);
            }
            this.localRotation.transformVector(translation, translation);
            this.localPosition.add(translation);

            return this;
        }
        getLocalTransform() {
            this.localTransform = new Matrix4().setTRS(this.localPosition,this.localRotation,this.localScale);

            return this.localTransform;
        }
        getWorldTransform() {
            var parentModelMatrix = new Matrix4();
            if (!!this.parent) {//如果父亲存在,层级结构可以一直递归到根
                parentModelMatrix = this.parent.getWorldTransform();
            }

            this.worldTransform = parentModelMatrix.multiply(this.getLocalTransform());//setTRS

            return this.worldTransform;
        }
        private _sync(){//更新层级结构世界模型矩阵
            this.worldTransform = this.getWorldTransform();

            if(this.children.length>0){
                for(var child of this.children){
                    child.worldTransform = this.worldTransform.multiply(child.localTransform);//更新子节点世界模型矩阵，传入shader即可进行层次修改
                }
            }
        }
        get root() {
            let parent = this.parent;
            if (!parent) {
                return this;
            }
            while (parent.parent) {
                parent = parent.parent;
            }
            return parent;
        }
        get up() {
            return this.getWorldTransform().getY(this._up).normalize();
        }
        get forward() {
            return this.getWorldTransform().getZ(this._forward).normalize();
        }
        get right() {
            return this.getWorldTransform().getX(this._right).normalize();
        }
    }
}