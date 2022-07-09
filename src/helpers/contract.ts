import Fees from "../interfaces/IFees";
import Msg from "../interfaces/IMsg";
import * as SecretJs from "secretjs";
import HandleMsg from "../interfaces/IHandleMsg";

/** @internal */
export const stockFees: Fees = {
    upload: {
        amount: [{
            amount: "2000000",
            denom: "uscrt"
        }],
        gas: "2000000",
    },
    init: {
        amount: [{
            amount: "500000",
            denom: "uscrt"
        }],
        gas: "500000",
    },
    exec: {
        amount: [{
            amount: "500000",
            denom: "uscrt"
        }],
        gas: "500000",
    },
    send: {
        amount: [{
            amount: "80000",
            denom: "uscrt"
        }],
        gas: "80000",
    },
}
/** @internal */
export async function query (session: SecretJs.SigningCosmWasmClient | undefined, contract: string, msg: Msg): Promise<string[]> {
    if (session) {
        return await session.queryContractSmart(contract, msg)
            .then(async (res) => {
                return await JSON.parse(Buffer.from(res.data, "base64").toString()) || []
            })
    } else {
        throw new Error('No Active Session')
    }
}

/** @internal */
export async function message (session: SecretJs.SigningCosmWasmClient | undefined, contract: string, msg: HandleMsg): Promise<boolean> {
    if (session) {
        await session.execute(contract, msg)
        return true
    } else {
        throw new Error('No Active Session')
    }
}
