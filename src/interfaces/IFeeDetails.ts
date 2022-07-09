import FeeAmount from "./IFeeAmount";

export default interface FeeDetails {
    amount: FeeAmount[],
    gas: string,
}