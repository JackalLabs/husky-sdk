import {FileMeta} from "./IFileMeta";

export interface FileBuffer {
    content: ArrayBuffer,
    meta: FileMeta
}