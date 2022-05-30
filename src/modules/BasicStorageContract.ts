import BasicStorageContractFrame from "../interfaces/IClasses/IBasicStorageContract";
import * as SecretJs from "secretjs";
import ContractConfig from "../interfaces/IContractConfig";
import {Fees} from "../interfaces/IFees";
import {message, query, stockFees} from "../helpers/contract";
import Msg from "../interfaces/IMsg";
import HandleMsg from "../interfaces/IHandleMsg";

export default class BasicStorageContract implements BasicStorageContractFrame {
    contractAddr: string
    pubkeyAddr: string
    session?: SecretJs.SigningCosmWasmClient

    constructor(cfg: ContractConfig, fees?: Fees) {
        this.contractAddr = cfg.scrtContractAddr
        this.pubkeyAddr = ''
        this.init(cfg, fees)
    }

    /** @internal */
    async init (cfg: ContractConfig, fees?: Fees) {
        this.session = await this.createSession(cfg, fees)
    }
    /** @internal */
    async createSession (cfg: ContractConfig, fees?: Fees): Promise<SecretJs.SigningCosmWasmClient> {
        const pen = await SecretJs.Secp256k1Pen.fromMnemonic(cfg.scrtMnemonic);
        const pubkey = SecretJs.encodeSecp256k1Pubkey(pen.pubkey);
        this.pubkeyAddr = SecretJs.pubkeyToAddress(pubkey, 'secret')

        return new SecretJs.SigningCosmWasmClient(
            cfg.scrtRestUrl,
            this.pubkeyAddr,
            (signBytes) => pen.sign(signBytes),
            SecretJs.EnigmaUtils.GenerateNewSeed(),
            fees || stockFees
        )
    }

    // custom routes
    customQuery (msg: Msg) {
        return query(this.session, this.contractAddr, msg)
    }
    customMessage (msg: HandleMsg) {
        return message(this.session, this.contractAddr, msg)
    }
}