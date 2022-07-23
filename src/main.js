const http = require('axios');
const convert = require('xml-js');
const PropertiesReader = require('properties-reader')
const properties = PropertiesReader("resources/app.properties")

const PREFIX = 'https://unipass.customs.go.kr:38010/ext/rest/cargCsclPrgsInfoQry/retrieveCargCsclPrgsInfo';
const API_KEY = properties.get("unipass.api.key");

(async () => {

    const result = await Promise.all(getRequestUrlListArray());

    let _cargTrcnRelaBsopTpcdSet = new Set();   // 처리구분
    let _rlbrCnSet = new Set();                 // 반출입내용

    result.forEach(elem => {
        let xmlToJson = convert.xml2json(elem.data, {compact: true, spaces: 2});
        let json = JSON.parse(xmlToJson);

        let targetRootPath = json.cargCsclPrgsInfoQryRtnVo.cargCsclPrgsInfoDtlQryVo;
        if (!!targetRootPath) {
            targetRootPath.forEach(function (elem) {
                let _cargTrcnRelaBsopTpcd = getTextOrEmpty(elem.cargTrcnRelaBsopTpcd);
                let _rlbrCn = getTextOrEmpty(elem.rlbrCn);

                if (!_cargTrcnRelaBsopTpcdSet.has(_cargTrcnRelaBsopTpcd)) {
                    _cargTrcnRelaBsopTpcdSet.add(_cargTrcnRelaBsopTpcd);
                }

                if (!_rlbrCnSet.has(_rlbrCn)) {
                    _rlbrCnSet.add(_rlbrCn);
                }
            });
        }
    });

    console.log(_cargTrcnRelaBsopTpcdSet);
    console.log(_rlbrCnSet);
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
    return path._text || '';
}
