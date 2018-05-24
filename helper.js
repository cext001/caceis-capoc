var mysql = require('mysql');

var con = mysql.createConnection({
    host: "52.71.120.86",
    user: "root",
    password: "root",
    database: "caceis"
});

module.exports = {
    "getCustomerDetails": function (customerId) {
        return new Promise(function (resolve, reject) {
            con.query("SELECT count(S_No) as count FROM customer WHERE Customer_ID=?", [customerId], function (err, result, fields) {
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
            con.query("SELECT * FROM security WHERE Security_Name LIKE ?", [securityName+"%"], function (err, result, fields) {
                if (err) {
                    reject(err)
                };
                resolve(result)
            });
        });
    }
};