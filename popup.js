const online = {};

maplers.forEach((mapler) => {
  const button = document.createElement('button');
  const div = document.createElement('div');
  const name = document.createElement('h4');
  name.innerText = mapler.name;
  const status = document.createElement('h4');
  status.innerText = 'offline';
  status.classList.add('offline');
  div.append(name, status);
  button.append(div);
  div.classList.add('menu-item');
  button.addEventListener('click', () => {
    console.log('online', online);
    if(!(mapler.name in online)) {
      status.classList.remove('offline');
      status.classList.add('online');
      status.innerText = 'online';
      online[mapler.name] = true;
      sendMapler(mapler);
    } else {
      delete online[mapler.name];
      status.classList.remove('online');
      status.classList.add('offline');
      status.innerText = 'offline';
    }
  });
  document.getElementById('menu').append(button);
  document.getElementById('menu').append(document.createElement('br'));
});

function sendMapler (mapler) {
  chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {command: "login", mapler});
  });
}