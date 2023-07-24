const PercentProfit = required('../models/pos.models/percent.profit.model.js');

modules.exports.CommisionCalculator = async (req,res) => {

    const percentProfit = await PercentProfit.find();
    



}