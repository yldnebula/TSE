var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Utils;
(function (Utils) {
    /**
     * 四方矩阵类
     */
    var Matrix4 = /** @class */ (function () {
        function Matrix4(opt_src) {
            this.elements = null;
            var i, s, d;
            if (opt_src && opt_src.hasOwnProperty('elements')) {
                s = opt_src.elements;
                d = new Float32Array(16);
                for (i = 0; i < 16; ++i) {
                    d[i] = s[i];
                }
                this.elements = d;
            }
            else {
                this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
            }
        }
        /**
         * 设置单位矩阵
         */
        Matrix4.prototype.setIdentity = function () {
            var e = this.elements;
            e[0] = 1;
            e[4] = 0;
            e[8] = 0;
            e[12] = 0;
            e[1] = 0;
            e[5] = 1;
            e[9] = 0;
            e[13] = 0;
            e[2] = 0;
            e[6] = 0;
            e[10] = 1;
            e[14] = 0;
            e[3] = 0;
            e[7] = 0;
            e[11] = 0;
            e[15] = 1;
            return this;
        };
        /**
         * 通过一个四方矩阵设置一个新矩阵
         * @param src 源四方矩阵
         */
        Matrix4.prototype.set = function (src) {
            var i, s, d;
            s = src.elements;
            d = this.elements;
            if (s === d) {
                return;
            }
            for (i = 0; i < 16; ++i) {
                d[i] = s[i];
            }
            return this;
        };
        /**
         * 右乘一个四方矩阵
         * @param other 需要右乘的四方矩阵
         */
        Matrix4.prototype.concat = function (other) {
            var i, e, a, b, ai0, ai1, ai2, ai3;
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
                ai0 = a[i];
                ai1 = a[i + 4];
                ai2 = a[i + 8];
                ai3 = a[i + 12];
                e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
                e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
                e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
                e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
            }
            return this;
        };
        /**
         * 右乘一个四方矩阵
         * @param other 需要右乘的四方矩阵
         */
        Matrix4.prototype.multiply = function (other) {
            this.concat(other);
            return this;
        };
        /**
         * 右乘一个三维矩阵，返回三维向量
         * @param pos 右乘的三维矩阵
         */
        Matrix4.prototype.mutiplyVector3 = function (pos) {
            var e = this.elements;
            var p = pos.elements;
            var v = new Vector3(null);
            var result = v.elements;
            result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + e[11];
            result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + e[12];
            result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + e[13];
            return v;
        };
        /**
         * 右乘一个四维向量，返回四维向量
         * @param pos 右乘的四维向量
         */
        Matrix4.prototype.multiplyVector4 = function (pos) {
            var e = this.elements;
            var p = pos.elements;
            var v = new Vector4(null);
            var result = v.elements;
            result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + p[3] * e[12];
            result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + p[3] * e[13];
            result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + p[3] * e[14];
            result[3] = p[0] * e[3] + p[1] * e[7] + p[2] * e[11] + p[3] * e[15];
            return v;
        };
        /**
         * 转置矩阵本身
         */
        Matrix4.prototype.transpose = function () {
            var e, t;
            e = this.elements;
            t = e[1];
            e[1] = e[4];
            e[4] = t;
            t = e[2];
            e[2] = e[8];
            e[8] = t;
            t = e[3];
            e[3] = e[12];
            e[12] = t;
            t = e[6];
            e[6] = e[9];
            e[9] = t;
            t = e[7];
            e[7] = e[13];
            e[13] = t;
            t = e[11];
            e[11] = e[14];
            e[14] = t;
            return this;
        };
        /**
         * 返回一个源四方矩阵的逆矩阵
         * @param other 源四方矩阵
         */
        Matrix4.prototype.setInverseOf = function (other) {
            var i, s, d, det;
            s = other.elements;
            d = this.elements;
            var inv = new Float32Array(16);
            inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15]
                + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
            inv[4] = -s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15]
                - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
            inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15]
                + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
            inv[12] = -s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14]
                - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];
            inv[1] = -s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15]
                - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
            inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15]
                + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
            inv[9] = -s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15]
                - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
            inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14]
                + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];
            inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15]
                + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
            inv[6] = -s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15]
                - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
            inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15]
                + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
            inv[14] = -s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14]
                - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];
            inv[3] = -s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11]
                - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
            inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11]
                + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
            inv[11] = -s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11]
                - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
            inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10]
                + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];
            det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
            if (det === 0) {
                return this;
            }
            det = 1 / det;
            for (i = 0; i < 16; i++) {
                d[i] = inv[i] * det;
            }
            return this;
        };
        /**
         * 设置正交投影矩阵，定义盒状可视空间，变量范围在[-1.0,1.0]
         * @param left 剪裁面的左边界
         * @param right 剪裁面的右边界
         * @param bottom 剪裁面的下边界
         * @param top 剪裁面的上边界
         * @param near 剪裁面的近边界
         * @param far 剪裁面的远边界
         */
        Matrix4.prototype.setOrtho = function (left, right, bottom, top, near, far) {
            var e, rw, rh, rd;
            if (left === right || bottom === top || near === far) {
                throw 'null frustum';
            }
            rw = 1 / (right - left);
            rh = 1 / (top - bottom);
            rd = 1 / (far - near);
            e = this.elements;
            e[0] = 2 * rw;
            e[1] = 0;
            e[2] = 0;
            e[3] = 0;
            e[4] = 0;
            e[5] = 2 * rh;
            e[6] = 0;
            e[7] = 0;
            e[8] = 0;
            e[9] = 0;
            e[10] = -2 * rd;
            e[11] = 0;
            e[12] = -(right + left) * rw;
            e[13] = -(top + bottom) * rh;
            e[14] = -(far + near) * rd;
            e[15] = 1;
            return this;
        };
        /**
         * 设置透视投影矩阵
         * @param fovy 视锥体上下两侧的角度
         * @param aspect 视锥体的横纵比，使用canvas.width/canvas.height
         * @param near 视点到近剪裁面的距离，为正值
         * @param far 视点到远剪裁面的距离，为正值
         */
        Matrix4.prototype.setPerspective = function (fovy, aspect, near, far) {
            var e, rd, s, ct;
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
            e[0] = ct / aspect;
            e[1] = 0;
            e[2] = 0;
            e[3] = 0;
            e[4] = 0;
            e[5] = ct;
            e[6] = 0;
            e[7] = 0;
            e[8] = 0;
            e[9] = 0;
            e[10] = -(far + near) * rd;
            e[11] = -1;
            e[12] = 0;
            e[13] = 0;
            e[14] = -2 * near * far * rd;
            e[15] = 0;
            return this;
        };
        /**
         * 设置缩放矩阵，一般new一个四方矩阵来存储
         * @param x x方向上的缩放比例
         * @param y y方向上的缩放比例
         * @param z z方向上的缩放比例
         */
        Matrix4.prototype.setScale = function (x, y, z) {
            var e = this.elements;
            e[0] = x;
            e[4] = 0;
            e[8] = 0;
            e[12] = 0;
            e[1] = 0;
            e[5] = y;
            e[9] = 0;
            e[13] = 0;
            e[2] = 0;
            e[6] = 0;
            e[10] = z;
            e[14] = 0;
            e[3] = 0;
            e[7] = 0;
            e[11] = 0;
            e[15] = 1;
            return this;
        };
        Matrix4.prototype.scale = function (x, y, z) {
            var e = this.elements;
            e[0] *= x;
            e[4] *= y;
            e[8] *= z;
            e[1] *= x;
            e[5] *= y;
            e[9] *= z;
            e[2] *= x;
            e[6] *= y;
            e[10] *= z;
            e[3] *= x;
            e[7] *= y;
            e[11] *= z;
            return this;
        };
        /**
         * 设置移动矩阵，一般new一个四方矩阵来存储
         * @param x x方向上的位移
         * @param y y方向上的位移
         * @param z z方向上的位移
         */
        Matrix4.prototype.setTranslate = function (x, y, z) {
            var e = this.elements;
            e[0] = 1;
            e[4] = 0;
            e[8] = 0;
            e[12] = x;
            e[1] = 0;
            e[5] = 1;
            e[9] = 0;
            e[13] = y;
            e[2] = 0;
            e[6] = 0;
            e[10] = 1;
            e[14] = z;
            e[3] = 0;
            e[7] = 0;
            e[11] = 0;
            e[15] = 1;
            return this;
        };
        /**
         * 将当前矩阵右乘一个平移矩阵
         * @param x x方向上的位移
         * @param y y方向上的位移
         * @param z z方向上的位移
         */
        Matrix4.prototype.translate = function (x, y, z) {
            var e = this.elements;
            e[12] += e[0] * x + e[4] * y + e[8] * z;
            e[13] += e[1] * x + e[5] * y + e[9] * z;
            e[14] += e[2] * x + e[6] * y + e[10] * z;
            e[15] += e[3] * x + e[7] * y + e[11] * z;
            return this;
        };
        /**
         * 设置绕轴旋转矩阵
         * @param angle 绕轴旋转角度
         * @param x 为1则表示绕x轴旋转
         * @param y 为1则表示绕y轴旋转
         * @param z 为1则表示绕z轴旋转
         */
        Matrix4.prototype.setRotate = function (angle, x, y, z) {
            var e, s, c, len, rlen, nc, xy, yz, zx, xs, ys, zs;
            angle = Math.PI * angle / 180;
            e = this.elements;
            s = Math.sin(angle);
            c = Math.cos(angle);
            if (0 !== x && 0 === y && 0 === z) {
                // Rotation around X axis
                if (x < 0) {
                    s = -s;
                }
                e[0] = 1;
                e[4] = 0;
                e[8] = 0;
                e[12] = 0;
                e[1] = 0;
                e[5] = c;
                e[9] = -s;
                e[13] = 0;
                e[2] = 0;
                e[6] = s;
                e[10] = c;
                e[14] = 0;
                e[3] = 0;
                e[7] = 0;
                e[11] = 0;
                e[15] = 1;
            }
            else if (0 === x && 0 !== y && 0 === z) {
                // Rotation around Y axis
                if (y < 0) {
                    s = -s;
                }
                e[0] = c;
                e[4] = 0;
                e[8] = s;
                e[12] = 0;
                e[1] = 0;
                e[5] = 1;
                e[9] = 0;
                e[13] = 0;
                e[2] = -s;
                e[6] = 0;
                e[10] = c;
                e[14] = 0;
                e[3] = 0;
                e[7] = 0;
                e[11] = 0;
                e[15] = 1;
            }
            else if (0 === x && 0 === y && 0 !== z) {
                // Rotation around Z axis
                if (z < 0) {
                    s = -s;
                }
                e[0] = c;
                e[4] = -s;
                e[8] = 0;
                e[12] = 0;
                e[1] = s;
                e[5] = c;
                e[9] = 0;
                e[13] = 0;
                e[2] = 0;
                e[6] = 0;
                e[10] = 1;
                e[14] = 0;
                e[3] = 0;
                e[7] = 0;
                e[11] = 0;
                e[15] = 1;
            }
            else {
                // Rotation around another axis
                len = Math.sqrt(x * x + y * y + z * z);
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
                e[0] = x * x * nc + c;
                e[1] = xy * nc + zs;
                e[2] = zx * nc - ys;
                e[3] = 0;
                e[4] = xy * nc - zs;
                e[5] = y * y * nc + c;
                e[6] = yz * nc + xs;
                e[7] = 0;
                e[8] = zx * nc + ys;
                e[9] = yz * nc - xs;
                e[10] = z * z * nc + c;
                e[11] = 0;
                e[12] = 0;
                e[13] = 0;
                e[14] = 0;
                e[15] = 1;
            }
            return this;
        };
        Matrix4.prototype.rotate = function (angle, x, y, z) {
            return this.concat(new Matrix4(null).setRotate(angle, x, y, z));
        };
        ;
        /**
         * 四元数设置旋转矩阵
         * @param axis  轴向
         * @param angle 绕轴旋转角度
         */
        Matrix4.prototype.setRotateFromQuaternion = function (axis, angle, isRadian) {
            var alpha = isRadian ? -angle : -angle * 180 / Math.PI; //修改为右手定则
            axis = axis.normalize();
            var x = Math.sin(alpha / 2) * axis.elements[0];
            var y = Math.sin(alpha / 2) * axis.elements[1];
            var z = Math.sin(alpha / 2) * axis.elements[2];
            var w = Math.cos(alpha / 2);
            var e;
            e = this.elements;
            e[0] = 2 * (x * x + w * w) - 1;
            e[1] = 2 * (x * y - z * w);
            e[2] = 2 * (x * z + y * w);
            e[3] = 0.0;
            e[4] = 2 * (x * y + z * w);
            e[5] = 2 * (y * y + w * w) - 1;
            e[6] = 2 * (y * z - x * w);
            e[7] = 0.0;
            e[8] = 2 * (x * z - y * w);
            e[9] = 2 * (y * z + x * w);
            e[10] = 2 * (z * z + w * w) - 1;
            e[11] = 0.0;
            e[12] = 0;
            e[13] = 0;
            e[14] = 0;
            e[15] = 1.0;
            return this;
        };
        /**
         * 四元数旋转矩阵
         */
        Matrix4.prototype.rotateByQuaternion = function (axis, angle, isRadian) {
            return this.concat(new Matrix4(null).setRotateFromQuaternion(axis, angle, isRadian));
        };
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
        Matrix4.prototype.setLookAt = function (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
            var e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;
            fx = centerX - eyeX;
            fy = centerY - eyeY;
            fz = centerZ - eyeZ;
            // Normalize f.
            rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
            fx *= rlf;
            fy *= rlf;
            fz *= rlf;
            // Calculate cross product of f and up.
            sx = fy * upZ - fz * upY;
            sy = fz * upX - fx * upZ;
            sz = fx * upY - fy * upX;
            // Normalize s.
            rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
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
        };
        Matrix4.prototype.lookAt = function (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
            return this.concat(new Matrix4(null).setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ));
        };
        /**
         * 将顶点投影到平面的矩阵从右侧相乘。
         * @param plane 平面方程"Ax+By+Cz+D=0"的系数数组
         * @param light 存储灯光坐标的数组。如果light[3]=0，则视为平行光。
         */
        Matrix4.prototype.dropShadow = function (plane, light) {
            var mat = new Matrix4(null);
            var e = mat.elements;
            var dot = plane[0] * light[0] + plane[1] * light[1] + plane[2] * light[2] + plane[3] * light[3];
            e[0] = dot - light[0] * plane[0];
            e[1] = -light[1] * plane[0];
            e[2] = -light[2] * plane[0];
            e[3] = -light[3] * plane[0];
            e[4] = -light[0] * plane[1];
            e[5] = dot - light[1] * plane[1];
            e[6] = -light[2] * plane[1];
            e[7] = -light[3] * plane[1];
            e[8] = -light[0] * plane[2];
            e[9] = -light[1] * plane[2];
            e[10] = dot - light[2] * plane[2];
            e[11] = -light[3] * plane[2];
            e[12] = -light[0] * plane[3];
            e[13] = -light[1] * plane[3];
            e[14] = -light[2] * plane[3];
            e[15] = dot - light[3] * plane[3];
            return this.concat(mat);
        };
        Matrix4.prototype.dropShadowDirectionally = function (normX, normY, normZ, planeX, planeY, planeZ, lightX, lightY, lightZ) {
            var a = planeX * normX + planeY * normY + planeZ * normZ;
            return this.dropShadow([normX, normY, normZ, -a], [lightX, lightY, lightZ, 0]);
        };
        return Matrix4;
    }());
    Utils.Matrix4 = Matrix4;
    /**
     * 三维向量类
     */
    var Vector3 = /** @class */ (function () {
        function Vector3(opt_src) {
            this.elements = null;
            var v = new Float32Array(3);
            if (opt_src) {
                v[0] = opt_src[0];
                v[1] = opt_src[1];
                v[2] = opt_src[2];
            }
            this.elements = v;
        }
        /**
         * 标准化三维向量
         */
        Vector3.prototype.normalize = function () {
            var v = this.elements;
            var c = v[0], d = v[1], e = v[2], g = Math.sqrt(c * c + d * d + e * e);
            if (g) {
                if (g == 1)
                    return this;
            }
            else {
                v[0] = 0;
                v[1] = 0;
                v[2] = 0;
                return this;
            }
            g = 1 / g;
            v[0] = c * g;
            v[1] = d * g;
            v[2] = e * g;
            return this;
        };
        /**
         * 得到三维空间法向量,以原点为起点
         */
        Vector3.prototype.getNormal = function () {
        };
        /**
         * 三维向量乘以一个数
         */
        Vector3.prototype.mutiply = function (m) {
            var v = this.elements;
            v[0] *= m;
            v[1] *= m;
            v[2] *= m;
            return this;
        };
        /**
         * 三维向量减去另一个三维向量
         */
        Vector3.prototype.minus = function (m) {
            var v = this.elements;
            v[0] -= m.elements[0];
            v[1] -= m.elements[1];
            v[2] -= m.elements[2];
            return this;
        };
        /**
         * 三维向量加上另一个三维向量
         */
        Vector3.prototype.add = function (m) {
            var v = this.elements;
            v[0] += m.elements[0];
            v[1] += m.elements[1];
            v[2] += m.elements[2];
            return this;
        };
        return Vector3;
    }());
    Utils.Vector3 = Vector3;
    /**
     * 四维向量类
     */
    var Vector4 = /** @class */ (function () {
        function Vector4(opt_src) {
            this.elements = null;
            var v = new Float32Array(4);
            if (opt_src) {
                v[0] = opt_src[0];
                v[1] = opt_src[1];
                v[2] = opt_src[2];
                v[3] = opt_src[3];
            }
            this.elements = v;
        }
        return Vector4;
    }());
    Utils.Vector4 = Vector4;
})(Utils || (Utils = {}));
// ------------------------------------------------------------------------------------------------
//四元数相关
// ------------------------------------------------------------------------------------------------
function matIV() {
    this.create = function () {
        return new Float32Array(16);
    };
    this.identity = function () {
        var dest = new Float32Array(16);
        dest[0] = 1;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = 0;
        dest[4] = 0;
        dest[5] = 1;
        dest[6] = 0;
        dest[7] = 0;
        dest[8] = 0;
        dest[9] = 0;
        dest[10] = 1;
        dest[11] = 0;
        dest[12] = 0;
        dest[13] = 0;
        dest[14] = 0;
        dest[15] = 1;
        return dest;
    };
    this.multiply = function (mat1, mat2) {
        var dest = new Float32Array(16);
        var a = mat1[0], b = mat1[1], c = mat1[2], d = mat1[3], e = mat1[4], f = mat1[5], g = mat1[6], h = mat1[7], i = mat1[8], j = mat1[9], k = mat1[10], l = mat1[11], m = mat1[12], n = mat1[13], o = mat1[14], p = mat1[15], A = mat2[0], B = mat2[1], C = mat2[2], D = mat2[3], E = mat2[4], F = mat2[5], G = mat2[6], H = mat2[7], I = mat2[8], J = mat2[9], K = mat2[10], L = mat2[11], M = mat2[12], N = mat2[13], O = mat2[14], P = mat2[15];
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
    this.scale = function (mat, vec) {
        var dest = new Float32Array(16);
        dest[0] = mat[0] * vec[0];
        dest[1] = mat[1] * vec[0];
        dest[2] = mat[2] * vec[0];
        dest[3] = mat[3] * vec[0];
        dest[4] = mat[4] * vec[1];
        dest[5] = mat[5] * vec[1];
        dest[6] = mat[6] * vec[1];
        dest[7] = mat[7] * vec[1];
        dest[8] = mat[8] * vec[2];
        dest[9] = mat[9] * vec[2];
        dest[10] = mat[10] * vec[2];
        dest[11] = mat[11] * vec[2];
        dest[12] = mat[12];
        dest[13] = mat[13];
        dest[14] = mat[14];
        dest[15] = mat[15];
        return dest;
    };
    this.translate = function (mat, vec) {
        var dest = new Float32Array(16);
        dest[0] = mat[0];
        dest[1] = mat[1];
        dest[2] = mat[2];
        dest[3] = mat[3];
        dest[4] = mat[4];
        dest[5] = mat[5];
        dest[6] = mat[6];
        dest[7] = mat[7];
        dest[8] = mat[8];
        dest[9] = mat[9];
        dest[10] = mat[10];
        dest[11] = mat[11];
        dest[12] = mat[0] * vec[0] + mat[4] * vec[1] + mat[8] * vec[2] + mat[12];
        dest[13] = mat[1] * vec[0] + mat[5] * vec[1] + mat[9] * vec[2] + mat[13];
        dest[14] = mat[2] * vec[0] + mat[6] * vec[1] + mat[10] * vec[2] + mat[14];
        dest[15] = mat[3] * vec[0] + mat[7] * vec[1] + mat[11] * vec[2] + mat[15];
        return dest;
    };
    this.rotate = function (mat, angle, axis) {
        var dest = new Float32Array(16);
        var sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
        if (!sq) {
            return null;
        }
        var a = axis[0], b = axis[1], c = axis[2];
        if (sq != 1) {
            sq = 1 / sq;
            a *= sq;
            b *= sq;
            c *= sq;
        }
        var d = Math.sin(angle), e = Math.cos(angle), f = 1 - e, g = mat[0], h = mat[1], i = mat[2], j = mat[3], k = mat[4], l = mat[5], m = mat[6], n = mat[7], o = mat[8], p = mat[9], q = mat[10], r = mat[11], s = a * a * f + e, t = b * a * f + c * d, u = c * a * f - b * d, v = a * b * f - c * d, w = b * b * f + e, x = c * b * f + a * d, y = a * c * f + b * d, z = b * c * f - a * d, A = c * c * f + e;
        if (angle) {
            if (mat != dest) {
                dest[12] = mat[12];
                dest[13] = mat[13];
                dest[14] = mat[14];
                dest[15] = mat[15];
            }
        }
        else {
            dest = mat;
        }
        dest[0] = g * s + k * t + o * u;
        dest[1] = h * s + l * t + p * u;
        dest[2] = i * s + m * t + q * u;
        dest[3] = j * s + n * t + r * u;
        dest[4] = g * v + k * w + o * x;
        dest[5] = h * v + l * w + p * x;
        dest[6] = i * v + m * w + q * x;
        dest[7] = j * v + n * w + r * x;
        dest[8] = g * y + k * z + o * A;
        dest[9] = h * y + l * z + p * A;
        dest[10] = i * y + m * z + q * A;
        dest[11] = j * y + n * z + r * A;
        return dest;
    };
    this.lookAt = function (eye, center, up) {
        var dest = new Float32Array(16);
        var eyeX = eye[0], eyeY = eye[1], eyeZ = eye[2], upX = up[0], upY = up[1], upZ = up[2], centerX = center[0], centerY = center[1], centerZ = center[2];
        if (eyeX == centerX && eyeY == centerY && eyeZ == centerZ) {
            return this.identity(dest);
        }
        var x0, x1, x2, y0, y1, y2, z0, z1, z2, l;
        z0 = eyeX - center[0];
        z1 = eyeY - center[1];
        z2 = eyeZ - center[2];
        l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= l;
        z1 *= l;
        z2 *= l;
        x0 = upY * z2 - upZ * z1;
        x1 = upZ * z0 - upX * z2;
        x2 = upX * z1 - upY * z0;
        l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!l) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        }
        else {
            l = 1 / l;
            x0 *= l;
            x1 *= l;
            x2 *= l;
        }
        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;
        l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!l) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        }
        else {
            l = 1 / l;
            y0 *= l;
            y1 *= l;
            y2 *= l;
        }
        dest[0] = x0;
        dest[1] = y0;
        dest[2] = z0;
        dest[3] = 0;
        dest[4] = x1;
        dest[5] = y1;
        dest[6] = z1;
        dest[7] = 0;
        dest[8] = x2;
        dest[9] = y2;
        dest[10] = z2;
        dest[11] = 0;
        dest[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
        dest[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
        dest[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
        dest[15] = 1;
        return dest;
    };
    this.perspective = function (fovy, aspect, near, far) {
        var dest = new Float32Array(16);
        var t = near * Math.tan(fovy * Math.PI / 360);
        var r = t * aspect;
        var a = r * 2, b = t * 2, c = far - near;
        dest[0] = near * 2 / a;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = 0;
        dest[4] = 0;
        dest[5] = near * 2 / b;
        dest[6] = 0;
        dest[7] = 0;
        dest[8] = 0;
        dest[9] = 0;
        dest[10] = -(far + near) / c;
        dest[11] = -1;
        dest[12] = 0;
        dest[13] = 0;
        dest[14] = -(far * near * 2) / c;
        dest[15] = 0;
        return dest;
    };
    this.ortho = function (left, right, top, bottom, near, far) {
        var dest = new Float32Array(16);
        var h = (right - left);
        var v = (top - bottom);
        var d = (far - near);
        dest[0] = 2 / h;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = 0;
        dest[4] = 0;
        dest[5] = 2 / v;
        dest[6] = 0;
        dest[7] = 0;
        dest[8] = 0;
        dest[9] = 0;
        dest[10] = -2 / d;
        dest[11] = 0;
        dest[12] = -(left + right) / h;
        dest[13] = -(top + bottom) / v;
        dest[14] = -(far + near) / d;
        dest[15] = 1;
        return dest;
    };
    this.transpose = function (mat) {
        var dest = new Float32Array(16);
        dest[0] = mat[0];
        dest[1] = mat[4];
        dest[2] = mat[8];
        dest[3] = mat[12];
        dest[4] = mat[1];
        dest[5] = mat[5];
        dest[6] = mat[9];
        dest[7] = mat[13];
        dest[8] = mat[2];
        dest[9] = mat[6];
        dest[10] = mat[10];
        dest[11] = mat[14];
        dest[12] = mat[3];
        dest[13] = mat[7];
        dest[14] = mat[11];
        dest[15] = mat[15];
        return dest;
    };
    this.inverse = function (mat) {
        var dest = new Float32Array(16);
        var a = mat[0], b = mat[1], c = mat[2], d = mat[3], e = mat[4], f = mat[5], g = mat[6], h = mat[7], i = mat[8], j = mat[9], k = mat[10], l = mat[11], m = mat[12], n = mat[13], o = mat[14], p = mat[15], q = a * f - b * e, r = a * g - c * e, s = a * h - d * e, t = b * g - c * f, u = b * h - d * f, v = c * h - d * g, w = i * n - j * m, x = i * o - k * m, y = i * p - l * m, z = j * o - k * n, A = j * p - l * n, B = k * p - l * o, ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
        dest[0] = (f * B - g * A + h * z) * ivd;
        dest[1] = (-b * B + c * A - d * z) * ivd;
        dest[2] = (n * v - o * u + p * t) * ivd;
        dest[3] = (-j * v + k * u - l * t) * ivd;
        dest[4] = (-e * B + g * y - h * x) * ivd;
        dest[5] = (a * B - c * y + d * x) * ivd;
        dest[6] = (-m * v + o * s - p * r) * ivd;
        dest[7] = (i * v - k * s + l * r) * ivd;
        dest[8] = (e * A - f * y + h * w) * ivd;
        dest[9] = (-a * A + b * y - d * w) * ivd;
        dest[10] = (m * u - n * s + p * q) * ivd;
        dest[11] = (-i * u + j * s - l * q) * ivd;
        dest[12] = (-e * z + f * x - g * w) * ivd;
        dest[13] = (a * z - b * x + c * w) * ivd;
        dest[14] = (-m * t + n * r - o * q) * ivd;
        dest[15] = (i * t - j * r + k * q) * ivd;
        return dest;
    };
}
function qtnIV() {
    this.create = function () {
        return new Float32Array(4);
    };
    this.identity = function (dest) {
        dest[0] = 0;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = 1;
        return dest;
    };
    this.inverse = function (qtn, dest) {
        dest[0] = -qtn[0];
        dest[1] = -qtn[1];
        dest[2] = -qtn[2];
        dest[3] = qtn[3];
        return dest;
    };
    this.normalize = function (dest) {
        var x = dest[0], y = dest[1], z = dest[2], w = dest[3];
        var l = Math.sqrt(x * x + y * y + z * z + w * w);
        if (l === 0) {
            dest[0] = 0;
            dest[1] = 0;
            dest[2] = 0;
            dest[3] = 0;
        }
        else {
            l = 1 / l;
            dest[0] = x * l;
            dest[1] = y * l;
            dest[2] = z * l;
            dest[3] = w * l;
        }
        return dest;
    };
    this.multiply = function (qtn1, qtn2) {
        var dest = new Float32Array(16);
        var ax = qtn1[0], ay = qtn1[1], az = qtn1[2], aw = qtn1[3];
        var bx = qtn2[0], by = qtn2[1], bz = qtn2[2], bw = qtn2[3];
        dest[0] = ax * bw + aw * bx + ay * bz - az * by;
        dest[1] = ay * bw + aw * by + az * bx - ax * bz;
        dest[2] = az * bw + aw * bz + ax * by - ay * bx;
        dest[3] = aw * bw - ax * bx - ay * by - az * bz;
        return dest;
    };
    this.rotate = function (angle, axis) {
        var dest = new Float32Array(16);
        var sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
        if (!sq) {
            return null;
        }
        var a = axis[0], b = axis[1], c = axis[2];
        if (sq != 1) {
            sq = 1 / sq;
            a *= sq;
            b *= sq;
            c *= sq;
        }
        var s = Math.sin(angle * 0.5);
        dest[0] = a * s;
        dest[1] = b * s;
        dest[2] = c * s;
        dest[3] = Math.cos(angle * 0.5);
        return dest;
    };
    this.toVecIII = function (vec, qtn) {
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
    this.toMatIV = function (qtn) {
        var dest = new Float32Array(16);
        var x = qtn[0], y = qtn[1], z = qtn[2], w = qtn[3];
        var x2 = x + x, y2 = y + y, z2 = z + z;
        var xx = x * x2, xy = x * y2, xz = x * z2;
        var yy = y * y2, yz = y * z2, zz = z * z2;
        var wx = w * x2, wy = w * y2, wz = w * z2;
        dest[0] = 1 - (yy + zz);
        dest[1] = xy - wz;
        dest[2] = xz + wy;
        dest[3] = 0;
        dest[4] = xy + wz;
        dest[5] = 1 - (xx + zz);
        dest[6] = yz - wx;
        dest[7] = 0;
        dest[8] = xz - wy;
        dest[9] = yz + wx;
        dest[10] = 1 - (xx + yy);
        dest[11] = 0;
        dest[12] = 0;
        dest[13] = 0;
        dest[14] = 0;
        dest[15] = 1;
        return dest;
    };
    this.slerp = function (qtn1, qtn2, time) {
        var dest = new Float32Array(16);
        var ht = qtn1[0] * qtn2[0] + qtn1[1] * qtn2[1] + qtn1[2] * qtn2[2] + qtn1[3] * qtn2[3];
        var hs = 1.0 - ht * ht;
        if (hs <= 0.0) {
            dest[0] = qtn1[0];
            dest[1] = qtn1[1];
            dest[2] = qtn1[2];
            dest[3] = qtn1[3];
        }
        else {
            hs = Math.sqrt(hs);
            if (Math.abs(hs) < 0.0001) {
                dest[0] = (qtn1[0] * 0.5 + qtn2[0] * 0.5);
                dest[1] = (qtn1[1] * 0.5 + qtn2[1] * 0.5);
                dest[2] = (qtn1[2] * 0.5 + qtn2[2] * 0.5);
                dest[3] = (qtn1[3] * 0.5 + qtn2[3] * 0.5);
            }
            else {
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
var Utils;
(function (Utils) {
    var GLIFParser = /** @class */ (function () {
        function GLIFParser(scene) {
            this.IWD = 2; //弯单元缺省值,包含弯单元半斤；１表示不包含
            this.Node = null;
            this.Scene = null;
            this.Scene = scene;
        }
        GLIFParser.prototype.readGilfFile = function (fileName, callback) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    if (request.status != 404) {
                        this.onReadFile(request.responseText);
                        if (typeof callback === 'function')
                            callback();
                    }
                }
            }.bind(this);
            request.open('GET', fileName, true); // Create a request to acquire the file
            request.send();
        };
        GLIFParser.prototype.onReadFile = function (fileString) {
            var result = this.parse(fileString); // Parse the file
            if (!result) {
                console.log("GLIF file parsing error.");
                return;
            }
        };
        GLIFParser.prototype.parse = function (fileString) {
            var ret = true;
            // console.log(fileString);
            var line = fileString.split('\n');
            var vaildLine = [];
            for (var _i = 0, line_1 = line; _i < line_1.length; _i++) {
                var l = line_1[_i];
                l = l.trim();
                vaildLine.push(l.split(','));
            }
            this.parseLog("startParse");
            var count = 0;
            var nowLine = vaildLine[count];
            while (!!nowLine[0]) {
                var nowLine = vaildLine[count];
                var tag = nowLine[0];
                // this.parseLog(nowLine);
                switch (tag) {
                    case "-1":
                        this.parseBentUnitInfo(nowLine);
                        count++;
                        break; //是否包含弯管半径
                    case "100":
                        this.parseStartPoint(nowLine);
                        count++;
                        break; //空间起始位置
                    case "10":
                        //从这里开始的要全部读入数组中
                        var nodeInfo = [];
                        var partCount = count;
                        // while(!!vaildLine[partCount]){
                        //     var partTag = vaildLine[partCount][0]
                        //     if(
                        //         partTag == "10" || partTag == "0"||
                        //         partTag == "1" || partTag == "2" ||
                        //         partTag == "3" || partTag == "4" ||
                        //         partTag == "5" || partTag == "6" ||
                        //         partTag == "61" || partTag == "60"){
                        //             nodeInfo.push(vaildLine[partCount++]);
                        //     }else{
                        //         break;
                        //     }
                        // }
                        while (!!vaildLine[partCount][0]) {
                            nodeInfo.push(vaildLine[partCount++]);
                        }
                        this.Node = this.parse3DInfo(nodeInfo);
                        count = partCount;
                        break; //读取管道节点
                    case "60":
                        this.parsePipeInfo(nowLine);
                        count++;
                        break; //管道外径和厚度
                    case "61":
                        this.parsePipeInfo(nowLine);
                        count++;
                        break;
                    default: count++;
                }
            }
            for (var i = 0; i < this.Node.length; i++) {
                this.parseNode(this.Node[i]);
            }
            render.render(ne.getScene());
            render.main();
            return ret;
        };
        /**
         * 解析弯单元信息
         */
        GLIFParser.prototype.parseBentUnitInfo = function (line) {
            this.parseLog("弯单元数据");
            this.parseLog(line);
            if (line.length == 1) { //设置默认值２
                return;
            }
            else {
                this.IWD = parseInt(line[1]);
            }
        };
        /**
         * 解析空间起始位置
         */
        GLIFParser.prototype.parseStartPoint = function (line) {
            var x = parseFloat(line[1]), y = parseFloat(line[2]), z = parseFloat(line[3]);
            this.startPoint = new Utils.Vector3([x, y, z]);
            this.parseLog("起始点");
            this.parseLog(this.startPoint);
        };
        /**
         * 从第一个10开始的所有空间节点数据
         */
        GLIFParser.prototype.parse3DInfo = function (nodeInfo) {
            this.parseLog(nodeInfo);
            var nodes = []; //元素为一个节点数据，并且严格遵守顺序
            var oneNode = [];
            for (var i = 0; i < nodeInfo.length; i++) {
                var nowLine = nodeInfo[i];
                if (!this.isNodeInfo(nowLine)) {
                    //表示一个新的节点或者,一条约束,如10,或者260,70,90
                    if (nowLine[0] == "10") {
                        oneNode.push(nowLine);
                        var innerCount = i + 1;
                        while (innerCount < nodeInfo.length) {
                            if (this.isNodeInfo(nodeInfo[innerCount])) {
                                oneNode.push(nodeInfo[innerCount]);
                                innerCount++;
                            }
                            else {
                                i = innerCount - 1;
                                break;
                            }
                        }
                        nodes.push(oneNode);
                        oneNode = [];
                    }
                    else {
                        nodes.push([nowLine]); //如果非10，算作一个节点信息，无论是不是节点附加属性
                    }
                }
            }
            this.parseLog("格式化节点数据");
            this.parseLog(nodes);
            return nodes;
        };
        /**
         * 判定当前行是否是节点内的内容，60,61可以出现在节点内
         */
        GLIFParser.prototype.isNodeInfo = function (nowLine) {
            if (nowLine[0] == "0" || nowLine[0] == "1" || nowLine[0] == "2" ||
                nowLine[0] == "3" || nowLine[0] == "4" || nowLine[0] == "5" ||
                nowLine[0] == "6" || nowLine[0] == "61" || nowLine[0] == "60") {
                return true; //是节点外的内容
            }
            else {
                return false; //节点内的内容
            }
        };
        /**
         * 10开头的一段数据,希望参数为整段数据,或者为260,70,90开头的数据
         * 10,7,8,81
                1,1,1,0.000,-0.441,-0.066
                0,1,1,0.457,81.494,1
                1,1,1,0.000,0.000,-2.618
                4,1,1,0.000,0.000,-0.500,477.9,0.000
                1,1,1,0.000,0.000,-0.700
         *　例子
         */
        GLIFParser.prototype.parseNode = function (lines) {
            if (lines[0][0] == "10") {
                // this.parseLog("节点段数据");
                // this.parseLog(lines);
                var pipes = lines;
                var lastNode = parseInt(pipes[0][1]);
                var nextNode = parseInt(pipes[0][2]);
                var restraint = parseInt(pipes[0][3]);
                var GlifNode = new GLIFNode(lastNode, nextNode, restraint);
                console.log(this.startPoint);
                for (var i = 1; i < pipes.length; i++) {
                    var tag = pipes[i][0];
                    switch (tag) {
                        case "0": //处理弯单元
                            GlifNode.UnitPool.push(this.parseBendingUnit(pipes[i], this.Scene));
                            break;
                        case "1": //处理直单元
                            GlifNode.UnitPool.push(this.parseDirectUnit(pipes[i], this.Scene));
                            break;
                        case "2":
                            break;
                        case "3":
                            break;
                        case "4":
                            break;
                        case "5":
                            break;
                        case "6":
                            break;
                        case "60":
                            this.parsePipeInfo(pipes[i]);
                            break;
                        case "61":
                            this.parsePipeInfo(pipes[i]);
                            break;
                        default: console.error("cannot parse '10'tag node");
                    }
                }
                this.parseLog(GlifNode.UnitPool);
            }
            else {
                //260,70,90信息，undo
                this.parseLog(lines);
            }
        };
        /**
         * 60,61开头的一段数据
         */
        GLIFParser.prototype.parsePipeInfo = function (line) {
            // this.parseLog("６０数据");
            // this.parseLog(line);
        };
        /**
         * 处理直单元
         * @param info
         */
        GLIFParser.prototype.parseDirectUnit = function (info, scene) {
            if (!!scene) {
                var pipe = new Pipe(parseFloat(info[3]), parseFloat(info[4]), parseFloat(info[5]), this.startPoint);
                pipe.IS = parseInt(info[1]);
                pipe.IE = parseInt(info[2]);
                this.startPoint = new Utils.Vector3([parseFloat(info[3]), parseFloat(info[4]),
                    parseFloat(info[5])]).add(this.startPoint); //计算新的管道，并且更新新的起始位置
                scene.addChild(pipe);
                // render.render(scene);
                return pipe;
            }
        };
        /**
         * 处理弯单元
         */
        GLIFParser.prototype.parseBendingUnit = function (info, scene) {
            if (!!scene) {
                var elbow = new Elbow();
                elbow.IS = info[1];
                elbow.IE = info[2];
                elbow.RR = info[3];
                elbow.RA = info[4];
                elbow.IA = info[5];
                scene.addChild(elbow);
                // render.render(scene);
                // render.main();
                return elbow;
            }
        };
        /**
         * 自定义输出
         * @param val
         */
        GLIFParser.prototype.parseLog = function (val) {
            //console.log(val)
        };
        return GLIFParser;
    }());
    Utils.GLIFParser = GLIFParser;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var ObjParser = /** @class */ (function () {
        function ObjParser(fileName) {
            this.fileName = null;
            this.mtls = null;
            this.objects = null;
            this.vertices = null;
            this.normals = null;
            this.g_objDoc = null;
            this.g_drawingInfo = null;
            this.fileName = fileName;
            this.mtls = new Array(0); // Initialize the property for MTL
            this.objects = new Array(0); // Initialize the property for Object
            this.vertices = new Array(0); // Initialize the property for Vertex
            this.normals = new Array(0); // Initialize the property for Normal
        }
        ObjParser.prototype.parse = function (fileString, scale, reverse) {
            var lines = fileString.split('\n');
            lines.push(null);
            var index = 0; //行号索引
            var currentObject = null;
            var currentMaterialName = '';
            var line;
            var sp = new StringParser(null);
            while ((line = lines[index++]) != null) {
                sp.init(line.trim()); // init StringParser
                var command = sp.getWord(); // Get command
                if (command == null)
                    continue; // check null command
                switch (command) {
                    case '#':
                        continue; // Skip comments
                    case 'mtllib': // Read Material chunk
                        var path = this.parseMtllib(sp, this.fileName);
                        var mtl = new MTLDoc(); // Create MTL instance
                        this.mtls.push(mtl);
                        var request = new XMLHttpRequest();
                        request.onreadystatechange = function () {
                            if (request.readyState == 4) {
                                if (request.status != 404) {
                                    this.onReadMTLFile(request.responseText, mtl);
                                }
                                else {
                                    mtl.complete = true;
                                }
                            }
                        }.bind(this);
                        request.open('GET', path, true); // Create a request to acquire the file
                        request.send(); // Send the request
                        continue; // Go to the next line
                    case 'o':
                    case 'g': // Read Object name
                        var object = this.parseObjectName(sp);
                        this.objects.push(object);
                        currentObject = object;
                        continue; // Go to the next line
                    case 'v': // Read vertex
                        var vertex = this.parseVertex(sp, scale);
                        this.vertices.push(vertex);
                        continue; // Go to the next line
                    case 'vn': // Read normal
                        var normal = this.parseNormal(sp);
                        this.normals.push(normal);
                        continue; // Go to the next line
                    case 'usemtl': // Read Material name
                        currentMaterialName = this.parseUsemtl(sp);
                        continue; // Go to the next line
                    case 'f': // Read face
                        var face = this.parseFace(sp, currentMaterialName, this.vertices, reverse);
                        currentObject.addFace(face);
                        continue; // Go to the next line
                }
            }
            return true;
        };
        ObjParser.prototype.parseMtllib = function (sp, fileName) {
            // Get directory path
            var i = fileName.lastIndexOf("/");
            var dirPath = "";
            if (i > 0)
                dirPath = fileName.substr(0, i + 1);
            return dirPath + sp.getWord(); // Get path
        };
        /**
         * parseObjectName
         */
        ObjParser.prototype.parseObjectName = function (sp) {
            var name = sp.getWord();
            return (new OBJObject(name));
        };
        /**
         * parseVertex
         */
        ObjParser.prototype.parseVertex = function (sp, scale) {
            var x = sp.getFloat() * scale;
            var y = sp.getFloat() * scale;
            var z = sp.getFloat() * scale;
            return (new Vertex(x, y, z));
        };
        /**
         * parseNormal
         */
        ObjParser.prototype.parseNormal = function (sp) {
            var x = sp.getFloat();
            var y = sp.getFloat();
            var z = sp.getFloat();
            return (new Normal(x, y, z));
        };
        /**
         * parseUsemtl
         */
        ObjParser.prototype.parseUsemtl = function (sp) {
            return sp.getWord();
        };
        /**
         * parseFace
         */
        ObjParser.prototype.parseFace = function (sp, materialName, vertices, reverse) {
            var face = new Face(materialName);
            // get indices
            for (;;) {
                var word = sp.getWord();
                if (word == null)
                    break;
                var subWords = word.split('/');
                if (subWords.length >= 1) {
                    var vi = parseInt(subWords[0]) - 1;
                    face.vIndices.push(vi);
                }
                if (subWords.length >= 3) { //当没有贴图和法线时，nIndices压入-1
                    var ni = parseInt(subWords[2]) - 1;
                    face.nIndices.push(ni);
                }
                else {
                    face.nIndices.push(-1);
                }
            }
            // calc normal
            var v0 = [
                vertices[face.vIndices[0]].x,
                vertices[face.vIndices[0]].y,
                vertices[face.vIndices[0]].z
            ];
            var v1 = [
                vertices[face.vIndices[1]].x,
                vertices[face.vIndices[1]].y,
                vertices[face.vIndices[1]].z
            ];
            var v2 = [
                vertices[face.vIndices[2]].x,
                vertices[face.vIndices[2]].y,
                vertices[face.vIndices[2]].z
            ];
            var normal = calcNormal(v0, v1, v2);
            // 法線が正しく求められたか調べる
            if (normal == null) {
                if (face.vIndices.length >= 4) { // 面が四角形なら別の3点の組み合わせで法線計算
                    var v3 = [
                        vertices[face.vIndices[3]].x,
                        vertices[face.vIndices[3]].y,
                        vertices[face.vIndices[3]].z
                    ];
                    normal = calcNormal(v1, v2, v3);
                }
                if (normal == null) { // 法線が求められなかったのでY軸方向の法線とする
                    normal = new Float32Array([0.0, 1.0, 0.0]);
                }
            }
            if (reverse) {
                normal[0] = -normal[0];
                normal[1] = -normal[1];
                normal[2] = -normal[2];
            }
            face.normal = new Normal(normal[0], normal[1], normal[2]);
            // Devide to triangles if face contains over 3 points.
            if (face.vIndices.length > 3) {
                var n = face.vIndices.length - 2; //需要多少三角形来绘制
                var newVIndices = new Array(n * 3);
                var newNIndices = new Array(n * 3);
                for (var i = 0; i < n; i++) {
                    newVIndices[i * 3 + 0] = face.vIndices[0];
                    newVIndices[i * 3 + 1] = face.vIndices[i + 1];
                    newVIndices[i * 3 + 2] = face.vIndices[i + 2];
                    newNIndices[i * 3 + 0] = face.nIndices[0];
                    newNIndices[i * 3 + 1] = face.nIndices[i + 1];
                    newNIndices[i * 3 + 2] = face.nIndices[i + 2];
                }
                face.vIndices = newVIndices;
                face.nIndices = newNIndices;
            }
            face.numIndices = face.vIndices.length;
            return face;
        };
        /**
         * isMTLComplete
         */
        ObjParser.prototype.isMTLComplete = function () {
            if (this.mtls.length == 0)
                return true;
            for (var i = 0; i < this.mtls.length; i++) {
                if (!this.mtls[i].complete)
                    return false;
            }
            return true;
        };
        /**
         * findColor
         */
        ObjParser.prototype.findColor = function (name) {
            for (var i = 0; i < this.mtls.length; i++) {
                for (var j = 0; j < this.mtls[i].materials.length; j++) {
                    if (this.mtls[i].materials[j].name == name) {
                        return (this.mtls[i].materials[j].color);
                    }
                }
            }
            return (new Color(0.8, 0.8, 0.8, 1));
        };
        /**
         * getDrawingInfo
         */
        ObjParser.prototype.getDrawingInfo = function () {
            // Create an arrays for vertex coordinates, normals, colors, and indices
            var numIndices = 0;
            for (var i = 0; i < this.objects.length; i++) {
                numIndices += this.objects[i].numIndices;
            }
            var numVertices = numIndices;
            var vertices = new Float32Array(numVertices * 3);
            var normals = new Float32Array(numVertices * 3);
            var colors = new Float32Array(numVertices * 4);
            var indices = new Uint16Array(numIndices);
            // Set vertex, normal and color
            var index_indices = 0;
            for (var i = 0; i < this.objects.length; i++) {
                var object = this.objects[i];
                for (var j = 0; j < object.faces.length; j++) {
                    var face = object.faces[j];
                    var color = this.findColor(face.materialName);
                    var faceNormal = face.normal;
                    for (var k = 0; k < face.vIndices.length; k++) {
                        // Set index
                        indices[index_indices] = index_indices;
                        // Copy vertex
                        var vIdx = face.vIndices[k];
                        var vertex = this.vertices[vIdx];
                        vertices[index_indices * 3 + 0] = vertex.x;
                        vertices[index_indices * 3 + 1] = vertex.y;
                        vertices[index_indices * 3 + 2] = vertex.z;
                        // Copy color
                        colors[index_indices * 4 + 0] = color.r;
                        colors[index_indices * 4 + 1] = color.g;
                        colors[index_indices * 4 + 2] = color.b;
                        colors[index_indices * 4 + 3] = color.a;
                        // Copy normal
                        var nIdx = face.nIndices[k];
                        if (nIdx >= 0) {
                            var normal = this.normals[nIdx];
                            normals[index_indices * 3 + 0] = normal.x;
                            normals[index_indices * 3 + 1] = normal.y;
                            normals[index_indices * 3 + 2] = normal.z;
                        }
                        else {
                            normals[index_indices * 3 + 0] = faceNormal.x;
                            normals[index_indices * 3 + 1] = faceNormal.y;
                            normals[index_indices * 3 + 2] = faceNormal.z;
                        }
                        index_indices++;
                    }
                }
            }
            return new DrawingInfo(vertices, normals, colors, indices);
        };
        // Read a file
        ObjParser.prototype.readOBJFile = function (fileName, scale, reverse, callback) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status !== 404) {
                    this.onReadOBJFile(request.responseText, fileName, scale, reverse);
                    if (typeof callback === 'function')
                        callback();
                }
            }.bind(this);
            request.open('GET', fileName, true); // Create a request to acquire the file
            request.send(); // Send the request
        };
        // OBJ File has been read
        ObjParser.prototype.onReadOBJFile = function (fileString, fileName, scale, reverse) {
            var result = this.parse(fileString, scale, reverse); // Parse the file
            if (!result) {
                this.g_objDoc = null;
                this.g_drawingInfo = null;
                console.log("OBJ file parsing error.");
                return;
            }
        };
        ObjParser.prototype.onReadMTLFile = function (fileString, mtl) {
            var lines = fileString.split('\n'); // Break up into lines and store them as array
            lines.push(null); // Append null
            var index = 0; // Initialize index of line
            // Parse line by line
            var line; // A string in the line to be parsed
            var name = ""; // Material name
            var sp = new StringParser(null); // Create StringParser
            while ((line = lines[index++]) != null) {
                sp.init(line); // init StringParser
                var command = sp.getWord(); // Get command
                if (command == null)
                    continue; // check null command
                switch (command) {
                    case '#':
                        continue; // Skip comments
                    case 'newmtl': // Read Material chunk
                        name = mtl.parseNewmtl(sp); // Get name
                        continue; // Go to the next line
                    case 'Kd': // Read normal
                        if (name == "")
                            continue; // Go to the next line because of Error
                        var material = mtl.parseRGB(sp, name);
                        mtl.materials.push(material);
                        name = "";
                        continue; // Go to the next line
                }
            }
            mtl.complete = true;
        };
        // OBJ File has been read compreatly
        ObjParser.prototype.onReadComplete = function (gl, model, objDoc) {
            // Acquire the vertex coordinates and colors from OBJ file
            var drawingInfo = objDoc.getDrawingInfo();
            // Write date into the buffer object
            gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.vertices, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.normals, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, model.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.colors, gl.STATIC_DRAW);
            // Write the indices to the buffer object
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, drawingInfo.indices, gl.STATIC_DRAW);
            return drawingInfo;
        };
        return ObjParser;
    }());
    Utils.ObjParser = ObjParser;
    var StringParser = /** @class */ (function () {
        function StringParser(str) {
            this.str = null;
            this.index = null;
            this.init(str);
        }
        StringParser.prototype.init = function (str) {
            this.str = str;
            this.index = 0;
        };
        StringParser.prototype.skipDelimiters = function () {
            for (var i = this.index, len = this.str.length; i < len; i++) {
                var c = this.str.charAt(i);
                // Skip TAB, Space, '(', ')
                if (c == '\t' || c == ' ' || c == '(' || c == ')' || c == '"' || c == " ")
                    continue;
                break;
            }
            this.index = i;
        };
        StringParser.prototype.skipToNextWord = function () {
            this.skipDelimiters();
            var n = getWordLength(this.str, this.index);
            this.index += (n + 1);
        };
        StringParser.prototype.getWord = function () {
            this.skipDelimiters();
            var n = getWordLength(this.str, this.index);
            if (n == 0)
                return null;
            var word = this.str.substr(this.index, n);
            this.index += (n + 1);
            return word;
        };
        StringParser.prototype.getInt = function () {
            return parseInt(this.getWord());
        };
        StringParser.prototype.getFloat = function () {
            return parseFloat(this.getWord());
        };
        return StringParser;
    }());
    Utils.StringParser = StringParser;
    var MTLDoc = /** @class */ (function () {
        function MTLDoc() {
            this.complete = null;
            this.materials = [];
        }
        MTLDoc.prototype.parseNewmtl = function (sp) {
            return sp.getWord();
        };
        MTLDoc.prototype.parseRGB = function (sp, name) {
            var r = sp.getFloat();
            var g = sp.getFloat();
            var b = sp.getFloat();
            return (new Material(name, r, g, b, 1));
        };
        return MTLDoc;
    }());
    Utils.MTLDoc = MTLDoc;
    var Material = /** @class */ (function () {
        function Material(name, r, g, b, a) {
            this.name = null;
            this.color = null;
            this.name = name;
            this.color = new Color(r, g, b, a);
        }
        return Material;
    }());
    Utils.Material = Material;
    var Color = /** @class */ (function () {
        function Color(r, g, b, a) {
            this.r = null;
            this.g = null;
            this.b = null;
            this.a = null;
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        return Color;
    }());
    Utils.Color = Color;
    var Vertex = /** @class */ (function () {
        function Vertex(x, y, z) {
            this.x = null;
            this.y = null;
            this.z = null;
            this.x = x;
            this.y = y;
            this.z = z;
        }
        return Vertex;
    }());
    Utils.Vertex = Vertex;
    var Normal = /** @class */ (function () {
        function Normal(x, y, z) {
            this.x = null;
            this.y = null;
            this.z = null;
            this.x = x;
            this.y = y;
            this.z = z;
        }
        return Normal;
    }());
    Utils.Normal = Normal;
    var OBJObject = /** @class */ (function () {
        function OBJObject(name) {
            this.name = null;
            this.faces = null;
            this.numIndices = null;
            this.name = name;
            this.faces = new Array(0);
            this.numIndices = 0;
        }
        OBJObject.prototype.addFace = function (face) {
            this.faces.push(face);
            this.numIndices += face.numIndices;
        };
        return OBJObject;
    }());
    Utils.OBJObject = OBJObject;
    var Face = /** @class */ (function () {
        function Face(materialName) {
            this.materialName = null;
            this.vIndices = null;
            this.nIndices = null;
            this.normal = null;
            this.numIndices = null;
            if (materialName == null)
                this.materialName = '';
            this.materialName = materialName;
            this.vIndices = new Array(0);
            this.nIndices = new Array(0);
        }
        return Face;
    }());
    Utils.Face = Face;
    var DrawingInfo = /** @class */ (function () {
        function DrawingInfo(vertices, normals, colors, indices) {
            this.vertices = null;
            this.normals = null;
            this.colors = null;
            this.indices = null;
            this.vertices = vertices;
            this.normals = normals;
            this.colors = colors;
            this.indices = indices;
        }
        return DrawingInfo;
    }());
    Utils.DrawingInfo = DrawingInfo;
    function getWordLength(str, start) {
        var n = 0;
        for (var i = start, len = str.length; i < len; i++) {
            var c = str.charAt(i);
            if (c == '\t' || c == ' ' || c == '(' || c == ')' || c == '"')
                break;
        }
        return i - start;
    }
    function calcNormal(p0, p1, p2) {
        // v0: a vector from p1 to p0, v1; a vector from p1 to p2
        var v0 = new Float32Array(3);
        var v1 = new Float32Array(3);
        for (var i = 0; i < 3; i++) {
            v0[i] = p0[i] - p1[i];
            v1[i] = p2[i] - p1[i];
        }
        // The cross product of v0 and v1
        var c = new Float32Array(3);
        c[0] = v0[1] * v1[2] - v0[2] * v1[1];
        c[1] = v0[2] * v1[0] - v0[0] * v1[2];
        c[2] = v0[0] * v1[1] - v0[1] * v1[0];
        // Normalize the result
        var v = new Utils.Vector3(c);
        v.normalize();
        return v.elements;
    }
})(Utils || (Utils = {}));
/**
 * 单例着色器工具类
 */
var Utils;
(function (Utils) {
    var ShaderUtils = /** @class */ (function () {
        function ShaderUtils() {
            this.shaderUtils = null;
            // if(ShaderUtils.instanceCount == 0){
            //     ShaderUtils.instanceCount++;
            //     this.shaderUtils = new ShaderUtils();
            //     return this.shaderUtils;
            // }else{
            //     return this.shaderUtils;
            // }
        }
        /**
         * 通过着色器代码生成shader
         * @param gl 上下文
         * @param vshader 顶点着色器
         * @param fshader 片元着色器
         */
        ShaderUtils.prototype.initShaders = function (gl, vshader, fshader) {
            var program = this.createProgram(gl, vshader, fshader);
            if (!program) {
                console.log("cannot create program\n");
                return {
                    status: false,
                    program: program,
                };
            }
            // gl.useProgram(program);
            // gl.program = program;//在js里可以正确编译，但是ts里的声明文件没有这个变量
            return {
                status: true,
                program: program
            };
        };
        /**
         * 生成着色器程序
         * @param gl 上下文
         * @param vshader 顶点着色器
         * @param fshader 片元着色器
         */
        ShaderUtils.prototype.createProgram = function (gl, vshader, fshader) {
            var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vshader);
            var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fshader);
            if (!vertexShader || !fragmentShader) {
                return null;
            }
            var program = gl.createProgram();
            if (!program) {
                console.log("failed to create Program");
                return null;
            }
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!linked) {
                console.log("cannot link program：" + gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
                gl.deleteShader(fragmentShader);
                gl.deleteShader(vertexShader);
                return null;
            }
            return program;
        };
        /**
         * 加载着色器
         * @param gl 上下文
         * @param type 着色器类型
         * @param shader_source 着色器源码
         */
        ShaderUtils.prototype.loadShader = function (gl, type, shader_source) {
            var shader = gl.createShader(type);
            if (shader == null) {
                console.log("cannot create shader\n");
                return null;
            }
            gl.shaderSource(shader, shader_source);
            gl.compileShader(shader);
            var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compiled) {
                console.log('Failed to compile shader: ' + gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };
        ShaderUtils.instanceCount = 0;
        return ShaderUtils;
    }());
    Utils.ShaderUtils = ShaderUtils;
})(Utils || (Utils = {}));
var Core;
(function (Core) {
    var Nebula = /** @class */ (function () {
        function Nebula(id, width, height) {
            this.GL = null;
            this.canvas = null;
            this.eye = {
                x: 0,
                y: 0,
                z: 14
            };
            this.center = {
                x: 0,
                y: 0,
                z: 0
            };
            this.scene = [];
            this.nowScene = null;
            this.canvas = this.getCanvasByID(id, width, height);
            console.log(this.canvas);
            this.GL = this.create3DContext(this.canvas);
        }
        /**
         * 创建一个画布
         * @param id 画布id
         * @param width 画布宽度
         * @param height 画布高度
         */
        Nebula.prototype.getCanvasByID = function (id, width, height) {
            var canvas = document.createElement('canvas');
            if (!canvas) {
                console.log("cannot get canvas by id:" + id);
                return null;
            }
            canvas.width = width;
            canvas.height = height;
            canvas.style.margin = "30px auto auto auto";
            canvas.id = id;
            console.log();
            document.body.style.margin = "0px";
            document.body.style.textAlign = "center";
            document.body.appendChild(canvas);
            return canvas;
        };
        /**
         * 通过canvas获取gl上下文,兼容各浏览器
         * @param canvas 页面canvas元素
         */
        Nebula.prototype.create3DContext = function (canvas) {
            var name = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            for (var i = 0; i < name.length; i++) {
                try {
                    var context = this.canvas.getContext(name[i]);
                    if (context) {
                        return context;
                    }
                }
                catch (e) {
                    console.log("error" + e);
                    return null;
                }
            }
            return null;
        };
        /**
         * 导演函数director
         */
        Nebula.prototype.getScene = function () {
            if (this.nowScene == null) {
                return null;
            }
            else {
                return this.nowScene;
            }
        };
        /**
         * 添加一个场景
         * @param scene 场景对象
         */
        Nebula.prototype.addScene = function (scene) {
            this.scene.push(scene);
        };
        /**
         * 删除一个场景
         * @param scene 场景对象
         */
        Nebula.prototype.deleteScene = function (scene) {
            if (this.scene.indexOf(scene) == -1)
                return false;
            this.scene.splice(this.scene.indexOf(scene), 1);
            return true;
        };
        /**
         * 设置当前场景
         * @param scene 场景对象
         * @param index 场景索引
         */
        Nebula.prototype.setScene = function (id) {
            for (var i = 0; i < this.scene.length; i++) {
                if (this.scene[i].sceneID == id) {
                    this.nowScene = this.scene[i];
                    return true;
                }
            }
            console.log("cannot set a scene");
            return false;
        };
        /**
         * 引擎生命周期
         */
        Nebula.prototype._OnLoad = function () {
        };
        Nebula.prototype._OnUpdate = function () {
        };
        Nebula.prototype._OnDestroy = function () {
        };
        return Nebula;
    }());
    Core.Nebula = Nebula;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Scene = /** @class */ (function () {
        function Scene(id) {
            this.Scene = null;
            this.sceneID = 0;
            this.LigthColor = new Float32Array([1.0, 1.0, 1.0]);
            this.LigthPoint = new Float32Array([2.3, 4.0, 3.5]);
            this.AmbientLight = new Float32Array([0.2, 0.2, 0.2]);
            this.projViewMatrix = null;
            this.Child = [];
            this.updateEvents = [];
            // if(Scene.instanceCount == 0){//不是单例类，多个场景切换
            //     Scene.instanceCount ++;
            //     this.Scene = new Scene();
            //     return this.Scene;
            // }else{
            //     return this.Scene;
            // }
            this.sceneID = id;
        }
        ;
        /**
         * 初始化场景
         */
        Scene.prototype.initScene = function () {
            GL.clearColor(0.0, 0, 0, 1.0);
            GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
            GL.enable(GL.DEPTH_TEST);
        };
        /**
         *
         * @param type 光照种类
         * @param color 光照颜色
         * @param point 光照起始点
         */
        Scene.prototype.setLightTypeColorPoint = function (type, color, point) {
        };
        /**
         * 为场景添加一个孩子
         */
        Scene.prototype.addChild = function (object) {
            this.Child.push(object);
        };
        /**
         * 删除一个孩子
         */
        Scene.prototype.deleteChild = function (object) {
            for (var i = 0; i < this.Child.length; i++) {
                if (this.Child[i] === object) {
                    this.Child.splice(i, 1);
                }
            }
        };
        /**
         * 场景更新函数，最终交由render管理
         * @param dt 帧间隔时间
         */
        Scene.prototype._update = function (dt) {
            for (var _i = 0, _a = this.updateEvents; _i < _a.length; _i++) {
                var event = _a[_i];
                if (!!event) {
                    event(dt);
                }
            }
        };
        /**
         * 添加update函数到更新队列
         * @param listener 添加一个update函数
         */
        Scene.prototype.addUpdateEvents = function (listener) {
            this.updateEvents.push(listener);
        };
        /**
         * 删除一个update函数从队列当中
         * @param listener update函数
         */
        Scene.prototype.removeUpdateEvents = function (listener) {
            var index = this.updateEvents.indexOf(listener);
            if (index !== -1) {
                // lazy delete
                this.updateEvents[index] = undefined;
            }
        };
        /**
         * 递归遍历场景子节点,自顶向下行为
         * //也可以考虑在每个NEObject中定义注册函数，形成自下而上的行为
         */
        Scene.prototype.traverseScene = function (parent, callBack) {
            if (parent instanceof NEObject) {
                callBack(parent);
            }
            if (!!parent && parent.Child.length > 0) {
                for (var _i = 0, _a = parent.Child; _i < _a.length; _i++) {
                    var child = _a[_i];
                    this.traverseScene(child, callBack);
                }
            }
        };
        Scene.instanceCount = 0;
        return Scene;
    }());
    Core.Scene = Scene;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Camera = /** @class */ (function () {
        function Camera(fovy, aspect, near, far) {
            this.coordinate = {
                x: 0, y: 0, z: 14
            };
            this.center = {
                x: 0, y: 0, z: 0
            };
            this.projectMatrix = new Matrix4(null);
            this.projViewMatrix = new Matrix4(null);
            this.setPerspectiveCamera(fovy, aspect, near, far);
        }
        Camera.prototype.setCoordinatePoint = function (x, y, z) {
            this.coordinate.x = x;
            this.coordinate.y = y;
            this.coordinate.z = z;
        };
        Camera.prototype.setCenter = function (x, y, z) {
            this.center.x = x;
            this.center.y = y;
            this.center.z = z;
        };
        /**
         * 设置透视摄像机
         */
        Camera.prototype.setPerspectiveCamera = function (fovy, aspect, near, far) {
            this.projectMatrix = new Matrix4(null);
            this.projectMatrix.setPerspective(fovy, aspect, near, far);
            this.projectMatrix.lookAt(this.coordinate.x, this.coordinate.y, this.coordinate.z, this.center.x, this.center.y, this.center.z, 0, 1, 0);
            this.projViewMatrix = this.projectMatrix;
        };
        Camera.prototype.updateGLIFCamera = function (factor) {
            var nowN = camera.getSightDirection(1);
            nowN = camera.getSightDirection(1 + factor);
            camera.setCoordinatePoint(camera.center.x - nowN[0], camera.center.y - nowN[1], camera.center.z - nowN[2]);
            camera.setPerspectiveCamera(85, canvas.width / canvas.height, 1, 1000);
        };
        /**
         * 设置正视摄像机,暂时不用开发
         */
        Camera.prototype.setOrthoCamera = function () {
        };
        /**
         * 获取视线方向向量
         * @param ratio 对方向向量的扩大缩小比率，不改为１
         */
        Camera.prototype.getSightDirection = function (ratio) {
            var ret = [];
            ret[0] = (this.center.x - this.coordinate.x) * ratio;
            ret[1] = (this.center.y - this.coordinate.y) * ratio;
            ret[2] = (this.center.z - this.coordinate.z) * ratio;
            return ret;
        };
        return Camera;
    }());
    Core.Camera = Camera;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Render = /** @class */ (function () {
        //单例类
        function Render() {
            this.stopped = true;
            this.currentFPS = 0;
            this.duration = 0;
            this.frameRate = 1000 / 60;
            this.startTime = 0;
            this.renderQueue = [];
            // requestAnimationFrame(this.main.bind(this));
        }
        /**
         * 主控函数，控制生命周期和帧刷新
         */
        Render.prototype.main = function () {
            if (this.stopped) {
                return;
            }
            var now = Date.now();
            for (var _i = 0, _a = this.renderQueue; _i < _a.length; _i++) {
                var renderCommand = _a[_i];
                renderCommand(this.frameRate);
            }
            var delta = now - this.duration - this.startTime;
            this.currentFPS = 1000 / delta;
            this.duration = now - this.startTime;
            requestAnimationFrame(this.main.bind(this));
        };
        /**
         * 渲染函数，将所有帧更新函数加入渲染队列,如果需要渲染几个场景，可以将scene改为Scene[]
         */
        Render.prototype.render = function (scene) {
            //渲染场景，
            //更新函数
            ne.getScene().traverseScene(ne.getScene(), function (o) {
                ne.getScene().addUpdateEvents(o.onUpdate.bind(o));
                render.stopped = false;
            });
            this.renderQueue.push(scene.initScene.bind(scene));
            this.renderQueue.push(scene._update.bind(scene));
        };
        return Render;
    }());
    Core.Render = Render;
})(Core || (Core = {}));
var Lib;
(function (Lib) {
    var RayCaster = /** @class */ (function () {
        function RayCaster() {
            this.start = null;
            this.end = null;
        }
        RayCaster.prototype.test2 = function () {
            var pA = [];
            var pB = [];
            var pC = [];
            var endA = [];
            var endB = [];
            var out = [];
            pA[0] = 0;
            pA[1] = 0;
            pA[2] = 0;
            pB[0] = 2;
            pB[1] = 0;
            pB[2] = 2;
            pC[0] = 0;
            pC[1] = 2;
            pC[2] = 2;
            endA[0] = 0;
            endA[1] = 0;
            endA[2] = 2;
            endB[0] = 2;
            endB[1] = 2;
            endB[2] = 0;
            if (this.intersectSurfaceLine(pA, pB, pC, endA, endB, out)) {
                this.rayPickLog(out);
            }
            else {
                this.rayPickLog("error");
            }
            return out;
        };
        /**
         * 初始化射线,可以通过摄像机位置和屏幕触点，或者任意射线都可以
         */
        RayCaster.prototype.initCameraRay = function (sx, sy, sz, ex, ey, ez, far) {
            var nNear = [];
            nNear[0] = (ex - sx) * far + sx;
            nNear[1] = (ey - sy) * far + sy;
            nNear[2] = (ez - sz) * far + sz;
            this.start = [sx, sy, sz];
            this.end = nNear;
            // console.log(this.start, this.end)
        };
        /**
         * 射线相交的物体
         * @param objects 检查的物体
         * @param testChild 是否检查子物体
         */
        RayCaster.prototype.intersectObjects = function (objects, testChild) {
            this.test2();
            var ret = [];
            var out = [];
            for (var i = 0; i < objects.length; i++) {
                // console.log("***********************name:"+objects[i].name);
                var triArr = objects[i].boundingBox.generateTestTriangle();
                for (var _i = 0, triArr_1 = triArr; _i < triArr_1.length; _i++) {
                    var tri = triArr_1[_i];
                    if (this.intersectSurfaceLine(tri[0].elements, tri[1].elements, tri[2].elements, this.start, this.end, out)) {
                        ret.push(objects[i]);
                        break;
                    }
                }
                if (testChild) {
                    var length = objects[i].Child.length;
                    if (length > 0) {
                        var childObj = this.intersectObjects.bind(this)(objects[i].Child, true); //递归检测\
                        for (var _a = 0, childObj_1 = childObj; _a < childObj_1.length; _a++) {
                            var child = childObj_1[_a];
                            ret.push(child);
                        }
                    }
                }
            }
            // var retObj = null;
            // var distance = 999;
            // for(var point of ret){
            //     var dis = Math.sqrt(point.coordinate.x*point.coordinate.x+point.coordinate.x*point.coordinate.x+point.coordinate.x*point.coordinate.x)
            //     if(dis < distance){
            //         retObj = point;
            //     }
            // }
            // console.log(ret);
            return ret[0];
        };
        /**
         * 判断点在面中
         * @param pA 三角形a点
         * @param pB 三角形b点
         * @param pC 三角形c点
         * @param endA 线段a点
         * @param endB 线段b点
         * @param out 交点，如果有
         */
        RayCaster.prototype.intersectSurfaceLine = function (pA, pB, pC, endA, endB, out) {
            var ret = false;
            var surfaceNornal = [];
            var side0 = [];
            var side1 = [];
            var nLine = [];
            this.getNormal(pA, pB, side0);
            this.getNormal(pA, pC, side1);
            this.cross(surfaceNornal, side0, side1);
            if (surfaceNornal[0] == 0 && surfaceNornal[1] == 0 && surfaceNornal[2] == 0) {
                this.rayPickLog("surface error");
                return false;
            }
            this.getNormal(endA, endB, nLine);
            this.rayPickLog("surface normal:" + surfaceNornal);
            this.rayPickLog("line normal:" + nLine);
            if ((nLine[0] * surfaceNornal[0]
                + nLine[1] * surfaceNornal[1]
                + nLine[2] * surfaceNornal[2]) == 0) {
                this.rayPickLog("surface and line parallel");
                return false; //直线和面平行
            }
            var baseScale = -1;
            baseScale = this.getBaseScale(nLine);
            if (baseScale < 0) {
                rayPickLog("line error");
                return false;
            }
            this.rayPickLog("getBaseScale:" + baseScale.toString());
            ret = this.intersect(surfaceNornal, pA, nLine, endA, baseScale, out);
            if (!ret) {
                return false;
            }
            this.rayPickLog("out:" + out);
            ret = this.surfacePointInSurface(pA, pB, pC, out);
            this.rayPickLog("in surface:" + ret);
            return ret;
        };
        /**
         * 获取法向量
         * @param pA a点
         * @param pB b点
         * @param out 计算后的法向量
         */
        RayCaster.prototype.getNormal = function (pA, pB, out) {
            out[0] = pB[0] - pA[0];
            out[1] = pB[1] - pA[1];
            out[2] = pB[2] - pA[2];
        };
        RayCaster.prototype.getBaseScale = function (nAB) {
            //找到不为0的偏量
            var baseScale = null; //0 for x; 1 for y, 2 for z;
            while (1) {
                if (nAB[0] != 0) {
                    baseScale = 0;
                    if (nAB[0] > -zero_guard && nAB[0] < zero_guard) {
                    }
                    else {
                        break;
                    }
                }
                if (nAB[1] != 0) {
                    if (baseScale == null) {
                        baseScale = 1;
                    }
                    if (nAB[1] > -zero_guard && nAB[1] < zero_guard) {
                    }
                    else {
                        baseScale = 1;
                        break;
                    }
                }
                if (nAB[2] != 0) {
                    if (baseScale == null) {
                        baseScale = 2;
                    }
                    if (nAB[2] > -zero_guard && nAB[2] < zero_guard) {
                    }
                    else {
                        baseScale = 2;
                        break;
                    }
                }
                break;
            }
            if (baseScale == null)
                return -1;
            return baseScale;
        };
        RayCaster.prototype.intersect = function (nSurface, point, nLine, linePoint, baseScale, out) {
            var ret = false;
            if (baseScale == 0) {
                ret = this.xBaseInsect(nSurface, point, nLine, linePoint, out);
            }
            else if (baseScale == 1) {
                ret = this.yBaseInsect(nSurface, point, nLine, linePoint, out);
            }
            else if (baseScale == 2) {
                ret = this.zBaseInsect(nSurface, point, nLine, linePoint, out);
            }
            return ret;
        };
        RayCaster.prototype.xBaseInsect = function (nSurface, point, nLine, linePoint, out) {
            var yK = (nLine[1] / nLine[0]);
            var yT = (nLine[1] / nLine[0]) * (-linePoint[0]) + linePoint[1];
            var zK = (nLine[2] / nLine[0]);
            var zT = (nLine[2] / nLine[0]) * (-linePoint[0]) + linePoint[2];
            var surfaceK = nSurface[0] + yK * nSurface[1] + zK * nSurface[2];
            var surfaceT = (-point[0]) * nSurface[0] + (yT - point[1]) * nSurface[1] + (zT - point[2]) * nSurface[2];
            if (surfaceK == 0)
                return false;
            out[0] = (-surfaceT) / surfaceK;
            out[1] = yK * out[0] + yT;
            out[2] = zK * out[0] + zT;
            return true;
        };
        RayCaster.prototype.yBaseInsect = function (nSurface, point, nLine, linePoint, out) {
            var xK = (nLine[0] / nLine[1]);
            var xT = (nLine[0] / nLine[1]) * (-linePoint[1]) + linePoint[0];
            this.rayPickLog("y base");
            var zK = (nLine[2] / nLine[1]);
            var zT = (nLine[2] / nLine[1]) * (-linePoint[1]) + linePoint[2];
            var surfaceK = xK * nSurface[0] + nSurface[1] + zK * nSurface[2];
            var surfaceT = (xT - point[0]) * nSurface[0] + (-point[1]) * nSurface[1] + (zT - point[2]) * nSurface[2];
            if (surfaceK == 0)
                return false;
            out[1] = (-surfaceT) / surfaceK;
            out[0] = xK * out[1] + xT;
            out[2] = zK * out[1] + zT;
            return true;
        };
        RayCaster.prototype.zBaseInsect = function (nSurface, point, nLine, linePoint, out) {
            var xK = (nLine[0] / nLine[2]);
            var xT = (nLine[0] / nLine[2]) * (-linePoint[2]) + linePoint[0];
            this.rayPickLog("z base");
            var yK = (nLine[1] / nLine[2]);
            var yT = (nLine[1] / nLine[2]) * (-linePoint[2]) + linePoint[1];
            var surfaceK = xK * nSurface[0] + yK * nSurface[1] + nSurface[2];
            var surfaceT = (xT - point[0]) * nSurface[0] + (yT - point[1]) * nSurface[1] + (-point[2]) * nSurface[2];
            if (surfaceK == 0)
                return false;
            out[2] = (-surfaceT) / surfaceK;
            out[0] = xK * out[2] + xT;
            out[1] = yK * out[2] + yT;
            return true;
        };
        RayCaster.prototype.surfacePointInSurface = function (pA, pB, pC, point) {
            var x1 = pB[0] - pA[0];
            var y1 = pB[1] - pA[1];
            var z1 = pB[2] - pA[2];
            var x2 = pC[0] - pA[0];
            var y2 = pC[1] - pA[1];
            var z2 = pC[2] - pA[2];
            var x3 = pC[0] - pB[0];
            var y3 = pC[1] - pB[1];
            var z3 = pC[2] - pB[2];
            var ret = false;
            var base = null; //
            while (1) {
                if ((y1 != 0 || z1 != 0) &&
                    (y2 != 0 || z2 != 0) &&
                    (y3 != 0 || z3 != 0)) {
                    base = 0; //yz面
                    this.rayPickLog("check in yz");
                    break;
                }
                if ((x1 != 0 || z1 != 0) &&
                    (x2 != 0 || z2 != 0) &&
                    (x3 != 0 || z3 != 0)) {
                    base = 1; //xz面
                    this.rayPickLog("check in xz");
                    break;
                }
                if ((x1 != 0 || y1 != 0) &&
                    (x2 != 0 || y2 != 0) &&
                    (x3 != 0 || y3 != 0)) {
                    base = 2; //xy面
                    this.rayPickLog("check in xy");
                    break;
                }
                this.rayPickLog("check in no face");
                break;
            }
            if (base == null)
                return ret;
            if (base == 0) {
                //xy 面
                ret = this.yzPointInSurface2D(pA, pB, pC, point);
            }
            else if (base == 1) {
                ret = this.xzPointInSurface2D(pA, pB, pC, point);
            }
            else if (base == 2) {
                ret = this.xyPointInSurface2D(pA, pB, pC, point);
            }
            return ret;
        };
        RayCaster.prototype.xyPointInSurface2D = function (pA, pB, pC, p) {
            var pointA = [];
            var pointB = [];
            var pointC = [];
            var point = [];
            pointA[0] = pA[0];
            pointA[1] = pA[1];
            pointB[0] = pB[0];
            pointB[1] = pB[1];
            pointC[0] = pC[0];
            pointC[1] = pC[1];
            point[0] = p[0];
            point[1] = p[1];
            return this.pointInSurface2D(pointA, pointB, pointC, point);
        };
        RayCaster.prototype.yzPointInSurface2D = function (pA, pB, pC, p) {
            var pointA = [];
            var pointB = [];
            var pointC = [];
            var point = [];
            pointA[0] = pA[1];
            pointA[1] = pA[2];
            pointB[0] = pB[1];
            pointB[1] = pB[2];
            pointC[0] = pC[1];
            pointC[1] = pC[2];
            point[0] = p[1];
            point[1] = p[2];
            return this.pointInSurface2D(pointA, pointB, pointC, point);
        };
        RayCaster.prototype.xzPointInSurface2D = function (pA, pB, pC, p) {
            var pointA = [];
            var pointB = [];
            var pointC = [];
            var point = [];
            pointA[0] = pA[0];
            pointA[1] = pA[2];
            pointB[0] = pB[0];
            pointB[1] = pB[2];
            pointC[0] = pC[0];
            pointC[1] = pC[2];
            point[0] = p[0];
            point[1] = p[2];
            return this.pointInSurface2D(pointA, pointB, pointC, point);
        };
        RayCaster.prototype.pointInSurface2D = function (pA, pB, pC, p) {
            this.rayPickLog("pointInSurface2D pA:" + pA);
            this.rayPickLog("pointInSurface2D pB:" + pB);
            this.rayPickLog("pointInSurface2D pC:" + pC);
            this.rayPickLog("pointInSurface2D p:" + p);
            var AB = [];
            var AC = [];
            var AP = [];
            var k = 0;
            var t = 0;
            AB[0] = pB[0] - pA[0];
            AB[1] = pB[1] - pA[1];
            AC[0] = pC[0] - pA[0];
            AC[1] = pC[1] - pA[1];
            AP[0] = p[0] - pA[0];
            AP[1] = p[1] - pA[1];
            //k AB[0] + t AC[0] = AP[0];
            //k AB[1] + t AC[1] = AP[1];
            var getted = false;
            while (1) {
                if (AB[0] == 0) {
                    //如果 AB[0] == 0;
                    if (AC[0] != 0) {
                        //如果 AC[0] != 0;
                        t = AP[0] / AC[0];
                        if (AB[1] != 0) {
                            //
                            k = (AP[1] - t * AC[1]) / AB[1];
                            getted = true;
                            break;
                        }
                        //AB[1] == 0
                        var val_1 = t * AC[1] - AP[1];
                        if (val_1 > -zero_guard && val_1 < zero_guard) {
                            //t AC[1] == AP[1]
                            k = 0;
                            getted = true;
                            break;
                        }
                        //无解
                        break;
                    }
                    //如果 AC[0] == 0;则只能通过"k AB[1] + t AC[1] = AP[1]" 求解
                    if (AP[0] < -zero_guard && AP[0] > zero_guard) {
                        //AP[0] != 0,使得"k AB[0] + t AC[0] = AP[0]" 左右不平等，无解
                        break;
                    }
                    //通过"k AB[1] + t AC[1] = AP[1]" 求解
                    if (AB[1] == 0) {
                        k = 0;
                        if (AC[1] != 0) {
                            t = AP[1] / AC[1];
                            getted = true;
                            break;
                        }
                        //AC[1] == 0
                        if (AP[1] < -zero_guard && AP[1] > zero_guard) {
                            //AP[1] != 0,使得"k AB[1] + t AC[1] = AP[1]" 左右不平等，无解
                            break;
                        }
                        t = 0;
                        getted = true;
                        break;
                    }
                    //如果 AB[1] != 0
                    if (AC[1] == 0) {
                        k = AP[1] / AB[1];
                        t = 0;
                        getted = true;
                        break;
                    }
                    //AC[1] != 0, 假设AC[1] == 0, 求之中一个解(此时应该是两条线重合了)
                    k = AP[1] / AB[1];
                    t = 0;
                    getted = true;
                    break;
                }
                //AB[0] != 0
                //据"k AB[0] + t AC[0] = AP[0]", 以t为基换算k
                var kK = (-AC[0]) / AB[0];
                var kT = AP[0] / AB[0];
                //带入"k AB[1] + t AC[1] = AP[1]"
                var nt = kK * AB[1] + AC[1];
                var val = AP[1] - kT * AB[1];
                t = val / nt;
                k = kK * t + kT;
                getted = true;
                break;
            }
            if (!getted) {
                return false;
            }
            this.rayPickLog("in line, t:" + t + ", k:" + k);
            if (t >= 0 && k >= 0 && t + k <= 1) {
                return true;
            }
            return false;
        };
        RayCaster.prototype.cross = function (out, a, b) {
            var ax = a[0], ay = a[1], az = a[2];
            var bx = b[0], by = b[1], bz = b[2];
            out[0] = ay * bz - az * by;
            out[1] = az * bx - ax * bz;
            out[2] = ax * by - ay * bx;
            return out;
        };
        RayCaster.prototype.rayPickLog = function (val) {
            // console.log(val);
        };
        return RayCaster;
    }());
    Lib.RayCaster = RayCaster;
})(Lib || (Lib = {}));
var Lib;
(function (Lib) {
    var BoundingBox = /** @class */ (function () {
        function BoundingBox(object) {
            this.vertices = null;
            this.indices = null;
            this.target = null;
            this.maxX = null;
            this.maxY = null;
            this.maxZ = null;
            this.minX = null;
            this.minY = null;
            this.minZ = null;
            this.target = object;
            if (this.target == null)
                return;
            this.handleObject(this.target.vertices);
            this.setVertices(this.maxX, this.minX, this.maxY, this.minY, this.maxZ, this.minZ);
            this.updateBoundingBox();
        }
        BoundingBox.prototype.updateBoundingBox = function () {
            if (this.target == null)
                return;
            this.generateTestTriangle();
        };
        BoundingBox.prototype.handleObject = function (vertices) {
            var flag = 0; //0-x,1-y,2-z(三维坐标)
            var vertices = vertices;
            for (var i = 0; i < vertices.length; i++) {
                if (flag == 0) {
                    if (this.maxX == null)
                        this.maxX = vertices[i];
                    if (this.minX == null)
                        this.minX = vertices[i];
                    if (vertices[i] > this.maxX) {
                        this.maxX = vertices[i];
                    }
                    if (vertices[i] < this.minX) {
                        this.minX = vertices[i];
                    }
                }
                else if (flag == 1) {
                    if (this.maxY == null)
                        this.maxY = vertices[i];
                    if (this.minY == null)
                        this.minY = vertices[i];
                    if (vertices[i] > this.maxY) {
                        this.maxY = vertices[i];
                    }
                    if (vertices[i] < this.minY) {
                        this.minY = vertices[i];
                    }
                }
                else {
                    if (this.maxZ == null)
                        this.maxZ = vertices[i];
                    if (this.minZ == null)
                        this.minZ = vertices[i];
                    if (vertices[i] > this.maxZ) {
                        this.maxZ = vertices[i];
                    }
                    if (vertices[i] < this.minZ) {
                        this.minZ = vertices[i];
                    }
                }
                if (flag == 2) {
                    flag = 0;
                }
                else {
                    flag++;
                }
            }
        };
        BoundingBox.prototype.setVertices = function (maxX, minX, maxY, minY, maxZ, minZ) {
            this.vertices = new Float32Array([
                maxX, maxY, maxZ, minX, maxY, maxZ, minX, minY, maxZ, maxX, minY, maxZ,
                maxX, maxY, maxZ, maxX, minY, maxZ, maxX, minY, minZ, maxX, maxY, minZ,
                maxX, maxY, maxZ, minX, maxY, maxZ, minX, minY, maxZ, maxX, minY, maxZ,
                minX, maxY, maxZ, minX, maxY, minZ, minX, minY, minZ, minX, minY, maxZ,
                minX, minY, minZ, maxX, minY, minZ, maxX, minY, maxZ, maxX, minY, maxZ,
                maxX, minY, minZ, minX, minY, minZ, minX, maxY, minZ, maxX, maxY, minZ //背面
            ]);
            this.indices = new Uint16Array([
                0, 1, 2, 0, 2, 3,
                4, 5, 6, 4, 6, 7,
                8, 9, 10, 8, 10, 11,
                12, 13, 14, 12, 14, 15,
                16, 17, 18, 16, 18, 19,
                20, 21, 22, 20, 22, 23 // back
            ]);
        };
        BoundingBox.prototype.generateTestTriangle = function () {
            var ret = [];
            var modelMatrix = this.target.getModelMatrix();
            var vertices = this.vertices;
            var indices = this.indices;
            for (var i = 0; i < indices.length; i += 3) {
                ret.push([modelMatrix.multiplyVector4(new Vector4([
                        vertices[indices[i] * 3 + 0],
                        vertices[indices[i] * 3 + 1],
                        vertices[indices[i] * 3 + 2],
                        1,
                    ])), modelMatrix.multiplyVector4(new Vector4([
                        vertices[(indices[i + 1]) * 3 + 0],
                        vertices[(indices[i + 1]) * 3 + 1],
                        vertices[(indices[i + 1]) * 3 + 2],
                        1
                    ])), modelMatrix.multiplyVector4(new Vector4([
                        vertices[(indices[i + 2]) * 3 + 0],
                        vertices[(indices[i + 2]) * 3 + 1],
                        vertices[(indices[i + 2]) * 3 + 2],
                        1
                    ]))]);
            }
            // console.log(ret)
            return ret;
        };
        return BoundingBox;
    }());
    Lib.BoundingBox = BoundingBox;
})(Lib || (Lib = {}));
var shader;
(function (shader) {
    /**
     * 所有３维物体的子类，实现基本方法
     */
    var NEObject = /** @class */ (function () {
        function NEObject() {
            this.coordinate = {
                x: 0,
                y: 0,
                z: 0
            };
            this.rotation = {
                x: 0,
                y: 0,
                z: 0
            };
            this.scale = {
                x: 1,
                y: 1,
                z: 1
            };
            this.vertex = '' +
                'attribute  vec4 a_Position;\n' +
                'attribute  vec4 a_Color;\n' +
                'attribute  vec4 a_Normal;\n' +
                'uniform    mat4 u_MvpMatrix;\n' +
                'uniform    mat4 u_ModelMatrix;\n' + // Model matrix
                'uniform    mat4 u_NormalMatrix;\n' + // Transformation matrix of the normal
                'uniform    bool u_Clicked;\n' +
                'varying    vec4 v_Color;\n' +
                'varying    vec3 v_Normal;\n' +
                'varying    vec3 v_Position;\n' +
                'void main() {\n' +
                '   gl_Position = u_MvpMatrix * a_Position;\n' +
                // Calculate the vertex position in the world coordinate
                '   v_Position = vec3(u_ModelMatrix * a_Position);\n' +
                '   v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
                '   v_Color = a_Color;\n' +
                '}\n';
            this.fragment = '' +
                '#ifdef GL_ES\n' +
                'precision mediump float;\n' +
                '#endif\n' +
                'uniform vec3 u_LightColor;\n' + // Light color
                'uniform vec3 u_LightPosition;\n' + // Position of the light source
                'uniform vec3 u_AmbientLight;\n' + // Ambient light color
                'varying vec3 v_Normal;\n' +
                'varying vec3 v_Position;\n' +
                'varying vec4 v_Color;\n' +
                'void main() {\n' +
                // Normalize the normal because it is interpolated and not 1.0 in length any more
                '  vec3 normal = normalize(v_Normal);\n' +
                // Calculate the light direction and make its length 1.
                '  vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
                // The dot product of the light direction and the orientation of a surface (the normal)
                '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
                // Calculate the final color from diffuse reflection and ambient reflection
                '  vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n' +
                '  vec3 ambient = u_AmbientLight * v_Color.rgb;\n' +
                '  gl_FragColor = vec4(diffuse + ambient, v_Color.a);\n' +
                '}\n';
            this._modelMatrix = new Matrix4(null); //模型矩阵
            this._mvpMatrix = new Matrix4(null); //模型视图投影矩阵
            this._normalMatrix = new Matrix4(null); //法向量变换矩阵
            this.program = null;
            this.OBJInfo = null;
            this.name = '';
            this.Child = [];
            this.parent = null;
            this.boundingBox = new BoundingBox(null);
            this.onLoad();
            this.onStart();
            // var nowScene = ne.getScene();
            // if(!!nowScene){
            //     nowScene.addUpdateEvents(this.onUpdate.bind(this));
            // }
            // this._loop();
        }
        NEObject.prototype.onLoad = function () {
        };
        NEObject.prototype.onStart = function () {
        };
        /**
         * 帧刷新函数，每帧调用
         */
        NEObject.prototype.onUpdate = function (dt) {
            // this._draw();
        };
        NEObject.prototype._draw = function (program, OBJ) {
            if (program && OBJ) {
                GL.useProgram(program);
                var a_Position = GL.getAttribLocation(program, 'a_Position');
                var a_Color = GL.getAttribLocation(program, 'a_Color');
                var a_Normal = GL.getAttribLocation(program, 'a_Normal');
                var u_ModelMatrix = GL.getUniformLocation(program, 'u_ModelMatrix');
                var u_MvpMatrix = GL.getUniformLocation(program, 'u_MvpMatrix');
                var u_NormalMatrix = GL.getUniformLocation(program, 'u_NormalMatrix');
                var u_LightColor = GL.getUniformLocation(program, 'u_LightColor');
                var u_LightPosition = GL.getUniformLocation(program, 'u_LightPosition');
                var u_AmbientLight = GL.getUniformLocation(program, 'u_AmbientLight');
                if (a_Position < 0 || a_Color < 0 || a_Normal < 0) {
                    console.log('Failed to get the attribute storage location');
                    return;
                }
                if (!u_ModelMatrix || !u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition || !u_AmbientLight) {
                    console.log('Failed to get the unifrom storage location');
                    return;
                }
                this.initAttributeVariable(GL, a_Position, OBJ.vertex);
                this.initAttributeVariable(GL, a_Color, OBJ.color);
                this.initAttributeVariable(GL, a_Normal, OBJ.normal);
                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, OBJ.index.buffer);
                // Set the light color (white)
                GL.uniform3fv(u_LightColor, sceneInfo.LigthColor);
                // Set the light direction (in the world coordinate)
                GL.uniform3fv(u_LightPosition, sceneInfo.LigthPoint);
                // Set the ambient light
                GL.uniform3fv(u_AmbientLight, sceneInfo.AmbientLight);
                // Pass the model matrix to u_ModelMatrix
                GL.uniformMatrix4fv(u_ModelMatrix, false, this.getModelMatrix().elements);
                // Pass the model view projection matrix to u_MvpMatrix
                GL.uniformMatrix4fv(u_MvpMatrix, false, this.getMvpMatrix().elements);
                // Pass the matrix to transform the normal based on the model matrix to u_NormalMatrix
                GL.uniformMatrix4fv(u_NormalMatrix, false, this.getNormalMatrix().elements);
                // Draw the Cylinder
                GL.drawElements(GL.TRIANGLES, OBJ.numIndices, GL.UNSIGNED_SHORT, 0);
            }
        };
        NEObject.prototype._loop = function (dt) {
            this.onUpdate(dt);
            requestAnimationFrame(this._loop.bind(this));
        };
        NEObject.prototype.onDestroy = function () {
        };
        /**
         * 父子层级函数
         * 添加孩子,需要判断是否添加了自己上级或自身
         */
        NEObject.prototype.addChild = function (object) {
            this.Child.push(object);
            object.parent = this;
        };
        /**
         * 设置父节点
         */
        NEObject.prototype.setParent = function (object) {
            if (!!object) {
                if (!!this.parent) {
                    var idx = this.parent.Child.indexOf(this); //判断是否是第一次设置父节点
                    if (idx != -1) {
                        this.parent.Child.splice(idx, 1);
                    }
                }
                object.Child.push(this);
                this.parent = object;
            }
            else {
                console.error("you can not set a child NEobject to null");
                return;
            }
        };
        NEObject.prototype.getParent = function () {
            return this.parent;
        };
        /**
         * 模型变换函数
         */
        NEObject.prototype.setPosition = function (x, y, z) {
            var dx = x - this.coordinate.x;
            var dy = y - this.coordinate.y;
            var dz = z - this.coordinate.z;
            this.setTranslate(dx, dy, dz);
        };
        NEObject.prototype.setRotation = function (x, y, z) {
            var dx = x - this.rotation.x;
            var dy = y - this.rotation.y;
            var dz = z - this.rotation.z;
            this.Rotate(dx, dy, dz);
        };
        NEObject.prototype.setRotationFromQuaternion = function (axis, angle, isRadian) {
            this._modelMatrix.setRotateFromQuaternion(axis, angle, isRadian);
            this._mvpMatrix.set(camera.projViewMatrix).multiply(this._modelMatrix);
            this._normalMatrix.setInverseOf(this._modelMatrix);
            this._normalMatrix.transpose();
            this.boundingBox.updateBoundingBox();
            for (var _i = 0, _a = this.Child; _i < _a.length; _i++) {
                var child = _a[_i];
                child.setRotationFromQuaternion(axis, angle, isRadian);
            }
        };
        NEObject.prototype.rotateByQuaternion = function (axis, angle, isRadian) {
            this._modelMatrix.rotateByQuaternion(axis, angle, isRadian);
            this._mvpMatrix.set(camera.projViewMatrix).multiply(this._modelMatrix);
            this._normalMatrix.setInverseOf(this._modelMatrix);
            this._normalMatrix.transpose();
            this.boundingBox.updateBoundingBox();
            for (var _i = 0, _a = this.Child; _i < _a.length; _i++) {
                var child = _a[_i];
                child.rotateByQuaternion(axis, angle, isRadian);
            }
        };
        NEObject.prototype.setTranslate = function (x, y, z) {
            this.coordinate.x += x;
            this.coordinate.y += y;
            this.coordinate.z += z;
            this._modelMatrix.translate(x, y, z);
            this._mvpMatrix.set(camera.projViewMatrix).multiply(this._modelMatrix);
            this._normalMatrix.setInverseOf(this._modelMatrix);
            this._normalMatrix.transpose();
            this.boundingBox.updateBoundingBox();
            for (var _i = 0, _a = this.Child; _i < _a.length; _i++) {
                var child = _a[_i];
                child.setTranslate(x, y, z);
            }
        };
        NEObject.prototype.setScale = function (x, y, z) {
            this.scale.x = x;
            this.scale.y = y;
            this.scale.z = z;
            // this._modelMatrix = new Matrix4(null);
            this._modelMatrix.scale(x, y, z);
            this._mvpMatrix.set(camera.projViewMatrix).multiply(this._modelMatrix);
            this._normalMatrix.setInverseOf(this._modelMatrix);
            this._normalMatrix.transpose();
            this.boundingBox.updateBoundingBox();
            for (var _i = 0, _a = this.Child; _i < _a.length; _i++) {
                var child = _a[_i];
                child.setScale(x, y, z);
            }
        };
        NEObject.prototype.Rotate = function (x, y, z) {
            this.rotation.x += x;
            this.rotation.y += y;
            this.rotation.z += z;
            if (x != 0) {
                this._modelMatrix.rotate(x, 1, 0, 0);
            }
            if (y != 0) {
                this._modelMatrix.rotate(y, 0, 1, 0);
            }
            if (z != 0) {
                this._modelMatrix.rotate(z, 0, 0, 1);
            }
            this._mvpMatrix.set(camera.projViewMatrix).multiply(this._modelMatrix);
            this._normalMatrix.setInverseOf(this._modelMatrix);
            this._normalMatrix.transpose();
            this.boundingBox.updateBoundingBox();
            for (var _i = 0, _a = this.Child; _i < _a.length; _i++) {
                var child = _a[_i];
                child.setRotation(x, y, z);
            }
        };
        NEObject.prototype.getModelMatrix = function () {
            return this._modelMatrix;
        };
        NEObject.prototype.getMvpMatrix = function () {
            this._mvpMatrix.set(camera.projViewMatrix).multiply(this._modelMatrix);
            return this._mvpMatrix;
        };
        NEObject.prototype.getNormalMatrix = function () {
            return this._normalMatrix;
        };
        NEObject.prototype.onClick = function () {
        };
        NEObject.prototype.onDrag = function () {
        };
        /**
 * 初始化各缓存区
 * @param gl 上下文
 * @param data 源数据
 * @param num 单位数据长度
 * @param type 单位类型
 */
        NEObject.prototype.initArrayBufferForLaterUse = function (gl, data, num, type) {
            var arrBufferObj = {
                buffer: null,
                num: null,
                type: null
            };
            arrBufferObj.num = num;
            arrBufferObj.type = type;
            arrBufferObj.buffer = gl.createBuffer();
            if (!arrBufferObj.buffer) {
                console.log("failed to create buffer");
                return null;
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, arrBufferObj.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            return arrBufferObj;
        };
        /**
         * 初始化索引数组
         * @param gl 上下文
         * @param data 源数据
         * @param type 索引源数据类型
         */
        NEObject.prototype.initElementArrayBufferForLaterUse = function (gl, data, type) {
            var eleBufferObj = {
                buffer: null,
                type: null,
            };
            eleBufferObj.type = type;
            eleBufferObj.buffer = gl.createBuffer(); // Create a buffer object
            if (!eleBufferObj.buffer) {
                console.log('Failed to create the buffer object');
                return null;
            }
            // Write date into the buffer object
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eleBufferObj.buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
            return eleBufferObj;
        };
        /**
         * 分配缓冲区对象并且激活分配
         * @param gl 上下文
         * @param a_attribute 属性名
         * @param buffer 缓冲区数据
         */
        NEObject.prototype.initAttributeVariable = function (gl, a_attribute, bufferObj) {
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferObj.buffer);
            gl.vertexAttribPointer(a_attribute, bufferObj.num, bufferObj.type, false, 0, 0);
            gl.enableVertexAttribArray(a_attribute);
        };
        /**
         * 初始化obj数据，全局只需绑定一次
         * @param vertices 顶点矩阵
         * @param colors 颜色矩阵
         * @param normals 法向量矩阵
         * @param program　对应的着色器程序
         * @param indices 索引矩阵
         */
        NEObject.prototype.initVertexBuffer = function (vertices, colors, normals, indices) {
            var OBJ = {
                vertex: null,
                color: null,
                normal: null,
                index: null,
                numIndices: null,
            };
            OBJ.vertex = this.initArrayBufferForLaterUse(GL, vertices, 3, GL.FLOAT);
            OBJ.color = this.initArrayBufferForLaterUse(GL, colors, 4, GL.FLOAT);
            OBJ.normal = this.initArrayBufferForLaterUse(GL, normals, 3, GL.FLOAT);
            OBJ.index = this.initElementArrayBufferForLaterUse(GL, indices, GL.UNSIGNED_SHORT);
            if (!OBJ.vertex || !OBJ.color || !OBJ.normal || !OBJ.index) {
                console.log("failed to init buffer");
                return null;
            }
            OBJ.numIndices = indices.length;
            GL.bindBuffer(GL.ARRAY_BUFFER, null);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
            return OBJ;
        };
        NEObject.prototype.initShader = function (target) {
            var shadertool = new shaderUtils();
            var obj = shadertool.initShaders(GL, target.vertex, target.fragment);
            if (!obj.status) {
                console.log("failed to init shader");
                return;
            }
            target.program = obj.program;
        };
        NEObject.prototype.initOBJInfo = function (target, path, callBack) {
            var obp = new OBJParser(path);
            obp.readOBJFile(path, 1 / 60, true, function () {
                var info = obp.getDrawingInfo();
                // console.log(target)
                target.vertices = info.vertices;
                target.OBJInfo = target.initVertexBuffer(info.vertices, info.colors, info.normals, info.indices);
                target.boundingBox = new BoundingBox(target);
                // console.log(this.Pipe);
                if (typeof callBack == "function")
                    callBack();
            }.bind(target));
        };
        return NEObject;
    }());
    shader.NEObject = NEObject;
})(shader || (shader = {}));
///<reference path="./Object.ts" />
var shader;
(function (shader) {
    var Cube = /** @class */ (function (_super) {
        __extends(Cube, _super);
        function Cube() {
            var _this = _super.call(this) || this;
            _this.vertex = '' +
                'attribute  vec4 a_Position;\n' +
                'attribute  vec4 a_Color;\n' +
                'attribute  vec4 a_Normal;\n' +
                'uniform    mat4 u_MvpMatrix;\n' +
                'uniform    mat4 u_ModelMatrix;\n' + // Model matrix
                'uniform    mat4 u_NormalMatrix;\n' + // Transformation matrix of the normal
                'uniform    bool u_Clicked;\n' +
                'varying    vec4 v_Color;\n' +
                'varying    vec3 v_Normal;\n' +
                'varying    vec3 v_Position;\n' +
                'void main() {\n' +
                '   gl_Position = u_MvpMatrix * a_Position;\n' +
                // Calculate the vertex position in the world coordinate
                '   v_Position = vec3(u_ModelMatrix * a_Position);\n' +
                '   v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
                '   v_Color = a_Color;\n' +
                '}\n';
            _this.fragment = '' +
                '#ifdef GL_ES\n' +
                'precision mediump float;\n' +
                '#endif\n' +
                'uniform vec3 u_LightColor;\n' + // Light color
                'uniform vec3 u_LightPosition;\n' + // Position of the light source
                'uniform vec3 u_AmbientLight;\n' + // Ambient light color
                'varying vec3 v_Normal;\n' +
                'varying vec3 v_Position;\n' +
                'varying vec4 v_Color;\n' +
                'void main() {\n' +
                // Normalize the normal because it is interpolated and not 1.0 in length any more
                '  vec3 normal = normalize(v_Normal);\n' +
                // Calculate the light direction and make its length 1.
                '  vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
                // The dot product of the light direction and the orientation of a surface (the normal)
                '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
                // Calculate the final color from diffuse reflection and ambient reflection
                '  vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n' +
                '  vec3 ambient = u_AmbientLight * v_Color.rgb;\n' +
                '  gl_FragColor = vec4(diffuse + ambient, v_Color.a);\n' +
                '}\n';
            _this.vertices = null;
            _this.colors = null;
            _this.indices = null;
            _this.normals = null;
            _this.gl = null;
            _this.program = null;
            _this.shadertool = null;
            //变量类型
            _this.u_ModelMatrix = null;
            _this.u_MvpMatrix = null;
            _this.u_NormalMatrix = null;
            _this.u_LightColor = null;
            _this.u_LightPosition = null;
            _this.u_AmbientLight = null;
            //
            _this.cube = null;
            _this.info = null;
            _this.name = 'cube';
            _this.shadertool = new shaderUtils();
            _this.gl = GL;
            var obj = _this.shadertool.initShaders(GL, _this.vertex, _this.fragment);
            if (!obj.status) {
                console.log("failed to init shader");
                return _this;
            }
            _this.program = obj.program;
            _this.initCubeInfo();
            return _this;
        }
        /**
         * 生命周期函数
         */
        // onload(){
        // }
        Cube.prototype.onUpdate = function (dt) {
            // console.log(dt)
            this._draw();
        };
        Cube.prototype._draw = function () {
            if (this.program && this.info) {
                GL.useProgram(this.program);
                var a_Position = GL.getAttribLocation(this.program, 'a_Position');
                var a_Color = GL.getAttribLocation(this.program, 'a_Color');
                var a_Normal = GL.getAttribLocation(this.program, 'a_Normal');
                var u_ModelMatrix = GL.getUniformLocation(this.program, 'u_ModelMatrix');
                var u_MvpMatrix = GL.getUniformLocation(this.program, 'u_MvpMatrix');
                var u_NormalMatrix = GL.getUniformLocation(this.program, 'u_NormalMatrix');
                var u_LightColor = GL.getUniformLocation(this.program, 'u_LightColor');
                var u_LightPosition = GL.getUniformLocation(this.program, 'u_LightPosition');
                var u_AmbientLight = GL.getUniformLocation(this.program, 'u_AmbientLight');
                if (a_Position < 0 || a_Color < 0 || a_Normal < 0) {
                    console.log('Failed to get the attribute storage location');
                    return;
                }
                if (!u_ModelMatrix || !u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition || !u_AmbientLight) {
                    console.log('Failed to get the unifrom storage location');
                    return;
                }
                this.initAttributeVariable(GL, a_Position, this.cube.vertex);
                this.initAttributeVariable(GL, a_Color, this.cube.color);
                this.initAttributeVariable(GL, a_Normal, this.cube.normal);
                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.cube.index.buffer);
                // Set the light color (white)
                GL.uniform3fv(u_LightColor, sceneInfo.LigthColor);
                // Set the light direction (in the world coordinate)
                GL.uniform3fv(u_LightPosition, sceneInfo.LigthPoint);
                // Set the ambient light
                GL.uniform3fv(u_AmbientLight, sceneInfo.AmbientLight);
                // Pass the model matrix to u_ModelMatrix
                GL.uniformMatrix4fv(u_ModelMatrix, false, this.getModelMatrix().elements);
                // Pass the model view projection matrix to u_MvpMatrix
                GL.uniformMatrix4fv(u_MvpMatrix, false, this.getMvpMatrix().elements);
                // Pass the matrix to transform the normal based on the model matrix to u_NormalMatrix
                GL.uniformMatrix4fv(u_NormalMatrix, false, this.getNormalMatrix().elements);
                // Draw the cube
                GL.drawElements(GL.TRIANGLES, this.cube.numIndices, GL.UNSIGNED_SHORT, 0);
            }
        };
        Cube.prototype.getVertex = function () {
            return this.vertex;
        };
        Cube.prototype.getFragment = function () {
            return this.fragment;
        };
        /**
         * 生成单位立方体，位于原点
         */
        Cube.prototype.initCubeInfo = function () {
            // Create a cube,
            //    v6----- v5        v0-v1-v2-v3 front
            //   /|      /|         v0-v3-v4-v5 right
            //  v1------v0|         v0-v5-v6-v1 up
            //  | |     | |         v1-v6-v7-v2 left
            //  | |v7---|-|v4       v7-v4-v3-v2 down
            //  |/      |/          v4-v7-v6-v5 back
            //  v2------v3
            //初始化顶点数组，六个面逆时针显示
            this.vertices = new Float32Array([
                0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
                0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5,
                0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
                -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5,
                -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
                0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5
            ]);
            //初始化顶点颜色
            this.colors = new Float32Array([
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0
            ]);
            //初始化各面法向量
            this.normals = new Float32Array([
                0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
                -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
                0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
                0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0
            ]);
            //初始化顶点索引=>按照顶点数组的24个元素来设置,逆时针三角形
            this.indices = new Uint16Array([
                0, 1, 2, 0, 2, 3,
                4, 5, 6, 4, 6, 7,
                8, 9, 10, 8, 10, 11,
                12, 13, 14, 12, 14, 15,
                16, 17, 18, 16, 18, 19,
                20, 21, 22, 20, 22, 23 // back
            ]);
            var obp = new OBJParser('./resources/cube.obj');
            obp.readOBJFile('./resources/cube.obj', 1, true, function () {
                this.info = obp.getDrawingInfo();
                this.vertices = this.info.vertices;
                this.normals = this.info.normals;
                this.colors = this.info.colors;
                this.indices = this.info.indices;
                this.cube = this.initVertexBuffer(this.vertices, this.colors, this.normals, this.indices);
                this.boundingBox = new BoundingBox(this);
                // console.log(this.info);
            }.bind(this));
        };
        return Cube;
    }(shader.NEObject));
    shader.Cube = Cube;
})(shader || (shader = {}));
///<reference path="./Object.ts" />
var shader;
(function (shader) {
    /**
     * 4弯头
     * 3三通
     * 2阀门
     * 1管道
     */
    var Pipe = /** @class */ (function (_super) {
        __extends(Pipe, _super);
        function Pipe(x, y, z, startPoint) {
            var _this = _super.call(this) || this;
            _this.position = new Vector3([0, 0, 0]);
            _this.initShader(_this);
            _this.initOBJInfo(_this, './resources/1/pipe.obj', function () {
                this.length = Math.sqrt(x * x + y * y + z * z);
                // this.setScale(this.length,1,1)
                this.calculate(x, y, z, startPoint);
            }.bind(_this));
            return _this;
        }
        Pipe.prototype.onLoad = function () {
            this.name = 'Pipe';
        };
        Pipe.prototype.calculate = function (x, y, z, startPoint) {
            this.direct = new Vector3([x, y, z]);
            this.setPosition(startPoint.elements[0], startPoint.elements[1], startPoint.elements[2]);
            // this.setScale(1,1,1)
            var endPoint = this.direct.add(startPoint);
            var angle1;
            var angle2;
            if (x != 0.000 && y != 0.000 && z != 0.000) {
                angle1 = Math.atan(y / x);
                angle2 = Math.atan(z / (Math.sqrt(x * x + y * y)));
                //计算基准轴向，ｘｙ向量的法向量
                var axis = new Vector3([-y / x, 1, 0]).normalize();
                this.rotateByQuaternion(new Vector3([0, 0, 1]), angle1, true);
                this.rotateByQuaternion(axis, -angle2, true);
            }
            else if (x == 0.000 && y != 0.000 && z != 0.000) {
                // console.log("1");
                angle1 = y > 0 ? Math.PI / 2 : -Math.PI / 2;
                angle2 = Math.atan(y / z);
                this.rotateByQuaternion(new Vector3([0, 0, 1]), angle1, true);
                this.rotateByQuaternion(new Vector3([0, 1, 0]), -angle2, true); //这个地方注意一下，旋转是按照本地坐标系旋转的,但是设置规模却是按照世界坐标系来的
                // console.log(angle1,angle2)
            }
            else if (x != 0.000 && y == 0.000 && z != 0.000) {
                angle1 = Math.atan(z / x);
                this.rotateByQuaternion(new Vector3([0, 1, 0]), -angle1, true);
            }
            else if (x != 0.000 && y != 0.000 && z == 0.000) {
                angle1 = Math.atan(y / x);
                this.rotateByQuaternion(new Vector3([0, 0, 1]), angle1, true);
            }
            else if (x == 0.000 && y != 0.000 && z == 0.000) {
                this.rotateByQuaternion(new Vector3([0, 0, 1]), Math.PI / 2, true);
            }
            else if (x != 0.000 && y == 0.000 && z == 0.000) {
                //nothing
            }
            else if (x == 0.000 && y == 0.000 && z != 0.000) {
                this.rotateByQuaternion(new Vector3([0, 1, 0]), -Math.PI / 2, true);
            }
            else if (x == 0.000 && y == 0.000 && z == 0.000) {
                //nothing
            }
            console.log(startPoint.elements[0], startPoint.elements[1], startPoint.elements[2]);
            return endPoint;
        };
        /**
         * 设置轴朝向
         * @param which　哪个轴为朝向，暂不实现，先用四元数
         */
        Pipe.prototype.setAxisDirection = function (which) {
        };
        Pipe.prototype.onUpdate = function (dt) {
            this._draw(this.program, this.OBJInfo);
        };
        return Pipe;
    }(shader.NEObject));
    shader.Pipe = Pipe;
    var Tee = /** @class */ (function (_super) {
        __extends(Tee, _super);
        function Tee() {
            return _super.call(this) || this;
        }
        Tee.prototype.onLoad = function () {
            this.name = 'Tee';
            this.initShader(this);
            this.initOBJInfo(this, './resources/1/tee.obj', null);
        };
        Tee.prototype.onUpdate = function (dt) {
            this._draw(this.program, this.OBJInfo);
        };
        Tee.prototype.calculate = function () {
        };
        return Tee;
    }(shader.NEObject));
    shader.Tee = Tee;
    var Elbow = /** @class */ (function (_super) {
        __extends(Elbow, _super);
        function Elbow() {
            return _super.call(this) || this;
        }
        Elbow.prototype.onLoad = function () {
            this.name = 'Elbow';
            this.initShader(this);
            this.initOBJInfo(this, './resources/1/elbow.obj', null);
        };
        Elbow.prototype.onUpdate = function (dt) {
            this._draw(this.program, this.OBJInfo);
        };
        return Elbow;
    }(shader.NEObject));
    shader.Elbow = Elbow;
    var Valve = /** @class */ (function (_super) {
        __extends(Valve, _super);
        function Valve() {
            return _super.call(this) || this;
        }
        Valve.prototype.onLoad = function () {
            this.name = 'Valve';
            this.initShader(this);
            this.initOBJInfo(this, './resources/1/valve.obj', null);
        };
        Valve.prototype.onUpdate = function (dt) {
            this._draw(this.program, this.OBJInfo);
        };
        return Valve;
    }(shader.NEObject));
    shader.Valve = Valve;
    var GLIFNode = /** @class */ (function () {
        function GLIFNode(isn, ien, ity) {
            this.UnitPool = [];
            this.startPoint = []; //存储该节点的开始位置
            this.IEN = ien;
            this.ISN = isn;
            this.ITY = ity;
        }
        return GLIFNode;
    }());
    shader.GLIFNode = GLIFNode;
})(shader || (shader = {}));
///<reference path="./Object.ts" />
var shader;
(function (shader) {
    var Cylinder = /** @class */ (function (_super) {
        __extends(Cylinder, _super);
        function Cylinder() {
            var _this = _super.call(this) || this;
            _this.vertex = '' +
                'attribute  vec4 a_Position;\n' +
                'attribute  vec4 a_Color;\n' +
                'attribute  vec4 a_Normal;\n' +
                'uniform    mat4 u_MvpMatrix;\n' +
                'uniform    mat4 u_ModelMatrix;\n' + // Model matrix
                'uniform    mat4 u_NormalMatrix;\n' + // Transformation matrix of the normal
                'uniform    bool u_Clicked;\n' +
                'varying    vec4 v_Color;\n' +
                'varying    vec3 v_Normal;\n' +
                'varying    vec3 v_Position;\n' +
                'void main() {\n' +
                '   gl_Position = u_MvpMatrix * a_Position;\n' +
                // Calculate the vertex position in the world coordinate
                '   v_Position = vec3(u_ModelMatrix * a_Position);\n' +
                '   v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
                '   v_Color = a_Color;\n' +
                '}\n';
            _this.fragment = '' +
                '#ifdef GL_ES\n' +
                'precision mediump float;\n' +
                '#endif\n' +
                'uniform vec3 u_LightColor;\n' + // Light color
                'uniform vec3 u_LightPosition;\n' + // Position of the light source
                'uniform vec3 u_AmbientLight;\n' + // Ambient light color
                'varying vec3 v_Normal;\n' +
                'varying vec3 v_Position;\n' +
                'varying vec4 v_Color;\n' +
                'void main() {\n' +
                // Normalize the normal because it is interpolated and not 1.0 in length any more
                '  vec3 normal = normalize(v_Normal);\n' +
                // Calculate the light direction and make its length 1.
                '  vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
                // The dot product of the light direction and the orientation of a surface (the normal)
                '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
                // Calculate the final color from diffuse reflection and ambient reflection
                '  vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n' +
                '  vec3 ambient = u_AmbientLight * v_Color.rgb;\n' +
                '  gl_FragColor = vec4(diffuse + ambient, v_Color.a);\n' +
                '}\n';
            _this.vertices = null;
            _this.colors = null;
            _this.indices = null;
            _this.normals = null;
            _this.gl = null;
            _this.program = null;
            _this.shadertool = null;
            //变量类型
            _this.u_ModelMatrix = null;
            _this.u_MvpMatrix = null;
            _this.u_NormalMatrix = null;
            _this.u_LightColor = null;
            _this.u_LightPosition = null;
            _this.u_AmbientLight = null;
            //
            _this.Cylinder = null;
            _this.info = null;
            _this.name = 'cylinder';
            _this.shadertool = new shaderUtils();
            _this.gl = GL;
            var obj = _this.shadertool.initShaders(GL, _this.vertex, _this.fragment);
            if (!obj.status) {
                console.log("failed to init shader");
                return _this;
            }
            _this.program = obj.program;
            _this.initCylinderInfo();
            return _this;
        }
        /**
         * 生命周期函数
         */
        // onload(){
        // }
        Cylinder.prototype.onUpdate = function (dt) {
            this._draw();
        };
        Cylinder.prototype._draw = function () {
            if (this.program && this.info) {
                GL.useProgram(this.program);
                var a_Position = GL.getAttribLocation(this.program, 'a_Position');
                var a_Color = GL.getAttribLocation(this.program, 'a_Color');
                var a_Normal = GL.getAttribLocation(this.program, 'a_Normal');
                var u_ModelMatrix = GL.getUniformLocation(this.program, 'u_ModelMatrix');
                var u_MvpMatrix = GL.getUniformLocation(this.program, 'u_MvpMatrix');
                var u_NormalMatrix = GL.getUniformLocation(this.program, 'u_NormalMatrix');
                var u_LightColor = GL.getUniformLocation(this.program, 'u_LightColor');
                var u_LightPosition = GL.getUniformLocation(this.program, 'u_LightPosition');
                var u_AmbientLight = GL.getUniformLocation(this.program, 'u_AmbientLight');
                if (a_Position < 0 || a_Color < 0 || a_Normal < 0) {
                    console.log('Failed to get the attribute storage location');
                    return;
                }
                if (!u_ModelMatrix || !u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition || !u_AmbientLight) {
                    console.log('Failed to get the unifrom storage location');
                    return;
                }
                this.initAttributeVariable(GL, a_Position, this.Cylinder.vertex);
                this.initAttributeVariable(GL, a_Color, this.Cylinder.color);
                this.initAttributeVariable(GL, a_Normal, this.Cylinder.normal);
                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.Cylinder.index.buffer);
                // Set the light color (white)
                GL.uniform3fv(u_LightColor, sceneInfo.LigthColor);
                // Set the light direction (in the world coordinate)
                GL.uniform3fv(u_LightPosition, sceneInfo.LigthPoint);
                // Set the ambient light
                GL.uniform3fv(u_AmbientLight, sceneInfo.AmbientLight);
                // Pass the model matrix to u_ModelMatrix
                GL.uniformMatrix4fv(u_ModelMatrix, false, this.getModelMatrix().elements);
                // Pass the model view projection matrix to u_MvpMatrix
                GL.uniformMatrix4fv(u_MvpMatrix, false, this.getMvpMatrix().elements);
                // Pass the matrix to transform the normal based on the model matrix to u_NormalMatrix
                GL.uniformMatrix4fv(u_NormalMatrix, false, this.getNormalMatrix().elements);
                // Draw the Cylinder
                GL.drawElements(GL.TRIANGLES, this.Cylinder.numIndices, GL.UNSIGNED_SHORT, 0);
            }
        };
        Cylinder.prototype.getVertex = function () {
            return this.vertex;
        };
        Cylinder.prototype.getFragment = function () {
            return this.fragment;
        };
        /**
         * 生成单位立方体，位于原点
         */
        Cylinder.prototype.initCylinderInfo = function () {
            var obp = new OBJParser('./resources/1/2.obj');
            obp.readOBJFile('./resources/1/2.obj', 0.1, true, function () {
                this.info = obp.getDrawingInfo();
                this.vertices = this.info.vertices;
                this.normals = this.info.normals;
                this.colors = this.info.colors;
                this.indices = this.info.indices;
                this.Cylinder = this.initVertexBuffer(this.vertices, this.colors, this.normals, this.program, this.indices);
                this.boundingBox = new BoundingBox(this);
                // console.log(this.Cylinder);
            }.bind(this));
        };
        return Cylinder;
    }(shader.NEObject));
    shader.Cylinder = Cylinder;
})(shader || (shader = {}));
///<reference path="./core/Engine.ts" />
///<reference path="./core/Scene.ts" />
///<reference path="./core/Camera.ts" />
///<reference path="./core/Render.ts" />
///<reference path="./lib/RayCaster.ts" />
///<reference path="./lib/BoundingBox.ts" />
///<reference path="../lib/shader-utils/shaderUtils.ts" />
///<reference path="../lib/matrix-utils/matrixUtils.ts" />
///<reference path="./shader/Cube.ts" />
///<reference path="./shader/Pipe.ts" />
///<reference path="./shader/Cylinder.ts" />
///<reference path="../lib/parse-utils/objParse.ts" />
///<reference path="../lib/parse-utils/GLIFParser.ts" />
var Nebula = Core.Nebula;
var Scene = Core.Scene;
var Camera = Core.Camera;
var shaderUtils = Utils.ShaderUtils;
var Matrix4 = Utils.Matrix4;
var Vector3 = Utils.Vector3;
var Vector4 = Utils.Vector4;
var cube = shader.Cube;
var Cylinder = shader.Cylinder;
var NEObject = shader.NEObject;
var OBJParser = Utils.ObjParser;
var Render = Core.Render;
var RayCaster = Lib.RayCaster;
var BoundingBox = Lib.BoundingBox;
var GLIFParser = Utils.GLIFParser;
var Pipe = shader.Pipe;
var Tee = shader.Tee;
var Elbow = shader.Elbow;
var Valve = shader.Valve;
var GLIFNode = shader.GLIFNode;
//************全局变量Global****************** */
var shaderTool = new shaderUtils();
var GL = null;
var canvas = {
    width: 1200,
    height: 800,
};
var ne = new Nebula('canvas', canvas.width, canvas.height); //gl作为全局变量
GL = ne.GL;
//场景信息
var sceneInfo = new Scene(0);
ne.addScene(sceneInfo);
ne.setScene(0);
sceneInfo.initScene();
//摄像机信息
var camera = new Camera(85, canvas.width / canvas.height, 1, 1000);
//初始化主控渲染器
var render = new Render();
//初始化GLIF解析器
// var gp = new GLIFParser(ne.getScene());
// gp.readGilfFile('./glif/inp2.TXT',"");
//******************************************* */
var Cube = new Pipe(1, 1, 0, new Vector3([0, 0, 0]));
// var cube = new Tee();
main();
function main() {
    // Cube.setTranslate(3,0,0);
    // var Pipe1 = new Pipe();
    // var cylinder = new Cylinder();
    // cylinder.setParent(Cube);
    Cube.setParent(ne.getScene());
    // cube.setRotation(90,0,0)
    // Cube.setScale(8,8,1);
    // Cube.setScale(1,8,1)
    // Pipe1.setParent(ne.getScene())
    // Pipe1.setRotation(0,0,90);
    // Cube.setRotationFromQuaternion(new Vector3([1,0,0]),Math.PI/6,true);
    render.render(sceneInfo);
    render.stopped = false; //将来可以改变为资源加载完成后自动改为false，开始update
    render.main();
    // Pipe1.setParent(ne.getScene())
    var RayCaster1 = new RayCaster();
    var ca = document.getElementById('canvas');
    var isDrag = false;
    var lastX = -1;
    var lastY = -1;
    //被选中的物体
    var objClicked = null;
    var setX = false;
    var setY = false;
    var setZ = false;
    //rotateCamera
    var rotateCamera = false;
    var testCamera = false;
    ca.onmousedown = function (ev) {
        var x = ev.layerX, y = ev.layerY;
        if (ev.layerX <= canvas.width && ev.layerX >= 0 && ev.layerY >= 0 && ev.layerY <= canvas.height) {
            isDrag = true;
        }
        lastX = x;
        lastY = y;
        var _mousex = (ev.layerX / canvas.width) * 2 - 1;
        var _mousey = -(ev.layerY / canvas.height) * 2 + 1;
        // console.log(_mousex,_mousey);
        var pointOnCanvasToNear = new Vector4([_mousex, _mousey, -1.0, 1.0]);
        var positionN = new Matrix4(null).setInverseOf(camera.projViewMatrix).multiplyVector4(pointOnCanvasToNear);
        RayCaster1.initCameraRay(camera.coordinate.x, camera.coordinate.y, camera.coordinate.z, positionN.elements[0], positionN.elements[1], positionN.elements[2], 100);
        var obj = RayCaster1.intersectObjects(ne.getScene().Child, true);
        if (!!obj) {
            objClicked = obj;
        }
        else {
            objClicked = null;
        }
        console.log(obj);
        // console.log(positionN);
    };
    ca.onmouseup = function (ev) {
        isDrag = false;
    };
    ca.onmousemove = function (ev) {
        var x = ev.clientX, y = ev.clientY;
        // console.log(ev.target)
        if (!isDrag)
            return;
        if (ev.layerX <= canvas.width && ev.layerX >= 0 && ev.layerY >= 0 && ev.layerY <= canvas.height) {
            var factor = 300 / canvas.height;
            var dx = factor * (x - lastX);
            var dy = factor * (y - lastY);
            // Cube.boundingBox.updateBoundingBox();
            if (rotateCamera) {
                camera.setCoordinatePoint(-dy / 10, -dx / 10, 14);
                camera.setPerspectiveCamera(85, canvas.width / canvas.height, 1, 1000);
                lastX = x;
                lastY = y;
                return;
            }
            if (!!objClicked) {
                if (setX) {
                    objClicked.setTranslate(dx / 20, 0, 0);
                }
                else if (setY) {
                    objClicked.setTranslate(0, -dy / 20, 0);
                }
                else if (setZ) {
                    objClicked.setTranslate(0, 0, dy / 20);
                }
            }
        }
        lastX = x;
        lastY = y;
    };
    // ca.onkeydown= function(e){
    //     console.log(e)
    // }
    //此处需要考虑不同浏览器的兼容性
    window.onmousewheel = function (e) {
        var factor = 0.1;
        if (e.deltaY < 0) { //zoom in
            camera.updateGLIFCamera(-factor);
        }
        else { //zoom out
            camera.updateGLIFCamera(factor);
        }
    }; //IE/Opera/Chrome/Safari
    //暂时使用键位来设置空间xyz位移
    window.onkeyup = function (e) {
        switch (e.code) {
            case "AltLeft":
                rotateCamera = false;
                break;
        }
    };
    window.onkeydown = function (e) {
        console.log(e.code);
        switch (e.code) {
            case "KeyZ":
                setX = true;
                setY = false;
                setZ = false;
                break;
            case "KeyX":
                setY = true;
                setZ = false;
                setX = false;
                break;
            case "KeyC":
                setZ = true;
                setY = false;
                setX = false;
                break;
                // case "KeyQ":Cube.setScale(Cube.scale.x,Cube.scale.y+0.01,Cube.scale.z)
                break;
            // case "KeyE":Cube.setScale(Cube.scale.x,Cube.scale.y-0.01,Cube.scale.z)
            // break;
            // case "KeyW":Cube.setScale(1,1,1)
            // break;
            case "AltLeft":
                rotateCamera = true;
                break;
        }
    };
}
var zero_guard = 0.00001;
function rayPickLog(val) {
    //return;
    console.log(val);
}
// var date= new Date().getTime();
// for(var i = 0; i < 2000; i++){
//   test1();
// }
// console.log(new Date().getTime()-date);
// test2();
function test1() {
    var pA = new Vector4(null);
    var pB = new Vector4(null);
    var pC = new Vector4(null);
    var endA = new Vector4(null);
    var endB = new Vector4(null);
    var out = new Vector4(null);
    pA[0] = 0;
    pA[1] = 0;
    pA[2] = 0;
    pB[0] = 2;
    pB[1] = 0;
    pB[2] = 2;
    pC[0] = 0;
    pC[1] = 2;
    pC[2] = 2;
    endA[0] = 0;
    endA[1] = 0;
    endA[2] = 2;
    endB[0] = 2;
    endB[1] = 2;
    endB[2] = 0;
    if (intersectSurfaceLine(pA, pB, pC, endA, endB, out)) {
        rayPickLog(out);
    }
    else {
        rayPickLog("error");
    }
}
function test2() {
    var pA = new Vector4(null);
    var pB = new Vector4(null);
    var pC = new Vector4(null);
    var endA = new Vector4(null);
    var endB = new Vector4(null);
    var out = new Vector4(null);
    pA[0] = 2;
    pA[1] = 0;
    pA[2] = 1;
    pB[0] = 2;
    pB[1] = 0;
    pB[2] = 2;
    pC[0] = 0;
    pC[1] = 2;
    pC[2] = 2;
    endA[0] = 0;
    endA[1] = 0;
    endA[2] = 2;
    endB[0] = 2;
    endB[1] = 2;
    endB[2] = 0;
    if (intersectSurfaceLine(pA, pB, pC, endA, endB, out)) {
        rayPickLog(out);
    }
    else {
        rayPickLog("error");
    }
}
//pA、pB、pC是三个三维点,确定一个三角形
//endA和endB是两个三维点，确定一条线段
//如果存在焦点，则返回true，out为交点
function intersectSurfaceLine(pA, pB, pC, endA, endB, out) {
    var ret = false;
    var surfaceNornal = new Vector4(null);
    var side0 = new Vector4(null);
    var side1 = new Vector4(null);
    var nLine = new Vector4(null);
    getNormal(pA, pB, side0);
    getNormal(pA, pC, side1);
    cross(surfaceNornal, side0, side1);
    if (surfaceNornal[0] == 0 && surfaceNornal[1] == 0 && surfaceNornal[2] == 0) {
        rayPickLog("surface error");
        return false;
    }
    getNormal(endA, endB, nLine);
    rayPickLog("surface normal:" + surfaceNornal);
    rayPickLog("line normal:" + nLine);
    if ((nLine[0] * surfaceNornal[0]
        + nLine[1] * surfaceNornal[1]
        + nLine[2] * surfaceNornal[2]) == 0) {
        rayPickLog("surface and line parallel");
        return false; //直线和面平行
    }
    var baseScale = -1;
    baseScale = getBaseScale(nLine);
    if (baseScale < 0) {
        rayPickLog("line error");
        return false;
    }
    rayPickLog("getBaseScale:" + baseScale.toString());
    ret = intersect(surfaceNornal, pA, nLine, endA, baseScale, out);
    if (!ret)
        return false;
    rayPickLog("out:" + out);
    ret = surfacePointInSurface(pA, pB, pC, out);
    rayPickLog("in surface:" + ret);
    return ret;
}
function getNormal(pA, pB, out) {
    out[0] = pB[0] - pA[0];
    out[1] = pB[1] - pA[1];
    out[2] = pB[2] - pA[2];
}
function getBaseScale(nAB) {
    //找到不为0的偏量
    var baseScale = null; //0 for x; 1 for y, 2 for z;
    while (1) {
        if (nAB[0] != 0) {
            baseScale = 0;
            if (nAB[0] > -zero_guard && nAB[0] < zero_guard) {
            }
            else {
                break;
            }
        }
        if (nAB[1] != 0) {
            if (baseScale == null) {
                baseScale = 1;
            }
            if (nAB[1] > -zero_guard && nAB[1] < zero_guard) {
            }
            else {
                baseScale = 1;
                break;
            }
        }
        if (nAB[2] != 0) {
            if (baseScale == null) {
                baseScale = 2;
            }
            if (nAB[2] > -zero_guard && nAB[2] < zero_guard) {
            }
            else {
                baseScale = 2;
                break;
            }
        }
        break;
    }
    if (baseScale == null)
        return -1;
    return baseScale;
}
function intersect(nSurface, point, nLine, linePoint, baseScale, out) {
    var ret = false;
    if (baseScale == 0) {
        ret = xBaseInsect(nSurface, point, nLine, linePoint, out);
    }
    else if (baseScale == 1) {
        ret = yBaseInsect(nSurface, point, nLine, linePoint, out);
    }
    else if (baseScale == 2) {
        ret = zBaseInsect(nSurface, point, nLine, linePoint, out);
    }
    return ret;
}
function xBaseInsect(nSurface, point, nLine, linePoint, out) {
    var yK = (nLine[1] / nLine[0]);
    var yT = (nLine[1] / nLine[0]) * (-linePoint[0]) + linePoint[1];
    var zK = (nLine[2] / nLine[0]);
    var zT = (nLine[2] / nLine[0]) * (-linePoint[0]) + linePoint[2];
    var surfaceK = nSurface[0] + yK * nSurface[1] + zK * nSurface[2];
    var surfaceT = (-point[0]) * nSurface[0] + (yT - point[1]) * nSurface[1] + (zT - point[2]) * nSurface[2];
    if (surfaceK == 0)
        return false;
    out[0] = (-surfaceT) / surfaceK;
    out[1] = yK * out[0] + yT;
    out[2] = zK * out[0] + zT;
    return true;
}
function yBaseInsect(nSurface, point, nLine, linePoint, out) {
    var xK = (nLine[0] / nLine[1]);
    var xT = (nLine[0] / nLine[1]) * (-linePoint[1]) + linePoint[0];
    rayPickLog("y base");
    var zK = (nLine[2] / nLine[1]);
    var zT = (nLine[2] / nLine[1]) * (-linePoint[1]) + linePoint[2];
    var surfaceK = xK * nSurface[0] + nSurface[1] + zK * nSurface[2];
    var surfaceT = (xT - point[0]) * nSurface[0] + (-point[1]) * nSurface[1] + (zT - point[2]) * nSurface[2];
    if (surfaceK == 0)
        return false;
    out[1] = (-surfaceT) / surfaceK;
    out[0] = xK * out[1] + xT;
    out[2] = zK * out[1] + zT;
    return true;
}
function zBaseInsect(nSurface, point, nLine, linePoint, out) {
    var xK = (nLine[0] / nLine[2]);
    var xT = (nLine[0] / nLine[2]) * (-linePoint[2]) + linePoint[0];
    rayPickLog("z base");
    var yK = (nLine[1] / nLine[2]);
    var yT = (nLine[1] / nLine[2]) * (-linePoint[2]) + linePoint[1];
    var surfaceK = xK * nSurface[0] + yK * nSurface[1] + nSurface[2];
    var surfaceT = (xT - point[0]) * nSurface[0] + (yT - point[1]) * nSurface[1] + (-point[2]) * nSurface[2];
    if (surfaceK == 0)
        return false;
    out[2] = (-surfaceT) / surfaceK;
    out[0] = xK * out[2] + xT;
    out[1] = yK * out[2] + yT;
    return true;
}
//面内的点，从垂直于x、y或z的面上(二维上)判断点在面以内
function surfacePointInSurface(pA, pB, pC, point) {
    var x1 = pB[0] - pA[0];
    var y1 = pB[1] - pA[1];
    var z1 = pB[2] - pA[2];
    var x2 = pC[0] - pA[0];
    var y2 = pC[1] - pA[1];
    var z2 = pC[2] - pA[2];
    var x3 = pC[0] - pB[0];
    var y3 = pC[1] - pB[1];
    var z3 = pC[2] - pB[2];
    var ret = false;
    var base = null; //
    while (1) {
        if ((y1 != 0 || z1 != 0) &&
            (y2 != 0 || z2 != 0) &&
            (y3 != 0 || z3 != 0)) {
            base = 0; //yz面
            rayPickLog("check in yz");
            break;
        }
        if ((x1 != 0 || z1 != 0) &&
            (x2 != 0 || z2 != 0) &&
            (x3 != 0 || z3 != 0)) {
            base = 1; //xz面
            rayPickLog("check in xz");
            break;
        }
        if ((x1 != 0 || y1 != 0) &&
            (x2 != 0 || y2 != 0) &&
            (x3 != 0 || y3 != 0)) {
            base = 2; //xy面
            rayPickLog("check in xy");
            break;
        }
        rayPickLog("check in no face");
        break;
    }
    if (base == null)
        return ret;
    if (base == 0) {
        //xy 面
        ret = yzPointInSurface2D(pA, pB, pC, point);
    }
    else if (base == 1) {
        ret = xzPointInSurface2D(pA, pB, pC, point);
    }
    else if (base == 2) {
        ret = xyPointInSurface2D(pA, pB, pC, point);
    }
    return ret;
}
function xyPointInSurface2D(pA, pB, pC, p) {
    var pointA = new Vector4(null);
    var pointB = new Vector4(null);
    var pointC = new Vector4(null);
    var point = new Vector4(null);
    pointA[0] = pA[0];
    pointA[1] = pA[1];
    pointB[0] = pB[0];
    pointB[1] = pB[1];
    pointC[0] = pC[0];
    pointC[1] = pC[1];
    point[0] = p[0];
    point[1] = p[1];
    return pointInSurface2D(pointA, pointB, pointC, point);
}
function yzPointInSurface2D(pA, pB, pC, p) {
    var pointA = new Vector4(null);
    var pointB = new Vector4(null);
    var pointC = new Vector4(null);
    var point = new Vector4(null);
    pointA[0] = pA[1];
    pointA[1] = pA[2];
    pointB[0] = pB[1];
    pointB[1] = pB[2];
    pointC[0] = pC[1];
    pointC[1] = pC[2];
    point[0] = p[1];
    point[1] = p[2];
    return pointInSurface2D(pointA, pointB, pointC, point);
}
function xzPointInSurface2D(pA, pB, pC, p) {
    var pointA = new Vector4(null);
    var pointB = new Vector4(null);
    var pointC = new Vector4(null);
    var point = new Vector4(null);
    pointA[0] = pA[0];
    pointA[1] = pA[2];
    pointB[0] = pB[0];
    pointB[1] = pB[2];
    pointC[0] = pC[0];
    pointC[1] = pC[2];
    point[0] = p[0];
    point[1] = p[2];
    return pointInSurface2D(pointA, pointB, pointC, point);
}
//点P在三角形内，则如果 "AB的向量*k + 则AC的向量*t = AP的向量"， 则 "k >=0, t >= 0, k + t <= 1"
function pointInSurface2D(pA, pB, pC, p) {
    rayPickLog("pointInSurface2D pA:" + pA);
    rayPickLog("pointInSurface2D pB:" + pB);
    rayPickLog("pointInSurface2D pC:" + pC);
    rayPickLog("pointInSurface2D p:" + p);
    var AB = new Vector4(null);
    var AC = new Vector4(null);
    var AP = new Vector4(null);
    var k = 0;
    var t = 0;
    AB[0] = pB[0] - pA[0];
    AB[1] = pB[1] - pA[1];
    AC[0] = pC[0] - pA[0];
    AC[1] = pC[1] - pA[1];
    AP[0] = p[0] - pA[0];
    AP[1] = p[1] - pA[1];
    //k AB[0] + t AC[0] = AP[0];
    //k AB[1] + t AC[1] = AP[1];
    var getted = false;
    while (1) {
        if (AB[0] == 0) {
            //如果 AB[0] == 0;
            if (AC[0] != 0) {
                //如果 AC[0] != 0;
                t = AP[0] / AC[0];
                if (AB[1] != 0) {
                    //
                    k = (AP[1] - t * AC[1]) / AB[1];
                    getted = true;
                    break;
                }
                //AB[1] == 0
                var val_2 = t * AC[1] - AP[1];
                if (val_2 > -zero_guard && val_2 < zero_guard) {
                    //t AC[1] == AP[1]
                    k = 0;
                    getted = true;
                    break;
                }
                //无解
                break;
            }
            //如果 AC[0] == 0;则只能通过"k AB[1] + t AC[1] = AP[1]" 求解
            if (AP[0] < -zero_guard && AP[0] > zero_guard) {
                //AP[0] != 0,使得"k AB[0] + t AC[0] = AP[0]" 左右不平等，无解
                break;
            }
            //通过"k AB[1] + t AC[1] = AP[1]" 求解
            if (AB[1] == 0) {
                k = 0;
                if (AC[1] != 0) {
                    t = AP[1] / AC[1];
                    getted = true;
                    break;
                }
                //AC[1] == 0
                if (AP[1] < -zero_guard && AP[1] > zero_guard) {
                    //AP[1] != 0,使得"k AB[1] + t AC[1] = AP[1]" 左右不平等，无解
                    break;
                }
                t = 0;
                getted = true;
                break;
            }
            //如果 AB[1] != 0
            if (AC[1] == 0) {
                k = AP[1] / AB[1];
                t = 0;
                getted = true;
                break;
            }
            //AC[1] != 0, 假设AC[1] == 0, 求之中一个解(此时应该是两条线重合了)
            k = AP[1] / AB[1];
            t = 0;
            getted = true;
            break;
        }
        //AB[0] != 0
        //据"k AB[0] + t AC[0] = AP[0]", 以t为基换算k
        var kK = (-AC[0]) / AB[0];
        var kT = AP[0] / AB[0];
        //带入"k AB[1] + t AC[1] = AP[1]"
        var nt = kK * AB[1] + AC[1];
        var val = AP[1] - kT * AB[1];
        t = val / nt;
        k = kK * t + kT;
        getted = true;
        break;
    }
    if (!getted)
        return false;
    rayPickLog("in line, t:" + t + ", k:" + k);
    if (t >= 0 && k >= 0 && t + k <= 1)
        return true;
    return false;
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2];
    var bx = b[0], by = b[1], bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
}
//# sourceMappingURL=Main.js.map