var Promise = require("bluebird");
var iSDK = require('infusionsoft');
var config = require('./config');
var DUPCHECK_FIELD = "Email";
var REASON = "API_CONTACT_UPDATE";
var groupId;
var contactId;
var client = new iSDK(config.appName, config.key);
Promise.promisifyAll(client);

var _parseGroupId = function(event) {
  return (event.tagId === undefined ? -1 : event.tagId);
}

var _parseContact = function(event){
  var firstName = (event.firstName === undefined ? 'unknown' : event.firstName);
  var lastName = (event.lastName === undefined ? 'unknown' : event.lastName);
  var email = (event.email === undefined ? 'unknown' : event.email);
  var phone = (event.phone === undefined ? '' : event.phone);

  return {
    FirstName: firstName,
    LastName: lastName,
    Email: email,
    Phone1: phone
  }
}

exports.handler = function(event, context) {
  console.log("infusion soft : contact update, optin, and tag, handler start : ", event, context, config);
  contactData = _parseContact(event);
  groupId = _parseGroupId(event);

  console.log("calling addWithDupCheckAsync : ", contactData, DUPCHECK_FIELD);
  client.addWithDupCheckAsync(contactData, DUPCHECK_FIELD )
  .then(
    function(data) {
     contactId = data;
     console.log("addWithDupCheck : done : ", contactId, contactData.Email);
     console.log("calling optInAsync : ", contactData.Email, REASON);
     return client.optInAsync(contactData.Email, REASON);
    }
  )
  .then(
    function(data) {
      console.log("optIn : done : ", data);
      console.log("calling grpAssign : ", contactId, groupId);
      return client.grpAssignAsync(contactId, groupId);
    }
  )
  .then(
    function(data){
       console.log("Done : ", data);
       context.done(null, {"STATUS":200}); // SUCCESS with message
       return true;
    }
  )
  .catch(function(err){
    console.error("Error : err", err);
    context.fail("Error : an error has occured");
  });
};
