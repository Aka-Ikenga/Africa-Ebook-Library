const {bucket} = require("../routes/helpers/storage")


async function bucketUpload(path) {
    let [file] = await bucket.upload(path, {public: true})
    let [meta] = await file.getMetadata()
    return meta.mediaLink
}

module.exports = {bucketUpload}
