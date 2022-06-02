export default interface NodeUploadResponse {
    sent: {
        address: string,
        pkey: string,
        skey: string
    },
    cid: string,
    miners: string[],
    dataId: string,
    node: string
}