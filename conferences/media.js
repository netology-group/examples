function gum (constraints) {
    return navigator.mediaDevices.getUserMedia(constraints)
        .catch(function (error) {
            console.log('[gum] error', error)

            throw error
        });
}

function gdm () {
    let promise

    if (navigator.getDisplayMedia) {
        promise = navigator.getDisplayMedia({video: true})
    } else if (navigator.mediaDevices.getDisplayMedia) {
        promise = navigator.mediaDevices.getDisplayMedia({video: true})
    } else {
        promise = navigator.mediaDevices.getUserMedia({video: {mediaSource: 'screen'}})
    }

    return promise.catch(function (error) {
        console.log('[gdm] error', error)

        throw error
    });
}

function getFakeStream () {
    const video = document.createElement('video')

//        video.autoplay = true
    video.loop = true
    video.muted = true
    video.src = './av_sync_test.mp4'

    return video.play().then(function () {
        return video.mozCaptureStream ? video.mozCaptureStream() : video.captureStream()
    })
}

function getSenderByKind (pc, kind) {
    let sender = null

    if (pc) {
        for (let item of pc.getSenders()) {
            if (item.track && item.track.kind === kind) {
                sender = item

                break
            }
        }
    }

    return sender
}

function switchTo (pc, source) {
    const sender = getSenderByKind(pc, 'video')

    if (sender) {
        sender.replaceTrack(source.getVideoTracks()[0])
    }
}

function stopStream (stream) {
    stream.getTracks().forEach(function (track) {
        track.stop()
    })
}

function streamToVideo (stream) {
    let video = document.createElement('video')

    // video.autoplay = true
    video.muted = true
    video.srcObject = stream

    // video.play()

    return video
}

let intervalId = null
let canvas = null

function mergeVideoStreams (stream1, stream2) {
    // First convert streams to video elements
    let video1 = streamToVideo(stream1)
    let video2 = streamToVideo(stream2)

    // Create canvas and initialize it
    canvas = document.createElement('canvas')

    canvas.width = 2560
    canvas.height = 1440

    let ctx = canvas.getContext('2d')

    ctx.fillStyle = 'black'

    return Promise.all([video1.play(), video2.play()]).then(function() {
        intervalId = setInterval(() => {
            // let video1Size = calculateSize(canvas.width, canvas.height, video1.videoWidth, video1.videoHeight)
            // let video2Size = calculateSize(canvas.width, canvas.height, video2.videoWidth, video2.videoHeight)

            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(
                video1,
                (canvas.width - video1.videoWidth) / 2,
                (canvas.height - video1.videoHeight) / 2,
                video1.videoWidth,
                video1.videoHeight
            )
            ctx.drawImage(video2, 0, 0, canvas.width / 4, canvas.height / 4)
        }, 100)

        return canvas.captureStream(30)
    })
}

function clearMerger () {
    clearInterval(intervalId)
    canvas = null
}

function calculateSize (containerWidth, containerHeight, imageWidth, imageHeight) {
    const scale = Math.min(containerWidth / imageWidth, containerHeight / imageHeight)

    return {
        width: imageWidth * scale,
        height: imageHeight * scale
    }
}