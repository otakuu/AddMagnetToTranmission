// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.



chrome.contextMenus.onClicked.addListener(function(info, tab) {
    
    console.log('url: '+info.linkUrl)
    
    //get username password
    chrome.storage.sync.get({
    itemUsername: 'username_default',
    itemPassword: 'password_default',
    itemUrl: 'url_default'
  	}, function(items) {
  	
    var username = items.itemUsername;
    var password = items.itemPassword;
    var url = items.itemUrl;
  	
  	console.log('username: '+username);
  	
  	var base64UsernamePw = window.btoa(username+":"+password);
  	console.log('base64: '+base64UsernamePw);
    
	// first get sessionId
    var xhrSession = new XMLHttpRequest();
	xhrSession.open("POST", url+"transmission/rpc", true);
	xhrSession.setRequestHeader("Authorization", "Basic "+base64UsernamePw+"");
	xhrSession.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	xhrSession.setRequestHeader("Content-Type", "json");
	xhrSession.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");

	xhrSession.onreadystatechange = function() {
  	if (xhrSession.readyState == 4) {
    	var startStr = xhrSession.responseText.indexOf('X-Transmission-Session-Id: ');
    	var sessionId = xhrSession.responseText.substring(startStr+27,startStr+27+48)
    	console.log(sessionId)
    	
    	//then add the torrent 
    	var paramJson = JSON.stringify({method:"torrent-add", arguments:{paused: "false", filename: info.linkUrl}})
    	console.log(paramJson);
    
    	var xhr = new XMLHttpRequest();
		xhr.open("POST", url+"transmission/rpc", true);
		xhr.setRequestHeader("Authorization", "Basic "+base64UsernamePw+"");
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.setRequestHeader("Content-Type", "json");
		xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
		xhr.setRequestHeader("X-Transmission-Session-Id", ""+sessionId+"");

		xhr.onreadystatechange = function() {
  		if (xhr.readyState == 4) {
    		console.log(xhr.responseText)
    		alert('torrent added! '+xhr.responseText)
  			}
		}
		xhr.send(paramJson);
    	
  		}
	}
	xhrSession.send();

    //open ui in new tab
  	var newURL = url+"transmission/web/";
    chrome.tabs.create({ url: newURL });
  	
  	});

});

chrome.contextMenus.create({
  id: 'open',
  title: 'add torrent to transmission',
  contexts: ['link'],
});
