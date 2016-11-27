export const SET_ENABLED = "SET_ENABLED";
export function setEnabled(name: string, value: boolean) {
    return {
        type: SET_ENABLED,
        payload: { name, value }
    };
}

export const SET_FMS_URL = "SET_FMS_URL";
export function setFMSURL(name: string, value: string) {
    return {
        type: SET_FMS_URL,
        payload: { name, value }
    };
}

export const SET_STREAM_KEY = "SET_STREAM_KEY";
export function setStreamKey(name: string, value: string) {
    return {
        type: SET_STREAM_KEY,
        payload: { name, value }
    };
}

export const SET_PUSH_BY = "SET_PUSH_BY";
export function setPushBy(name: string, value: string) {
    return {
        type: SET_PUSH_BY,
        payload: { name, value }
    };
}
