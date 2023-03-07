const axios = require('axios');
const PropertiesReader = require('properties-reader')
const properties = PropertiesReader("resources/app.properties")

const TALKPLUS_CHANNEL_UPDATE_API = properties.get("tp.ch.upd.api");
const KEY = properties.get("tp.api.key");
const APP = properties.get("tp.app.id");
const OID = properties.get("tp.oid");

const CHANNEL_IDS_NOTIFICATION_ACTIVE = properties.get("tp.channel.ids.notification.active");
const CHANNEL_IDS_CONSULTING_ACTIVE = properties.get("tp.channel.ids.consulting.active");
const CHANNEL_IDS_CONSULTING_INACTIVE = properties.get("tp.channel.ids.consulting.inactive");
const CHANNEL_IDS_DM_ACTIVE = properties.get("tp.channel.ids.dm.active");
const CHANNEL_IDS_DM_INACTIVE = properties.get("tp.channel.ids.dm.inactive");

const config = {
    headers: {
        'Content-Type': 'application/json',
        'api-key': KEY,
        'app-id': APP
    }
};

async function makeRequests() {

    let requestData = getRequestData();
    for (let i = 0; i < requestData.length; i++) {

        let temp = requestData[i];
        const data = {
            ownerId: temp['ownerId'].toString(),
            category: temp['category'],
            subcategory: temp['subcategory'],
        }

        try {
            let url = TALKPLUS_CHANNEL_UPDATE_API + temp['cid'];

            const response = await axios.put(url, data, config);
            console.log(response.data);
        } catch (error) {
            console.error('Error occurred during request', error);
        }

        await new Promise(resolve => setTimeout(resolve, 30));
    }
}

makeRequests();

function getRequestData() {
    const channelIdsNotificationActive = CHANNEL_IDS_NOTIFICATION_ACTIVE.split(",");
    const channelIdsConsultingActive = CHANNEL_IDS_CONSULTING_ACTIVE.split(",");
    const channelIdsConsultingInactive = CHANNEL_IDS_CONSULTING_INACTIVE.split(",");
    const channelIdsDmActive = CHANNEL_IDS_DM_ACTIVE.split(",");
    const channelIdsDmInactive = CHANNEL_IDS_DM_INACTIVE.split(",");
    const requestData = [];

    channelIdsNotificationActive.forEach(elem => {
        requestData.push({cid: elem, ownerId: OID, category: "NOTIFICATION", subcategory: "ACTIVE"})
    });

    channelIdsConsultingActive.forEach(elem => {
        requestData.push({cid: elem, ownerId: OID, category: "CONSULTING", subcategory: "ACTIVE"})
    });

    channelIdsConsultingInactive.forEach(elem => {
        requestData.push({cid: elem, ownerId: OID, category: "CONSULTING", subcategory: "INACTIVE"})
    });

    channelIdsDmActive.forEach(elem => {
        requestData.push({cid: elem, ownerId: OID, category: "DM", subcategory: "ACTIVE"})
    });

    channelIdsDmInactive.forEach(elem => {
        requestData.push({cid: elem, ownerId: OID, category: "DM", subcategory: "INACTIVE"})
    });

    return requestData;
}
