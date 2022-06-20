import NodeUploadResponse from "./INodeUploadResponse";

export default interface NodeHooverResponse {
    iv: Uint8Array,
    key: CryptoKey,
    info: NodeUploadResponse
}