const {GoogleSpreadsheet} = require('google-spreadsheet');
const creds = require('../../client_secret.json');

const sheetIds = require('./sheetIds')

module.exports = async (sheet) => {
    const doc = new GoogleSpreadsheet('1v037dJAFD_k75Zug73SN-UC3x0Q0zqERe5fqYJUSDZE');
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheetRef = doc.sheetsById[sheetIds[sheet]];

    sheetRows = await sheetRef.getRows();
    return sheetRows;        
}