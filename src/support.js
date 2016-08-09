module.exports = {
    searchParams: 'URLSearchParams' in window,
    iterable: 'Symbol' in window && 'iterator' in window,
    blob: 'FileReader' in window && 'Blob' in window && (function () {
        try {
            new Blob()
            return true
        } catch (e) {
            return false
        }
    })(),
    formData: 'FormData' in window,
    arrayBuffer: 'ArrayBuffer' in window
}
