const {Percent} = require('../models/pos.models/percent.profit.model')

async function marketShare(total){
    try{
        const percent = await Percent.find([0]);
        console.log(percent);
    }catch(err){
        console.log(err);
        return false;
    }
}

module.exports = {marketShare}