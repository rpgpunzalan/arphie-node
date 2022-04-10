const moment = require('moment');
const getData = require('../utils/getData');
const getSheet = require('../utils/getSheet');
const _ = require('lodash');


const getNextVoucherIndex = async () => {
    const voucherRows = await getData('VOUCHERS');
    vindexes = [];
    voucherRows.map(item=>{
        vindexes.push(item['VINDEX']);
    })
    return (+_.max(_.uniq(vindexes)))+1;
}

module.exports = {
    addVoucher: async (bulk) => {
        let voucherNo;
        const voucherRows = await getSheet('VOUCHERS');
        voucherData = await getData('VOUCHERS');
        let vindex = 1;
        if(voucherData.length>0){
            vindex = await getNextVoucherIndex();
        }
        if(!bulk.voucherNo){
            // console.log(`VCHR-${moment().format('yyyy')}-${('0000'+(+vindex)).slice(('0000'+(+vindex)).length-4)}`)
            voucherNo = `VCHR-${moment().format('yyyy')}-${('0000'+(+vindex)).slice(('0000'+(+vindex)).length-4)}`
        }
        else {
            voucherNo = bulk.voucherNo;
        }
        let bulkItems = [];
        bulk.map(({date, payee, particulars, referenceNo, amount, voucherType, pore})=>{
            bulkItems.push({
                DATE: date,
                "VOUCHER NO": voucherNo,
                PAYEE: payee,
                PARTICULARS: particulars,
                "REFERENCE NO": referenceNo,
                AMOUNT: amount,
                VINDEX: vindex,
                "VOUCHER TYPE": voucherType,
                "PORE": pore,
            })
        })
        return voucherRows.addRows(bulkItems)
            .then((data) => {
                return voucherNo
            })
            .catch((e) => {
                console.log(e)
                return false
            })
        
    },

    getVouchers: async () => {
        const voucherRows = await getData('DISPLAYVOUCHERS');
        const vouchers = [];
        const voucherNumberList = [];
        voucherRows.map(voucher=>{
            vouchers.push({
                date: voucher.DATE,
                voucherNo: voucher["VOUCHER NO"],
                payee: voucher["PAYEE"],
                particulars: voucher["PARTICULARS"],
                referenceNo: voucher['REFERENCE NO'],
                amount: voucher.AMOUNT,
                voucherType: voucher['VOUCHER TYPE'],
                pore: voucher['PORE'],
                status: voucher['STATUS']
            })
            voucherNumberList.push(voucher['VOUCHER NO'])
        })

        const grouped = _.mapValues(_.groupBy(vouchers, 'voucherNo'), vlist => vlist.map(voucher=> {
            let sum = +voucher.amount
            return _.omit({...voucher, sum}, 'voucherNo')
        }))
        const retVouchers = [];
        _.uniq(voucherNumberList).map(voucherNumber=>{
            let totalAmount = 0;
            let voucherDate, voucherPayee;
            let voucherItemList = [];
            grouped[voucherNumber].map(item=>{
                totalAmount += +item.amount;
                voucherDate = item.date,
                voucherPayee = item.payee
                voucherItemList.push({
                    particulars: item.particulars, 
                    reference: item.referenceNo,
                    amount: item.amount
                }),
                vindex= item.vindex
                status = item.status
            })
            retVouchers.push({date: voucherDate, payee: voucherPayee, voucherNumber, totalAmount, voucherItemList, vindex, status});
        })
        return retVouchers;
    },
    addVoucherDecision: async ({voucherNo, decisionDate, decision}) => {
        const voucherApprovalRows = await getSheet('VOUCHER_APPROVALS');
        return voucherApprovalRows.addRow({
            "VOUCHER NO": voucherNo,
            "APPROVAL DATE": decisionDate,
            "DECISION": decision
        }).then((data)=>{
            return voucherNo;       
        });
    }
}