function addDrag(target, mapler) {
  let drag = null;
  let x = null;
  let y = null;
  let x2 = null;
  let y2 = null;
  let recoverRef = null;

  target.addEventListener("mousedown", (event) => {
    clearTimeout(recoverRef);
    zIdx++;
    target.style.zIndex = zIdx;
    x = event.pageX;
    y = event.pageY;
    drag = target;
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
    mapler.changeEmote(['cry', 'angry']);
    target.style.cursor = "url('https://res.cloudinary.com/miko2/raw/upload/v1657492283/aero_arrow_nurzij.cur'), grab";
    const duration = parseInt(drag.style.bottom) * 2;
    drag.style.transitionDuration = duration + 'ms';
    drag.style.animationDuration = (duration - 100) + 'ms';
    drag.classList.add('transition-bottom');
    if(mapler.right) {
      drag.classList.add('falling-rotation-right');
    } else {
      drag.classList.add('falling-rotation');
    }
    drag.style.bottom = ground;
    const sprite = drag.firstChild;
    drag.onanimationend = (e) => {
      if(e.currentTarget !== e.target) return;
      console.log('animation end');
      mapler.changeBoth(['hit', 'angry', 'pain'], 'lyingDown');
      target.style.animationDuration = null;
      recoverRef = setTimeout(() => {
        mapler.changeBoth(undefined, 'alert'); 
        makeAlive(mapler);
      }, Math.floor(Math.random() * 5000) + 3000);
      target.onanimationend = null;
    }
    
    sprite.onload = () => {
      if(
        mapler.content.hit.lyingDown[0] === sprite.getAttribute('src') ||
        mapler.content.angry.lyingDown[0] === sprite.getAttribute('src') ||
        mapler.content.pain.lyingDown[0] === sprite.getAttribute('src')
      ) {
        sprite.onload = null;
        target.classList.remove('falling-rotation');
        target.classList.remove('falling-rotation-right');
        sprite.classList.add('damage');
        sprite.onanimationend = (e) => {
          if(e.currentTarget !== e.target) return;
          sprite.classList.remove('damage');
          sprite.onanimationend = null;
        }
      }
    }
    drag.ontransitionend = () => {
      target.classList.remove('transition-bottom');
      target.style.transitionDuration = null;
      target.ontransitionend = null;
    }
    drag = null;
  });
}

function addRemove(target, mapler) {
  target.addEventListener("mousedown", (e) => {
    if(e.ctrlKey) mapler.logOut();
  })
}

function addTest(target, mapler) {
  document.addEventListener('keydown', (e) => {
    if(e.ctrlKey && e.key === 'q') {
      console.log('walking')
      mapler.walk();
    }
  });
}
