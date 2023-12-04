const axios = require("axios");
const {IATA} = require("../../models/aoc.service.model/iata.model");

exports.createIATA = async (req, res) => {
  try {
    const data = {
      number: req.body.number,
      province_th: req.body.province_th,
      province_en: req.body.province_en,
      IATA: req.body.iata,
      name: req.body.name,
    };
    const new_IATA = await IATA(data);
    new_IATA.save((err, data) => {
      if (err) {
        return res
          .status(403)
          .send({status: false, message: "ไม่สามารถเพิ่มข้อมูลได้"});
      }
      return res
        .status(200)
        .send({status: true, message: "เพิ่มข้อมูลสำเร็จ", data: data});
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.getIATA = async (req, res) => {
  try {
    const IATA_list = await IATA.find();
    if (IATA_list) {
      return res
        .status(200)
        .send({status: true, message: "ดึงข้อมูลสำเร็จ", data: IATA_list});
    } else {
      return res
        .status(400)
        .send({message: "ดึงข้อมูลไม่สำเร็จ", status: false});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.getIATAById = async (req, res) => {
  try {
    const id = req.params.id;
    const iata = await IATA.findById(id);
    if (!iata) {
      return res
        .status(400)
        .send({message: "ดึงข้อมูลไม่สำเร็จ", status: false});
    } else {
      return res
        .status(200)
        .send({status: true, message: "ดึงข้อมูลสำเร็จ", data: iata});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.updateIATAById = async (req, res) => {
  try {
    const id = req.params.id;
    const iata_data = await IATA.findById(id);

    const number = req.body.number ? req.body.number : iata_data.number;
    const name = req.body.name ? req.body.name : iata_data.name;
    const province_th = req.body.province_th
      ? req.body.province_th
      : iata_data.province_th;
    const province_en = req.body.province_en
      ? req.body.province_en
      : iata_data.province_en;
    const iata = req.body.iata ? req.body.iata : iata_data.IATA;

    const data = {
      number: number,
      province_en: province_en,
      province_th: province_th,
      IATA: iata,
      name: name,
    };
    IATA.findByIdAndUpdate(id, data, {returnDocument: "after"}, (err, data) => {
      if (err) {
        return res
          .status(403)
          .send({status: false, message: "แก้ไขข้อมูลไม่สำเร็จ"});
      }
      if (data) {
        return res
          .status(200)
          .send({status: true, message: "แก้ไขข้อมูลสำเร็จ", data: data});
      } else {
        return res
          .status(403)
          .send({status: false, message: "แก้ไขข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง"});
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.deleteIATA = async (req, res) => {
  try {
    const id = req.params.id;
    IATA.findByIdAndDelete(id, (err, data) => {
      if (err) {
        return res
          .status(403)
          .send({status: false, message: "ลบไม่ข้อมูลสำเร็จ", data: err});
      }
      if (data) {
        return res.status(200).send({status: true, message: "ลบข้อมูลสำเร็จ"});
      } else {
        return res
          .status(403)
          .send({status: false, message: "ลบข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง"});
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};
