import BasicStorageContract from "./modules/BasicStorageContract";
import ContractConfig from "./interfaces/IContractConfig";
import {Fees} from "./interfaces/IFees";

class Blah extends BasicStorageContract {
    constructor(cfg: ContractConfig, fees?: Fees) {
        super(cfg, fees)
    }
}

const contract = new Blah({}, '')
contract.customQuery({})
