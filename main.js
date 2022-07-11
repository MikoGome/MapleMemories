const url = 'https://api.maplestory.net/character/render';
let zIndex= 1000;

class Mapler {
  constructor(name, body) {
    this.name = name;
    this.body = body;
    this.faceFrame = 0;
    this.poseFrame = 0;
    this.content = {};
    fetchPose(this, this.body, 'default', 'standingOneHanded');
    makeAlive(this);
  }

  changePose(pose) {
    const poses = [
      'standingOneHanded', 
      'alert',
      'sitting',
      'flying', 
      'lyingDown', 
      'lyingDownStabbing', 
      'firingBow', 
      'firingCrossbow', 
      'firingBigBow',
      'stabbingOneHanded',
      'thrustingOneHanded',
      'stabbingTwoHanded',
      'thrustingTwoHanded',
      'throwingBackhanded',
      'throwingDownward',
      'throwingForehanded',
      'bashing',
      'smashing',
      'slashingBehind',
      'slashingFront',
      'slashingUpward',
      'spinningSlash'
    ];
    const randPose = pose || poses[Math.floor(Math.random() * poses.length)];
    console.log(randPose);
    this.poseFrame = 0;
    fetchPose(this, this.body, this.faceEmote, randPose);
  }

  changeEmote(emote) {
    const emotes = [
      'default', 
      'hit', 
      'smile', 
      'troubled', 
      'cry', 
      'angry', 
      'bewildered', 
      'stunned'
    ];
    const randEmote = emote || emotes[Math.floor(Math.random() * emotes.length)];
    console.log(randEmote);
    this.emoteFrame = 0;
    fetchPose(this, this.body, randEmote, this.pose);
  }
}

function fetchPose(mapler, info, faceEmote, pose) {
  console.log('faceEmote', faceEmote, 'pose', pose);
  if(mapler.content[faceEmote] && mapler.content[faceEmote][pose]) {
    mapler.faceEmote = faceEmote;
    mapler.pose = pose;
    return;
  }
  const body = JSON.parse(JSON.stringify(info));
  const fetchPoses = [];
  if(!mapler[faceEmote]) mapler.content[faceEmote] = {};
  const poseArr = mapler.content[faceEmote][pose] = [];
  for(let i = 0; i < 4; i++) {
    body.faceEmote = faceEmote;
    body.pose = pose;
    body.poseFrame = i;
    if(pose !== 'sitting') {
      delete body.chairItemId;
      delete body.chairFrame;
    }
    fetchPoses[i] = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    })
      .then(res => {
        if(res.ok) {
          return res.blob()
        }
        return null;
      });
  }
  Promise.all(fetchPoses)
    .then(blobs => {
      blobs.forEach(blob => {
        if(!blob) return;
        poseArr.push(URL.createObjectURL(blob));
      })
    })
    .then(() => {
      mapler.faceEmote = faceEmote;
      mapler.pose = pose;
      console.log(pose, faceEmote);
      if(mapler.sprite) return;
      const char = document.createElement('div');
      char.classList.add('mapler');
      const sprite = mapler.sprite = document.createElement('img');
      sprite.setAttribute('src', poseArr[0]);
      sprite.setAttribute('draggable', false);
      sprite.classList.add('sprite');
      addAnimation(sprite, mapler);
      const name = document.createElement('span');
      name.classList.add('name');
      name.innerText = mapler.name;
      char.append(sprite);
      char.append(name);
      addDrag(char, mapler);
      addFlip(sprite);
      document.body.append(char);
      // css stuff
      char.style.position = 'absolute';
      char.style.top = '0';
      char.style.left= '0';
      sprite.style.transformOrigin = 'bottom';
      sprite.style.transform = 'scale(2)';
      char.style.height = '11rem';
      char.style.display = 'flex';
      char.style.flexDirection = 'column';
      char.style.justifyContent = 'flex-end';
      char.style.alignItems = 'center';
      name.style.color = 'white';
      char.style.cursor = "url('https://res.cloudinary.com/miko2/raw/upload/v1657492283/aero_arrow_nurzij.cur'), pointer";   
      name.style.background = 'rgba(0, 0, 0, 0.65)';
      name.style.textAlign = 'center';
      name.style.position = 'relative';
      name.style.margin = '0.25rem 0';
      name.style.padding = '0.25rem 0.25rem';
      name.style.fontFamily = 'Arial';
      //
    })
}


function makeAlive(mapler) {
  console.log('tetst')
  setTimeout(() => {
    const changePoseChance = Math.floor(Math.random() * 10);
    const changeEmoteChance = Math.floor(Math.random() * 10);

    if(changePoseChance < 5) {
      mapler.changePose();
    }
    if(changeEmoteChance < 5) {
      mapler.changeEmote();
    }
    makeAlive(mapler);
  }, Math.floor(Math.random() * 30000) + 1000) ;
}

function addDrag(target, mapler) {
  let drag = null;
  let x = null;
  let y = null;
  let timeOut = null;

  target.addEventListener("mousedown", (event) => {
    zIndex++;
    target.style.zIndex = zIndex;
    x = event.pageX;
    y = event.pageY;
    drag = target;
    timeOut = setTimeout(() => {
      target.style.cursor = "url('https://res.cloudinary.com/miko2/raw/upload/v1657492328/aero_move_kusjof.cur'), pointer"
      // mapler.changePose('flying');
      // mapler.changeEmote('cry');
    }, 100);
  });

  target.addEventListener("mousemove", (event) => {
    if(!drag) return;
    x2 = x - event.pageX;
    y2 = y - event.pageY;
    x = event.pageX;
    y = event.pageY;
    drag.style.left = `${drag.offsetLeft - x2 }px`;
    target.style.top = `${drag.offsetTop - y2}px`;
  });

  target.addEventListener("mouseup", () => {
    clearTimeout(timeOut);
    target.style.cursor = "url('https://res.cloudinary.com/miko2/raw/upload/v1657492283/aero_arrow_nurzij.cur'), pointer";   
    drag = null;
    zIndex++;
    // mapler.changePose();
    // mapler.changeEmote();
  });

  target.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    target.remove();
  });
}

function addAnimation(target, mapler) {
  let poseIncreasing = true;
  setInterval(() => {
    const poseArr = mapler.content[mapler.faceEmote][mapler.pose];
    const faceEmoteArr = mapler.content[mapler.faceEmote];
    if(['standingOneHanded', 'alert', 'flying'].includes(mapler.pose)) {
      if(mapler.poseFrame + 1 >= poseArr.length) {
        poseIncreasing = false;
      } else if(mapler.poseFrame - 1 < 0) {
        poseIncreasing = true;
      }
  
      if(poseIncreasing) {
        mapler.poseFrame++;
      } else {
        mapler.poseFrame--;
      }
    } else {
      mapler.poseFrame++;
      mapler.poseFrame %= poseArr.length;
    }
    const currPose = poseArr[mapler.poseFrame];
    target.setAttribute('src', currPose);
  }, 600);
}

function addFlip(target) {
  target.addEventListener("dblclick", (e) => {
    const currTransform = target.style.transform;
    target.style.transform = currTransform === 'scale(2) scaleX(-1)' ? ' scale(2) scaleX(1)': 'scale(2) scaleX(-1)';
  })
}

const maplers = [
  {
    "name":"Shitfer",
    "items":{
      "hat":{"name":"Green Headband","id":1002067},
      "earrings":{},"faceAccessory":{},
      "eyeDecoration":{},
      "top":{"name":"Blue One-Lined T-Shirt","id":1040013},
      "bottom":{"name":"Blue Jean Shorts","id":1060002},
      "overall":{},
      "glove":{},
      "weapon":{},
      "shield":{},
      "cape":{},
      "shoes":{"name":"Red Rubber Boots","id":1072001}
    },
    "body":{
      "face":{"name":"Motivated Look (Black)",
      "id":20000,"animationName":"default","frame":0},
      "hair":{"name":"Unkempt Hair","id":30023},
      "skin":{"name":"Light","id":"light"},
      "pose":{"id":"standingOneHanded","frame":"0"},
      "ears":{"id":"humanEars"}
    },
        "chair":{"name":"Sky-blue Wooden Chair","id":3010001,"frame":0}
  },
  {"name":"Dragon00034","items":{"hat":{"name":"Red Headband","id":1002318},"earrings":{"name":"Emerald Earrings","id":1032007},"faceAccessory":{},"eyeDecoration":{},"top":{"name":"Blue-Striped Undershirt","id":"1040036"},"bottom":{"name":"Underpants","id":"1062112"},"overall":{"name":"White Wizard Robe","id":1050026},"glove":{"name":"Red Lutia","id":1082051},"weapon":{},"shield":{},"cape":{},"shoes":{"name":"White Magicshoes","id":1072077}},"body":{"face":{"name":"Alert Face","id":20005,"animationName":"default","frame":0},"hair":{"name":"Unkempt Hair","id":30024},"skin":{"name":"","id":"light"},"pose":{"id":"standingOneHanded","frame":0},"ears":{"id":"humanEars"}},"chair":{"name":"The Relaxer","id":3010000,"frame":0}},
  {"name":"FamePlzo","items":{"hat":{"name":"White Bandana","id":1002019},"earrings":{},"faceAccessory":{},"eyeDecoration":{},"top":{"name":"Red-Striped Top","id":1041011},"bottom":{"name":"Red Sailor Skirt","id":1061007},"overall":{},"glove":{},"weapon":{},"shield":{},"cape":{},"shoes":{"name":"Leather Sandals","id":1072005}},"body":{"face":{"name":"Strong Stare (Red)","id":21203,"animationName":"default","frame":0},"hair":{"name":"Red Caspia","id":31221},"skin":{"name":"","id":"light"},"pose":{"id":"standingOneHanded","frame":0},"ears":{"id":"humanEars"}},"chair":{"name":"The Relaxer","id":3010000,"frame":0}},
]

/*
const body = {
  "skin": "light",
  "faceId": 20000,
  "hairId": 30000,
  "pose": "standingOneHanded",
  "poseFrame": 1,
  "faceEmote": "default",
  "faceFrame": 0,
  "ears": "humanEars",
  "itemIds": [
    1060002,
    1040193
  ],
  "effectFrame": 0,
}
*/

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

const mapler = generateMapler(maplers[0]);