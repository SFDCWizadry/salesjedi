#!/usr/bin/env node

/**
 * salesjedi
 * https://github.com/SFDCWizadry/salesjedi
 *
 * Copyright (c) 2015 Alfian Busryo
 * Licensed under the MIT license.
 */

var repl = require("repl"),
  _ = require('underscore'),
  jsforce = require('jsforce'),
  readlineSync = require('readline-sync'),
  table = require('better-console').table;

var url = readlineSync.question('Your Salesforce login url (ex: https://ap.salesforce.com): ');
var username = readlineSync.question('Your username (we won\'t keep): ');
var passwd = readlineSync.question('Your password (we won\'t keep): ', {
  hideEchoBack: true
});

var conn = new jsforce.Connection({
  loginUrl : url
});
conn.login(username, passwd, function(err, userInfo) {
  if (err) { return console.error(err); }
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);

  var repleCommand = repl.start({
    prompt: "soql> ",
    ignoreUndefined: true,
    eval: function(cmd, context, filename, callback) {
      var records = [];
      conn.query(cmd, function(err, result) {
        if (err) { return console.error(err); }
        var filteredRecords = _.map(result.records, function(value, key) {
          delete value.attributes;
          return value;
        });
        table(filteredRecords);
        callback(); 

      });

    }
  });
});