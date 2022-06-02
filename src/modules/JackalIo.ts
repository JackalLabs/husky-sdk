import {chunky, readFile} from "../helpers/teardown";
import TimeMarkers from "../interfaces/ITimeMarkers";
import {buildEncryptedFile, genIv, genKey, oneWayString} from "../helpers/crypt";
import {randomCaseString} from "make-random";
import FormData from "form-data";
import {jklNodePost} from "../helpers/transmit";
import NodeUploadResponse from "../interfaces/INodeTypes/INodeUploadResponse";


export default class JackalIo {
    overrideNode?: string
    node?: string
    timeModifier: number
    timer: number

    constructor(timeCounts: TimeMarkers, overrideNode?: string) {
        this.timeModifier = this.calcModifier(timeCounts)
        this.timer = Date.now() + this.timeModifier
        this.overrideNode = overrideNode || ''
    }

    setNode (node: string): void {
        if (Date.now() > this.timer) {
            this.node = node
        } else {
            throw new Error('Refresh not ready')
        }
    }
    getCurrentNode (): string {
        return this.overrideNode || this.node || 'NA'
    }
    calcModifier (tc: TimeMarkers): number {
        const ms = 1000
        const {s, m, h, d, w} = tc
        return [
            (ms * Number(s) || 0),
            (ms * 60 * Number(m) || 0),
            (ms * 60 * 60 * Number(h) || 0),
            (ms * 60 * 60 * 24 * Number(d) || 0),
            (ms * 60 * 60 * 24 * 7 * Number(w) || 0)
        ].reduce((a, b) => a + b, 0)
    }

    async hoover (file: File, myAddress: string): Promise<NodeUploadResponse> {
        const myIv = genIv()
        const myKey = await genKey()
        return await readFile(file)
            .then(async ({content, meta}) => {
                const ret: File[] = await Promise.all(chunky(content)
                    .map(async (data) => {
                        const rdm = randomCaseString(4)
                        return await buildEncryptedFile(data, `${meta.name + rdm}`, myIv, myKey)
                    }))
                const metaFile = await buildEncryptedFile((new TextEncoder()).encode(JSON.stringify(meta)).buffer, meta.name, myIv, myKey)
                ret.unshift(metaFile)
                return {
                    crypt: {
                        iv: myIv,
                        key: myKey
                    },
                    files: ret
                }
            })
            .then(async (myData) => {
                let FD = FormData
                if (!window) {
                    FD = await import('form-data') as unknown as typeof FormData
                }
                const myFD: FormData = new FD()
                myData.files.map(rec => myFD.append('files', rec))
                myFD.append('address', myAddress)
                myFD.append('pkey', randomCaseString(16))
                myFD.append('skey', randomCaseString(16))

                return await jklNodePost(`https://${this.overrideNode || this.node}/upload`, myFD)
            })
    }

    stashSecrets () {

    }

    receiveBacon () {
        return
        return new File([new Blob([new Uint8Array(data)], { endings: 'native' })], `${await oneWayString(meta.name + randomCaseString(4, ''))}.jkl`, { type: 'text/plain' })

    }
}