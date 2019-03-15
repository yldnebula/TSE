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
         * @param far 视点到源建材面的距离，为正值
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
var Utils;
(function (Utils) {
    var ObjParser = /** @class */ (function () {
        function ObjParser() {
            this.fileName = null;
            this.mtls = null;
            this.objects = null;
            this.vertices = null;
            this.normals = null;
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
                sp.init(line); // init StringParser
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
                                    onReadMTLFile(request.responseText, mtl);
                                }
                                else {
                                    mtl.complete = true;
                                }
                            }
                        };
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
                if (c == '\t' || c == ' ' || c == '(' || c == ')' || c == '"')
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
            this.materials = null;
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
        function Face() {
            this.materialName = null;
            this.vIndices = null;
        }
        return Face;
    }());
    Utils.Face = Face;
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
            this.projectMatrix = null;
            this.eye = {
                x: 6,
                y: 6,
                z: 14
            };
            this.center = {
                x: 0,
                y: 0,
                z: 0
            };
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
        Nebula.prototype.setEyePoint = function (x, y, z) {
            this.eye.x = x;
            this.eye.y = y;
            this.eye.z = z;
        };
        Nebula.prototype.setAtCenter = function (x, y, z) {
            this.center.x = x;
            this.center.y = y;
            this.center.z = z;
        };
        /**
         * 设置透视摄像机
         */
        Nebula.prototype.setPerspectiveCamera = function (fovy, near, far) {
            this.projectMatrix = new Matrix4(null);
            this.projectMatrix.setPerspective(fovy, canvas.width / canvas.height, near, far);
            this.projectMatrix.lookAt(this.eye.x, this.eye.y, this.eye.z, this.center.x, this.center.y, this.center.z, 0, 1, 0);
            sceneInfo.projViewMatrix = this.projectMatrix;
        };
        /**
         * 设置正视摄像机
         */
        Nebula.prototype.setOrthoCamera = function () {
        };
        Nebula.prototype.setLightTypeColorPoint = function (type, color, point) {
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
    var Event = /** @class */ (function () {
        function Event() {
        }
        Event.prototype.emit = function () {
        };
        Event.prototype.listen = function () {
        };
        /**
         * 鼠标事件
         */
        Event.prototype.onMouseMove = function () {
        };
        Event.prototype.onMouseDown = function () {
        };
        Event.prototype.onMouseUp = function () {
        };
        Event.prototype.onMouseClick = function () {
        };
        return Event;
    }());
    Core.Event = Event;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var SceneInfo = /** @class */ (function () {
        function SceneInfo() {
            this.SceneInfo = null;
            this.LigthColor = new Float32Array([1.0, 1.0, 1.0]);
            this.LigthPoint = new Float32Array([2.3, 4.0, 3.5]);
            this.AmbientLight = new Float32Array([0.2, 0.2, 0.2]);
            this.projViewMatrix = null;
            if (SceneInfo.instanceCount == 0) {
                SceneInfo.instanceCount++;
                this.SceneInfo = new SceneInfo();
                return this.SceneInfo;
            }
            else {
                return this.SceneInfo;
            }
        }
        ;
        SceneInfo.prototype.initScene = function () {
            GL.clearColor(0, 0, 0, 1.0);
            GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
            GL.enable(GL.DEPTH_TEST);
        };
        SceneInfo.instanceCount = 0;
        return SceneInfo;
    }());
    Core.SceneInfo = SceneInfo;
})(Core || (Core = {}));
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
            this._modelMatrix = new Matrix4(null); //模型矩阵
            this._mvpMatrix = new Matrix4(null); //模型视图投影矩阵
            this._normalMatrix = new Matrix4(null); //法向量变换矩阵
            this.onload();
            this._loop();
        }
        NEObject.prototype.onload = function () {
        };
        NEObject.prototype.onUpdate = function () {
            this._draw();
        };
        NEObject.prototype._draw = function () {
        };
        NEObject.prototype._loop = function () {
            this.onUpdate();
            requestAnimationFrame(this._loop.bind(this));
        };
        NEObject.prototype.onDestroy = function () {
        };
        NEObject.prototype.setTranslate = function (x, y, z) {
            this.coordinate.x += x;
            this.coordinate.y += y;
            this.coordinate.z += z;
            this._modelMatrix.translate(x, y, z);
            this._mvpMatrix.set(sceneInfo.projViewMatrix).multiply(this._modelMatrix);
            this._normalMatrix.setInverseOf(this._modelMatrix);
            this._normalMatrix.transpose();
        };
        NEObject.prototype.setScale = function (x, y, z) {
            this.scale.x = x;
            this.scale.y = y;
            this.scale.z = z;
            this._modelMatrix.scale(x, y, z);
            this._mvpMatrix.set(sceneInfo.projViewMatrix).multiply(this._modelMatrix);
            this._normalMatrix.setInverseOf(this._modelMatrix);
            this._normalMatrix.transpose();
        };
        NEObject.prototype.setRotation = function (x, y, z) {
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
            this._mvpMatrix.set(sceneInfo.projViewMatrix).multiply(this._modelMatrix);
            this._normalMatrix.setInverseOf(this._modelMatrix);
            this._normalMatrix.transpose();
        };
        NEObject.prototype.getModelMatrix = function () {
            return this._modelMatrix;
        };
        NEObject.prototype.getMvpMatrix = function () {
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
                '   if(u_Clicked){' +
                '       v_Color = vec4(1.0, 1.0, 0.0, 1.0);' +
                '   }else{' +
                '       v_Color = a_Color;' +
                '   }' +
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
            _this.shadertool = new shaderUtils();
            _this.gl = GL;
            var obj = _this.shadertool.initShaders(GL, _this.vertex, _this.fragment);
            if (!obj.status) {
                console.log("failed to init shader");
                return _this;
            }
            _this.program = obj.program;
            _this.initCubeInfo();
            _this.cube = _this.initVertexBuffer(_this.vertices, _this.colors, _this.normals, _this.program, _this.indices);
            return _this;
        }
        /**
         * 生命周期函数
         */
        // onload(){
        // }
        // onUpdate(){
        // }
        Cube.prototype._draw = function () {
            if (this.program) {
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
                GL.drawElements(GL.TRIANGLES, this.cube.numIndices, GL.UNSIGNED_BYTE, 0);
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
            this.indices = new Uint8Array([
                0, 1, 2, 0, 2, 3,
                4, 5, 6, 4, 6, 7,
                8, 9, 10, 8, 10, 11,
                12, 13, 14, 12, 14, 15,
                16, 17, 18, 16, 18, 19,
                20, 21, 22, 20, 22, 23 // back
            ]);
        };
        /**
         * 初始化obj数据，全局只需绑定一次
         * @param vertices 顶点矩阵
         * @param colors 颜色矩阵
         * @param normals 法向量矩阵
         * @param program　对应的着色器程序
         * @param indices 索引矩阵
         */
        Cube.prototype.initVertexBuffer = function (vertices, colors, normals, program, indices) {
            var cubeObj = {
                vertex: null,
                color: null,
                normal: null,
                index: null,
                numIndices: null,
            };
            cubeObj.vertex = this.initArrayBufferForLaterUse(GL, vertices, 3, GL.FLOAT);
            cubeObj.color = this.initArrayBufferForLaterUse(GL, colors, 3, GL.FLOAT);
            cubeObj.normal = this.initArrayBufferForLaterUse(GL, normals, 3, GL.FLOAT);
            cubeObj.index = this.initElementArrayBufferForLaterUse(GL, indices, GL.UNSIGNED_BYTE);
            if (!cubeObj.vertex || !cubeObj.color || !cubeObj.normal || !cubeObj.index) {
                console.log("failed to init buffer");
                return null;
            }
            cubeObj.numIndices = indices.length;
            GL.bindBuffer(GL.ARRAY_BUFFER, null);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
            return cubeObj;
        };
        return Cube;
    }(shader.NEObject));
    shader.Cube = Cube;
})(shader || (shader = {}));
///<reference path="./core/Engine.ts" />
///<reference path="./core/Scene.ts" />
///<reference path="../lib/shader-utils/shaderUtils.ts" />
///<reference path="../lib/matrix-utils/matrixUtils.ts" />
///<reference path="./shader/Cube.ts" />
var Nebula = Core.Nebula;
var SceneInfo = Core.SceneInfo;
var shaderUtils = Utils.ShaderUtils;
var Matrix4 = Utils.Matrix4;
var Vector3 = Utils.Vector3;
var Vector4 = Utils.Vector4;
var cube = shader.Cube;
var NEObject = shader.NEObject;
//************全局变量Global****************** */
var shaderTool = new shaderUtils();
var GL = null;
var sceneInfo = new SceneInfo();
var canvas = {
    width: 400,
    height: 400,
};
//************ */
main();
function main() {
    var ne = new Nebula('canvas', canvas.width, canvas.height); //gl作为全局变量
    GL = ne.GL;
    ne.setPerspectiveCamera(30, 1, 100);
    sceneInfo.initScene();
    var Cube = new cube();
    Cube.setScale(1, 1, 1);
    var cube2 = new cube();
    cube2.setTranslate(0, 3, 0);
    var cube3 = new cube();
    cube3.setRotation(20, 10, 10);
    cube3.setTranslate(0, 0, 3);
    var ca = document.getElementById('canvas');
    var isDrag = false;
    var lastX = -1;
    var lastY = -1;
    var currentAngle = [0.0, 0.0];
    var isPick = 0;
    ca.onmousedown = function (ev) {
        var x = ev.layerX, y = ev.layerY;
        if (ev.layerX <= canvas.width && ev.layerX >= 0 && ev.layerY >= 0 && ev.layerY <= canvas.height) {
            isDrag = true;
        }
        var pixels = new Uint8Array(4);
        GL.readPixels(x, y, 1, 1, GL.RGBA, GL.UNSIGNED_BYTE, pixels); //tap点像素颜色测试
        console.log(pixels);
        if (pixels[0] == 255) {
            isPick = 1;
            console.log("pick");
        }
    };
    ca.onmouseup = function (ev) {
        var x = ev.clientX, y = ev.clientY;
        isDrag = false;
    };
    ca.onmousemove = function (ev) {
        var x = ev.clientX, y = ev.clientY;
        // console.log(ev.target)
        if (!isDrag)
            return;
        if (ev.layerX <= canvas.width && ev.layerX >= 0 && ev.layerY >= 0 && ev.layerY <= canvas.height) {
            var factor = 100 / canvas.height;
            var dx = factor * (x - lastX);
            var dy = factor * (y - lastY);
            Cube.setRotation(0, dx, 0);
            cube2.setRotation(0, dx, 0);
            cube3.setRotation(0, dx, 0);
            // Cube._draw();
        }
        lastX = x;
        lastY = y;
    };
}
var Core;
(function (Core) {
    var Camera = /** @class */ (function () {
        function Camera() {
        }
        return Camera;
    }());
    Core.Camera = Camera;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Render = /** @class */ (function () {
        function Render() {
        }
        return Render;
    }());
    Core.Render = Render;
})(Core || (Core = {}));
//# sourceMappingURL=Main.js.map