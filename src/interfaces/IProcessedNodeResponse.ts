export default interface ProcessedNodeResponse {
    header: Headers,
    response: Promise<any>
}