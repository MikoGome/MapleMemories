function fetchPose(mapler, info, faceEmote, pose) {
  if(mapler.content[faceEmote] && mapler.content[faceEmote][pose]) {
    mapler.faceEmote = faceEmote;
    mapler.pose = pose;
    if(mapler.pose === 'jumping') mapler.isJumping = true;
    return;
  }
  const body = deepClone(info);
  const fetchPoses = [];
  if(!mapler.content[faceEmote]) mapler.content[faceEmote] = {};
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
          return res.blob();
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
      if(mapler.pose === 'jumping') mapler.isJumping = true;
      if(mapler.sprite) {
        return;
      }
      const char = document.createElement('div');
      char.classList.add('char');
      const sprite = mapler.sprite = document.createElement('img');
      sprite.setAttribute('src', poseArr[0]);
      sprite.setAttribute('draggable', false);
      sprite.classList.add('sprite');

      if(mapler.right) {
        sprite.classList.add('right-sprite');
      }
      char.classList.add('spawn');
    
      const name = document.createElement('span');
      name.classList.add('name-tag');
      name.innerText = mapler.name;
      char.append(sprite);
      char.append(name);

      mapler.char = char;
      mapler.sprite = sprite;
      mapler.ign = name;

      document.body.append(char);
      char.style.zIndex = zIdx;
      char.style.bottom = ground + mapler.bottom + 'px';
      const {width} = char.getBoundingClientRect();
      char.style.left= Math.floor(Math.random() * (innerWidth - width)) + 'px';

      setTimeout(() => {
        char.classList.remove('spawn');
        mapler.animate(sprite);
      }, 3000);
    })
}

function justFetch(mapler, info, faceEmote, pose) {
  const body = deepClone(info);
  const fetchPoses = [];
  if(!mapler.content[faceEmote]) mapler.content[faceEmote] = {};
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
    });
}