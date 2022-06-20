export default interface GatewayStorageContractFrame {
    // contract query routes
    getGatewayContents(target: string, viewingKey: string, filePath: string): Promise<string[]>
    getNodeList(size: number): Promise<string[]>
    getNodeListSize(): Promise<string[]>

    // contract message route
    createGatewayViewingKey(): Promise<boolean>
}
