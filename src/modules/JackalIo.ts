import {chunky, readFile} from "../helpers/teardown";
import TimeMarkers from "../interfaces/ITimeMarkers";
import {buildEncryptedFile, genIv, genKey} from "../helpers/crypt";
import {randomCaseString} from "make-random";
import FormData from "form-data";
import {jklNodePost} from "../helpers/transmit";
import NodeHooverResponse from "../interfaces/INodeTypes/INodeHooverResponse";
import NodeResponse from "../interfaces/INodeTypes/INodeResponse";

export default class JackalIo {
    priorityList: string[]
    node: string
    timeModifier: number
    timer: number

    constructor(timeCounts?: TimeMarkers, priorityList?: string[]) {
        this.timeModifier = this.calcModifier(timeCounts)
        this.timer = Date.now() + this.timeModifier
        this.priorityList = priorityList || []
        this.node = (priorityList && priorityList.length) ? priorityList[0] : ''
    }

    async refreshNode (node: string): Promise<boolean> {
        if (this.priorityList.length) {
            const priorityNode = await Promise.any(this.priorityList.map(url => {
                return fetch(`https://${url}`)
                    .then(res => res.json())
                    .then((res: NodeResponse) => {
                        if (res.jcode === 2000) {
                            return url
                        } else {
                            throw new Error('Bad Connection')
                        }
                    })
            }))
            if (priorityNode && priorityNode.length) {
                this.node = priorityNode
                return true
            } else {
                return false
            }
        } else {


            return false
        }

    }
    getCurrentNode (): string {
        return this.node
    }
    isTimerExpired (): boolean {
        return (this.timeModifier > 0 && Date.now() > this.timer)
    }
    updateTimerExpiration (): number {
        this.timer = Date.now() + this.timeModifier
        return this.timer
    }
    calcModifier (tc: TimeMarkers | undefined): number {
        const ms = 1000
        const {s, m, h, d, w} = tc || {}
        return [
            (ms * Number(s) || 0),
            (ms * 60 * Number(m) || 0),
            (ms * 60 * 60 * Number(h) || 0),
            (ms * 60 * 60 * 24 * Number(d) || 0),
            (ms * 60 * 60 * 24 * 7 * Number(w) || 0)
        ].reduce((a, b) => a + b, 0)
    }

    async hoover (file: File, myAddress: string): Promise<NodeHooverResponse> {
        const myIv = genIv()
        const myKey = await genKey()
        const uploadResult = await readFile(file)
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

                return await jklNodePost(`https://${this.node}/upload`, myFD)
            })
        return {
            iv: myIv,
            key: myKey,
            info: uploadResult
        }
    }

    stashSecrets (func: any) {
// todo
    }

    receiveBacon () {
        return
        // return new File([new Blob([new Uint8Array(data)], { endings: 'native' })], `${await oneWayString(meta.name + randomCaseString(4, ''))}.jkl`, { type: 'text/plain' })

    }
}