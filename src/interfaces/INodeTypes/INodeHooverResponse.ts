import NodeCoreUploadResponse from "./INodeCoreUploadResponse";

export default interface NodeHooverResponse {
    iv: Uint8Array,
    key: CryptoKey,
    info: NodeCoreUploadResponse
}