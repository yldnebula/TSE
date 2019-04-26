// /<reference path=".././lib/Render.ts" />
///<reference path="../core/elements.ts" />
///<reference path="../../lib/matrix-utils/matrixUtils.ts" />
///<reference path="../script/Script.ts" />

import Script = script.Script;
import arrayRemove = Utils.arrayRemove;
import NElement = Core.NElement

namespace Core{

    export class NEnode extends NElement implements Script{
        scaleCompensatePosTransform = new Matrix4();
        scaleCompensatePos = new Vector3();
        scaleCompensateRot = new Quat();
        scaleCompensateRot2 = new Quat();
        scaleCompensateScale = new Vector3();
        scaleCompensateScaleForParent = new Vector3();
        //world
        scale = new Vector3(1,1,1);
        rotation = new Quat(0,0,0,1);
        position = new Vector3(0,0,0);
        color = new Vector4(0,0,0,1);
        eulerAngles = new Vector3(0,0,0);
        worldTransform = new Matrix4();


        //local
        localPosition = new Vector3(0, 0, 0);
        localRotation = new Quat(0, 0, 0, 1);
        localScale = new Vector3(1, 1, 1);
        localEulerAngles = new Vector3(0, 0, 0);
        localTransform = new Matrix4();

        scaleCompensation = false;
        private _dirtyNormal = true;
        private _dirtyLocal = false;
        private _dirtyWorld = false;
        private _up = new Vector3();
        private _right = new Vector3();
        private _forward = new Vector3();
    
        parent:NEnode = null;
        children:NEnode[] = [];
        constructor(){
            super();
        }
        onLoad(){
            
        }
        addChild(child: NEnode) {
            this.children.push(child);
            child.parent = this;
            child._dirtify();
        }
        removeChild(child: NEnode) {
            arrayRemove(this.children, child);
            child.parent = undefined;
        }
        setPosition(x: Vector3): this;
        setPosition(x: number, y: number, z: number): this;
        setPosition(x?, y?, z?) {
            let position = new Vector3();
            if (x instanceof Vector3) {
                position.copy(x);
            } else {
                position.set(x, y, z);
            }
            if (this.parent == null) {
                this.localPosition = position;
            } else {
                let invParentWtm = new Matrix4().copy(this.parent.getWorldTransform()).invert();
                invParentWtm.transformPoint(position, this.localPosition);
            }
            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
            return this;
        }
        /**
         * 获取世界坐标
         * @returns
         * @memberof INode
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
            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
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
            if (this.parent != null) {
                let parentRot = this.parent.getRotation();
                let invParentRot = new Quat().copy(parentRot).invert();
                this.localRotation.mul2(invParentRot, this.localRotation);
            }
    
            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
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
            // this.localPosition.copy(Vector3);
            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
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
            if (this.parent == null) {
                this.localRotation.copy(rotation);
            } else {
                let parentRot = this.parent.getRotation();
                let invParentRot = new Quat().copy(parentRot).invert();
                this.localRotation.copy(invParentRot).mul(rotation);
            }
    
            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
            return this;
        }
        getRotation() {
            this.rotation.setFromMat4(this.getWorldTransform());
            return this.rotation;
        }
        getWorldTransform() {
            if (!this._dirtyLocal && !this._dirtyWorld) {
                return this.worldTransform;
            }
            if (this.parent) {
                this.parent.getWorldTransform();
            }
            this._sync();
            return this.worldTransform;
        }
        setLocalScale(x: Vector3): this;
        setLocalScale(x: number, y: number, z: number): this;
        setLocalScale(x?, y?, z?) {
            if (x instanceof Vector3) {
                this.localScale.copy(x);
            } else {
                this.localScale.set(x, y, z);
            }
    
            if (!this._dirtyLocal) {
                this._dirtify(true);
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
    
            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
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
    
            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
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
    
            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
            return this;
        }
        getLocalTransform() {
            if (this._dirtyLocal) {
                this.localTransform.setTRS(this.localPosition, this.localRotation, this.localScale);
                this._dirtyLocal = false;
            }
            return this.localTransform;
        }
        // 更新此节点及其所有后代的世界转换矩阵。
        syncHierarchy() {
            if (!this.enabled) {
                return;
            }
            if (this._dirtyLocal || this._dirtyWorld) {
                this._sync();
            }
            for (let i = 0; i < this.children.length; i++) {
                this.children[i].syncHierarchy();
            }
        }
        private _sync() {
            if (this._dirtyLocal) {
                this.localTransform.setTRS(this.localPosition, this.localRotation, this.localScale);
                this._dirtyLocal = false;
            }
            if (this._dirtyWorld) {
                if (this.parent == null) {
    
                    this.worldTransform.copy(this.localTransform);
                } else {
                    if (this.scaleCompensation) {
                        let parentWorldScale!: Vector3;
                        let parent = this.parent;
    
                        // Find a parent of the first uncompensated node up in the hierarchy and use its scale * localScale
                        let scale = this.localScale;
                        let parentToUseScaleFrom: NEnode | undefined = parent; // current parent
                        if (parentToUseScaleFrom) {
                            while (parentToUseScaleFrom && parentToUseScaleFrom.scaleCompensation) {
                                parentToUseScaleFrom = parentToUseScaleFrom.parent;
                            }
                            // topmost node with scale compensation
                            if (parentToUseScaleFrom) {
                                parentToUseScaleFrom = parentToUseScaleFrom.parent;
                            } // node without scale compensation
                            if (parentToUseScaleFrom) {
                                parentWorldScale = parentToUseScaleFrom.worldTransform.getScale();
                                this.scaleCompensateScale.mul2(parentWorldScale, this.localScale);
                                scale = this.scaleCompensateScale;
                            }
                        }
    
    
                        // Rotation is as usual
                        this.scaleCompensateRot2.setFromMat4(parent.worldTransform);
                        this.scaleCompensateRot.mul2(this.scaleCompensateRot2, this.localRotation);
    
                        // Find matrix to transform position
                        let tmatrix = parent.worldTransform;
                        if (parent.scaleCompensation) {
                            // console.assert(parentWorldScale, 'parentWorldScale 不能是null');
                            this.scaleCompensateScaleForParent.mul2(parentWorldScale, parent.getLocalScale());
                            this.scaleCompensatePosTransform.setTRS(parent.worldTransform.getTranslation(this.scaleCompensatePos),
                                this.scaleCompensateRot2,
                                this.scaleCompensateScaleForParent);
                            tmatrix = this.scaleCompensatePosTransform;
                        }
                        tmatrix.transformPoint(this.localPosition, this.scaleCompensatePos);
    
                        this.worldTransform.setTRS(this.scaleCompensatePos,this. scaleCompensateRot, scale);
    
                    } else {
                        this.worldTransform.mul2(this.parent.worldTransform, this.localTransform);
                    }
                }
    
                this._dirtyWorld = false;
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
        /**
         * 标记自己和儿子“脏” 需要重新获取位置
         *
         * @private
         * @param {boolean} [local]
         * @returns
         * @memberof INode
         */
        // tslint:disable-next-line:member-ordering
        _dirtify(local?: boolean) {
            if ((!local || (local && this._dirtyLocal)) && this._dirtyWorld) {
                return;
            }
            if (local) {
                this._dirtyLocal = true;
            }
            if (!this._dirtyWorld) {
                this._dirtyWorld = true;
    
                let i = this.children.length;
                while (i--) {
                    if (this.children[i]._dirtyWorld) {
                        continue;
                    }
                    this.children[i]._dirtify();
                }
            }
            this._dirtyNormal = true;
            // this._aabbVer++;
            // TODO
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