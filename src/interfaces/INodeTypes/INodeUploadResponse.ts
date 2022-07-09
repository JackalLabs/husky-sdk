import NodeCoreUploadResponse from "./INodeCoreUploadResponse";

export default interface NodeUploadResponse extends NodeCoreUploadResponse{
    node: string,
    sent: {
        address: string,
        pkey: string,
        skey: string
    }
}