export default interface PushConfig {
    method: string,
    headers: {
        'Content-Type': string
    },
    body: any
}
