const commonPoses = [
  'standingOneHanded', 
  'alert',
  'sitting',
  'walkingOneHanded',
]

const poses = [
  'standingOneHanded', 
  'alert',
  'sitting',
  'walkingOneHanded',
  'jumping',
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

const commonEmotes = [
  'default',
  'smile',
  'troubled',
  'angry', 
  'bewildered', 
  'stunned',
]

const emotes = [
  'default', 
  'hit', 
  'smile', 
  'troubled', 
  'cry', 
  'angry', 
  'bewildered', 
  'stunned',
  'cheers',
  'oops',
  'shine',
  'wink'
];

class Mapler {
  constructor(name, body) {

    this.name = name;
    this.body = body;
    this.right = Math.random() < 0.5 ? true : false;
    this.faceFrame = 0;
    this.poseFrame = 0;
    this.lifeRef = null;
    this.faceEmote = null;
    this.pose = null;
    this.content = {};

    this.animateRef = null;

    this.falling = true;
    this.rotation = 0;
    this.gravity = 0;
    this.bottom = 137;
    this.jumpForce = 0;
    this.isJumping = true;

    this.justSpawn = true;


    fetchPose(this, this.body, 'default', 'jumping');
    justFetch(this, this.body, 'default', 'standingOneHanded');
    for(const emote of ['hit', 'angry', 'pain']) {
      justFetch(this, this.body, emote, 'lyingDown');
    }
    for(const emote of ['cry', 'angry', 'bewildered']) {
      justFetch(this, this.body, emote, 'flying');
    }
    makeAlive(this);
  }

  changePose(pose) {
    if(Array.isArray(pose)) pose = pose[Math.floor(Math.random() * pose.length)];
    const randPose = pose || poses[Math.floor(Math.random() * poses.length)];
    this.poseFrame = 0;
    fetchPose(this, this.body, this.faceEmote, randPose);
  }

  changeEmote(emote) {
    if(Array.isArray(emote)) emote = emote[Math.floor(Math.random() * emote.length)];
    const randEmote = emote || emotes[Math.floor(Math.random() * emotes.length)];
    this.faceFrame = 0;
    fetchPose(this, this.body, randEmote, this.pose);
  }

  changeBoth(emote, pose) {
    if(Array.isArray(pose)) pose = pose[Math.floor(Math.random() * pose.length)];
    if(Array.isArray(emote)) emote = emote[Math.floor(Math.random() * emote.length)];
    const randPose = pose || poses[Math.floor(Math.random() * poses.length)];
    const randEmote = emote || emotes[Math.floor(Math.random() * emotes.length)];
    this.poseFrame = 0;
    this.faceFrame = 0;

    fetchPose(this, this.body, randEmote, randPose);
  }

  walk() {
    this.changePose('walkingOneHanded')
  }

  jump() {
    this.changePose('jumping')
  }

  delife() {
    clearTimeout(this.lifeRef);
    this.lifeRef = null;
  }

  animate(target) {
    let poseIncreasing = true;
    let now = Date.now();
    let poseThen = now;
    let moveThen = now;

    const poseFps = 1000/4;
    const fps = 1000 / 120;

    target.onerror = () => {
      this.changeBoth('default', 'standingOneHanded');
    }
    
    let highestPoint = 0;

    const animation = () => {
      now = Date.now();
      highestPoint = Math.max(highestPoint, this.bottom);
      const poseArr = this.content[this.faceEmote][this.pose];
      if(poseThen !== null && now - poseThen > poseFps) {
        const faceEmoteArr = this.content[this.faceEmote];

        if(['standingOneHanded', 'alert', 'flying'].includes(this.pose)) {
          if(this.poseFrame + 1 >= poseArr.length) {
            poseIncreasing = false;
          } else if(this.poseFrame - 1 < 0) {
            poseIncreasing = true;
          }
      
          if(poseIncreasing) {
            this.poseFrame++;
          } else {
            this.poseFrame--;
          }
        } else {
          this.poseFrame++;
          this.poseFrame %= poseArr.length;
        }
        poseThen = now;
        target.setAttribute('src', this.content[this.faceEmote][this.pose][this.poseFrame]);
      }

      if(now - moveThen > fps) {
        if(this.pose === 'walkingOneHanded') {
          const pos = parseInt(this.char.style.left);
          const speed = 1;
          const {x, width} = this.sprite.getBoundingClientRect();
  
          if(x < 0 && !this.right) {
            this.turn();
          } else if(x + width > innerWidth && this.right) {
            this.turn();
          }
  
          if(this.right) {
            this.char.style.left = pos + speed + 'px';
          } else {
            this.char.style.left = pos - speed + 'px';
          }
          target.setAttribute('src', this.content[this.faceEmote][this.pose][this.poseFrame]);
        }
        moveThen = now;

        const bottom = parseInt(this.bottom);
        if(!this.falling && this.isJumping) {
          this.char.style.bottom = bottom + 'px';
          this.bottom += this.jumpForce;
          this.jumpForce -= 0.1;
        }

        if(this.isJumping && this.pose !== 'jumping') {
          this.changePose('jumping');
        }

        if(this.jumpForce < 0) {
          this.falling = true;
        }

        if(this.falling && bottom > ground) {
          this.bottom = bottom - this.gravity;
          this.gravity += 0.1;
          this.rotation += 1;

          if(this.right && this.pose === 'flying') {
            this.sprite.style.transform = `scale(2) scaleX(-1) rotate(${-this.rotation}deg)`;
          } else if(this.pose === 'flying') {
            this.sprite.style.transform = `scale(2) rotate(${-this.rotation}deg)`;
          }

          if(this.bottom < ground) this.bottom = ground;
          this.char.style.bottom = this.bottom + 'px';
        } else if(this.falling) {
          this.falling = false;
          this.gravity = 0;
          this.rotation = 0;
          if(this.isJumping && this.bottom === ground) {
            this.isJumping = false;
            if(this.justSpawn) {
              this.changePose('standingOneHanded');
              this.justSpawn = false;
              addDrag(this);
              addRemove(this);
              addTest(this);  
            } else {
              this.changePose(['alert', 'standingOneHanded', 'jumping']);
            }
            this.jumpForce = 5;
          } else {
            this.changeBoth(['hit', 'angry', 'pain'], 'lyingDown');
          }
          target.setAttribute('src', this.content[this.faceEmote][this.pose][this.poseFrame]);
        }
      }
      this.animateRef = requestAnimationFrame(animation);
    }

    this.animateRef = requestAnimationFrame(animation);
  }

  turn() {
    if(this.right) {
      this.right = false;
      this.sprite.classList.remove('right-sprite');
    } else {
      this.right = true;
      this.sprite.classList.add('right-sprite');
    }

    if(this.pose !== 'walkingOneHanded') {
      this.changePose('walkingOneHanded');
      if(Math.random() < 0.5) {
        setTimeout(() => {
          this.changePose('standingOneHanded');
        }, (Math.random() * 5000) + 600);
      }
    }
  }

  logOut() {
    this.delife();
    this.char.remove();
    cancelAnimationFrame(this.animateRef);
  }
}