namespace Lib{
    /**
     * 资源加载类
     */
    export class AssetsLoader{
        obj = {};
        constructor(){

        }
        static async loadAssets(obj: { [s: string]: Promise<any> }) {
            let arr: Array<Promise<any>> = [];
            let map = {} as any;
            let i = 0;
            for (let x in obj) {
                arr.push(obj[x]);
                map[i++] = x;
            }
            let x = await Promise.all(arr);
            let loader = new AssetsLoader();
            x.forEach((x, i) => {
                loader.set(map[i], x);
            });
            return loader;
        }
        get<T= any>(name: string): T {
            return this.obj[name];
        }
        private set(name: string, p: any) {
            this.obj[name] = p;
        }
    }
}