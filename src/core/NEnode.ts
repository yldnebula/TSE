namespace Core{
    export class NEnode{
     
        scale = new Vector3(1,1,1);
        rotation = new Quat();
        position = new Vector3();
        color = new Vector4(0,0,0,1);

        parent:NEnode = null;
        children:NEnode[] = [];
        constructor(){

        }
        addChild(obj:NEnode){
            this.children.push(obj);//未判断是否已经被加入到队列中
            obj.parent = this;
        }
        setParent(obj:NEnode){
            if(!!obj){
                if(!!this.parent){
                    var idx = this.parent.children.indexOf(this);//判断是否是第一次设置父节点
                    if(idx != -1){
                        this.parent.children.splice(idx, 1);
                    }
                }
                obj.children.push(this);
                this.parent = obj;
            }else{
                console.error("you can not set a child NEobject to null");
                return;
            }
        }
        setRotation(x: Quat): this;
        setRotation(x: number, y: number, z: number, w: number): this;
        setRotation(x?, y?, z?, w?) {
            let rotation: Quat;
            if (x instanceof Quat) {
                rotation = x;
            } else {
                rotation = new Quat(x, y, z, w);
            }
            this.rotation.copy(rotation);
            return this;
        }
        setRotationFromAxis(axis:Vector3,angle:number,isRadian:boolean):this{
            let rotation: Quat;
            var alpha = isRadian?angle:angle*Math.PI/180;//修改为右手定则
            axis = axis.normalize();
            
            var x= Math.sin(alpha/2)*axis.x;
            var y= Math.sin(alpha/2)*axis.y;
            var z= Math.sin(alpha/2)*axis.z;
            var w= Math.cos(alpha/2)
                
            rotation = new Quat(x, y, z, w);

            this.rotation.copy(rotation);
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
    
            this.rotation.mul(quaternion);
            return this;
        }
        rotateFromAxis(axis:Vector3,angle:number,isRadian:boolean){
            let rotation: Quat;
            var alpha = isRadian?angle:angle*Math.PI/180;//修改为右手定则
            axis = axis.normalize();
            
            var x= Math.sin(alpha/2)*axis.x;
            var y= Math.sin(alpha/2)*axis.y;
            var z= Math.sin(alpha/2)*axis.z;
            var w= Math.cos(alpha/2)

            rotation = new Quat(x, y, z, w);
            this.rotation.mul(rotation);
            return this;
        }
        setLocalEulerAngles(x: Vector3): this;
        setLocalEulerAngles(x: number, y: number, z: number): this;
        setLocalEulerAngles(x?, y?, z?) {
            if (x instanceof Vector3) {
                this.rotation.setFromEulerAngles(x.elements[0], x.elements[1], x.elements[2]);
            } else {
                this.rotation.setFromEulerAngles(x, y, z);
            }
            return this;
        }
        setLocalPosition(x: Vector3): this;
        setLocalPosition(x: number, y: number, z: number): this;
        setLocalPosition(x?, y?, z?) {
            if (x instanceof Vector3) {
                this.position.copy(x);
            } else {
                this.position.set(x, y, z);
            }
            return this;
        }
        setLocalScale(x: Vector3): this;
        setLocalScale(x: number, y: number, z: number): this;
        setLocalScale(x?, y?, z?) {
            if (x instanceof Vector3) {
                this.scale.copy(x);
            } else {
                this.scale.set(x, y, z);
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
            translation.add(this.position);
            this.setLocalPosition(translation);
            return this;
        }
        get up():Vector3{
            var ret = new Vector3();
            return ret;
        }
        get right():Vector3{
            var ret = new Vector3();
            return ret;
        }
        get front():Vector3{
            var ret = new Vector3();
            return ret;
        }
    }
}