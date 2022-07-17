let onlineMaplers = {};

maplers.forEach((mapler) => {
  const button = document.createElement('button');
  const div = document.createElement('div');
  const name = document.createElement('h4');
  name.innerText = mapler.name;
  const status = document.createElement('h4');
  status.innerText = 'offline';
  status.classList.add('status', 'offline');
  div.append(name, status);
  button.append(div);
  div.classList.add('menu-item');
  button.addEventListener('click', () => {
    if(!(mapler.name in onlineMaplers)) {
      status.classList.remove('offline');
      status.classList.add('online');
      status.innerText = 'online';
      onlineMaplers[mapler.name] = true;
      loginMapler(mapler);
    } else {
      delete onlineMaplers[mapler.name];
      status.classList.remove('online');
      status.classList.add('offline');
      status.innerText = 'offline';
      logoutMapler(mapler);
    }
  });
  document.getElementById('menu').append(button);
  document.getElementById('menu').append(document.createElement('br'));
  button.addEventListener('update', () => {
    if(mapler.name in onlineMaplers) {
      status.classList.remove('offline');
      status.classList.add('online');
      status.innerText = 'online';
      onlineMaplers[mapler.name] = true;
    } else {
      delete onlineMaplers[mapler.name];
      status.classList.remove('online');
      status.classList.add('offline');
      status.innerText = 'offline';
    }
  });
});

function loginMapler(mapler) {
  chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {command: "login", mapler});
  });
}

function logoutMapler(mapler) {
  chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {command: 'logout', name: mapler.name});
  });
}

chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
  const activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, {command: "getOnline"});
});

chrome.extension.onMessage.addListener((msg, sender, response) => {
  if(msg.command === 'sentOnline') {
    onlineMaplers = msg.onlineMaplers;
    document.querySelectorAll('button').forEach(el => {
      el.dispatchEvent(new Event('update'));
    });
  }
});