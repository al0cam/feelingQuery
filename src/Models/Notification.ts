export type Notification = {
    message: string,
    type: string, // success, error, warning, info
    time: Date,
    timeout: number,
}