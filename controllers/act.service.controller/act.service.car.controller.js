const {
  TypeCars,
  validate,
} = require("../../models/act.service.model/act.service.car.model");

module.exports.createTypeCar = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      price_service: req.body.price_service,
    };
    const actTypecar = new TypeCars(data);
    if (!actTypecar) {
      return res
        .status(403)
        .send({status: false, message: "ไม่สามารถบันทึกได้"});
    } else {
      return res
        .status(200)
        .send({status: true, message: "บันทึกสำเร็จ", data: actTypecar});
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({message: "มีบางอย่างผิดพลาด", error: "server side error"});
  }
};

module.exports.getTypecarAll = async (req, res) => {
  try {
    const type_car = await TypeCars.find();
    if (!type_car) {
      return res
        .status(403)
        .send({status: false, message: "ดึงข้อมูลประเภทรถไม่สำเร็จ"});
    } else {
      return res
        .status(200)
        .send({status: true, message: "ดึงข้อมูลสำเร็จ", data: type_car});
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({message: "มีบางอย่างผิดพลาด", error: "server side error"});
  }
};

module.exports.getTypecarById = async (req, res) => {
  try {
    const id = req.params.id;
    const type_car = await TypeCars.findById(id);
    if (!type_car) {
      return res
        .status(403)
        .send({status: false, message: "ดึงข้อมูลประเภทรถไม่สำเร็จ"});
    } else {
      return res
        .status(200)
        .send({status: true, message: "ดึงข้อมูลสำเร็จ", data: type_car});
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({message: "มีบางอย่างผิดพลาด", error: "server side error"});
  }
};

module.exports.updateTypeCar = async (req, res) => {
  try {
    const id = req.params.id;
    const data = {
      name: req.body.name,
      price_service: req.body.price_service,
    };
    const type_car = await TypeCars.findByIdAndUpdate(id, data);
    if (!type_car) {
      return res
        .status(403)
        .send({status: false, message: "แก้ไขประเภทรถไม่สำเร็จ"});
    } else {
      return res
        .status(403)
        .send({status: false, message: "แก้ไขประเภทรถสำเร็จ"});
    }
  } catch (error) {
    return res
      .status(500)
      .send({message: "มีบางอย่างผิดพลาด", error: "server side error"});
  }
};

module.exports.deleteTypeCar = async (req, res) => {
  try {
    const id = req.params.id;
    const data = {
      name: req.body.name,
      price_service: req.body.price_service,
    };
    const type_car = await TypeCars.findByIdAndUpdate(id, data);
    if (!type_car) {
      return res
        .status(403)
        .send({status: false, message: "แก้ไขประเภทรถไม่สำเร็จ"});
    } else {
      return res
        .status(403)
        .send({status: false, message: "แก้ไขประเภทรถสำเร็จ"});
    }
  } catch (error) {
    return res
      .status(500)
      .send({message: "มีบางอย่างผิดพลาด", error: "server side error"});
  }
};