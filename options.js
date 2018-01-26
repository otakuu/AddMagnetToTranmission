// Saves options to chrome.storage
function save_options() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var url = document.getElementById('url').value;
  chrome.storage.sync.set({
    itemUsername: username,
    itemPassword: password,
    itemUrl: url
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores stored in chrome.storage.
function restore_options() {
  // Use defaults
  chrome.storage.sync.get({
    itemUsername: 'username_default',
    itemPassword: 'password_default',
    itemUrl: 	  'url_default'
  }, function(items) {
    document.getElementById('username').value = items.itemUsername;
    document.getElementById('password').value = items.itemPassword;
    document.getElementById('url').value = items.itemUrl;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);