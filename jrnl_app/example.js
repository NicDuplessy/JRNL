/*
#f75926 Orange
#1c2037 Dark Blue
#656673 Grey Blue
#afacb0 Grey
#f9f2ed White 
Logo Font = Montserrat Light Alt1
*/

// IFT 402 JRNL Nicolas Duplessy, Jesse Wells, Lane Gibbons, Rodolfo De Luna

/*Asset Entry class. Will take this template to create new objects for asset entry taking the 5 arguments.
All arguments will be taken as strings. Serial Number will be serial number from device, status will be set or updated by 
technician/admin to in Use, Available, On Order, Maintenance, Unknown, & Retired. Asset conditions will be New, Good, Fair, 
Unknown, and Scrap.
*/
class AssetEntry {
  newAsset(serialNum, status, model, condition, assignedTo) {
    this.serialNum = serialNum;
    this.status = status;
    this.model = model;
    this.condition = condition;
    this.assignedTo = assignedTo;
  }
}

/*Asset Request class. User input for new device request will take this class as a template to create a new object request for 
new device. It will take 2 arguments which will be device type(laptop, tablet, cellphone, etc.) and requester which is the person
making the asset request. */
class AssetRequest {
  newRequest(typeDevice, requester) {
    this.typeDevice = typeDevice;
    this.requester = requester;
  }
}

//Created global variables for user input to allow for all classes/functions to use these variables.
let assetNum, assetStatus, assetModel, assetCondition;
assetAssignedTo;

//Function to take user input for asset entry info.
function newEntryPrompt() {
  assetNum = prompt("Enter asset Serial Number: ");
  assetStatus = prompt("Enter asset Status: ");
  assetModel = prompt("Enter asset Model: ");
  assetCondition = prompt("Enter asset Condition: ");
  assetAssignedTo = prompt("Enter person asset assigned to: ");
  return assetNum, assetStatus, assetModel, assetCondition, assetAssignedTo;
}

//Function to take user input for asset request. Variable scope still in decision, not sure if it will be global or local.
function assetRequestPrompt() {
  let assetDevice = prompt("Device type needed: ");
  let assetRequester = prompt("Enter your name: ");
  return assetDevice, assetRequester;
}

/*May move newEntryPrompt function and assetRequestPrompt function to the AssetEntry and AssetRequest classes to allow for faster 
compiling and constructing of objects and create separate functions outside where the new objects are created. */
