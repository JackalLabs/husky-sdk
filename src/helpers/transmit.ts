import {ProcessedNodeResponse} from "../interfaces/IProcessedNodeResponse";
import {PushConfig} from "../interfaces/IPushConfig";
import FormData from "form-data";
import NodeResponse from "../interfaces/INodeTypes/INodeResponse";
import NodeUploadResponse from "../interfaces/INodeTypes/INodeUploadResponse";

/** @internal */
async function push (url: string, config: PushConfig): Promise<Response> {
    return fetch(url, config)
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
export async function jklNodePost(url: string, formData: any): Promise<NodeUploadResponse> {
    return push(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
    })
        .then(async (res) => ({
            header: res.headers,
            content: await res.json() as NodeResponse
        }))
        .then(res => {
            if (res.content.message) {
                throw new Error(res.content.message)
            } else {
                return res.content.data as NodeUploadResponse
            }
        })
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


