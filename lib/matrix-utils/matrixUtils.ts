namespace Utils{
  export const DEG_TO_RAD = Math.PI / 180;
  export const RAD_TO_DEG = 180 / Math.PI;
  export const INV_LOG2 = 1 / Math.log(2);
    /**
     * 四方矩阵类
     */
    export class Matrix4{
        elements:Float32Array= null;
        constructor();
        constructor(
            v0: number, v1: number, v2: number, v3: number, v4: number, v5: number, v6: number, v7: number, v8: number,
            v9: number, v10: number, v11: number, v12: number, v13: number, v14: number, v15: number
        );
        constructor(v0: [
            number, number, number, number, number, number, number, number,
            number, number, number, number, number, number, number, number
        ]);
        constructor(v0?, v1?, v2?, v3?, v4?, v5?, v6?, v7?, v8?, v9?, v10?, v11?, v12?, v13?, v14?, v15?) {
            if (v0 && v0.length === 16) {
                this.elements = new Float32Array(v0);
                return;
            }
    
            this.elements = new Float32Array(16);
    
            if (typeof (v0) === 'number') {
                this.elements[0] = v0;
                this.elements[1] = v1;
                this.elements[2] = v2;
                this.elements[3] = v3;
                this.elements[4] = v4;
                this.elements[5] = v5;
                this.elements[6] = v6;
                this.elements[7] = v7;
                this.elements[8] = v8;
                this.elements[9] = v9;
                this.elements[10] = v10;
                this.elements[11] = v11;
                this.elements[12] = v12;
                this.elements[13] = v13;
                this.elements[14] = v14;
                this.elements[15] = v15;
            } else {
                this.setIdentity();
            }
        }
        /**
         * 设置单位矩阵
         */
        setIdentity(){
            var e = this.elements;
            e[0] = 1;   e[4] = 0;   e[8]  = 0;   e[12] = 0;
            e[1] = 0;   e[5] = 1;   e[9]  = 0;   e[13] = 0;
            e[2] = 0;   e[6] = 0;   e[10] = 1;   e[14] = 0;
            e[3] = 0;   e[7] = 0;   e[11] = 0;   e[15] = 1;
            return this;
        }
        /**
         * 通过一个四方矩阵设置一个新矩阵
         * @param src 源四方矩阵
         */
        set(src:Matrix4){
            var i:number, s:Float32Array, d:Float32Array;

            s = src.elements;
            d = this.elements;
          
            if (s === d) {
              return;
            }
          
            for (i = 0; i < 16; ++i) {
              d[i] = s[i];
            }
          
            return this;
        }
        /**
         * 右乘一个四方矩阵
         * @param other 需要右乘的四方矩阵
         */
        concat(other:Matrix4){
            var i:number, e:Float32Array, 
            a:Float32Array, b:Float32Array, 
            ai0:number, ai1:number, ai2:number, 
            ai3:number;

            // Calculate e = a * b
            e = this.elements;
            a = this.elements;
            b = other.elements;

            // If e equals b, copy b to temporary matrix.
            if (e === b) {
                b = new Float32Array(16);
                for (i = 0; i < 16; ++i) {
                b[i] = e[i];
                }
            }

            for (i = 0; i < 4; i++) {
                ai0=a[i];  ai1=a[i+4];  ai2=a[i+8];  ai3=a[i+12];
                e[i]    = ai0 * b[0]  + ai1 * b[1]  + ai2 * b[2]  + ai3 * b[3];
                e[i+4]  = ai0 * b[4]  + ai1 * b[5]  + ai2 * b[6]  + ai3 * b[7];
                e[i+8]  = ai0 * b[8]  + ai1 * b[9]  + ai2 * b[10] + ai3 * b[11];
                e[i+12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
            }

            return this;
        }
        /**
         * 右乘一个四方矩阵
         * @param other 需要右乘的四方矩阵
         */
        multiply(other:Matrix4){
            this.concat(other);
            return this;
        }
        mul2(lhs: Matrix4, rhs: Matrix4): this {
            let a00, a01, a02, a03,
                a10, a11, a12, a13,
                a20, a21, a22, a23,
                a30, a31, a32, a33,
                b0, b1, b2, b3,
                a = lhs.elements,
                b = rhs.elements,
                r = this.elements;
    
            a00 = a[0];
            a01 = a[1];
            a02 = a[2];
            a03 = a[3];
            a10 = a[4];
            a11 = a[5];
            a12 = a[6];
            a13 = a[7];
            a20 = a[8];
            a21 = a[9];
            a22 = a[10];
            a23 = a[11];
            a30 = a[12];
            a31 = a[13];
            a32 = a[14];
            a33 = a[15];
    
            b0 = b[0];
            b1 = b[1];
            b2 = b[2];
            b3 = b[3];
            r[0] = a00 * b0 + a10 * b1 + a20 * b2 + a30 * b3;
            r[1] = a01 * b0 + a11 * b1 + a21 * b2 + a31 * b3;
            r[2] = a02 * b0 + a12 * b1 + a22 * b2 + a32 * b3;
            r[3] = a03 * b0 + a13 * b1 + a23 * b2 + a33 * b3;
    
            b0 = b[4];
            b1 = b[5];
            b2 = b[6];
            b3 = b[7];
            r[4] = a00 * b0 + a10 * b1 + a20 * b2 + a30 * b3;
            r[5] = a01 * b0 + a11 * b1 + a21 * b2 + a31 * b3;
            r[6] = a02 * b0 + a12 * b1 + a22 * b2 + a32 * b3;
            r[7] = a03 * b0 + a13 * b1 + a23 * b2 + a33 * b3;
    
            b0 = b[8];
            b1 = b[9];
            b2 = b[10];
            b3 = b[11];
            r[8] = a00 * b0 + a10 * b1 + a20 * b2 + a30 * b3;
            r[9] = a01 * b0 + a11 * b1 + a21 * b2 + a31 * b3;
            r[10] = a02 * b0 + a12 * b1 + a22 * b2 + a32 * b3;
            r[11] = a03 * b0 + a13 * b1 + a23 * b2 + a33 * b3;
    
            b0 = b[12];
            b1 = b[13];
            b2 = b[14];
            b3 = b[15];
            r[12] = a00 * b0 + a10 * b1 + a20 * b2 + a30 * b3;
            r[13] = a01 * b0 + a11 * b1 + a21 * b2 + a31 * b3;
            r[14] = a02 * b0 + a12 * b1 + a22 * b2 + a32 * b3;
            r[15] = a03 * b0 + a13 * b1 + a23 * b2 + a33 * b3;
    
            return this;
        }
        /**
         * 左乘一个四方矩阵
         */
        leftMultiply(other:Matrix4){
          var ret = new Matrix4(null);
          return other.multiply(ret);
        }
        /**
         * 右乘一个三维矩阵，返回三维向量
         * @param pos 右乘的三维矩阵
         */
        mutiplyVector3(pos:Vector3):Vector3{
            var e:Float32Array = this.elements;
            var p = pos.elements;
            var v = new Vector3(null);
            var result = v.elements;
          
            result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[ 8] + e[11];
            result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[ 9] + e[12];
            result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + e[13];
          
            return v;
        }
        /**
         * 右乘一个四维向量，返回四维向量
         * @param pos 右乘的四维向量
         */
        multiplyVector4(pos:Vector4):Vector4{
            var e = this.elements;
            var p = pos.elements;
            var v = new Vector4(null);
            var result = v.elements;
          
            result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[ 8] + p[3] * e[12];
            result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[ 9] + p[3] * e[13];
            result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + p[3] * e[14];
            result[3] = p[0] * e[3] + p[1] * e[7] + p[2] * e[11] + p[3] * e[15];
          
            return v;
        }
        /**
         * 转置矩阵本身
         */
        transpose():Matrix4{
            var e:Float32Array, t:number;
            e = this.elements;
          
            t = e[ 1];  e[ 1] = e[ 4];  e[ 4] = t;
            t = e[ 2];  e[ 2] = e[ 8];  e[ 8] = t;
            t = e[ 3];  e[ 3] = e[12];  e[12] = t;
            t = e[ 6];  e[ 6] = e[ 9];  e[ 9] = t;
            t = e[ 7];  e[ 7] = e[13];  e[13] = t;
            t = e[11];  e[11] = e[14];  e[14] = t;
          
            return this;
        }
        /**
         * 返回一个源四方矩阵的逆矩阵
         * @param other 源四方矩阵
         */
        setInverseOf(other:Matrix4):Matrix4{
            var i:number, s:Float32Array,
                d:Float32Array,
                det:number;

            s = other.elements;
            d = this.elements;
            var inv = new Float32Array(16);

            inv[0]  =   s[5]*s[10]*s[15] - s[5] *s[11]*s[14] - s[9] *s[6]*s[15]
                        + s[9]*s[7] *s[14] + s[13]*s[6] *s[11] - s[13]*s[7]*s[10];
            inv[4]  = - s[4]*s[10]*s[15] + s[4] *s[11]*s[14] + s[8] *s[6]*s[15]
                        - s[8]*s[7] *s[14] - s[12]*s[6] *s[11] + s[12]*s[7]*s[10];
            inv[8]  =   s[4]*s[9] *s[15] - s[4] *s[11]*s[13] - s[8] *s[5]*s[15]
                        + s[8]*s[7] *s[13] + s[12]*s[5] *s[11] - s[12]*s[7]*s[9];
            inv[12] = - s[4]*s[9] *s[14] + s[4] *s[10]*s[13] + s[8] *s[5]*s[14]
                        - s[8]*s[6] *s[13] - s[12]*s[5] *s[10] + s[12]*s[6]*s[9];

            inv[1]  = - s[1]*s[10]*s[15] + s[1] *s[11]*s[14] + s[9] *s[2]*s[15]
                        - s[9]*s[3] *s[14] - s[13]*s[2] *s[11] + s[13]*s[3]*s[10];
            inv[5]  =   s[0]*s[10]*s[15] - s[0] *s[11]*s[14] - s[8] *s[2]*s[15]
                        + s[8]*s[3] *s[14] + s[12]*s[2] *s[11] - s[12]*s[3]*s[10];
            inv[9]  = - s[0]*s[9] *s[15] + s[0] *s[11]*s[13] + s[8] *s[1]*s[15]
                        - s[8]*s[3] *s[13] - s[12]*s[1] *s[11] + s[12]*s[3]*s[9];
            inv[13] =   s[0]*s[9] *s[14] - s[0] *s[10]*s[13] - s[8] *s[1]*s[14]
                        + s[8]*s[2] *s[13] + s[12]*s[1] *s[10] - s[12]*s[2]*s[9];

            inv[2]  =   s[1]*s[6]*s[15] - s[1] *s[7]*s[14] - s[5] *s[2]*s[15]
                        + s[5]*s[3]*s[14] + s[13]*s[2]*s[7]  - s[13]*s[3]*s[6];
            inv[6]  = - s[0]*s[6]*s[15] + s[0] *s[7]*s[14] + s[4] *s[2]*s[15]
                        - s[4]*s[3]*s[14] - s[12]*s[2]*s[7]  + s[12]*s[3]*s[6];
            inv[10] =   s[0]*s[5]*s[15] - s[0] *s[7]*s[13] - s[4] *s[1]*s[15]
                        + s[4]*s[3]*s[13] + s[12]*s[1]*s[7]  - s[12]*s[3]*s[5];
            inv[14] = - s[0]*s[5]*s[14] + s[0] *s[6]*s[13] + s[4] *s[1]*s[14]
                        - s[4]*s[2]*s[13] - s[12]*s[1]*s[6]  + s[12]*s[2]*s[5];

            inv[3]  = - s[1]*s[6]*s[11] + s[1]*s[7]*s[10] + s[5]*s[2]*s[11]
                        - s[5]*s[3]*s[10] - s[9]*s[2]*s[7]  + s[9]*s[3]*s[6];
            inv[7]  =   s[0]*s[6]*s[11] - s[0]*s[7]*s[10] - s[4]*s[2]*s[11]
                        + s[4]*s[3]*s[10] + s[8]*s[2]*s[7]  - s[8]*s[3]*s[6];
            inv[11] = - s[0]*s[5]*s[11] + s[0]*s[7]*s[9]  + s[4]*s[1]*s[11]
                        - s[4]*s[3]*s[9]  - s[8]*s[1]*s[7]  + s[8]*s[3]*s[5];
            inv[15] =   s[0]*s[5]*s[10] - s[0]*s[6]*s[9]  - s[4]*s[1]*s[10]
                        + s[4]*s[2]*s[9]  + s[8]*s[1]*s[6]  - s[8]*s[2]*s[5];

            det = s[0]*inv[0] + s[1]*inv[4] + s[2]*inv[8] + s[3]*inv[12];
            if (det === 0) {
                return this;
            }

            det = 1 / det;
            for (i = 0; i < 16; i++) {
                d[i] = inv[i] * det;
            }

            return this;
        }
        copy(rhs: Matrix4): this {
            let src = rhs.elements,
                dst = this.elements;
    
            dst[0] = src[0];
            dst[1] = src[1];
            dst[2] = src[2];
            dst[3] = src[3];
            dst[4] = src[4];
            dst[5] = src[5];
            dst[6] = src[6];
            dst[7] = src[7];
            dst[8] = src[8];
            dst[9] = src[9];
            dst[10] = src[10];
            dst[11] = src[11];
            dst[12] = src[12];
            dst[13] = src[13];
            dst[14] = src[14];
            dst[15] = src[15];
    
            return this;
        }
        /**
         * 修改自身，逆矩阵
         *
         * @returns {this} this
         * @memberof Mat4
         */
        invert(): this {
            let a00, a01, a02, a03,
                a10, a11, a12, a13,
                a20, a21, a22, a23,
                a30, a31, a32, a33,
                b00, b01, b02, b03,
                b04, b05, b06, b07,
                b08, b09, b10, b11,
                det, invDet, m;

            m = this.elements;
            a00 = m[0];
            a01 = m[1];
            a02 = m[2];
            a03 = m[3];
            a10 = m[4];
            a11 = m[5];
            a12 = m[6];
            a13 = m[7];
            a20 = m[8];
            a21 = m[9];
            a22 = m[10];
            a23 = m[11];
            a30 = m[12];
            a31 = m[13];
            a32 = m[14];
            a33 = m[15];

            b00 = a00 * a11 - a01 * a10;
            b01 = a00 * a12 - a02 * a10;
            b02 = a00 * a13 - a03 * a10;
            b03 = a01 * a12 - a02 * a11;
            b04 = a01 * a13 - a03 * a11;
            b05 = a02 * a13 - a03 * a12;
            b06 = a20 * a31 - a21 * a30;
            b07 = a20 * a32 - a22 * a30;
            b08 = a20 * a33 - a23 * a30;
            b09 = a21 * a32 - a22 * a31;
            b10 = a21 * a33 - a23 * a31;
            b11 = a22 * a33 - a23 * a32;

            det = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);
            if (det === 0) {
                // #ifdef DEBUG
                console.warn("pc.Mat4#invert: Can't invert matrix, determinant is 0");
                // #endif
                this.setIdentity();
            } else {
                invDet = 1 / det;

                m[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
                m[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
                m[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
                m[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
                m[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
                m[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
                m[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
                m[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
                m[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
                m[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
                m[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
                m[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
                m[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
                m[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
                m[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
                m[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
            }


            return this;
        }
            /**
     * 移动到某个点
     *
     * @param {Vec3} vec
     * @param {Vec3} [res] ref
     * @returns {Vec3} res
     * @memberof Mat4
     */
    transformPoint(vec: Vector3, res?/* ref */: Vector3): Vector3 {
        let x, y, z,
            m = this.elements,
            v = vec.elements;

        res = (res === undefined) ? new Vector3() : res;

        x =
            v[0] * m[0] +
            v[1] * m[4] +
            v[2] * m[8] +
            m[12];
        y =
            v[0] * m[1] +
            v[1] * m[5] +
            v[2] * m[9] +
            m[13];
        z =
            v[0] * m[2] +
            v[1] * m[6] +
            v[2] * m[10] +
            m[14];

        return res.set(x, y, z);
    }
        /**
         * 设置正交投影矩阵，定义盒状可视空间，变量范围在[-1.0,1.0]
         * @param left 剪裁面的左边界
         * @param right 剪裁面的右边界
         * @param bottom 剪裁面的下边界
         * @param top 剪裁面的上边界
         * @param near 剪裁面的近边界
         * @param far 剪裁面的远边界
         */
        setOrtho(left:number, right:number, bottom:number, top:number, near:number, far:number){
            var e:Float32Array, rw:number, rh:number, rd:number;

            if (left === right || bottom === top || near === far) {
              throw 'null frustum';
            }
          
            rw = 1 / (right - left);
            rh = 1 / (top - bottom);
            rd = 1 / (far - near);
          
            e = this.elements;
          
            e[0]  = 2 * rw;
            e[1]  = 0;
            e[2]  = 0;
            e[3]  = 0;
          
            e[4]  = 0;
            e[5]  = 2 * rh;
            e[6]  = 0;
            e[7]  = 0;
          
            e[8]  = 0;
            e[9]  = 0;
            e[10] = -2 * rd;
            e[11] = 0;
          
            e[12] = -(right + left) * rw;
            e[13] = -(top + bottom) * rh;
            e[14] = -(far + near) * rd;
            e[15] = 1;
          
            return this;
        }
        /**
         * 设置透视投影矩阵
         * @param fovy 视锥体上下两侧的角度
         * @param aspect 视锥体的横纵比，使用canvas.width/canvas.height
         * @param near 视点到近剪裁面的距离，为正值
         * @param far 视点到远剪裁面的距离，为正值
         */
        setPerspective(fovy:number, aspect:number, near:number, far:number){
            var e:Float32Array, rd:number, s:number, ct:number;

            if (near === far || aspect === 0) {
              throw 'null frustum';
            }
            if (near <= 0) {
              throw 'near <= 0';
            }
            if (far <= 0) {
              throw 'far <= 0';
            }
          
            fovy = Math.PI * fovy / 180 / 2;
            s = Math.sin(fovy);
            if (s === 0) {
              throw 'null frustum';
            }
          
            rd = 1 / (far - near);
            ct = Math.cos(fovy) / s;
          
            e = this.elements;
          
            e[0]  = ct / aspect;
            e[1]  = 0;
            e[2]  = 0;
            e[3]  = 0;
          
            e[4]  = 0;
            e[5]  = ct;
            e[6]  = 0;
            e[7]  = 0;
          
            e[8]  = 0;
            e[9]  = 0;
            e[10] = -(far + near) * rd;
            e[11] = -1;
          
            e[12] = 0;
            e[13] = 0;
            e[14] = -2 * near * far * rd;
            e[15] = 0;
          
            return this;
        }
        /**
         * 设置缩放矩阵，一般new一个四方矩阵来存储
         * @param x x方向上的缩放比例
         * @param y y方向上的缩放比例
         * @param z z方向上的缩放比例
         */
        setScale(x:number, y:number, z:number){
            var e = this.elements;
            e[0] = x;  e[4] = 0;  e[8]  = 0;  e[12] = 0;
            e[1] = 0;  e[5] = y;  e[9]  = 0;  e[13] = 0;
            e[2] = 0;  e[6] = 0;  e[10] = z;  e[14] = 0;
            e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
            return this;
        }
        scale(x:number, y:number, z:number){
          var e = this.elements;
          e[0] *= x;  e[4] *= y;  e[8]  *= z;
          e[1] *= x;  e[5] *= y;  e[9]  *= z;
          e[2] *= x;  e[6] *= y;  e[10] *= z;
          e[3] *= x;  e[7] *= y;  e[11] *= z;
          return this;
        }
        /**
         * 设置移动矩阵，一般new一个四方矩阵来存储
         * @param x x方向上的位移
         * @param y y方向上的位移
         * @param z z方向上的位移
         */
        setTranslate(x:number, y:number, z:number){
            var e = this.elements;
            e[0] = 1;  e[4] = 0;  e[8]  = 0;  e[12] = x;
            e[1] = 0;  e[5] = 1;  e[9]  = 0;  e[13] = y;
            e[2] = 0;  e[6] = 0;  e[10] = 1;  e[14] = z;
            e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
            return this;
        }
        /**
         * 将当前矩阵右乘一个平移矩阵
         * @param x x方向上的位移
         * @param y y方向上的位移
         * @param z z方向上的位移
         */
        translate(x:number, y:number, z:number){
            var e = this.elements;
            e[12] += e[0] * x + e[4] * y + e[8]  * z;
            e[13] += e[1] * x + e[5] * y + e[9]  * z;
            e[14] += e[2] * x + e[6] * y + e[10] * z;
            e[15] += e[3] * x + e[7] * y + e[11] * z;
            return this;
        }
        /**
         * 设置绕轴旋转矩阵
         * @param angle 绕轴旋转角度
         * @param x 为1则表示绕x轴旋转
         * @param y 为1则表示绕y轴旋转
         * @param z 为1则表示绕z轴旋转
         */
        setRotate(angle: number, x: number, y: number, z: number){
            var e:Float32Array, s: number, c: number,
                len: number, rlen: number, nc: number, 
                xy: number, yz: number, zx: number, 
                xs: number, ys: number, zs: number;

            angle = Math.PI * angle / 180;
            e = this.elements;
          
            s = Math.sin(angle);
            c = Math.cos(angle);
          
            if (0 !== x && 0 === y && 0 === z) {
              // Rotation around X axis
              if (x < 0) {
                s = -s;
              }
              e[0] = 1;  e[4] = 0;  e[ 8] = 0;  e[12] = 0;
              e[1] = 0;  e[5] = c;  e[ 9] =-s;  e[13] = 0;
              e[2] = 0;  e[6] = s;  e[10] = c;  e[14] = 0;
              e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
            } else if (0 === x && 0 !== y && 0 === z) {
              // Rotation around Y axis
              if (y < 0) {
                s = -s;
              }
              e[0] = c;  e[4] = 0;  e[ 8] = s;  e[12] = 0;
              e[1] = 0;  e[5] = 1;  e[ 9] = 0;  e[13] = 0;
              e[2] =-s;  e[6] = 0;  e[10] = c;  e[14] = 0;
              e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
            } else if (0 === x && 0 === y && 0 !== z) {
              // Rotation around Z axis
              if (z < 0) {
                s = -s;
              }
              e[0] = c;  e[4] =-s;  e[ 8] = 0;  e[12] = 0;
              e[1] = s;  e[5] = c;  e[ 9] = 0;  e[13] = 0;
              e[2] = 0;  e[6] = 0;  e[10] = 1;  e[14] = 0;
              e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
            } else {
              // Rotation around another axis
              len = Math.sqrt(x*x + y*y + z*z);
              if (len !== 1) {
                rlen = 1 / len;
                x *= rlen;
                y *= rlen;
                z *= rlen;
              }
              nc = 1 - c;
              xy = x * y;
              yz = y * z;
              zx = z * x;
              xs = x * s;
              ys = y * s;
              zs = z * s;
          
              e[ 0] = x*x*nc +  c;
              e[ 1] = xy *nc + zs;
              e[ 2] = zx *nc - ys;
              e[ 3] = 0;
          
              e[ 4] = xy *nc - zs;
              e[ 5] = y*y*nc +  c;
              e[ 6] = yz *nc + xs;
              e[ 7] = 0;
          
              e[ 8] = zx *nc + ys;
              e[ 9] = yz *nc - xs;
              e[10] = z*z*nc +  c;
              e[11] = 0;
          
              e[12] = 0;
              e[13] = 0;
              e[14] = 0;
              e[15] = 1;
            }
          
            return this;
        }
        rotate(angle:number, x:number, y:number, z:number) {
          return this.concat(new Matrix4(null).setRotate(angle, x, y, z));
        };
        /**
         * 四元数设置旋转矩阵
         * @param axis  轴向
         * @param angle 绕轴旋转角度
         */
        setRotateFromQuaternion1(axis:Vector3, angle:number, isRadian:boolean){
          var alpha = isRadian?-angle:-angle*180/Math.PI;//修改为右手定则
          axis = axis.normalize();
          var x= Math.sin(alpha/2)*axis.elements[0];
          var y= Math.sin(alpha/2)*axis.elements[1];
          var z= Math.sin(alpha/2)*axis.elements[2];
          var w= Math.cos(alpha/2)

          
          var e:Float32Array;
          e = this.elements;

          e[ 0] = 2 * ( x * x + w * w ) - 1;
          e[ 1] = 2 * ( x * y - z * w );
          e[ 2] = 2 * ( x * z + y * w );
          e[ 3] = 0.0;
      
          e[ 4] = 2 * ( x * y + z * w );
          e[ 5] = 2 * ( y * y + w * w ) - 1;
          e[ 6] = 2 * ( y * z - x * w );
          e[ 7] = 0.0;
      
          e[ 8] = 2 * ( x * z - y * w );
          e[ 9] = 2 * ( y * z + x * w );
          e[10] = 2 * ( z * z + w * w ) - 1;
          e[11] = 0.0;
      
          e[12] = 0;
          e[13] = 0;
          e[14] = 0;
          e[15] = 1.0;

          return this;
        }
        setRotateFromQuaternion(axis:Vector3, angle:number, isRadian:boolean){
          var alpha = isRadian?angle:angle*180/Math.PI;

          var e:Float32Array;
          e = this.elements;

          var u = axis.elements[0];
          var v = axis.elements[1];
          var w = axis.elements[2];

          var c = Math.cos(angle)
          var s = Math.sin(angle)


          e[ 0] = u*u+(1-u*u)*c;
          e[ 1] = u*v*(1-c)+w*s;
          e[ 2] = u*w*(1-c)-v*s;
          e[ 3] = 0.0;
      
          e[ 4] = u*v*(1-c)-w*s;
          e[ 5] = v*v+(1-v*v)*c;
          e[ 6] = v*w*(1-c)+u*s;
          e[ 7] = 0.0;
      
          e[ 8] = u*w*(1-c)+v*s;
          e[ 9] = v*w*(1-c)-u*s;
          e[10] = w*w+(1-w*w)*c;
          e[11] = 0.0;
      
          e[12] = 0;
          e[13] = 0;
          e[14] = 0;
          e[15] = 1.0;

          return this;
        }
        /**
         * 四元数旋转矩阵
         */
        rotateByQuaternion(axis:Vector3, angle:number, isRadian:boolean){
          return this.concat(new Matrix4(null).setRotateFromQuaternion(axis,angle,isRadian));
        }
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
        setLookAt(eyeX: number, eyeY: number, eyeZ: number, centerX: number, centerY: number, centerZ: number, upX: number, upY: number, upZ: number){
            var e:Float32Array, fx: number, fy: number, 
                fz: number, rlf: number, sx: number, sy: number, 
                sz: number, rls: number, ux: number, uy: number, uz: number;

            fx = centerX - eyeX;
            fy = centerY - eyeY;
            fz = centerZ - eyeZ;
          
            // Normalize f.
            rlf = 1 / Math.sqrt(fx*fx + fy*fy + fz*fz);
            fx *= rlf;
            fy *= rlf;
            fz *= rlf;
          
            // Calculate cross product of f and up.
            sx = fy * upZ - fz * upY;
            sy = fz * upX - fx * upZ;
            sz = fx * upY - fy * upX;
          
            // Normalize s.
            rls = 1 / Math.sqrt(sx*sx + sy*sy + sz*sz);
            sx *= rls;
            sy *= rls;
            sz *= rls;
          
            // Calculate cross product of s and f.
            ux = sy * fz - sz * fy;
            uy = sz * fx - sx * fz;
            uz = sx * fy - sy * fx;
          
            // Set to this.
            e = this.elements;
            e[0] = sx;
            e[1] = ux;
            e[2] = -fx;
            e[3] = 0;
          
            e[4] = sy;
            e[5] = uy;
            e[6] = -fy;
            e[7] = 0;
          
            e[8] = sz;
            e[9] = uz;
            e[10] = -fz;
            e[11] = 0;
          
            e[12] = 0;
            e[13] = 0;
            e[14] = 0;
            e[15] = 1;
          
            // Translate.
            return this.translate(-eyeX, -eyeY, -eyeZ);
        }
        lookAt(eyeX: number, eyeY: number, eyeZ: number, centerX: number, centerY: number, centerZ: number, upX: number, upY: number, upZ: number){
            return this.concat(new Matrix4(null).setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ));
        }
        /**
         * 将顶点投影到平面的矩阵从右侧相乘。
         * @param plane 平面方程"Ax+By+Cz+D=0"的系数数组
         * @param light 存储灯光坐标的数组。如果light[3]=0，则视为平行光。 
         */
        dropShadow(plane:number[], light:number[]){
            var mat = new Matrix4(null);
            var e = mat.elements;
          
            var dot = plane[0] * light[0] + plane[1] * light[1] + plane[2] * light[2] + plane[3] * light[3];
          
            e[ 0] = dot - light[0] * plane[0];
            e[ 1] =     - light[1] * plane[0];
            e[ 2] =     - light[2] * plane[0];
            e[ 3] =     - light[3] * plane[0];
          
            e[ 4] =     - light[0] * plane[1];
            e[ 5] = dot - light[1] * plane[1];
            e[ 6] =     - light[2] * plane[1];
            e[ 7] =     - light[3] * plane[1];
          
            e[ 8] =     - light[0] * plane[2];
            e[ 9] =     - light[1] * plane[2];
            e[10] = dot - light[2] * plane[2];
            e[11] =     - light[3] * plane[2];
          
            e[12] =     - light[0] * plane[3];
            e[13] =     - light[1] * plane[3];
            e[14] =     - light[2] * plane[3];
            e[15] = dot - light[3] * plane[3];
          
            return this.concat(mat);
        }
        dropShadowDirectionally(normX:number, normY:number, normZ:number, planeX:number, planeY:number, planeZ:number, lightX:number, lightY:number, lightZ:number){
            var a = planeX * normX + planeY * normY + planeZ * normZ;
            return this.dropShadow([normX, normY, normZ, -a], [lightX, lightY, lightZ, 0]);
        }
        setTRS(t: Vector3, r: Quat, s: Vector3): this {
          let tx, ty, tz, qx, qy, qz, qw, sx, sy, sz,
              x2, y2, z2, xx, xy, xz, yy, yz, zz, wx, wy, wz, m;
  
          tx = t.x;
          ty = t.y;
          tz = t.z;
  
          qx = r.x;
          qy = r.y;
          qz = r.z;
          qw = r.w;
  
          sx = s.x;
          sy = s.y;
          sz = s.z;
  
          x2 = qx + qx;
          y2 = qy + qy;
          z2 = qz + qz;
          xx = qx * x2;
          xy = qx * y2;
          xz = qx * z2;
          yy = qy * y2;
          yz = qy * z2;
          zz = qz * z2;
          wx = qw * x2;
          wy = qw * y2;
          wz = qw * z2;
  
          m = this.elements;
  
          m[0] = (1 - (yy + zz)) * sx;
          m[1] = (xy + wz) * sx;
          m[2] = (xz - wy) * sx;
          m[3] = 0;
  
          m[4] = (xy - wz) * sy;
          m[5] = (1 - (xx + zz)) * sy;
          m[6] = (yz + wx) * sy;
          m[7] = 0;
  
          m[8] = (xz + wy) * sz;
          m[9] = (yz - wx) * sz;
          m[10] = (1 - (xx + yy)) * sz;
          m[11] = 0;
  
          m[12] = tx;
          m[13] = ty;
          m[14] = tz;
          m[15] = 1;
  
          return this;
      }
      getEulerAngles = (() => {
        let scale = new Vector3();

        return (eulers?: Vector3): Vector3 => {
            let x, y, z, sx, sy, sz, m, halfPi;

            eulers = (eulers === undefined) ? new Vector3() : eulers;

            this.getScale(scale);
            sx = scale.x;
            sy = scale.y;
            sz = scale.z;

            m = this.elements;

            y = Math.asin(-m[2] / sx);
            halfPi = Math.PI * 0.5;

            if (y < halfPi) {
                if (y > -halfPi) {
                    x = Math.atan2(m[6] / sy, m[10] / sz);
                    z = Math.atan2(m[1] / sx, m[0] / sx);
                } else {
                    // Not a unique solution
                    z = 0;
                    x = -Math.atan2(m[4] / sy, m[5] / sy);
                }
            } else {
                // Not a unique solution
                z = 0;
                x = Math.atan2(m[4] / sy, m[5] / sy);
            }

            return eulers.set(x, y, z).scale(RAD_TO_DEG);
        };
    })();
    getScale = (() => {
        let x, y, z;

        x = new Vector3();
        y = new Vector3();
        z = new Vector3();

        return (scale?: Vector3) => {
            scale = (scale === undefined) ? new Vector3() : scale;

            this.getX(x);
            this.getY(y);
            this.getZ(z);
            scale.set(x.length(), y.length(), z.length());

            return scale;
        };
    })();
    getTranslation(t?/* ref */: Vector3): Vector3 {
        t = (t === undefined) ? new Vector3() : t;

        return t.set(this.elements[12], this.elements[13], this.elements[14]);
    }
    getX(x?: Vector3): Vector3 {
        x = (x === undefined) ? new Vector3() : x;

        return x.set(this.elements[0], this.elements[1], this.elements[2]);
    }


    getY(y?/*ref and return*/: Vector3): Vector3 {
        y = (y === undefined) ? new Vector3() : y;

        return y.set(this.elements[4], this.elements[5], this.elements[6]);
    }


    getZ(z?: Vector3): Vector3 {
        z = (z === undefined) ? new Vector3() : z;

        return z.set(this.elements[8], this.elements[9], this.elements[10]);
    }
    }
    /**
     * 三维向量类
     */
    export class Vector3{
        elements:Float32Array = null;
        constructor();
        constructor(x: number, y: number, z: number)
        constructor(x: [number, number, number])
        constructor(x?, y?, z?) {
            if (x && x.length === 3) {
                this.elements = new Float32Array(x);
                return;
            }
    
            this.elements = new Float32Array(3);
    
            this.elements[0] = x || 0;
            this.elements[1] = y || 0;
            this.elements[2] = z || 0;
        }
    
        /**
         * 标准化三维向量
         */
        normalize(){
            var v = this.elements;
            var c = v[0], d = v[1], e = v[2], g = Math.sqrt(c*c+d*d+e*e);
            if(g){
                if(g == 1)
                    return this;
            } else {
                v[0] = 0; v[1] = 0; v[2] = 0;
                return this;
            }
             g = 1/g;
             v[0] = c*g; v[1] = d*g; v[2] = e*g;
             return this;
        }
        /**
         * 得到三维空间法向量,以原点为起点
         */
        getNormal(){

        }
        /**
         * 三维向量乘以一个数
         */
        mutiply(m:number){
          var v = this.elements;
          v[0]*=m;
          v[1]*=m;
          v[2]*=m;
          return this;
        }
        mul2(lhs: Vector3, rhs: Vector3): this {
            let a = lhs.elements,
                b = rhs.elements,
                r = this.elements;
    
            r[0] = a[0] * b[0];
            r[1] = a[1] * b[1];
            r[2] = a[2] * b[2];
    
            return this;
        }
        clone(): Vector3 {
          return new Vector3().copy(this);
        }
        /**
         * 三维向量减去另一个三维向量
         */
        minus(m:Vector3){
          var v = this.elements;
          v[0]-=m.elements[0];
          v[1]-=m.elements[1];
          v[2]-=m.elements[2];
          return this;
        }
        /**
         * 三维向量加上另一个三维向量
         */
        add(m:Vector3){
          var v = this.elements;
          v[0]+=m.elements[0];
          v[1]+=m.elements[1];
          v[2]+=m.elements[2];
          return this;
        }
        copy(x:Vector3){
          var v = this.elements;
          v[0]=x.elements[0];
          v[1]=x.elements[1];
          v[2]=x.elements[2];
          return this;
        }
        set(x,y,z){
          var v = this.elements;
          v[0]=x;
          v[1]=y;
          v[2]=z;
          return this;
        }
        scale(scalar: number): this {
          let v = this.elements;
  
          v[0] *= scalar;
          v[1] *= scalar;
          v[2] *= scalar;
  
          return this;
        }

        get x(): number {
          return this.elements[0];
        }
        set x(value: number) {
          this.elements[0] = value;
        }
    
    
        get y(): number {
            return this.elements[1];
        }
        set y(value: number) {
            this.elements[1] = value;
        }
    
    
        get z(): number {
            return this.elements[2];
        }
        set z(value: number) {
            this.elements[2] = value;
        }
    }
    /**
     * 四维向量类
     */
    export class Vector4{
        elements:Float32Array = null;
        constructor();
        constructor(x: number, y: number, z: number, w:number)
        constructor(x: [number, number, number, number])
        constructor(x?, y?, z?, w?){
            if (x && x.length === 4) {
                this.elements = new Float32Array(x);
                return;
            }
    
            this.elements = new Float32Array(4);
    
            this.elements[0] = x || 0;
            this.elements[1] = y || 0;
            this.elements[2] = z || 0;
            this.elements[3] = w || 0;
        }
        get x(): number {
            return this.elements[0];
        }
        set x(value: number) {
            this.elements[0] = value;
        }
    
    
        get y(): number {
            return this.elements[1];
        }
        set y(value: number) {
            this.elements[1] = value;
        }
    
    
        get z(): number {
            return this.elements[2];
        }
        set z(value: number) {
            this.elements[2] = value;
        }
        get w(): number {
            return this.elements[3];
        }
        set w(value: number) {
            this.elements[3] = value;
        }
    }
    /**
     * 四元数类
     */
    export class Quat{
      x: number;
      y: number;
      z: number;
      w: number;
      constructor(x: number, y: number, z: number, w: number)
      constructor(x: [number, number, number, number])
      constructor()
      constructor(x?, y?, z?, w?) {
          if (x && x.length === 4) {
              this.x = x[0];
              this.y = x[1];
              this.z = x[2];
              this.w = x[3];
          } else {
              this.x = (x === undefined) ? 0 : x;
              this.y = (y === undefined) ? 0 : y;
              this.z = (z === undefined) ? 0 : z;
              this.w = (w === undefined) ? 1 : w;
          }
      }
  
  
  
      clone() {
          return new Quat(this.x, this.y, this.z, this.w);
      }
  
      conjugate() {
          this.x *= -1;
          this.y *= -1;
          this.z *= -1;
  
          return this;
      }
  
  
      copy({ x, y, z, w }: Quat) {
          this.x = x;
          this.y = y;
          this.z = z;
          this.w = w;
  
          return this;
      }
  
  
      equals({ x, y, z, w }: Quat) {
          return (this.x === x) && (this.y === y) && (this.z === z) && (this.w === w);
      }
  
  
      getAxisAngle(axis: Vector3) {
          let rad = Math.acos(this.w) * 2;
          const s = Math.sin(rad / 2);
          if (s !== 0) {
              axis.x = this.x / s;
              axis.y = this.y / s;
              axis.z = this.z / s;
              if (axis.x < 0 || axis.y < 0 || axis.z < 0) {
                  // Flip the sign
                  axis.x *= -1;
                  axis.y *= -1;
                  axis.z *= -1;
                  rad *= -1;
              }
          } else {
              // If s is zero, return any axis (no rotation - axis does not matter)
              axis.x = 1;
              axis.y = 0;
              axis.z = 0;
          }
          return rad * RAD_TO_DEG;
      }
  
  
      getEulerAngles(eulers?/*ref*/: Vector3) {
          let x, y, z, qx, qy, qz, qw, a2;
  
          eulers = (eulers === undefined) ? new Vector3() : eulers;
  
          qx = this.x;
          qy = this.y;
          qz = this.z;
          qw = this.w;
  
          a2 = 2 * (qw * qy - qx * qz);
          if (a2 <= -0.99999) {
              x = 2 * Math.atan2(qx, qw);
              y = -Math.PI / 2;
              z = 0;
          } else if (a2 >= 0.99999) {
              x = 2 * Math.atan2(qx, qw);
              y = Math.PI / 2;
              z = 0;
          } else {
              x = Math.atan2(2 * (qw * qx + qy * qz), 1 - 2 * (qx * qx + qy * qy));
              y = Math.asin(a2);
              z = Math.atan2(2 * (qw * qz + qx * qy), 1 - 2 * (qy * qy + qz * qz));
          }
  
          return eulers.set(x, y, z).scale(RAD_TO_DEG);
      }
  
  
      invert() {
          return this.conjugate().normalize();
      }
  
  
      length() {
          let x, y, z, w;
  
          x = this.x;
          y = this.y;
          z = this.z;
          w = this.w;
  
          return Math.sqrt(x * x + y * y + z * z + w * w);
      }
  
  
      lengthSq() {
          let x, y, z, w;
          return x * x + y * y + z * z + w * w;
      }
  
  
      mul({ x, y, z, w }: Quat) {
          let q1x, q1y, q1z, q1w, q2x, q2y, q2z, q2w;
  
          q1x = this.x;
          q1y = this.y;
          q1z = this.z;
          q1w = this.w;
  
          q2x = x;
          q2y = y;
          q2z = z;
          q2w = w;
  
          this.x = q1w * q2x + q1x * q2w + q1y * q2z - q1z * q2y;
          this.y = q1w * q2y + q1y * q2w + q1z * q2x - q1x * q2z;
          this.z = q1w * q2z + q1z * q2w + q1x * q2y - q1y * q2x;
          this.w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
  
          return this;
      }
  
  
      mul2(lhs: Quat, rhs: Quat): Quat {
          let q1x, q1y, q1z, q1w, q2x, q2y, q2z, q2w;
  
          q1x = lhs.x;
          q1y = lhs.y;
          q1z = lhs.z;
          q1w = lhs.w;
  
          q2x = rhs.x;
          q2y = rhs.y;
          q2z = rhs.z;
          q2w = rhs.w;
  
          this.x = q1w * q2x + q1x * q2w + q1y * q2z - q1z * q2y;
          this.y = q1w * q2y + q1y * q2w + q1z * q2x - q1x * q2z;
          this.z = q1w * q2z + q1z * q2w + q1x * q2y - q1y * q2x;
          this.w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
  
          return this;
      }
  
  
      normalize() {
          let len = this.length();
          if (len === 0) {
              this.x = this.y = this.z = 0;
              this.w = 1;
          } else {
              len = 1 / len;
              this.x *= len;
              this.y *= len;
              this.z *= len;
              this.w *= len;
          }
  
          return this;
      }
  
  
      set(x: number, y: number, z: number, w: number) {
          this.x = x;
          this.y = y;
          this.z = z;
          this.w = w;
  
          return this;
      }
  
  
      setFromAxisAngle({ x, y, z }: Vector3, angle: number) {
          let sa, ca;
  
          angle *= 0.5 * DEG_TO_RAD;
  
          sa = Math.sin(angle);
          ca = Math.cos(angle);
  
          this.x = sa * x;
          this.y = sa * y;
          this.z = sa * z;
          this.w = ca;
  
          return this;
      }
  
  
      setFromEulerAngles(ex: number, ey: number, ez: number) {
          let sx, cx, sy, cy, sz, cz, halfToRad;
  
          halfToRad = 0.5 * DEG_TO_RAD;
          ex *= halfToRad;
          ey *= halfToRad;
          ez *= halfToRad;
  
          sx = Math.sin(ex);
          cx = Math.cos(ex);
          sy = Math.sin(ey);
          cy = Math.cos(ey);
          sz = Math.sin(ez);
          cz = Math.cos(ez);
  
          this.x = sx * cy * cz - cx * sy * sz;
          this.y = cx * sy * cz + sx * cy * sz;
          this.z = cx * cy * sz - sx * sy * cz;
          this.w = cx * cy * cz + sx * sy * sz;
  
          return this;
      }
  
  
      setFromMat4(mat: Matrix4) {
          let m00, m01, m02, m10, m11, m12, m20, m21, m22, tr, s, rs, lx, ly, lz;
  
          let m = mat.elements;
  
          // Cache matrix values for super-speed
          m00 = m[0];
          m01 = m[1];
          m02 = m[2];
          m10 = m[4];
          m11 = m[5];
          m12 = m[6];
          m20 = m[8];
          m21 = m[9];
          m22 = m[10];
  
          // Remove the scale from the matrix
          lx = 1 / Math.sqrt(m00 * m00 + m01 * m01 + m02 * m02);
          ly = 1 / Math.sqrt(m10 * m10 + m11 * m11 + m12 * m12);
          lz = 1 / Math.sqrt(m20 * m20 + m21 * m21 + m22 * m22);
  
          m00 *= lx;
          m01 *= lx;
          m02 *= lx;
          m10 *= ly;
          m11 *= ly;
          m12 *= ly;
          m20 *= lz;
          m21 *= lz;
          m22 *= lz;
  
          // http://www.cs.ucr.edu/~vbz/resources/quatut.pdf
  
          tr = m00 + m11 + m22;
          if (tr >= 0) {
              s = Math.sqrt(tr + 1);
              this.w = s * 0.5;
              s = 0.5 / s;
              this.x = (m12 - m21) * s;
              this.y = (m20 - m02) * s;
              this.z = (m01 - m10) * s;
          } else {
              if (m00 > m11) {
                  if (m00 > m22) {
                      // XDiagDomMatrix
                      rs = (m00 - (m11 + m22)) + 1;
                      rs = Math.sqrt(rs);
  
                      this.x = rs * 0.5;
                      rs = 0.5 / rs;
                      this.w = (m12 - m21) * rs;
                      this.y = (m01 + m10) * rs;
                      this.z = (m02 + m20) * rs;
                  } else {
                      // ZDiagDomMatrix
                      rs = (m22 - (m00 + m11)) + 1;
                      rs = Math.sqrt(rs);
  
                      this.z = rs * 0.5;
                      rs = 0.5 / rs;
                      this.w = (m01 - m10) * rs;
                      this.x = (m20 + m02) * rs;
                      this.y = (m21 + m12) * rs;
                  }
              } else if (m11 > m22) {
                  // YDiagDomMatrix
                  rs = (m11 - (m22 + m00)) + 1;
                  rs = Math.sqrt(rs);
  
                  this.y = rs * 0.5;
                  rs = 0.5 / rs;
                  this.w = (m20 - m02) * rs;
                  this.z = (m12 + m21) * rs;
                  this.x = (m10 + m01) * rs;
              } else {
                  // ZDiagDomMatrix
                  rs = (m22 - (m00 + m11)) + 1;
                  rs = Math.sqrt(rs);
  
                  this.z = rs * 0.5;
                  rs = 0.5 / rs;
                  this.w = (m01 - m10) * rs;
                  this.x = (m20 + m02) * rs;
                  this.y = (m21 + m12) * rs;
              }
          }
  
          return this;
      }
  
  
      slerp(lhs: Quat, rhs: Quat, alpha: number): this {
          let lx, ly, lz, lw, rx, ry, rz, rw;
          lx = lhs.x;
          ly = lhs.y;
          lz = lhs.z;
          lw = lhs.w;
          rx = rhs.x;
          ry = rhs.y;
          rz = rhs.z;
          rw = rhs.w;
  
          // Calculate angle between them.
          let cosHalfTheta = lw * rw + lx * rx + ly * ry + lz * rz;
  
          if (cosHalfTheta < 0) {
              rw = -rw;
              rx = -rx;
              ry = -ry;
              rz = -rz;
              cosHalfTheta = -cosHalfTheta;
          }
  
          // If lhs == rhs or lhs == -rhs then theta == 0 and we can return lhs
          if (Math.abs(cosHalfTheta) >= 1) {
              this.w = lw;
              this.x = lx;
              this.y = ly;
              this.z = lz;
              return this;
          }
  
          // Calculate temporary values.
          let halfTheta = Math.acos(cosHalfTheta);
          let sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);
  
          // If theta = 180 degrees then result is not fully defined
          // we could rotate around any axis normal to qa or qb
          if (Math.abs(sinHalfTheta) < 0.001) {
              this.w = (lw * 0.5 + rw * 0.5);
              this.x = (lx * 0.5 + rx * 0.5);
              this.y = (ly * 0.5 + ry * 0.5);
              this.z = (lz * 0.5 + rz * 0.5);
              return this;
          }
  
          let ratioA = Math.sin((1 - alpha) * halfTheta) / sinHalfTheta;
          let ratioB = Math.sin(alpha * halfTheta) / sinHalfTheta;
  
          // Calculate Quaternion.
          this.w = (lw * ratioA + rw * ratioB);
          this.x = (lx * ratioA + rx * ratioB);
          this.y = (ly * ratioA + ry * ratioB);
          this.z = (lz * ratioA + rz * ratioB);
          return this;
      }
  
  
      transformVector(vec: Vector3, res?: Vector3) {
          if (res === undefined) {
              res = new Vector3();
          }
  
          const x = vec.x, y = vec.y, z = vec.z;
          const qx = this.x, qy = this.y, qz = this.z, qw = this.w;
  
          // calculate quat * vec
          const ix = qw * x + qy * z - qz * y;
          const iy = qw * y + qz * x - qx * z;
          const iz = qw * z + qx * y - qy * x;
          const iw = -qx * x - qy * y - qz * z;
  
          // calculate result * inverse quat
          res.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
          res.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
          res.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  
          return res;
      }
      static readonly TEMP = new Quat();
  
      static readonly IDENTITY: Quat = new Quat();
  
  
      static readonly ZERO: Quat = new Quat(0, 0, 0, 0);
    }
}
