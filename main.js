const url = 'https://api.maplestory.net/character/render';
let zIdx= 10000;

const ground = 10;

function generateMapler(mapler) {
  const {name} = mapler;
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
  console.log(input);
  return new Mapler(name, input);
}

document.addEventListener('keydown', (e) => {
  if(e.key === 'm' && e.ctrlKey) {
    const randIdx = Math.floor(Math.random() * maplers.length)
    generateMapler(maplers[randIdx]);
  }
});

