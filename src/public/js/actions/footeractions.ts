export const SET_NEED_APPLY = "SET_NEED_APPLY";
export function setToNeedApply(value: boolean) {
    return { type: SET_NEED_APPLY, payload: value };
}
