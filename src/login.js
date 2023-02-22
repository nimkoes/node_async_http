const axios = require('axios');
const PropertiesReader = require('properties-reader')
const properties = PropertiesReader("resources/app.properties")

const LOGIN_API = properties.get("login.api");
const USERS = properties.get("login.users");
const PW = properties.get("login.pw");
const TP = properties.get("login.tp");

const config = {
    headers: {
        'Content-Type': 'application/json',
    },
};

const promiseList = getRequestData().map((requestData) => {
    return axios.post(LOGIN_API, requestData, config);
});

Promise.all(promiseList)
    .then((responses) => {
        responses.forEach((response, index) => {
            const resp = response.data;
            console.log(`${resp.email}`);
            console.log(`${resp.token}`);
            console.log();
        });
    })
    .catch((error) => {
        console.error('Error occurred during requests', error);
    });

function getRequestData() {
    const users = USERS.split(",");
    const requestData = [];

    users.forEach(user => {
        requestData.push({email: user, password: PW, loginType: TP});
    });

    return requestData;
}
