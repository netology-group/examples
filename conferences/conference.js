function createRoomResource (time, audience) {
    const uuid = uuidv4()
    const method = 'room.create'
    const payload = {
        time,
        audience
    }
    const properties = {
        type: 'request',
        method: method,
        response_topic: `agents/${AGENT_LABEL}.${ACCOUNT_LABEL}.${AUDIENCE}/api/v1/in/${CONFERENCE_APP_NAME}`,
        correlation_data: uuid
    }
    const data = {
        payload: JSON.stringify(payload),
        properties: properties
    }

    requestMap[uuid] = method

    sendToConference(data)
}

function createRTCResource () {
    const uuid = uuidv4()
    const method = 'rtc.create'
    const payload = {
        room_id: roomId
    }
    const properties = {
        type: 'request',
        method: method,
        response_topic: `agents/${AGENT_LABEL}.${ACCOUNT_LABEL}.${AUDIENCE}/api/v1/in/${CONFERENCE_APP_NAME}`,
        correlation_data: uuid
    }
    const data = {
        payload: JSON.stringify(payload),
        properties: properties
    }

    requestMap[uuid] = method

    sendToConference(data)
}

function readRTCResource () {
    const uuid = uuidv4()
    const method = 'rtc.read'
    const payload = {
        id: rtcId
    }
    const properties = {
        type: 'request',
        method: method,
        response_topic: `agents/${AGENT_LABEL}.${ACCOUNT_LABEL}.${AUDIENCE}/api/v1/in/${CONFERENCE_APP_NAME}`,
        correlation_data: uuid
    }
    const data = {
        payload: JSON.stringify(payload),
        properties: properties
    }

    requestMap[uuid] = method

    sendToConference(data)
}

function listRTCResource () {
    const uuid = uuidv4()
    const method = 'rtc.list'
    const payload = {
        room_id: roomId,
        offset: 0,
        limit: 100
    }
    const properties = {
        type: 'request',
        method: method,
        response_topic: `agents/${AGENT_LABEL}.${ACCOUNT_LABEL}.${AUDIENCE}/api/v1/in/${CONFERENCE_APP_NAME}`,
        correlation_data: uuid
    }
    const data = {
        payload: JSON.stringify(payload),
        properties: properties
    }

    requestMap[uuid] = method

    sendToConference(data)
}

function createSignal (jsep) {
    const uuid = uuidv4()
    const method = 'signal.create'
    const payload = {
        // label: 'test_label123',
        rtc_id: rtcId,
        jsep: jsep
    }

    if (jsep.type === 'offer') {
        payload.label = 'test_label123'
    }

    const properties = {
        type: 'request',
        method: method,
        response_topic: `agents/${AGENT_LABEL}.${ACCOUNT_LABEL}.${AUDIENCE}/api/v1/in/${CONFERENCE_APP_NAME}`,
        correlation_data: uuid
    }
    const data = {
        payload: JSON.stringify(payload),
        properties: properties
    }

    requestMap[uuid] = method

    sendToConference(data)
}

function sendToConference (data) {
    mqttClient.publish(
        `agents/${AGENT_LABEL}.${ACCOUNT_LABEL}.${AUDIENCE}/api/v1/out/${CONFERENCE_APP_NAME}`,
        JSON.stringify(data),
        null,
        function (error) {
            if (error) {
                console.log('[publish error]', error)

                return
            }
        }
    )
}