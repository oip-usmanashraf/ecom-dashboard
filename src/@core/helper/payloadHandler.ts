export const payloadHandler = (
    payload: { statusCode: string },
    successCallback: (successPayload: any) => void,
    errorCallback?: (errorPayload: any) => void
) => {
    if (payload.statusCode === '10000') {
        successCallback(payload)
    } else {
        errorCallback && errorCallback(payload)
    }
}