/*
* [counter type=login] (value)
* account counter = {login, logout}
* visit counter = {session counter, browser counter, referrer counter}
* page counter = {page access, page rank}
* action counter = {post, comment, search}
* */
var winston = require('winston');
var moment = require('moment');

var common = require('../../../core/lib/common');
var misc = require('../../../core/lib/misc');
var connection = require('../../../core/lib/connection');

var db = require('./database');

function indexPage(req, res) {
    var params = {
        title: "관리자 화면",
        page: Number(req.query['p']) || 1
    };
}

function accountCounter(uuid, type, agent, device) {
    // insert uuid and login type and now date
    var logData = {
        uuid: uuid,
        type: type.value,
        client: agent.toString(),
        device: device.name + " (" + device.type  + ")",
        created_at: new Date()
    };

    var counterData = {
        type: type.id,
        date: moment().format('YYYYMMDD')
    };

    var mysql = connection.get();

    db.insertAccountActionLog(mysql, logData, function (error, result) {
        if (error) {
            winston.error(error);
        } else {
            winston.verbose('Insert user ' + counterData.type + ' record:', uuid);
        }
    });

    db.updateAccountCounter(mysql, counterData, function (error, result) {
        if (error) {
            winston.error(error);
        } else {
            winston.verbose('Updated ' + counterData.type + ' info record:', uuid);
        }
    });
}

function sessionCounter(type) {
    var counterData = {
        type: type.id,
        date: moment().format('YYYYMMDD')
    };

    var mysql = connection.get();

    db.updateAccountCounter(mysql, counterData, function (error, result) {
        if (error) {
            winston.error(error);
        } else {
            winston.verbose('Updated ' + counterData.type + ' info record:');
        }
    });
}

function pageCounter(path, method, ip, ref, agent, device) {
// var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
/*
    var fullUrl = url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
    });
*/
    var logData = {
        path: path,
        method: method,
        ip: ip,
        ref: ref,
        client: agent.toString(),
        device: device.name + " (" + device.type  + ")",
        created_at: new Date()
    };
    var counterData = {
        path: path,
        date: moment().format('YYYYMMDD')
    };

    var mysql = connection.get();

    // insert log
    db.insertPageViewLog(mysql, logData, function (error, result) {
        if (error) {
            winston.error(error);
        } else {
            winston.verbose('Insert visit log record:', result.insertId);
        }
    });

    // update counter
    db.updatePageCounter(mysql, counterData, function (error, result) {
        if (error) {
            winston.error(error);
        } else {
            winston.verbose('Update visit counter record:', result.insertId || result.changedRows);
        }
    });
}

function checkSession(sessID, callback) {
    var mysql = connection.get();

    db.selectSession(mysql, sessID, function (error, rows) {
        var result = false;

        if (!(rows && rows[0] && rows[0].id)) result = true;

        callback(error, result);
    });
}

function insertSessionLog(sessID, userID, callback) {
    var mysql = connection.get();

    db.insertSessionLog(mysql, {session: sessID, uuid: userID}, function (error, result) {
        winston.verbose('Inserted new session log record:', sessID);

        callback && callback(error, result);
    });
}

module.exports = {
    index: indexPage,
    session: checkSession,
    insertSessionLog: insertSessionLog,
    insertAccountCounter: accountCounter,
    insertSessionCounter: sessionCounter,
    insertPageCounter: pageCounter,
    insertActionCounter: indexPage,
    insertVisitCounter: indexPage
};