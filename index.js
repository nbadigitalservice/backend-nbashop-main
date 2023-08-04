//Production
// const path = require("path");
// require("dotenv").config({path:__dirname +  "/.env"});

//test index.js

//Dev
require("dotenv").config();

const fs = require('fs');
const https = require('https');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connection = require("./config/db");
connection();


app.use(bodyParser.json({limit: '50mb', type: 'application/json'}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());

// Delete Image
app.use("/v1/nba-shop/delete/image", require("./routes/pos/deleteImage"));
// CALL ME
app.use("/v1/nba-shop/me", require("./routes/pos/me"));
// UPLOAD FILE COLLECTION
app.use(
  "/v1/nba-shop/image/collection",
  require("./routes/pos/uploadfile.collection")
);
// Line Notify
app.use("/v1/nba-shop/line-notify", require("./routes/pos/line.notify"));
// LOGIN
app.use("/v1/nba-shop/login", require("./routes/pos/login"));
app.use("/v1/nba-shop/login-company", require("./routes/pos/login.company"));

app.use("/v1/nba-shop/admin", require("./routes/pos/admin"));
// Check
app.use("/v1/nba-shop/check", require("./routes/pos/check"));

app.use("/v1/nba-shop/employee", require("./routes/pos/employee"));
app.use("/v1/nba-shop/partner", require("./routes/pos/partner"));
app.use("/v1/nba-shop/shop", require("./routes/pos/shop"));
app.use("/v1/nba-shop/company", require("./routes/pos/company"));

app.use("/v1/nba-shop/product/nba", require("./routes/pos/product.nba"));
app.use("/v1/nba-shop/product/shop", require("./routes/pos/product.shop"));

app.use("/v1/nba-shop/preorder/nba", require("./routes/pos/preorder.nba"));
app.use("/v1/nba-shop/preorder/shop", require("./routes/pos/preorder.shop"));
app.use('/v1/nba-shop/preorder/consignment', require('./routes/pos/preorder.consignment'))
app.use('/v1/nba-shop/preorder/dealer', require('./routes/dealer/podealer'))
app.use(
  "/v1/nba-shop/preorder/shop-full",
  require("./routes/pos/preorder.shop.full")
);

app.use("/v1/nba-shop/invoice/shop", require("./routes/pos/invoice.shop"));
app.use("/v1/nba-shop/invoice-tax", require("./routes/pos/invoice.tax"));

app.use("/v1/nba-shop/return/product", require("./routes/pos/return.product"));
// Types
app.use("/v1/nba-shop/type", require("./routes/pos/type"));
app.use("/v1/nba-shop/dealer", require("./routes/pos/dealer"));


app.use(
  "/v1/nba-shop/product/request",
  require("./routes/pos/product.request")
);

app.use(
  "/v1/nba-shop/product/reference",
  require("./routes/pos/product.reference")
);
app.use("/v1/nba-shop/brand", require("./routes/pos/brand"));

app.use("/v1/nba-shop/percent-profit", require("./routes/pos/percent.profit"));

app.use(
  "/v1/nba-shop/advertising-image",
  require("./routes/pos/advertising.image")
);

//art work
app.use(
  "/v1/nba-shop/artwork", require("./routes/artwork/index")
)
app.use("/v1/nba-shop/artwork/product-graphic",require("./routes/artwork/product.graphic"));

//order
app.use("/v1/nba-shop/order", require("./routes/pos/order"));
app.use('/v1/nba-shop/order_consignment', require('./routes/pos/order.consignment'))
app.use("/v1/nba-shop/product/store", require("./routes/pos/product.store"))

//facebook service
app.use("/v1/nba-shop/facebookservice", require("./routes/facebookservice/index"))

//website service
app.use("/v1/nba-shop/websiteservice", require("./routes/websiteservice/index"))

//account service
app.use("/v1/nba-shop/accountservice", require("./routes/accountservice/index"))

//por ror bor service
app.use("/v1/nba-shop/actlegalservice", require("./routes/actservice/index"))

// service order controller
app.use("/v1/nba-shop/orderservice", require("./routes/order.service/order.service.router"))

//express ระบบ ขนส่ง
app.use("/v1/nba-shop/express/product", require("./routes/express/product.express"));
app.use("/v1/nba-shop/express", require("./routes/express/booking.shippop"));
app.use("/v1/nba-shop/express/order", require("./routes/express/order.express"));
app.use('/v1/nba-shop/express/percent_courier', require("./routes/express/percent.courier"))
app.use("/v1/nba-shop/express/box_standard", require("./routes/express/box.standard"))
app.use('/v1/nba-shop/express/address_book/', require("./routes/express/address.book"))

//counter service
app.use("/v1/nba-shop/counter_service/", require('./routes/cs/'))
app.use("/v1/nba-shop/counter_service/percent", require('./routes/cs/percent'))
app.use("/v1/nba-shop/counter_service/service", require("./routes/cs/service"))
app.use("/v1/nba-shop/counter_service/barcode", require('./routes/cs/barcode'))
app.use('/v1/nba-shop/counter_service/mobile_bill', require('./routes/cs/mobile_bill.js'))
app.use('/v1/nba-shop/counter_service/wallet', require('./routes/cs/wallet'))
app.use('/v1/nba-shop/counter_service/nba', require('./routes/cs/nba'))

//เติมเงินมือถือ
app.use('/v1/nba-shop/counter_service/mobile_topup', require('./routes/mobile_topup/index'));
app.use('/v1/nba-shop/counter_service/card_topup', require('./routes/mobile_topup/card.topup'))
app.use('/v1/nba-shop/mobile_topup', require('./routes/mobile_topup/mobile.topup'))
//More
app.use("/v1/nba-shop/more/money_history", require("./routes/more/money.history"))
app.use('/v1/nba-shop/more/credit_history', require('./routes/more/credit.history'))
app.use('/v1/nba-shop/more/function_more', require("./routes/more/function.more"))
app.use('/v1/nba-shop/more/service_nba', require('./routes/more/service_nba'))
app.use('/v1/nba-shop/more/debit_history', require('./routes/more/debit.history'))
app.use('/v1/nba-shop/more/platform', require('./routes/more/platform'))

//จัดการหมวดหมู่สินค้า
app.use('/v1/nba-shop/category', require("./routes/pos/category"));

//เติมเงินเข้ากระเป๋าอิเล็กทรอนิกส์
app.use('/v1/nba-shop/partner/wallet_topup', require('./routes/topup_wallet/collection'))
app.use('/v1/nba-shop/partner/wallet_topup/slip', require('./routes/topup_wallet/slip'))  //สลิปโอนเงิน
app.use('/v1/nba-shop/partner/wallet_topup/qrcode', require('./routes/topup_wallet/qrcode'));

app.use('/v1/nba-shop/callback', require('./routes/callback'));

//Thailand
app.use('/v1/nba-shop/thailand', require('./routes/thailand'));

//public
app.use('/v1/nba-shop/public', require('./routes/public'))

//api partner
app.use('/v1/nba-shop/api/',require('./routes/api'));


const port = process.env.PORT || 9030;
app.listen(port, console.log(`Listening on port ${port}...`));