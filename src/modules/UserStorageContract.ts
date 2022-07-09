import {randomString} from "make-random";

import {message, query} from "../helpers/contract";
import ContractConfig from "../interfaces/IContractConfig";
import Fees from "../interfaces/IFees";
import Msg from "../interfaces/IMsg";
import BasicStorageContract from "./BasicStorageContract";
import HandleMsg from "../interfaces/IHandleMsg";
import {IPFSMove, IPFSMultiCreate, IPFSRemoveReset, IPFSSetPermission} from "../interfaces/IIPFS";
import UserStorageContractFrame from "../interfaces/IClasses/IUserStorageContract";

export class UserStorageContract extends BasicStorageContract implements UserStorageContractFrame {
    constructor(cfg: ContractConfig, fees?: Fees) {
        super(cfg, fees)
    }

    // contract query routes
    getContents (viewingKey: string, filePath: string): Promise<string[]> {
        const msg: Msg = {
            get_contents: {
                behalf: this.pubkeyAddr,
                key: viewingKey,
                path: filePath
            }
        }
        return query(this.session, this.contractAddr, msg)
    }
    getNodeList (size: number): Promise<string[]> {
        const msg: Msg = {
            get_node_list: {size}
        }
        return query(this.session, this.contractAddr, msg)
    }
    getNodeListSize (): Promise<string[]> {
        const msg: Msg = {
            get_node_list_size: {}
        }
        return query(this.session, this.contractAddr, msg)
    }
    youUpBro (): Promise<string[]> {
        const msg: Msg = {
            you_up_bro: {
                address: this.pubkeyAddr
            }
        }
        return query(this.session, this.contractAddr, msg)
    }

    // contract message routes
    async initAddress (): Promise<boolean> {
        const preEntropy = await randomString(32)
        const msg: HandleMsg = {
            handleMsg: {
                init_address: {
                    contents: 'init',
                    entropy: btoa(preEntropy),
                }
            }
        }
        return message(this.session, this.contractAddr, msg)
    }
    async createViewingKey (): Promise<boolean> {
        const preEntropy = await randomString(32)
        const msg: HandleMsg = {
            handleMsg: {
                create_viewing_key: {
                    behalf: this.pubkeyAddr,
                    entropy: btoa(preEntropy),
                    padding: randomString(32)
                }
            }
        }
        return message(this.session, this.contractAddr, msg)
    }
    // storeFile (data: IPFSCreate): Promise<boolean> {
    //     const msg: HandleMsg = {
    //         handleMsg: {
    //             create: data
    //         }
    //     }
    //     return message(this.session, this.contractAddr, msg)
    // }
    storeFiles (data: IPFSMultiCreate): Promise<boolean> {
        const msg: HandleMsg = {
            handleMsg: {
                create_multi: data
            }
        }
        return message(this.session, this.contractAddr, msg)
    }
    // removeFile (data: IPFSRemoveReset): Promise<boolean> {
    //     const msg: HandleMsg = {
    //         handleMsg: {
    //             remove: data
    //         }
    //     }
    //     return message(this.session, this.contractAddr, msg)
    // }
    removeFiles (data: string[]): Promise<boolean> {
        const msg: HandleMsg = {
            handleMsg: {
                remove_multi: data
            }
        }
        return message(this.session, this.contractAddr, msg)
    }
    moveFile (data: IPFSMove): Promise<boolean> {
        const msg: HandleMsg = {
            handleMsg: {
                move: data
            }
        }
        return message(this.session, this.contractAddr, msg)
    }
    allowRead (data: IPFSSetPermission): Promise<boolean> {
        const msg: HandleMsg = {
            handleMsg: {
                allow_read: data
            }
        }
        return message(this.session, this.contractAddr, msg)
    }
    disallowRead (data: IPFSSetPermission): Promise<boolean> {
        const msg: HandleMsg = {
            handleMsg: {
                disallow_read: data
            }
        }
        return message(this.session, this.contractAddr, msg)
    }
    resetRead (data: IPFSRemoveReset): Promise<boolean> {
        const msg: HandleMsg = {
            handleMsg: {
                reset_read: data
            }
        }
        return message(this.session, this.contractAddr, msg)
    }
    allowWrite (data: IPFSSetPermission): Promise<boolean> {
        const msg: HandleMsg = {
            handleMsg: {
                allow_write: data
            }
        }
        return message(this.session, this.contractAddr, msg)
    }
    disallowWrite (data: IPFSSetPermission): Promise<boolean> {
        const msg: HandleMsg = {
            handleMsg: {
                disallow_write: data
            }
        }
        return message(this.session, this.contractAddr, msg)
    }
    resetWrite (data: IPFSRemoveReset): Promise<boolean> {
        const msg: HandleMsg = {
            handleMsg: {
                reset_write: data
            }
        }
        return message(this.session, this.contractAddr, msg)
    }
}
