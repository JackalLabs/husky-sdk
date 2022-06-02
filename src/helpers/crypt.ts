import {randomCaseString} from "make-random";

const keyAlgo = {
    name: 'AES-GCM',
    length: 256,
}

/** @internal */
export function genIv (length = 16): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(length))
}

/** @internal */
export function genKey (): Promise<CryptoKey> {
    return crypto.subtle.generateKey(keyAlgo, true, ['encrypt', 'decrypt'])
}

/** @internal */
export async function aescrypt (data: Uint8Array, iv: Uint8Array, key: CryptoKey, mode?: string): Promise<ArrayBuffer> {
    const algo = {
        name: 'AES-GCM',
        iv
    }

    if (mode?.toLowerCase() === 'encrypt') {
        return await crypto.subtle.encrypt(algo, key, data)
            .catch(err => {
                throw new Error(err)
            })
    } else {
        return await crypto.subtle.decrypt(algo, key, data)
            .catch(err => {
                throw new Error(err)
            })
    }
}

/** @internal */
export async function buildEncryptedFile (fileData: ArrayBuffer, fileName: string, iv: Uint8Array, key: CryptoKey): Promise<File> {
    return aescrypt(new Uint8Array(fileData), iv, key, 'encrypt')
        .then(async (encrypted) => {
            const content = new Blob([new Uint8Array(encrypted)], { endings: 'native' })
            return new File([content], `${await oneWayString(fileName)}.jkl`, { type: 'text/plain' })
        })

}

/** @internal */
export async function oneWayString (toHash: string): Promise<string> {
    return crypto.subtle.digest('sha-256', (new TextEncoder()).encode(toHash).buffer)
        .then(buf => (new TextDecoder()).decode(new Uint8Array(buf)))
}
