namespace Utils{
    export class ObjParser{
        fileName    = null;
        mtls        = null;
        objects     = null;
        vertices    = null;
        normals     = null;

        constructor(){

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
                sp.init(line);                  // init StringParser
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
                        onReadMTLFile(request.responseText, mtl);
                      }else{
                        mtl.complete = true;
                      }
                    }
                  }
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
                if (c == '\t'|| c == ' ' || c == '(' || c == ')' || c == '"') continue;
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
        materials= null;
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