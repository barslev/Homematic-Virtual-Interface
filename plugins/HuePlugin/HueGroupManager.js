"use strict";

//
//  HueGroupManager.js
//  Homematic Virtual Interface Plugin
//
//  Created by Thomas Kluge on 29.11.16.
//  Copyright � 2016 kSquare.de. All rights reserved.
//
var HueDevice = require(__dirname + "/HueDevice.js").HueDevice;

var HomematicDevice;
	
var HueGroupManager = function(plugin, hueApi) {

    this.mappedGroups = [];
    this.hmDevices = [];
    this.hueApi = hueApi;
    this.log = plugin.log;
    this.server = plugin.server;
    this.bridge = plugin.server.getBridge();

    if (this.bridge == undefined) {
	   throw("HM Layer was not set correctly");
    }
    
	HomematicDevice = plugin.server.homematicDevice;

}

HueGroupManager.prototype.addGroup = function(group) {
	var id  = this.mappedGroups.length;
	this.log.debug("Adding Group ID %s",id);
	group["id"]=id;
	this.mappedGroups.push(group);
}


HueGroupManager.prototype.getGroup = function(groupId) {
	var result = undefined;
	
	this.mappedGroups.forEach(function(group){
		if (group["id"]==groupId) {
			result = group;
		}
	});
	return result;
}



HueGroupManager.prototype.publish = function(publishedGroups,ccuNotification) {
  // First remove all HUEGR* Devices
  
  var i = 1;
  var cnt = 0;
  var that = this;

  
  var devices = this.bridge.devicesWithNameLike("HUEGROUP");
  
  this.log.debug(devices);
  devices.forEach(function (device){
	  that.bridge.deleteDevice(device,ccuNotification);
  });
  
  
  
  var groups = publishedGroups;
  if (groups.length>0) {
  groups.forEach(function (groupid){
	  var group = that.getGroup(groupid);
	  if (group != undefined) {
	  	that.log.debug("Adding new Group " + group["name"]);
    	group["hm_device_name"] = "HUEGROUP00" + group["id"];
		that.hmDevices.push(new HueDevice(that,that.hueApi,group,"HUEGROUP00"));
	  }
  });
  }
}


HueGroupManager.prototype.getMappedGroups = function() {
  return this.mappedGroups;
}

module.exports = {
	HueGroupManager : HueGroupManager
}