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
/**
 * 单例着色器工具类
 */
var Utils;
(function (Utils) {
    var ShaderUtils = /** @class */ (function () {
        function ShaderUtils() {
            this.shaderUtils = null;
            if (ShaderUtils.instanceCount == 0) {
                ShaderUtils.instanceCount++;
                this.shaderUtils = new ShaderUtils();
                return this.shaderUtils;
            }
            else {
                return this.shaderUtils;
            }
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
            gl.useProgram(program);
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
var Engine;
(function (Engine) {
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
        return Nebula;
    }());
    Engine.Nebula = Nebula;
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
            GL.enable(GL.DEPTH_TEST);
        };
        SceneInfo.instanceCount = 0;
        return SceneInfo;
    }());
    Engine.SceneInfo = SceneInfo;
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
    Engine.Event = Event;
})(Engine || (Engine = {}));
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
        }
        NEObject.prototype.init = function () {
        };
        NEObject.prototype.setTranslate = function (x, y, z) {
            this.coordinate.x += x;
            this.coordinate.y += y;
            this.coordinate.z += z;
            this._modelMatrix.translate(x, y, z);
            this._mvpMatrix = sceneInfo.projViewMatrix.multiply(this._modelMatrix);
            this._normalMatrix.setInverseOf(this._modelMatrix);
            this._normalMatrix.transpose();
        };
        NEObject.prototype.setScale = function (x, y, z) {
            this.scale.x = x;
            this.scale.y = y;
            this.scale.z = z;
            this._modelMatrix.scale(x, y, z);
            this._mvpMatrix = sceneInfo.projViewMatrix.multiply(this._modelMatrix);
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
            this._mvpMatrix = sceneInfo.projViewMatrix.multiply(this._modelMatrix);
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
        NEObject.prototype.onDestroy = function () {
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
            _this.shadertool = new shaderUtils();
            _this.gl = GL;
            var obj = _this.shadertool.initShaders(GL, _this.vertex, _this.fragment);
            if (!obj.status) {
                console.log("failed to init shader");
                return _this;
            }
            _this.program = obj.program;
            _this.initCubeInfo();
            _this.update(0);
            return _this;
        }
        Cube.prototype.update = function (isClicked) {
            var n = this.initVertexBuffer();
            var u_ModelMatrix = this.gl.getUniformLocation(this.program, 'u_ModelMatrix');
            var u_MvpMatrix = this.gl.getUniformLocation(this.program, 'u_MvpMatrix');
            var u_NormalMatrix = this.gl.getUniformLocation(this.program, 'u_NormalMatrix');
            var u_LightColor = this.gl.getUniformLocation(this.program, 'u_LightColor');
            var u_LightPosition = this.gl.getUniformLocation(this.program, 'u_LightPosition');
            var u_AmbientLight = this.gl.getUniformLocation(this.program, 'u_AmbientLight');
            var u_Clicked = this.gl.getUniformLocation(this.program, 'u_Clicked');
            if (!u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition || !u_AmbientLight || !u_Clicked) {
                console.log('Failed to get the storage location');
                return;
            }
            this.gl.uniform1i(u_Clicked, isClicked);
            // Set the light color (white)
            this.gl.uniform3fv(u_LightColor, sceneInfo.LigthColor);
            // Set the light direction (in the world coordinate)
            this.gl.uniform3fv(u_LightPosition, sceneInfo.LigthPoint);
            // Set the ambient light
            this.gl.uniform3fv(u_AmbientLight, sceneInfo.AmbientLight);
            // Pass the model matrix to u_ModelMatrix
            this.gl.uniformMatrix4fv(u_ModelMatrix, false, this.getModelMatrix().elements);
            // Pass the model view projection matrix to u_MvpMatrix
            this.gl.uniformMatrix4fv(u_MvpMatrix, false, this.getMvpMatrix().elements);
            // Pass the matrix to transform the normal based on the model matrix to u_NormalMatrix
            this.gl.uniformMatrix4fv(u_NormalMatrix, false, this.getNormalMatrix().elements);
            // Clear color and depth buffer
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            // Draw the cube
            this.gl.drawElements(this.gl.TRIANGLES, n, this.gl.UNSIGNED_BYTE, 0);
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
        Cube.prototype.initVertexBuffer = function () {
            if (!this.initArrayBuffer(this.gl, 'a_Position', this.vertices, 3, this.gl.FLOAT))
                return -1;
            if (!this.initArrayBuffer(this.gl, 'a_Color', this.colors, 3, this.gl.FLOAT))
                return -1;
            if (!this.initArrayBuffer(this.gl, 'a_Normal', this.normals, 3, this.gl.FLOAT))
                return -1;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
            var indexBuffer = this.gl.createBuffer();
            if (!indexBuffer) {
                console.log("failed to create index buffer of vertex");
                return -1;
            }
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.STATIC_DRAW);
            return this.indices.length;
        };
        Cube.prototype.initArrayBuffer = function (gl, attribute, data, num, type) {
            var buffer = this.gl.createBuffer();
            if (!buffer) {
                console.log("failed to create the buffer object!");
                return false;
            }
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
            var a_attribute = gl.getAttribLocation(this.program, attribute);
            if (a_attribute < 0) {
                console.log("failed to get location of " + a_attribute);
                return false;
            }
            this.gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
            this.gl.enableVertexAttribArray(a_attribute);
            return true;
        };
        return Cube;
    }(shader.NEObject));
    shader.Cube = Cube;
})(shader || (shader = {}));
///<reference path="./core/Engine.ts" />
///<reference path="../lib/shader-utils/shaderUtils.ts" />
///<reference path="../lib/matrix-utils/matrixUtils.ts" />
///<reference path="./shader/Cube.ts" />
var Nebula = Engine.Nebula;
var SceneInfo = Engine.SceneInfo;
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
    Cube.setScale(4, 4, 4);
    Cube.update(0);
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
        GL.readPixels(x, y, 1, 1, GL.RGBA, GL.UNSIGNED_BYTE, pixels);
        console.log(pixels);
        if (pixels[0] == 255) {
            isPick = 1;
            console.log("pick");
            Cube.update(isPick);
        }
    };
    ca.onmouseup = function (ev) {
        var x = ev.clientX, y = ev.clientY;
        isDrag = false;
    };
    ca.onmousemove = function (ev) {
        var x = ev.clientX, y = ev.clientY;
        if (!isDrag)
            return;
        if (ev.layerX <= canvas.width && ev.layerX >= 0 && ev.layerY >= 0 && ev.layerY <= canvas.height) {
            var factor = 0.01 / canvas.height;
            var dx = factor * (x - lastX);
            var dy = factor * (y - lastY);
            currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90), -90);
            currentAngle[1] = currentAngle[1] + dx;
            Cube.setRotation(currentAngle[0], currentAngle[1], 0);
            Cube.update(isPick);
        }
        lastX = x;
        lastY = y;
    };
}
//# sourceMappingURL=Main.js.map