import generateUUID = Utils.generateUUID;

namespace Core{
    export class NElement {
        uuid = generateUUID();
        name = '';
        tag: string[] = [];
        enabled = true;
    }
}
