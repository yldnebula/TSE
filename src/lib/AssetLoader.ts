namespace Lib{
    /**
     * 资源加载类
     */
    export class AssetsLoader{
        assets = {};
        constructor(){

        }
        static async loadAssets(assets: { [s: string]: Promise<any> }) {
            let promiseArr: Array<Promise<any>> = [];
            let maps = {} as any;
            let i = 0;
            for (let x in assets) {
                promiseArr.push(assets[x]);
                maps[i++] = x;
            }
            let x = await Promise.all(promiseArr);
            let loader = new AssetsLoader();
            x.forEach((x, i) => {
                loader.set(maps[i], x);
            });
            return loader;
        }
        get<T= any>(assetName: string): T {
            return this.assets[assetName];
        }
        private set(assetName: string, p: any) {
            this.assets[assetName] = p;
        }
    }
}