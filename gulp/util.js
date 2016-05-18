export function parallel(streams) {
    return Promise.all(
        streams.map(maybeStream =>
            maybeStream instanceof Promise
                ? maybeStream
                : streamToPromise(maybeStream)));
}

export function streamToPromise(stream) {
    return new Promise((resolve, reject) => {
        stream.on("error", onError);
        stream.on("end", onEnd);

        function onError(e) {
            stream.removeListener("error", onError);
            stream.removeListener("end", onEnd);
            reject(e);
        }

        function onEnd() {
            stream.removeListener("error", onError);
            stream.removeListener("end", onEnd);
            resolve();
        }
    });
}
