import * as SecretJs from "secretjs";
import ContractConfig from "../IContractConfig";
import {Fees} from "../IFees";
import Msg from "../IMsg";
import {message, query} from "../../helpers/contract";
import {randomString} from "make-random";
import HandleMsg from "../IHandleMsg";
import {IPFSCreate, IPFSMove, IPFSMultiCreate, IPFSRemoveReset, IPFSSetPermission} from "../IIPFS";

export default interface BasicStorageContractFrame {
    // contract query routes
    getContents(viewingKey: string, filePath: string): Promise<string[]>
    getNodeList(size: number): Promise<string[]>
    getNodeListSize(): Promise<string[]>
    youUpBro(): Promise<string[]>

    // contract message routes
    initAddress(): Promise<boolean>
    createViewingKey(): Promise<boolean>
    storeFile(data: IPFSCreate): Promise<boolean>
    storeFiles(data: IPFSMultiCreate): Promise<boolean>
    removeFile(data: IPFSRemoveReset): Promise<boolean>
    removeFiles(data: string[]): Promise<boolean>
    moveFile(data: IPFSMove): Promise<boolean>
    allowRead(data: IPFSSetPermission): Promise<boolean>
    disallowRead(data: IPFSSetPermission): Promise<boolean>
    resetRead(data: IPFSRemoveReset): Promise<boolean>
    allowWrite(data: IPFSSetPermission): Promise<boolean>
    disallowWrite(data: IPFSSetPermission): Promise<boolean>
    resetWrite(data: IPFSRemoveReset): Promise<boolean>
}
