function addDrag(mapler) {
  const target = mapler.char;

  let drag = null;
  let x = null;
  let y = null;
  let x2 = null;
  let y2 = null;
  let recoverRef = null;
  
  let touchIdx = null;

  const eventRefs = {};

  const handleMouseDown = (event) => {
    const sprite = target.firstChild;
    clearTimeout(recoverRef);
    mapler.falling = false;
    mapler.gravity = 0;
    zIdx++;
    target.style.zIndex = zIdx;  
    if(event.changedTouches) {
      if(touchIdx === null) touchIdx = event.touches.length - 1;
      const touch = event.touches[touchIdx];
      x = touch.pageX;
      y = touch.pageY;
    } else {
      document.onmousemove = handleMouseMove;
      x = event.pageX;
      y = event.pageY;
    }
    drag = target;
    target.classList.add('move-cursor');
    mapler.delife();
    mapler.changeBoth(['cry', 'angry', 'bewildered'], 'flying');
  }
  
  const handleMouseMove = (event) => {
    console.log('move');
    if(!drag) return;
    if(event.changedTouches) {
      const touch = event.touches[touchIdx];
      x2 = x - touch.pageX;
      y2 = y - touch.pageY;
      x = touch.pageX;
      y = touch.pageY;
    } else {
      x2 = x - event.pageX;
      y2 = y - event.pageY;
      x = event.pageX;
      y = event.pageY;
    }
    drag.style.left = `${drag.offsetLeft - x2 }px`;
    const {bottom, height} = drag.getBoundingClientRect();
    mapler.bottom = innerHeight - ground - bottom;
    drag.style.bottom = `${innerHeight - (drag.offsetTop - y2) - height}px`;
  };
  
  const handleMouseUp = () => {
    document.onmousemove = null;
    const sprite = drag.firstChild;
    sprite.classList.remove('transform-origin-center');
    sprite.classList.add('transform-origin-center');
    drag = null;
    touchIdx = null;
    
    mapler.changeEmote(['cry', 'angry']);
    mapler.falling = true;
    target.classList.remove('move-cursor');
    
    sprite.onload = () => {
      if(mapler.pose === 'lyingDown') {
        sprite.classList.remove('transform-origin-center');
        sprite.classList.remove('damage');
        void sprite.offsetWidth;
        sprite.classList.add('damage');
        mapler.sprite.style.transform = null;
        sprite.onanimationend = (e) => {
          if(e.currentTarget !== e.target) return;
          sprite.classList.remove('damage');
          sprite.onanimationend = null;
        }
        recoverRef = setTimeout(() => {
          if(mapler.pose === 'flying') return;
          mapler.changeBoth(undefined, 'alert'); 
          makeAlive(mapler);
        }, Math.floor(Math.random() * 5000) + 3000);
        sprite.onload = null;
      }
    }
  }
  
  eventRefs.mousedown = target.addEventListener('mousedown', handleMouseDown);
  eventRefs.touchstart = target.addEventListener('touchstart', handleMouseDown);
  
  eventRefs.touchmove = target.addEventListener('touchmove', handleMouseMove);
  
  eventRefs.mouseup = target.addEventListener('mouseup', handleMouseUp);
  eventRefs.touchend = target.addEventListener('touchend', handleMouseUp); 
  eventRefs.touchcancel = target.addEventListener('touchcancel', handleMouseUp);

  return eventRefs;
}

function addRemove(mapler) {
  const target = mapler.char;
  target.addEventListener("mousedown", (e) => {
    if(e.ctrlKey) mapler.logOut();
  })
}

function addTest(mapler) {
  const target = mapler.char;
  document.addEventListener('keydown', (e) => {
    if(e.ctrlKey && e.key === 'q') {
      mapler.walk();
    } else if(e.ctrlKey && e.key === 'y') {
      mapler.jump();
    }
  });
}
