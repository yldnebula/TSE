

namespace Utils{
    export class GLIFParser{

        startPoint:Vector3;
        IWD:number = 2;//弯单元缺省值,包含弯单元半斤；１表示不包含
        Node = null;

        Scene = null;
        constructor(scene:Scene){
            this.Scene = scene;
        }

        readGilfFile(fileName,callback){
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (request.readyState == 4) {
                    if (request.status != 404) {
                        this.onReadFile(request.responseText);
                        if(typeof callback ==='function')callback();
                    }
                }
            }.bind(this);
            request.open('GET', fileName, true);  // Create a request to acquire the file
            request.send(); 
        }
        onReadFile(fileString){
            var result = this.parse(fileString); // Parse the file
            if (!result) {
                console.log("GLIF file parsing error.");
                return;
            }
        }
        parse(fileString:string):boolean{
            var ret = true;
            // console.log(fileString);
            var line = fileString.split('\n');
            var vaildLine:Array<Array<string>> = [];
            for(var l of line){
                l=l.trim();
                vaildLine.push(l.split(','));
            }
            this.parseLog("startParse")
            var count = 0;
            var nowLine = vaildLine[count];
            while(!!nowLine[0]){
                var nowLine = vaildLine[count];
                var tag = nowLine[0];
                // this.parseLog(nowLine);
                switch(tag){
                    case "-1":
                        this.parseBentUnitInfo(nowLine);
                        count++;
                    break;//是否包含弯管半径
                    case "100":
                        this.parseStartPoint(nowLine);
                        count++;
                    break;//空间起始位置
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
                        while(!!vaildLine[partCount][0]){
                            nodeInfo.push(vaildLine[partCount++]);
                        }
                        this.Node = this.parse3DInfo(nodeInfo);
                        
                        count = partCount;
                    break;//读取管道节点
                    case "60":
                        this.parsePipeInfo(nowLine);
                        count++;
                    break;//管道外径和厚度
                    case "61":
                        this.parsePipeInfo(nowLine);
                        count++;
                    break;
                    default:count++;
                }
            }
            for(var i = 0; i < this.Node.length;i++){
                this.parseNode(this.Node[i]);
            }
            render.renderScene(ne.getScene())
            render.loadAsset();
            render.main()
            return ret;
        }
        /**
         * 解析弯单元信息
         */
        parseBentUnitInfo(line:string[]){
            this.parseLog("弯单元数据");
            this.parseLog(line);

            if(line.length == 1){//设置默认值２
                return;
            }else{
                this.IWD = parseInt(line[1]);
            }
        }
        /**
         * 解析空间起始位置
         */
        parseStartPoint(line:string[]){
            var x = parseFloat(line[1]), y= parseFloat(line[2]),z=parseFloat(line[3]);
            this.startPoint = new Vector3([x,y,z]);
            this.parseLog("起始点");
            this.parseLog(this.startPoint);

        }
        /**
         * 从第一个10开始的所有空间节点数据
         */
        parse3DInfo(nodeInfo:string[][]){
            this.parseLog(nodeInfo);
            var nodes = [];//元素为一个节点数据，并且严格遵守顺序
            var oneNode = [];
            for(var i = 0; i <nodeInfo.length;i++){
                var nowLine = nodeInfo[i]
                if(!this.isNodeInfo(nowLine)){
                    //表示一个新的节点或者,一条约束,如10,或者260,70,90
                    if(nowLine[0] == "10"){
                        oneNode.push(nowLine);
                        var innerCount = i+1;
                        while(innerCount<nodeInfo.length){
                            if(this.isNodeInfo(nodeInfo[innerCount])){
                                oneNode.push(nodeInfo[innerCount]);
                                innerCount++;
                            }else{
                                i = innerCount-1;
                                break;
                            }
                        }
                        nodes.push(oneNode);oneNode = [];
                    }else{
                        
                        nodes.push([nowLine]);//如果非10，算作一个节点信息，无论是不是节点附加属性
                    }
                }
            }
            this.parseLog("格式化节点数据");
            this.parseLog(nodes);
            return nodes;
        }
        /**
         * 判定当前行是否是节点内的内容，60,61可以出现在节点内
         */
        isNodeInfo(nowLine:string[]){
            if(
            nowLine[0] == "0"||nowLine[0] == "1"||nowLine[0] == "2"||
            nowLine[0] == "3"||nowLine[0] == "4"||nowLine[0] == "5"||
            nowLine[0] == "6"||nowLine[0] == "61"||nowLine[0] == "60"
            ){
                return true;//是节点外的内容
            }else{
                return false;//节点内的内容
            }
        }
        /**
         * 10开头的一段数据,期望参数为整段数据,或者为260,70,90开头的数据
         * 10,7,8,81
                1,1,1,0.000,-0.441,-0.066
                0,1,1,0.457,81.494,1
                1,1,1,0.000,0.000,-2.618
                4,1,1,0.000,0.000,-0.500,477.9,0.000
                1,1,1,0.000,0.000,-0.700
         *　例子
         */
        parseNode(lines:string[][]){
            if(lines[0][0] == "10"){
                // this.parseLog("节点段数据");
                // this.parseLog(lines);
    
                var pipes = lines;
                var lastNode = parseInt(pipes[0][1]);
                var nextNode = parseInt(pipes[0][2]);
                var restraint = parseInt(pipes[0][3]);
                var GlifNode = new GLIFNode(lastNode,nextNode,restraint)
                // console.log(this.startPoint)
                for(var i = 1; i < pipes.length; i++){
                    var tag = pipes[i][0];
                    switch(tag){
                        case "0"://处理弯单元
                            var info = pipes[i-1];
                            GlifNode.UnitPool.push(this.parseBendingUnit(pipes[i],this.Scene,
                                new Vector3(parseFloat(info[3]), parseFloat(info[4]), parseFloat(info[5]))));
                        break;
                        case "1"://处理直单元
                            GlifNode.UnitPool.push(this.parseDirectUnit(pipes[i],this.Scene))
                            break;
                        case "2":
                        
                        break;
                        case "3":
                        
                        break;
                        case "4":
                            GlifNode.UnitPool.push(this.parseDirectUnit(pipes[i],this.Scene))
                        
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
                        default:console.error("cannot parse '10'tag node");
                    }
                }
                this.parseLog(GlifNode.UnitPool)
            }else{
                //260,70,90信息，undo
                this.parseLog(lines);
            }
            

        }
        /**
         * 60,61开头的一段数据
         */
        parsePipeInfo(line:string[]){
            // this.parseLog("６０数据");
            // this.parseLog(line);

        }
        /**
         * 处理直单元
         * @param info 
         */
        parseDirectUnit(info:string[], scene:Scene){
            if(!!scene){
                var pipe = new Pipe(parseFloat(info[3]), parseFloat(info[4]), 
                parseFloat(info[5]),this.startPoint);
                pipe.IS = parseInt(info[1]);
                pipe.IE = parseInt(info[2]);
                this.startPoint = new Vector3([parseFloat(info[3]), parseFloat(info[4]), 
                parseFloat(info[5])]).add(this.startPoint)//计算新的管道，并且更新新的起始位置
                
                
                
                scene.addChild(pipe);
                // render.render(scene);
                return pipe;
            }
        }
        /**
         * 处理弯单元
         */
        parseBendingUnit(info, scene,direct){
            if(!!scene){
                var elbow = new Elbow(this.startPoint,direct);//弯单元不改变下一个的位置
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
        }
        /**
         * 自定义输出
         * @param val 
         */
        parseLog(val){
            //console.log(val)
        }
    }
}