export const SET_NEED_APPLY = "SET_NEED_APPLY";
export function setToNeedApply(value: boolean) {
    return { type: SET_NEED_APPLY, payload: value };
}

export const SET_SUB_PROCESS_STATUS = "SET_SUB_PROCESS_STATUS";
export function setSubProcessStatus(
    nginx: boolean,
    nginxErrorReasons: string[],
    ffmpeg: boolean,
    ffmpegErrorReasons: string[]
) {
    return {
        type: SET_SUB_PROCESS_STATUS,
        payload: {
            nginx,
            nginxErrorReasons,
            ffmpeg,
            ffmpegErrorReasons
        }
    };
}
