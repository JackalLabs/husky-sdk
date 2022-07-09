import FeeDetails from "./IFeeDetails";

export default interface Fees {
    exec: FeeDetails,
    init: FeeDetails,
    send: FeeDetails,
    upload: FeeDetails
}