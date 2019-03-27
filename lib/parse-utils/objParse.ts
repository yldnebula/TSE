namespace Utils{
    export class ObjParser{
        fileName    = null;
        mtls        = null;
        objects     = null;
        vertices    = null;
        normals     = null;
        g_objDoc    = null;
        g_drawingInfo=null;
        constructor(fileName){
          this.fileName = fileName;
          this.mtls = new Array(0);      // Initialize the property for MTL
          this.objects = new Array(0);   // Initialize the property for Object
          this.vertices = new Array(0);  // Initialize the property for Vertex
          this.normals = new Array(0);   // Initialize the property for Normal
        }

        public parse(fileString:string, scale, reverse){
            var lines = fileString.split('\n');
            lines.push(null);
            var index = 0;  //行号索引

            var currentObject = null;
            var currentMaterialName = '';
            
            var line;
            var sp = new StringParser(null);

            while ((line = lines[index++]) != null) {
                sp.init(line.trim());                  // init StringParser
                var command = sp.getWord();     // Get command
                if(command == null)	 continue;  // check null command
            
                switch(command){
                case '#':
                  continue;  // Skip comments
                case 'mtllib':     // Read Material chunk
                  var path = this.parseMtllib(sp, this.fileName);
                  var mtl = new MTLDoc();   // Create MTL instance
                  this.mtls.push(mtl);
                  var request = new XMLHttpRequest();
                  request.onreadystatechange = function() {
                    if (request.readyState == 4) {
                      if (request.status != 404) {
                        this.onReadMTLFile(request.responseText, mtl);
                      }else{
                        mtl.complete = true;
                      }
                    }
                  }.bind(this);
                  request.open('GET', path, true);  // Create a request to acquire the file
                  request.send();                   // Send the request
                  continue; // Go to the next line
                case 'o':
                case 'g':   // Read Object name
                  var object = this.parseObjectName(sp);
                  this.objects.push(object);
                  currentObject = object;
                  continue; // Go to the next line
                case 'v':   // Read vertex
                  var vertex = this.parseVertex(sp, scale);
                  this.vertices.push(vertex); 
                  continue; // Go to the next line
                case 'vn':   // Read normal
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
        }
        public parseMtllib(sp:StringParser, fileName:string){
            // Get directory path
            var i = fileName.lastIndexOf("/");
            var dirPath = "";
            if(i > 0) dirPath = fileName.substr(0, i+1);

            return dirPath + sp.getWord();   // Get path
        }
        /**
         * parseObjectName
         */
        public parseObjectName(sp:StringParser) {
          var name = sp.getWord();
          return (new OBJObject(name));
        }
        /**
         * parseVertex
         */
        public parseVertex(sp, scale) {
          var x = sp.getFloat() * scale;
          var y = sp.getFloat() * scale;
          var z = sp.getFloat() * scale;
          return (new Vertex(x, y, z));
        }
        /**
         * parseNormal
         */
        public parseNormal(sp:StringParser) {
          var x = sp.getFloat();
          var y = sp.getFloat();
          var z = sp.getFloat();
          return (new Normal(x, y, z));
        }
        /**
         * parseUsemtl
         */
        public parseUsemtl(sp:StringParser) {
          return sp.getWord();
        }
        /**
         * parseFace
         */
        public parseFace(sp, materialName, vertices, reverse) {
          var face = new Face(materialName);
          // get indices
          
          for(;;){
            var word = sp.getWord();
            if(word == null) break;
            var subWords = word.split('/');
            if(subWords.length >= 1){
              var vi = parseInt(subWords[0]) - 1;
              face.vIndices.push(vi);
            }
            if(subWords.length >= 3){//当没有贴图和法线时，nIndices压入-1
              var ni = parseInt(subWords[2]) - 1;
              face.nIndices.push(ni);
            }else{
              face.nIndices.push(-1);
            }
          }

          // calc normal
          var v0 = [
            vertices[face.vIndices[0]].x,
            vertices[face.vIndices[0]].y,
            vertices[face.vIndices[0]].z];
          var v1 = [
            vertices[face.vIndices[1]].x,
            vertices[face.vIndices[1]].y,
            vertices[face.vIndices[1]].z];
          var v2 = [
            vertices[face.vIndices[2]].x,
            vertices[face.vIndices[2]].y,
            vertices[face.vIndices[2]].z];

          var normal = calcNormal(v0, v1, v2);
          // 法線が正しく求められたか調べる
          if (normal == null) {
            if (face.vIndices.length >= 4) { // 面が四角形なら別の3点の組み合わせで法線計算
              var v3 = [
                vertices[face.vIndices[3]].x,
                vertices[face.vIndices[3]].y,
                vertices[face.vIndices[3]].z];
              normal = calcNormal(v1, v2, v3);
            }
            if(normal == null){         // 法線が求められなかったのでY軸方向の法線とする
              normal = new Float32Array([0.0, 1.0, 0.0]);
            }
          }
          if(reverse){
            normal[0] = -normal[0];
            normal[1] = -normal[1];
            normal[2] = -normal[2];
          }
          face.normal = new Normal(normal[0], normal[1], normal[2]);

          // Devide to triangles if face contains over 3 points.
          if(face.vIndices.length > 3){
            var n = face.vIndices.length - 2;//需要多少三角形来绘制
            var newVIndices = new Array(n * 3);
            var newNIndices = new Array(n * 3);
            for(var i=0; i<n; i++){
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
        }
        /**
         * isMTLComplete
         */
        public isMTLComplete() {
          if(this.mtls.length == 0) return true;
          for(var i = 0; i < this.mtls.length; i++){
            if(!this.mtls[i].complete) return false;
          }
          return true;
        }
        /**
         * findColor
         */
        public findColor(name) {
          for(var i = 0; i < this.mtls.length; i++){
            for(var j = 0; j < this.mtls[i].materials.length; j++){
              if(this.mtls[i].materials[j].name == name){
                return(this.mtls[i].materials[j].color)
              }
            }
          }
          return(new Color(0.8, 0.8, 0.8, 1));
        }
        /**
         * getDrawingInfo
         */
        public getDrawingInfo() {
            // Create an arrays for vertex coordinates, normals, colors, and indices
            var numIndices = 0;
            for(var i = 0; i < this.objects.length; i++){
              numIndices += this.objects[i].numIndices;
            }
            var numVertices = numIndices;
            var vertices = new Float32Array(numVertices * 3);
            var normals = new Float32Array(numVertices * 3);
            var colors = new Float32Array(numVertices * 4);
            var indices = new Uint16Array(numIndices);

            // Set vertex, normal and color
            var index_indices = 0;
            for(var i = 0; i < this.objects.length; i++){
              var object = this.objects[i];
              for(var j = 0; j < object.faces.length; j++){
                var face = object.faces[j];
                var color = this.findColor(face.materialName);
                var faceNormal = face.normal;
                for(var k = 0; k < face.vIndices.length; k++){
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
                  if(nIdx >= 0){
                    var normal = this.normals[nIdx];
                    normals[index_indices * 3 + 0] = normal.x;
                    normals[index_indices * 3 + 1] = normal.y;
                    normals[index_indices * 3 + 2] = normal.z;
                  }else{
                    normals[index_indices * 3 + 0] = faceNormal.x;
                    normals[index_indices * 3 + 1] = faceNormal.y;
                    normals[index_indices * 3 + 2] = faceNormal.z;
                  }
                  index_indices ++;
                }
              }
            }

            return new DrawingInfo(vertices, normals, colors, indices);
        }
            // Read a file
        readOBJFile(fileName, scale, reverse,callback) {
          var request = new XMLHttpRequest();

          request.onreadystatechange = function() {
            if (request.readyState === 4 && request.status !== 404) {
              this.onReadOBJFile(request.responseText, fileName, scale, reverse);
              if(typeof callback ==='function')callback();
            }
          }.bind(this);
          request.open('GET', fileName, true); // Create a request to acquire the file
          request.send();                      // Send the request
        }
            // OBJ File has been read
        onReadOBJFile(fileString, fileName, scale, reverse) {
          var result = this.parse(fileString, scale, reverse); // Parse the file
          if (!result) {
            this.g_objDoc = null; this.g_drawingInfo = null;
            console.log("OBJ file parsing error.");
            return;
          }
        }
        onReadMTLFile(fileString, mtl) {
          var lines = fileString.split('\n');  // Break up into lines and store them as array
          lines.push(null);           // Append null
          var index = 0;              // Initialize index of line
        
          // Parse line by line
          var line;      // A string in the line to be parsed
          var name = ""; // Material name
          var sp = new StringParser(null);  // Create StringParser
          while ((line = lines[index++]) != null) {
            sp.init(line);                  // init StringParser
            var command = sp.getWord();     // Get command
            if(command == null)	 continue;  // check null command
        
            switch(command){
            case '#':
              continue;    // Skip comments
            case 'newmtl': // Read Material chunk
              name = mtl.parseNewmtl(sp);    // Get name
              continue; // Go to the next line
            case 'Kd':   // Read normal
              if(name == "") continue; // Go to the next line because of Error
              var material = mtl.parseRGB(sp, name);
              mtl.materials.push(material);
              name = "";
              continue; // Go to the next line
            }
          }
          mtl.complete = true;
        }
            // OBJ File has been read compreatly
        onReadComplete(gl, model, objDoc) {
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
        }
    }
    export class StringParser{
        str = null;
        index= null;
        constructor(str:string){
            this.init(str)
        }
        public init(str:string){
            this.str = str;
            this.index = 0;
        }
        skipDelimiters(){
            for(var i = this.index, len = this.str.length; i < len; i++){
                var c = this.str.charAt(i);
                // Skip TAB, Space, '(', ')
                if (c == '\t'|| c == ' ' || c == '(' || c == ')' || c == '"' ||c==" ") continue;
                break;
              }
              this.index = i;
        }
        skipToNextWord(){
            this.skipDelimiters();
            var n = getWordLength(this.str, this.index);
            this.index += (n + 1);
        }
        getWord(){
            this.skipDelimiters();
            var n = getWordLength(this.str, this.index);
            if (n == 0) return null;
            var word = this.str.substr(this.index, n);
            this.index += (n + 1);
          
            return word;
        }
        getInt(){
            return parseInt(this.getWord());
        }
        getFloat(){
            return parseFloat(this.getWord());
        }
    }
    export class MTLDoc{
        complete = null;
        materials= [];
        constructor(){

        }
        public parseNewmtl(sp:StringParser){
            return sp.getWord();
        }
        public parseRGB(sp:StringParser, name){
            var r = sp.getFloat();
            var g = sp.getFloat();
            var b = sp.getFloat();
            return (new Material(name, r, g, b, 1));
        }
    }
    export class Material{
        name = null;
        color = null;
        constructor(name, r, g, b, a){
            this.name = name;
            this.color = new Color(r,g,b,a);
        }
    }
    export class Color{
        r=null;g=null;b=null;a=null;
        constructor(r,g,b,a){
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
    }
    export class Vertex{
        x=null;y=null;z=null;
        constructor(x,y,z){
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }
    export class Normal{
        x=null;y=null;z=null;
        constructor(x,y,z){
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }
    export class OBJObject{
        name = null;
        faces = null;
        numIndices = null;
        constructor(name){
            this.name = name;
            this.faces = new Array(0);
            this.numIndices = 0;
        }
        public addFace(face){
            this.faces.push(face);
            this.numIndices += face.numIndices;
        }
    }
    export class Face{
        materialName=null;
        vIndices    =null;
        nIndices    =null;
        normal      =null;
        numIndices  =null;
        constructor(materialName){
            if(materialName==null) this.materialName = '';
            this.materialName = materialName;
            this.vIndices = new Array(0);
            this.nIndices = new Array(0);
        }
    }
    export class DrawingInfo{
        vertices = null;
        normals  = null;
        colors    = null;
        indices  = null;
        constructor(vertices,normals,colors,indices){
          this.vertices = vertices;
          this.normals = normals;
          this.colors = colors;
          this.indices = indices;
        }
    }
    function getWordLength(str, start) {
        var n = 0;
        for(var i = start, len = str.length; i < len; i++){
          var c = str.charAt(i);
          if (c == '\t'|| c == ' ' || c == '(' || c == ')' || c == '"') 
          break;
        }
        return i - start;
    }
    function calcNormal(p0, p1, p2) {
        // v0: a vector from p1 to p0, v1; a vector from p1 to p2
        var v0 = new Float32Array(3);
        var v1 = new Float32Array(3);
        for (var i = 0; i < 3; i++){
          v0[i] = p0[i] - p1[i];
          v1[i] = p2[i] - p1[i];
        }
      
        // The cross product of v0 and v1
        var c = new Float32Array(3);
        c[0] = v0[1] * v1[2] - v0[2] * v1[1];
        c[1] = v0[2] * v1[0] - v0[0] * v1[2];
        c[2] = v0[0] * v1[1] - v0[1] * v1[0];
      
        // Normalize the result
        var v = new Vector3(c);
        v.normalize();
        return v.elements;
    }
    

}