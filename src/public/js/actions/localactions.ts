export const SET_NGINX_PATH = 'SET_NGINX_PATH';
export function setNginxPath(path: string) {
  return {
    type: SET_NGINX_PATH,
    payload: path,
  };
}

export const SET_NGINX_PORT = 'SET_NGINX_PORT';
export function setNginxPort(port: number) {
  return {
    type: SET_NGINX_PORT,
    payload: port,
  };
}

export const SET_FFMPEG_PATH = 'SET_FFMPEG_PATH';
export function setFfmpegPath(path: string) {
  return {
    type: SET_FFMPEG_PATH,
    payload: path,
  };
}

export const SET_HIDE_SERVICES_SUPPORTED_BY_RESTREAM_IO = 'SET_HIDE_SERVICES_SUPPORTED_BY_RESTREAM_IO';
export function setHideServicesSupportedByRestreamIo(value: boolean) {
  return {
    type: SET_HIDE_SERVICES_SUPPORTED_BY_RESTREAM_IO,
    payload: value,
  };
}
