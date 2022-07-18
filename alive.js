function makeAlive(mapler) {
  if(mapler.lifeRef) return;
  mapler.lifeRef = setTimeout(() => {
    if(mapler.bottom > ground || mapler.pose === 'jumping' || mapler.pose === 'flying' || mapler.isJumping) {
      mapler.lifeRef = null;
      makeAlive(mapler);
      return;
    }

    if(mapler.pose === 'sitting' && Math.random() < 0.6) {
      mapler.changeEmote();
      mapler.lifeRef = null;
      return makeAlive(mapler);
    } 
    const changePoseChance = Math.floor(Math.random() * 10);
    const changeEmoteChance = Math.floor(Math.random() * 10);
    const changeBothChance = Math.floor(Math.random() * 10);
    const turnChance = Math.floor(Math.random() * 10);

    if(changeBothChance < 10/3) {
      if(Math.random() < 0.5) mapler.changeBoth(commonEmotes, commonPoses);
      else mapler.changeBoth();
    } else if(changeEmoteChance < 10/3) {
      if(Math.random() < 0.5) mapler.changeBoth(commonEmotes);
      else mapler.changeEmote();
    } else if(changePoseChance < 10/3) {
      if(Math.random() < 0.5) mapler.changePose(commonPoses);
      else mapler.changePose();
    }

    if(turnChance < 10/3) {
      mapler.turn();
    }
    mapler.lifeRef = null;
    makeAlive(mapler);
  }, Math.floor(Math.random() * 20000) + 600) ;
}