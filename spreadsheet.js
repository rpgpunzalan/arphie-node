const {GoogleSpreadsheet} = require('google-spreadsheet');
const creds = require('./client_secret.json');

const searchValByKey = (myArray, key, searchVal) => {
    return myArray.map((item) => {
        if(item[key] == searchVal) {
            return item;
        }
        return null;
    })
}

async function accessSpreadsheet() {
    const doc = new GoogleSpreadsheet('1v037dJAFD_k75Zug73SN-UC3x0Q0zqERe5fqYJUSDZE');
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const inventorySheet = doc.sheetsById['1134497922'];
    const userSheet = doc.sheetsById['428994628'];
    const salesSheet = doc.sheetsById['298865985'];
    console.log(`Title: ${inventorySheet.title}`)
    // console.log(await )
    const usersSheet = await userSheet.getRows();
    const users = [];
    usersSheet.map((user)=>{
        // console.log(user.EMAIL)
        users.push({
            id: user.ID,
            email: user.EMAIL,
            password: user.PASSWORD,
            name: user.NAME,
            accessLevel: +user['ACCESS LEVEL']
        })
    });

    const user = searchValByKey(users, 'email', 'rpgpunzalan@gmail.com');
    const salesRows = await salesSheet.getRows();
    const sales = [];
    salesRows.map((sale)=>{
        sales.push({
            date: sale['DATE'],
            invoiceNumber: sale['INVOICE NUMBER'],
            customer: sale['CUSTOMER']
        })
    })

    selectedSale = {};
    const items = [];
    salesRows.map((sale)=>{
        if(sale['INVOICE NUMBER'] == 9522) {
            selectedSale = {
                date: sale['DATE'],
                invoiceNumber: sale['INVOICE NUMBER'],
                agent: sale['AGENT']
            }
            items.push({
                item: sale.ITEM,
                lotNumber: sale['LOT NUMBER'],
                expiry: sale['EXPIRY DATE'],
                qty: sale['QTY'],
                amount: sale['AMOUNT'],
                cogs: sale['COST OF GOODS']
            })
        }
    })

    selectedSale = {
        ...selectedSale,
        items
    }


}

accessSpreadsheet();