import {randomCaseString} from "make-random";

export async function generateUniqueRandomString (strLength: number, usedValues: string[]) {
    let ret
    do {
        ret = await randomCaseString(strLength)
    } while (usedValues.includes(ret))
    return ret
}