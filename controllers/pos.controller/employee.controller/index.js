const bcrypt = require("bcrypt");
const {
  Employee,
  validate,
} = require("../../../models/pos.models/employee.model");

exports.findAll = async (req, res) => {
  try {
    Employee.find()
      .then(async (data) => {
        res.send({ data, message: "success", status: true });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "มีบางอย่างผิดพลาด",
        });
      });
  } catch (error) {
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};
exports.findByShopId = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    Employee.find({ employee_shop_id: id })
      .then((data) => {
        if (!data)
          res
            .status(404)
            .send({ message: "ไม่สามารถหาผู้ใช้งานนี้ได้", status: false });
        else res.send({ data, status: true });
      })
      .catch((err) => {
        res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    Employee.findById(id)
      .then((data) => {
        if (!data)
          res
            .status(404)
            .send({ message: "ไม่สามารถหาผู้ใช้งานนี้ได้", status: false });
        else res.send({ data, status: true });
      })
      .catch((err) => {
        res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    Employee.findByIdAndRemove(id, { useFindAndModify: false })
      .then((data) => {
        console.log(data);
        if (!data) {
          res.status(404).send({
            message: `ไม่สามารถลบผู้ใช้งานนี้ได้`,
            status: false,
          });
        } else {
          res.send({
            message: "ลบผู้ใช้งานนี้เรียบร้อยเเล้ว",
            status: true,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "ไม่สามารถลบผู้ใช้งานนี้ได้",
          status: false,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "ไม่สามารถลบผู้ใช้งานนี้ได้",
      status: false,
    });
  }
};
exports.update = async (req, res) => {
  console.log(req.body);
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "ส่งข้อมูลผิดพลาด",
      });
    }
    const id = req.params.id;
    if (!req.body.employee_password) {
      Employee.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
          if (!data) {
            res.status(404).send({
              message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
              status: false,
            });
          } else
            res.send({
              message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
              status: true,
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: "มีบ่างอย่างผิดพลาด" + id,
            status: false,
          });
        });
    } else {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.employee_password, salt);
      Employee.findByIdAndUpdate(
        id,
        { ...req.body, employee_password: hashPassword },
        { useFindAndModify: false }
      )
        .then((data) => {
          if (!data) {
            res.status(404).send({
              message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
              status: false,
            });
          } else
            res.send({
              message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
              status: true,
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้",
            status: false,
          });
        });
    }
  } catch (error) {
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};
exports.create = async (req, res) => {
  console.log(req.body);
  try {
    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .send({ message: error.details[0].message, status: false });

    const user = await Employee.findOne({
      employee_username: req.body.employee_username,
    });
    console.log(user);
    if (user)
      return res.status(409).send({
        status: false,
        message: "มีชื่อผู้ใช้งานนี้ในระบบเเล้ว",
      });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.employee_password, salt);

    const result = await new Employee({
      ...req.body,
      employee_password: hashPassword,
    }).save();
    res
      .status(201)
      .send({ message: "สร้างข้อมูลสำเร็จ", status: true, result: result });
  } catch (error) {
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};
