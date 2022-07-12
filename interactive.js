function addDrag(target, mapler) {
  let drag = null;
  let x = null;
  let y = null;
  let x2 = null;
  let y2 = null;

  target.addEventListener("mousedown", (event) => {
    zIdx++;
    target.style.zIndex = zIdx;
    console.log('z-index', target.style.zIndex)
    x = event.pageX;
    y = event.pageY;
    drag = target;
    drag.classList.remove('transition-bottom');
    drag.classList.remove('falling-rotation');
    drag.classList.remove('falling-rotation-right');
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
      mapler.changeBoth(['hit', 'angry', 'pain'], 'lyingDown');
      setTimeout(() => {
        mapler.changeBoth(undefined, 'alert');
        makeAlive(mapler);
      }, Math.floor(Math.random() * 5000) + 3000);
    }, duration - 100);
  });
}

function addFlip(target) {
  target.addEventListener("dblclick", (e) => {
    target.remove();
  })
}
