const {TopupWallet,validate_topup_wallet} = require('../../models/topup_wallet.model/topup_wallet.model')
const axios = require('axios');
const dayjs = require('dayjs');
//CERTIFICATE SOT
const https = require("https");
const fs = require("fs");
const path = require("path");
const { default: axios } = require('axios');
const certFile = path.resolve(__dirname, "../../cert/client_nba.crt");
const keyFile = path.resolve(__dirname, "../../cert/client_nba_rsa.key");
let config_agent = null;
if (process.env.SERVICE === "production") {
  config_agent = {
    httpsAgent: new https.Agent({
      cert: fs.readFileSync(certFile),
      key: fs.readFileSync(keyFile),
      rejectUnauthorized: false,
      passphrase: "Qwer!234",
    }),
  };
}

