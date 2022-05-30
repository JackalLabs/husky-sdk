import {ProcessedNodeResponse} from "../interfaces/IProcessedNodeResponse";
import {PushConfig} from "../interfaces/IPushConfig";

/** @internal */
async function push (url: string, config: PushConfig): Promise<void> {
    fetch(url, config)
        .then(res => res)
        .catch(err => {
            throw new Error(err)
        })
}

/** @internal */
export async function pushPostJson (url: string, payload: unknown): Promise<void> {
    push(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(res => res)
        .catch(err => {
            throw new Error(err)
        })
}

/** @internal */
export async function pushPostForm (url: string, payload: FormData): Promise<void> {
    push(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload
    })
        .then(res => res)
        .catch(err => {
            throw new Error(err)
        })
}

/** @internal */
export async function pushPutForm (url: string, payload: FormData): Promise<void> {
    push(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload
    })
        .then(res => res)
        .catch(err => {
            throw new Error(err)
        })
}

/** @internal */
export async function pull (url: string): Promise<ProcessedNodeResponse> {
    return fetch(url)
        .then(res => ({
                header: res.headers,
                response: res.json()
            }))
        .then(res => res as ProcessedNodeResponse)
        .catch(err => {
            throw new Error(err)
        })
}


