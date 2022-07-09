import {randomString} from "make-random";

import {message, query} from "../helpers/contract";
import ContractConfig from "../interfaces/IContractConfig";
import Fees from "../interfaces/IFees";
import Msg from "../interfaces/IMsg";
import BasicStorageContract from "./BasicStorageContract";
import HandleMsg from "../interfaces/IHandleMsg";
import GatewayStorageContractFrame from "../interfaces/IClasses/IGatewayStorageContract";

export class GatewayStorageContract extends BasicStorageContract implements GatewayStorageContractFrame{
    constructor(cfg: ContractConfig, fees?: Fees) {
        cfg.mode = 'nodejs'
        super(cfg, fees)
    }

    // contract query routes
    getGatewayContents (target: string, viewingKey: string, filePath: string): Promise<string[]> {
        const msg: Msg = {
            get_contents: {
                behalf: target,
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

    // contract message route
    async createGatewayViewingKey (): Promise<boolean> {
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
}
