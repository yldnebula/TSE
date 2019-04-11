namespace Utils{
    /**
     * 四方矩阵类
     */
    export class Matrix4{
        elements:Float32Array= null;
        constructor(opt_src:Matrix4 | null){
            var i:number, s:Float32Array, d:Float32Array;
            if (opt_src && opt_src.hasOwnProperty('elements')) {
                s = opt_src.elements;
                d = new Float32Array(16);
                for (i = 0; i < 16; ++i) {
                  d[i] = s[i];
                }
                this.elements = d;
              } else {
                this.elements = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
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

    }
    /**
     * 三维向量类
     */
    export class Vector3{
        elements:Float32Array = null;
        constructor(opt_src:Float32Array|number[]|Vector3 | null){
            var v = new Float32Array(3);
            if (opt_src) {
              v[0] = opt_src[0]; v[1] = opt_src[1]; v[2] = opt_src[2];
            }
            this.elements = v;
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
    }
    /**
     * 四维向量类
     */
    export class Vector4{
        elements:Float32Array = null;
        constructor(opt_src:Float32Array|number[]|Vector4 | null){
            var v = new Float32Array(4);
            if (opt_src) {
                v[0] = opt_src[0]; v[1] = opt_src[1]; v[2] = opt_src[2]; v[3] = opt_src[3];
            }
            this.elements = v;
        }
    }
}
// ------------------------------------------------------------------------------------------------
//四元数相关
// ------------------------------------------------------------------------------------------------

function matIV(){
	this.create = function(){
		return new Float32Array(16);
	};
	this.identity = function(){
    var dest = new Float32Array(16);
		dest[0]  = 1; dest[1]  = 0; dest[2]  = 0; dest[3]  = 0;
		dest[4]  = 0; dest[5]  = 1; dest[6]  = 0; dest[7]  = 0;
		dest[8]  = 0; dest[9]  = 0; dest[10] = 1; dest[11] = 0;
		dest[12] = 0; dest[13] = 0; dest[14] = 0; dest[15] = 1;
		return dest;
	};
	this.multiply = function(mat1, mat2){
    var dest = new Float32Array(16);
		var a = mat1[0],  b = mat1[1],  c = mat1[2],  d = mat1[3],
			e = mat1[4],  f = mat1[5],  g = mat1[6],  h = mat1[7],
			i = mat1[8],  j = mat1[9],  k = mat1[10], l = mat1[11],
			m = mat1[12], n = mat1[13], o = mat1[14], p = mat1[15],
			A = mat2[0],  B = mat2[1],  C = mat2[2],  D = mat2[3],
			E = mat2[4],  F = mat2[5],  G = mat2[6],  H = mat2[7],
			I = mat2[8],  J = mat2[9],  K = mat2[10], L = mat2[11],
			M = mat2[12], N = mat2[13], O = mat2[14], P = mat2[15];
		dest[0] = A * a + B * e + C * i + D * m;
		dest[1] = A * b + B * f + C * j + D * n;
		dest[2] = A * c + B * g + C * k + D * o;
		dest[3] = A * d + B * h + C * l + D * p;
		dest[4] = E * a + F * e + G * i + H * m;
		dest[5] = E * b + F * f + G * j + H * n;
		dest[6] = E * c + F * g + G * k + H * o;
		dest[7] = E * d + F * h + G * l + H * p;
		dest[8] = I * a + J * e + K * i + L * m;
		dest[9] = I * b + J * f + K * j + L * n;
		dest[10] = I * c + J * g + K * k + L * o;
		dest[11] = I * d + J * h + K * l + L * p;
		dest[12] = M * a + N * e + O * i + P * m;
		dest[13] = M * b + N * f + O * j + P * n;
		dest[14] = M * c + N * g + O * k + P * o;
		dest[15] = M * d + N * h + O * l + P * p;
		return dest;
	};
	this.scale = function(mat, vec){
    var dest = new Float32Array(16);
		dest[0]  = mat[0]  * vec[0];
		dest[1]  = mat[1]  * vec[0];
		dest[2]  = mat[2]  * vec[0];
		dest[3]  = mat[3]  * vec[0];
		dest[4]  = mat[4]  * vec[1];
		dest[5]  = mat[5]  * vec[1];
		dest[6]  = mat[6]  * vec[1];
		dest[7]  = mat[7]  * vec[1];
		dest[8]  = mat[8]  * vec[2];
		dest[9]  = mat[9]  * vec[2];
		dest[10] = mat[10] * vec[2];
		dest[11] = mat[11] * vec[2];
		dest[12] = mat[12];
		dest[13] = mat[13];
		dest[14] = mat[14];
		dest[15] = mat[15];
		return dest;
	};
	this.translate = function(mat, vec){
    var dest = new Float32Array(16);

		dest[0] = mat[0]; dest[1] = mat[1]; dest[2]  = mat[2];  dest[3]  = mat[3];
		dest[4] = mat[4]; dest[5] = mat[5]; dest[6]  = mat[6];  dest[7]  = mat[7];
		dest[8] = mat[8]; dest[9] = mat[9]; dest[10] = mat[10]; dest[11] = mat[11];
		dest[12] = mat[0] * vec[0] + mat[4] * vec[1] + mat[8]  * vec[2] + mat[12];
		dest[13] = mat[1] * vec[0] + mat[5] * vec[1] + mat[9]  * vec[2] + mat[13];
		dest[14] = mat[2] * vec[0] + mat[6] * vec[1] + mat[10] * vec[2] + mat[14];
		dest[15] = mat[3] * vec[0] + mat[7] * vec[1] + mat[11] * vec[2] + mat[15];
		return dest;
	};
	this.rotate = function(mat, angle, axis){
    var dest = new Float32Array(16);

		var sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
		if(!sq){return null;}
		var a = axis[0], b = axis[1], c = axis[2];
		if(sq != 1){sq = 1 / sq; a *= sq; b *= sq; c *= sq;}
		var d = Math.sin(angle), e = Math.cos(angle), f = 1 - e,
			g = mat[0],  h = mat[1], i = mat[2],  j = mat[3],
			k = mat[4],  l = mat[5], m = mat[6],  n = mat[7],
			o = mat[8],  p = mat[9], q = mat[10], r = mat[11],
			s = a * a * f + e,
			t = b * a * f + c * d,
			u = c * a * f - b * d,
			v = a * b * f - c * d,
			w = b * b * f + e,
			x = c * b * f + a * d,
			y = a * c * f + b * d,
			z = b * c * f - a * d,
			A = c * c * f + e;
		if(angle){
			if(mat != dest){
				dest[12] = mat[12]; dest[13] = mat[13];
				dest[14] = mat[14]; dest[15] = mat[15];
			}
		} else {
			dest = mat;
		}
		dest[0]  = g * s + k * t + o * u;
		dest[1]  = h * s + l * t + p * u;
		dest[2]  = i * s + m * t + q * u;
		dest[3]  = j * s + n * t + r * u;
		dest[4]  = g * v + k * w + o * x;
		dest[5]  = h * v + l * w + p * x;
		dest[6]  = i * v + m * w + q * x;
		dest[7]  = j * v + n * w + r * x;
		dest[8]  = g * y + k * z + o * A;
		dest[9]  = h * y + l * z + p * A;
		dest[10] = i * y + m * z + q * A;
		dest[11] = j * y + n * z + r * A;
		return dest;
	};
	this.lookAt = function(eye, center, up){
    var dest = new Float32Array(16);
		var eyeX    = eye[0],    eyeY    = eye[1],    eyeZ    = eye[2],
			upX     = up[0],     upY     = up[1],     upZ     = up[2],
			centerX = center[0], centerY = center[1], centerZ = center[2];
		if(eyeX == centerX && eyeY == centerY && eyeZ == centerZ){return this.identity(dest);}
		var x0, x1, x2, y0, y1, y2, z0, z1, z2, l;
		z0 = eyeX - center[0]; z1 = eyeY - center[1]; z2 = eyeZ - center[2];
		l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
		z0 *= l; z1 *= l; z2 *= l;
		x0 = upY * z2 - upZ * z1;
		x1 = upZ * z0 - upX * z2;
		x2 = upX * z1 - upY * z0;
		l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
		if(!l){
			x0 = 0; x1 = 0; x2 = 0;
		} else {
			l = 1 / l;
			x0 *= l; x1 *= l; x2 *= l;
		}
		y0 = z1 * x2 - z2 * x1; y1 = z2 * x0 - z0 * x2; y2 = z0 * x1 - z1 * x0;
		l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
		if(!l){
			y0 = 0; y1 = 0; y2 = 0;
		} else {
			l = 1 / l;
			y0 *= l; y1 *= l; y2 *= l;
		}
		dest[0] = x0; dest[1] = y0; dest[2]  = z0; dest[3]  = 0;
		dest[4] = x1; dest[5] = y1; dest[6]  = z1; dest[7]  = 0;
		dest[8] = x2; dest[9] = y2; dest[10] = z2; dest[11] = 0;
		dest[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
		dest[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
		dest[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
		dest[15] = 1;
		return dest;
	};
	this.perspective = function(fovy, aspect, near, far){
    var dest = new Float32Array(16);

		var t = near * Math.tan(fovy * Math.PI / 360);
		var r = t * aspect;
		var a = r * 2, b = t * 2, c = far - near;
		dest[0]  = near * 2 / a;
		dest[1]  = 0;
		dest[2]  = 0;
		dest[3]  = 0;
		dest[4]  = 0;
		dest[5]  = near * 2 / b;
		dest[6]  = 0;
		dest[7]  = 0;
		dest[8]  = 0;
		dest[9]  = 0;
		dest[10] = -(far + near) / c;
		dest[11] = -1;
		dest[12] = 0;
		dest[13] = 0;
		dest[14] = -(far * near * 2) / c;
		dest[15] = 0;
		return dest;
	};
	this.ortho = function(left, right, top, bottom, near, far) {
    var dest = new Float32Array(16);

		var h = (right - left);
		var v = (top - bottom);
		var d = (far - near);
		dest[0]  = 2 / h;
		dest[1]  = 0;
		dest[2]  = 0;
		dest[3]  = 0;
		dest[4]  = 0;
		dest[5]  = 2 / v;
		dest[6]  = 0;
		dest[7]  = 0;
		dest[8]  = 0;
		dest[9]  = 0;
		dest[10] = -2 / d;
		dest[11] = 0;
		dest[12] = -(left + right) / h;
		dest[13] = -(top + bottom) / v;
		dest[14] = -(far + near) / d;
		dest[15] = 1;
		return dest;
	};
	this.transpose = function(mat){
    var dest = new Float32Array(16);

		dest[0]  = mat[0];  dest[1]  = mat[4];
		dest[2]  = mat[8];  dest[3]  = mat[12];
		dest[4]  = mat[1];  dest[5]  = mat[5];
		dest[6]  = mat[9];  dest[7]  = mat[13];
		dest[8]  = mat[2];  dest[9]  = mat[6];
		dest[10] = mat[10]; dest[11] = mat[14];
		dest[12] = mat[3];  dest[13] = mat[7];
		dest[14] = mat[11]; dest[15] = mat[15];
		return dest;
	};
	this.inverse = function(mat){
    var dest = new Float32Array(16);

		var a = mat[0],  b = mat[1],  c = mat[2],  d = mat[3],
			e = mat[4],  f = mat[5],  g = mat[6],  h = mat[7],
			i = mat[8],  j = mat[9],  k = mat[10], l = mat[11],
			m = mat[12], n = mat[13], o = mat[14], p = mat[15],
			q = a * f - b * e, r = a * g - c * e,
			s = a * h - d * e, t = b * g - c * f,
			u = b * h - d * f, v = c * h - d * g,
			w = i * n - j * m, x = i * o - k * m,
			y = i * p - l * m, z = j * o - k * n,
			A = j * p - l * n, B = k * p - l * o,
			ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
		dest[0]  = ( f * B - g * A + h * z) * ivd;
		dest[1]  = (-b * B + c * A - d * z) * ivd;
		dest[2]  = ( n * v - o * u + p * t) * ivd;
		dest[3]  = (-j * v + k * u - l * t) * ivd;
		dest[4]  = (-e * B + g * y - h * x) * ivd;
		dest[5]  = ( a * B - c * y + d * x) * ivd;
		dest[6]  = (-m * v + o * s - p * r) * ivd;
		dest[7]  = ( i * v - k * s + l * r) * ivd;
		dest[8]  = ( e * A - f * y + h * w) * ivd;
		dest[9]  = (-a * A + b * y - d * w) * ivd;
		dest[10] = ( m * u - n * s + p * q) * ivd;
		dest[11] = (-i * u + j * s - l * q) * ivd;
		dest[12] = (-e * z + f * x - g * w) * ivd;
		dest[13] = ( a * z - b * x + c * w) * ivd;
		dest[14] = (-m * t + n * r - o * q) * ivd;
		dest[15] = ( i * t - j * r + k * q) * ivd;
		return dest;
	};
}

function qtnIV(){
	this.create = function(){
		return new Float32Array(4);
	};
	this.identity = function(dest){
		dest[0] = 0; dest[1] = 0; dest[2] = 0; dest[3] = 1;
		return dest;
	};
	this.inverse = function(qtn, dest){
		dest[0] = -qtn[0];
		dest[1] = -qtn[1];
		dest[2] = -qtn[2];
		dest[3] =  qtn[3];
		return dest;
	};
	this.normalize = function(dest){
		var x = dest[0], y = dest[1], z = dest[2], w = dest[3];
		var l = Math.sqrt(x * x + y * y + z * z + w * w);
		if(l === 0){
			dest[0] = 0;
			dest[1] = 0;
			dest[2] = 0;
			dest[3] = 0;
		}else{
			l = 1 / l;
			dest[0] = x * l;
			dest[1] = y * l;
			dest[2] = z * l;
			dest[3] = w * l;
		}
		return dest;
	};
	this.multiply = function(qtn1, qtn2){
    var dest = new Float32Array(16);

		var ax = qtn1[0], ay = qtn1[1], az = qtn1[2], aw = qtn1[3];
		var bx = qtn2[0], by = qtn2[1], bz = qtn2[2], bw = qtn2[3];
		dest[0] = ax * bw + aw * bx + ay * bz - az * by;
		dest[1] = ay * bw + aw * by + az * bx - ax * bz;
		dest[2] = az * bw + aw * bz + ax * by - ay * bx;
		dest[3] = aw * bw - ax * bx - ay * by - az * bz;
		return dest;
	};
	this.rotate = function(angle, axis){
    var dest = new Float32Array(16);

		var sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
		if(!sq){return null;}
		var a = axis[0], b = axis[1], c = axis[2];
		if(sq != 1){sq = 1 / sq; a *= sq; b *= sq; c *= sq;}
		var s = Math.sin(angle * 0.5);
		dest[0] = a * s;
		dest[1] = b * s;
		dest[2] = c * s;
		dest[3] = Math.cos(angle * 0.5);
		return dest;
	};
	this.toVecIII = function(vec, qtn){
    var dest = new Float32Array(16);

		var qp = this.create();
		var qq = this.create();
		var qr = this.create();
		this.inverse(qtn, qr);
		qp[0] = vec[0];
		qp[1] = vec[1];
		qp[2] = vec[2];
		this.multiply(qr, qp, qq);
		this.multiply(qq, qtn, qr);
		dest[0] = qr[0];
		dest[1] = qr[1];
		dest[2] = qr[2];
		return dest;
	};
	this.toMatIV = function(qtn){
    var dest = new Float32Array(16);

		var x = qtn[0], y = qtn[1], z = qtn[2], w = qtn[3];
		var x2 = x + x, y2 = y + y, z2 = z + z;
		var xx = x * x2, xy = x * y2, xz = x * z2;
		var yy = y * y2, yz = y * z2, zz = z * z2;
		var wx = w * x2, wy = w * y2, wz = w * z2;
		dest[0]  = 1 - (yy + zz);
		dest[1]  = xy - wz;
		dest[2]  = xz + wy;
		dest[3]  = 0;
		dest[4]  = xy + wz;
		dest[5]  = 1 - (xx + zz);
		dest[6]  = yz - wx;
		dest[7]  = 0;
		dest[8]  = xz - wy;
		dest[9]  = yz + wx;
		dest[10] = 1 - (xx + yy);
		dest[11] = 0;
		dest[12] = 0;
		dest[13] = 0;
		dest[14] = 0;
		dest[15] = 1;
		return dest;
	};
	this.slerp = function(qtn1, qtn2, time){
    var dest = new Float32Array(16);

		var ht = qtn1[0] * qtn2[0] + qtn1[1] * qtn2[1] + qtn1[2] * qtn2[2] + qtn1[3] * qtn2[3];
		var hs = 1.0 - ht * ht;
		if(hs <= 0.0){
			dest[0] = qtn1[0];
			dest[1] = qtn1[1];
			dest[2] = qtn1[2];
			dest[3] = qtn1[3];
		}else{
			hs = Math.sqrt(hs);
			if(Math.abs(hs) < 0.0001){
				dest[0] = (qtn1[0] * 0.5 + qtn2[0] * 0.5);
				dest[1] = (qtn1[1] * 0.5 + qtn2[1] * 0.5);
				dest[2] = (qtn1[2] * 0.5 + qtn2[2] * 0.5);
				dest[3] = (qtn1[3] * 0.5 + qtn2[3] * 0.5);
			}else{
				var ph = Math.acos(ht);
				var pt = ph * time;
				var t0 = Math.sin(ph - pt) / hs;
				var t1 = Math.sin(pt) / hs;
				dest[0] = qtn1[0] * t0 + qtn2[0] * t1;
				dest[1] = qtn1[1] * t0 + qtn2[1] * t1;
				dest[2] = qtn1[2] * t0 + qtn2[2] * t1;
				dest[3] = qtn1[3] * t0 + qtn2[3] * t1;
			}
		}
		return dest;
	};
}