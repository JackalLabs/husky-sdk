import BasicStorageContractFrame from "../interfaces/IClasses/IBasicStorageContract";
import * as SecretJs from "secretjs";
import ContractConfig from "../interfaces/IContractConfig";
import Fees from "../interfaces/IFees";
import {message, query, stockFees} from "../helpers/contract";
import Msg from "../interfaces/IMsg";
import HandleMsg from "../interfaces/IHandleMsg";
import {Window} from "@keplr-wallet/types";

export default class BasicStorageContract implements BasicStorageContractFrame {
    /** @internal */
    contractAddr: string
    /** @internal */
    pubkeyAddr: string
    /** @internal */
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
        const chain = cfg.chainId || 'secret-4'
        let address: string
        let signer: any
        let seed
        if (cfg.mode === 'keplr' && window) {
            const eWindow = window as Window
            if (eWindow.keplr) {
                const { keplr } = eWindow
                const accts = await signer.getAccounts()
                address = accts[0].address
                signer = keplr.getOfflineSigner(chain)
                seed = keplr.getEnigmaUtils(chain)
            } else {
                throw new Error('Keplr not installed')
            }
        } else {
            const pen = await SecretJs.Secp256k1Pen.fromMnemonic(cfg.scrtMnemonic);
            const pubkey = SecretJs.encodeSecp256k1Pubkey(pen.pubkey);
            this.pubkeyAddr = SecretJs.pubkeyToAddress(pubkey, 'secret')
            address = this.pubkeyAddr
            signer = (signBytes: Uint8Array) => pen.sign(signBytes)
            seed = SecretJs.EnigmaUtils.GenerateNewSeed()
        }

        return new SecretJs.SigningCosmWasmClient(
            cfg.scrtRestUrl,
            address,
            signer,
            seed,
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