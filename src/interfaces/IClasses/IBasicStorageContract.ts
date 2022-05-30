import * as SecretJs from "secretjs";
import ContractConfig from "../IContractConfig";
import {Fees} from "../IFees";
import Msg from "../IMsg";
import HandleMsg from "../IHandleMsg";

export default interface BasicStorageContractFrame {
    session?: SecretJs.SigningCosmWasmClient
    pubkeyAddr: string

    init(cfg: ContractConfig, fees?: Fees): Promise<void>
    createSession(cfg: ContractConfig, fees?: Fees): Promise<SecretJs.SigningCosmWasmClient>

    customQuery(msg: Msg): Promise<string[]>
    customMessage(msg: HandleMsg): Promise<boolean>
}