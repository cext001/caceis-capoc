require('dotenv').config();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

console.log("HOST: " + process.env.DB_HOST + ", USER: " + process.env.DB_USER + ", PASS: " + process.env.DB_PASS + ", DBNAME: " + process.env.DB_NAME);

module.exports = {
    "getCustomerDetails": function (customerId) {
        return new Promise(function (resolve, reject) {
            con.query("SELECT * FROM customer WHERE Customer_ID=?", [customerId], function (err, result, fields) {
                if (err) {
                    reject(err)
                };
                resolve(result)
            });
        });
    },
    "saveChatHistory": function (record) {
        return new Promise(function (resolve, reject) {
            con.query("INSERT INTO messagecentre(Message_ID,Mode,Customer_ID,Name,Date,Subject,Status,Assigned,Chat_History) VALUES (?,?, ?,?,?,?,?,?,?)", record, function (err, result) {
                if (err) {
                    reject(err)
                };
                console.log("Number of records inserted: " + result.affectedRows);
                resolve(result);
            });
        });
    },
    "getSecurityDetailsByName": function (securityName) {
        return new Promise(function (resolve, reject) {
            con.query("SELECT * FROM security WHERE Security_Name LIKE ?", [securityName + "%"], function (err, result, fields) {
                if (err) {
                    reject(err)
                };
                resolve(result)
            });
        });
    },
    "getCustomersHoldingForISIN": function (customerId, ISIN) {
        return new Promise(function (resolve, reject) {
            con.query("SELECT * FROM holdingtable WHERE customer_ID= ? AND Security_ID=?", [customerId, ISIN], function (err, result, fields) {
                if (err) {
                    reject(err)
                };
                resolve(result)
            });
        });
    },
    "getTradeStatusBySecurityIdAndCustomerId": function (securityId, customerId) {
        return new Promise(function (resolve, reject) {
            con.query("SELECT * FROM tradetable WHERE Security_ID=? AND customer_ID= ? ", [securityId, customerId], function (err, result, fields) {
                if (err) {
                    reject(err)
                };
                resolve(result)
            });
        });
    },
    "getCorporateActionInfoForSecurity": function (securityId) {
        return new Promise(function (resolve, reject) {
            con.query("SELECT * FROM corporateactionevent WHERE Security_ID=?", [securityId], function (err, result, fields) {
                if (err) {
                    reject(err)
                };
                resolve(result)
            });
        });
    },
    "getHoldingAndCorporateActionData": function (customerId, securityId) {
        return new Promise(function (resolve, reject) {
            con.query("CALL getHoldingAndCorporateActionData(?, ?)", [customerId, securityId], function (err, result, fields) {
                if (err) {
                    reject(err)
                };
                resolve(result)
            });
        });
    },
    "getFormattedDate": function () {
        var today = new Date();
        var date = "";
        var dd = today.getDate();
        var mm = today.getMonth() + 1;

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        date = yyyy + '-' + mm + '-' + dd;

        return date;
    }
};