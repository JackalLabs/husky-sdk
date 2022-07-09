import FileMeta from "./IFileMeta";

export default interface FilePartBundle {
    meta: FileMeta,
    [key: number]: {
        cid: string,
        dataId: string,
        miners: string[]
    }
}