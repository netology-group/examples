function createJanusSession () {
    const uuid = uuidv4()
    const payload = {
        janus: 'create',
        transaction: uuid
    }
    const data = {
        payload: JSON.stringify(payload)
    }

    requestMap[uuid] = 'create'

    sendToJanus(data)
}

function attachJanusPluginHandler () {
    const uuid = uuidv4()
    const payload = {
        janus: 'attach',
        session_id: sessionId,
        plugin: 'janus.plugin.conference',
        transaction: uuid
    }
    const data = {
        payload: JSON.stringify(payload)
    }

    requestMap[uuid] = 'attach'

    sendToJanus(data)
}

function createStreamResource (offer) {
    const uuid = uuidv4()
    const method = 'stream.create'
    const payload = {
        janus: 'message',
        session_id: sessionId,
        handle_id: handlerId,
        transaction: uuid,
        body: {
            method: method,
            id: roomId
        },
        jsep: offer
    }
    const data = {
        payload: JSON.stringify(payload)
    }

    requestMap[uuid] = method

    sendToJanus(data)
}

function readStreamResource (offer) {
    const uuid = uuidv4()
    const method = 'stream.read'
    const payload = {
        janus: 'message',
        session_id: sessionId,
        handle_id: handlerId,
        transaction: uuid,
        body: {
            method: method,
            id: roomId
        },
        jsep: offer
    }
    const data = {
        payload: JSON.stringify(payload)
    }

    requestMap[uuid] = method

    sendToJanus(data)
}

function sendCandidateToJanus (candidate) {
    const uuid = uuidv4()
    const payload = {
        janus: 'trickle',
        session_id: sessionId,
        handle_id: handlerId,
        transaction: uuid,
        candidate: candidate
    }
    const data = {
        payload: JSON.stringify(payload)
    }

    requestMap[uuid] = 'trickle'

    sendToJanus(data)
}

function sendToJanus (data) {
    mqttClient.publish(
        `agents/${APP_LABEL}.${APP_NAME}/api/v1/in/${CONFERENCE_APP_NAME}`,
        JSON.stringify(data),
        null,
        function (error) {
            if (error) {
                console.log('[publish error]', error)
            }
        }
    )
}