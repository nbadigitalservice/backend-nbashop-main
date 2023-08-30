const { WalletHistory } = require('../models/wallet.history.model')

//get All wallet history
module.exports.GetAll = async (req, res) => {
    try {
        const wallethistory = await WalletHistory.find()
        return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: wallethistory })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: 'server side error' })
    }
}

module.exports.GetWalletHistoryByPartnerId = async (req, res) => {
    try {
        const wallethistory = await WalletHistory.find({ partner_id: req.params.id });
        console.log(wallethistory)
        if (!wallethistory) {
            return res.status(403).send({ status: false, message: 'ไม่พบข้อมูล' });

        } else {
            return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: wallethistory });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: "server side error" })
    }
}

//Create
module.exports.create = async (req, res) => {
    try {
  
          //create collection
          const data = {
            shop_id: req.body.shop_id,
            partner_id: req.body.partner_id,
            orderid: req.body.orderid,
            name: req.body.name,
            type: req.body.type,
            amount: req.body.amount
          }
          const wallethistory = new WalletHistory(data);
          wallethistory.save(error => {
            if (error) {
              res.status(403).send({ status: false, message: 'ไม่สามารถบันทึกได้', data: error })
            } else {
              res.status(200).send({ status: true, message: 'บันทึกสำเร็จ', data: wallethistory })
            }
          })
          //end
        
      
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }