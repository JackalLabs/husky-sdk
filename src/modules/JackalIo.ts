import {chunky, readFile} from "../helpers/teardown";
import TimeMarkers from "../interfaces/ITimeMarkers";
import {buildEncryptedFile, genIv, genKey} from "../helpers/crypt";
import {randomCaseString} from "make-random";
import {jklNodePost} from "../helpers/transmit";
import NodeHooverResponse from "../interfaces/INodeTypes/INodeHooverResponse";
import NodeResponse from "../interfaces/INodeTypes/INodeResponse";
import {generateUniqueRandomString} from "../helpers/utils";
import FilePartBundle from "../interfaces/IFilePartBundle";
import {isStringObject} from "util/types";

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

        const details = await readFile(file)
            .then(({content, meta}) => ({
                chunks: chunky(content),
                meta
            }))
            .then(async ({chunks, meta}) => {
                const markers: string[] = []
                const readyToSend: File[] = []
                for (const chunk of chunks) {
                    let tmp
                    do {
                        tmp = await generateUniqueRandomString(4, markers)
                    } while (markers.includes(tmp))
                    markers.push(tmp)
                    readyToSend.push(await buildEncryptedFile(chunk, `${meta.name + tmp}`, myIv, myKey))
                }
                return {readyToSend, meta}
            })
            .then(async ({readyToSend, meta}) => {
                let FD = FormData
                if (!window) {
                    FD = await import('formdata-node') as unknown as typeof FormData
                }
                const myFD: FormData = new FD()
                myFD.set('address', myAddress)
                const storage: FilePartBundle = {meta}
                for (let i = 0; i < readyToSend.length; i++) {
                    myFD.set('file', readyToSend[i])
                    const {cid, dataId, miners} = await jklNodePost(`https://${this.node}/upload`, myFD)
                    storage[i] = {cid, dataId, miners}
                }
                myFD.set('pkey', await randomCaseString(16))
                myFD.set('skey', await randomCaseString(16))
                myFD.set('file', await buildEncryptedFile(new Uint8Array(JSON.parse(JSON.stringify(storage))).buffer, `${meta.name}`, myIv, myKey))
                return await jklNodePost(`https://${this.node}/upload`, myFD)
            })
            .then(storage => ({
                cid: storage.cid,
                dataId: storage.dataId,
                miners: storage.miners
            }))
        return {
            iv: myIv,
            key: myKey,
            info: details
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