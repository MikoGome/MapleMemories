const url = 'https://api.maplestory.net/character/render';
let zIdx= 10000;

const ground = 10;

const onlineMaplers = {};

const maplerStorage = {};

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if(msg.command ===  'login') {
    const {mapler} = msg;
    onlineMaplers[mapler.name] = true;
    maplerStorage[mapler.name] = generateMapler(mapler);
  } else if(msg.command === 'logout') {
    const {name} = msg;
    maplerStorage[name].logOut();
    delete onlineMaplers[name];
  } else if(msg.command === 'getOnline') {
    chrome.runtime.sendMessage({command: 'sentOnline', onlineMaplers})
  }
});

function generateMapler(mapler) {
  const {name} = mapler;
  if(name in maplerStorage) {
    return reinitialize(maplerStorage[name]);
  }
  const input = {};
  input.skin = mapler.body.skin.id;
  input.faceId = mapler.body.face.id;
  input.hairId = mapler.body.hair.id;
  input.pose = mapler.body.pose.id;
  input.poseFrame = mapler.body.pose.frame;
  input.faceEmote = mapler.body.face.animationName;
  input.faceFrame = mapler.body.face.frame;
  input.ears = mapler.body.ears.id;

  input.itemIds = [];
  for(const key in mapler.items) {
    if(mapler.items[key].id) input.itemIds.push(Number(mapler.items[key].id))
  }
  input.effectFrame = 0;

  input.chairItemId = mapler.chair.id;
  input.chairFrame = mapler.chair.frame;
  return new Mapler(name, input);
}

function reinitialize(mapler) {
  spawn(mapler);
  const {faceEmote, pose} = mapler;
  mapler.sprite.setAttribute('src', mapler.content[faceEmote][pose]);
  document.body.append(mapler.char);
  return mapler;
}

document.onkeydown = (e) => {
  if(e.key === 'p') {
    for(const key in maplerStorage) {
      maplerStorage[key].jump();
    }
  }
}

