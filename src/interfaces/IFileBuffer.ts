import FileMeta from "./IFileMeta";

export default interface FileBuffer {
    content: ArrayBuffer,
    meta: FileMeta
}