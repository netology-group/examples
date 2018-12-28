function createPeerConnection () {
    console.log('[createPeerConnection]')
    let iceServers = [
        {urls: STUN_URL},
        {
            urls: TURN_URL,
            username: TURN_USERNAME,
            credential: TURN_CREDENTIAL
        }
    ]

    peerConnection = new RTCPeerConnection({
        iceServers: iceServers,
        // iceTransportPolicy: 'relay' // for demo only, not recommended for production
    })

    peerConnection.onconnectionstatechange = handleConnectionStateChangeEvent
    peerConnection.onnegotiationneeded = handleNegotiationNeededEvent
    peerConnection.onicecandidate = handleICECandidateEvent
    peerConnection.onremovestream = handleRemoveStreamEvent
    peerConnection.oniceconnectionstatechange = handleICEConnectionStateChangeEvent
    peerConnection.onicegatheringstatechange = handleICEGatheringStateChangeEvent
    peerConnection.onsignalingstatechange = handleSignalingStateChangeEvent
    peerConnection.ontrack = handleTrackEvent
}

function closePeerConnection() {
    if (peerConnection) {
        console.log('[closePeerConnection]')

        peerConnection.onconnectionstatechange = null
        peerConnection.onnegotiationneeded = null
        peerConnection.onicecandidate = null
        peerConnection.onremovestream = null
        peerConnection.oniceconnectionstatechange = null
        peerConnection.onicegatheringstatechange = null
        peerConnection.onsignalingstatechange = null
        peerConnection.ontrack = null

        peerConnection.close()
        peerConnection = null
    }
}

function handleConnectionStateChangeEvent(event) {
    console.debug('[pc] handleConnectionStateChangeEvent', event.currentTarget.connectionState)
}

function handleNegotiationNeededEvent() {
    console.debug('[pc] negotiationneeded')
}

function handleICECandidateEvent(event) {
    if (event.candidate) {
        console.debug('[ICE] Outgoing ICE candidate: ' + event.candidate.candidate)

        sendCandidateToJanus(event.candidate)
        // createSignal(event.candidate)
    }
}

function handleRemoveStreamEvent(event) {
    console.log('[pc] removestream', event)
}

function handleICEConnectionStateChangeEvent(event) {
    console.log('[ICE] connection state changed to: ' + event.target.iceConnectionState)

    switch (event.target.iceConnectionState) {
        case 'closed':
        case 'failed':
//            case 'disconnected':
//                closeCall()

            break
    }
}

function handleICEGatheringStateChangeEvent(event) {
    console.debug('ICE gathering state changed to: ' + event.target.iceGatheringState)

    switch (event.target.iceGatheringState) {
        case 'complete':
            sendCandidateToJanus({completed: true})
            // createSignal({completed: true}) // or null

            // alternative: collect all candidates and then send request
//                const offer = peerConnection.localDescription
//
//                createStreamResource({
//                    type: 'offer',
//                    sdp: offer.sdp,
//                    trickle: false
//                })
            break
    }
}

function handleSignalingStateChangeEvent(event) {
    console.info('[WebRTC] signaling state changed to: ' + peerConnection.signalingState)

    switch (event.target.signalingState) {
        case 'closed':
//                closeCall()

            break
    }
}

function handleTrackEvent(event) {
    console.log('[pc] track', event)

    document.getElementById('video').srcObject = event.streams[0]
    document.getElementById('video').muted = false
}