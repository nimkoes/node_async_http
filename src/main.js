const http = require('axios');
const convert = require('xml-js');
const PropertiesReader = require('properties-reader')
const properties = PropertiesReader("resources/app.properties")

const PREFIX = 'https://unipass.customs.go.kr:38010/ext/rest/cargCsclPrgsInfoQry/retrieveCargCsclPrgsInfo';
const API_KEY = properties.get("unipass.api.key");

(async () => {
    let _set = new Set();
    const result = await Promise.all(getRequestUrlListArray());

    result.forEach(elem => {
        let xmlToJson = convert.xml2json(elem.data, {compact: true, spaces: 2});
        let json = JSON.parse(xmlToJson);

        let targetRootPath = json.cargCsclPrgsInfoQryRtnVo.cargCsclPrgsInfoQryVo;
        if (!!targetRootPath) {
            let _csclPrgsStts = getTextOrEmpty(targetRootPath.csclPrgsStts);

            /*
            let _prgsStCd = getTextOrEmpty(targetRootPath.prgsStCd);
            let _prgsStts = getTextOrEmpty(targetRootPath.prgsStts);

            let data = _csclPrgsStts + "|" + _prgsStCd + "|" + _prgsStts;
            if (!_map.has(data)) {
                _map.set(data, getTextOrEmpty(targetRootPath.hblNo));
            } else {
                _map.set(data, _map.get(data) + ", " + getTextOrEmpty(targetRootPath.hblNo));
            }
            */

            if (!_set.has(_csclPrgsStts)) {
                _set.add(_csclPrgsStts);
            }
        }
    });

    console.log(_set);
})();

function getRequestUrlListArray() {
    const RESULT = [];

    const BL_LIST = [
        {mblNo: "", hblNo: "", blYy: ""}
    ];

    for (const elem of BL_LIST) {
        RESULT.push(http.get(`${PREFIX}?crkyCn=${API_KEY}&mblNo=${elem.mblNo}&hblNo=${elem.hblNo}&blYy=${elem.blYy}`));
    }

    return RESULT;
}

function getTextOrEmpty(path) {
    return !path ? '' : path._text;
}
