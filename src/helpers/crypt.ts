const keyAlgo = {
    name: 'AES-GCM',
    length: 256,
}

/** @internal */
export function genIv (length = 16): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(length))
}

/** @internal */
export async function aescrypt (data: Uint8Array, iv: Uint8Array, mode?: string): Promise<ArrayBuffer> {
    const key = await crypto.subtle.generateKey(keyAlgo, true, ['encrypt', 'decrypt'])
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
