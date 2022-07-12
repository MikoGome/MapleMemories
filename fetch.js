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
      char.classList.add('char');
      const sprite = mapler.sprite = document.createElement('img');
      sprite.setAttribute('src', poseArr[0]);
      sprite.setAttribute('draggable', false);
      sprite.classList.add('sprite');

      if(mapler.right) {
        sprite.classList.add('right');
      }

      mapler.animate(sprite);
      const name = document.createElement('span');
      name.classList.add('name');
      name.innerText = mapler.name;
      char.append(sprite);
      char.append(name);
      addDrag(char, mapler);

      mapler.char = char;
      mapler.sprite = sprite;
      mapler.name = name;

      document.body.append(char);
      char.style.zIndex = zIdx;
      char.style.bottom = ground;
      char.style.left= '0';
      /* css stuff
     
      char.style.position = 'absolute';
      
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
      name.style.fontSize = '12pt';
      */
    })
}