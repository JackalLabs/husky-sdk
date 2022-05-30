import {strict} from "assert";


export class ContractStorage {
    public address: string
    public SigningCWClient
    constructor() {}
}



const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);
const accAddress = pubkeyToAddress(pubkey, 'secret');
const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();

const secretjs = new SigningCosmWasmClient(
    SECRET_REST_URL,
    accAddress,
    (signBytes) => signingPen.sign(signBytes),
    txEncryptionSeed, customFees
);