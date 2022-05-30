import { FileBuffer } from '../interfaces/IFileBuffer';

const chunkSize /** in bytes */ = 32000000

/** @internal */
export async function readFile (file: File): Promise<FileBuffer> {
    const meta = {
        lastMod: file.lastModified as number,
        name: file.name,
        type: file.type
    }
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            resolve({
                meta,
                content: (reader.result) ? reader.result as ArrayBuffer : new ArrayBuffer(0)
            })
        }
        reader.onerror = reject;
        reader.readAsArrayBuffer(file)
        // (mode?.toLowerCase() === 'buffer') ? reader.readAsArrayBuffer(file) : reader.readAsText(file)
    })
}

/** @internal */
export function chunky (source: ArrayBuffer): ArrayBuffer[] {
    const len = source.byteLength
    const count = Math.ceil(len / chunkSize)

    if (count === 1) {
        return [source]
    } else {
        const ret = []
        for (let i = 0; i < count; i++) {
            const startIndex = i * chunkSize
            const endIndex = (i + 1) * chunkSize
            ret.push(source.slice(startIndex, endIndex))
        }
        return ret
    }
}

