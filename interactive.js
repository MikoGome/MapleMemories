function addDrag(target, mapler) {
  let drag = null;
  let x = null;
  let y = null;
  let x2 = null;
  let y2 = null;
  let floating = false;

  target.addEventListener("mousedown", (event) => {
    floating = true;
    zIdx++;
    target.style.zIndex = zIdx;
    x = event.pageX;
    y = event.pageY;
    drag = target;
    drag.style.transitionDuration = null;
    drag.style.animationDuration = null;
    target.style.cursor = "url('https://res.cloudinary.com/miko2/raw/upload/v1657492328/aero_move_kusjof.cur'), grabbing"
    mapler.delife();
    mapler.changeBoth(['cry', 'angry', 'bewildered'], 'flying');
  });

  target.addEventListener("mousemove", (event) => {
    if(!drag) return;
    x2 = x - event.pageX;
    y2 = y - event.pageY;
    x = event.pageX;
    y = event.pageY;
    drag.style.left = `${drag.offsetLeft - x2 }px`;
    const {height} = drag.getBoundingClientRect();
    drag.style.bottom = `${innerHeight - (drag.offsetTop - y2) - height}px`;
  });

  target.addEventListener("mouseup", () => {
    floating = false;
    mapler.changeEmote(['cry', 'angry']);
    target.style.cursor = "url('https://res.cloudinary.com/miko2/raw/upload/v1657492283/aero_arrow_nurzij.cur'), grab";
    const duration = parseInt(drag.style.bottom) * 2;
    drag.style.transitionDuration = duration + 'ms';
    drag.style.animationDuration = duration + 'ms';
    drag.classList.add('transition-bottom');
    if(mapler.right) {
      drag.classList.add('falling-rotation-right');
    } else {
      drag.classList.add('falling-rotation');
    }
    drag.style.bottom = ground;
    drag = null;
    setTimeout(() => {
      observer.observe(target, {attributes: true})
      console.log('target', target);
      target.classList.remove('transition-bottom');
      target.classList.remove('falling-rotation');
      target.classList.remove('falling-rotation-right');
      mapler.changeBoth(['hit', 'angry', 'pain'], 'lyingDown');
      setTimeout(() => {
        if(floating) return;
        mapler.changeBoth(undefined, 'alert'); //goes off when i'm holding mapler
        makeAlive(mapler);
      }, Math.floor(Math.random() * 5000) + 3000);
    }, duration - 100);
    
  });
}

const mutationList = [];

const observer = new MutationObserver((mutations) => {
  for(const mutation of mutations) {
    if(mutation.type === 'attributes') {
      console.log('attributes changed');
    }
  }
});



function addRemove(target) {
  target.addEventListener("mousedown", (e) => {
    console.log('ctrl', e.ctrKey)
    if(e.ctrlKey) target.remove();
  })
}
