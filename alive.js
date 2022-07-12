function makeAlive(mapler) {
  mapler.lifeRef = setTimeout(() => {
    console.log('mapler', mapler);
    const changePoseChance = Math.floor(Math.random() * 10);
    const changeEmoteChance = Math.floor(Math.random() * 10);
    const changeBothChance = Math.floor(Math.random() * 10);
    const turnChance = Math.floor(Math.random() * 10);

    if(changeBothChance < 10/3) {
      mapler.changeBoth();
    } else if(changeEmoteChance < 10/3) {
      mapler.changeEmote();
    } else if(changePoseChance < 10/3) {
      mapler.changePose();
    }

    if(turnChance < 10/3) {
      mapler.turn();
    }

    makeAlive(mapler);
  }, Math.floor(Math.random() * 30000) + 1000) ;
}