//lấy  giá trị game làm khung hình + game 2D
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Khởi tạo các giá trị
let score;
let scoreText;
let highscore;
let highscoreText;
let player;
let gravity;
let obstacles = [];
let gameSpeed;
let keys = {};

// các sự kiện keyup, keydown
document.addEventListener('keydown', function (evt) {
  keys[evt.code] = true;
});
document.addEventListener('keyup', function (evt) {
  keys[evt.code] = false;
});

class Player {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.dy = 0;
    this.jumpForce = 15;
    this.originalHeight = h;
    this.grounded = false;
    this.jumpTimer = 0;
  }

  Animate() {
    // Nếu ấn Space thì sẽ nhảy
    if (keys['Space']) {
      this.Jump();
    } else {
      this.jumpTimer = 0;
    }
    //nếu ấn S thì sẽ nằm, Height/2
    if (keys['KeyS']) {
      this.h = this.originalHeight / 2;
    } else {
      this.h = this.originalHeight;
    }
    //âm thanh khi ấn Space Nhảy

    document.addEventListener('keyup', event => {
      if (event.code === 'Space') {
        const audio = document.querySelector("#chatAudio");
        audio.autoPlay = true;
        audio.volume = 1;
        audio.load();
      }
      //âm thanh khi thu người lại S
      else if (event.code === 'KeyS') {
        const audio1 = document.querySelector("#chatAudio1");
        audio1.autoPlay = true;
        audio1.volume = 1;
        audio1.load();
      }
      // âm thanh nhạc nền  khi ấn M
      else if (event.code === 'KeyM') {
        const audio2 = document.querySelector("#audio");
        audio2.autoPlay = true;
        audio2.volume = 1;
        audio2.load();
      }
      //tắt âm thanh nhạc nền  khi ấn A
      else if (event.code === 'KeyA') {
        const audio2 = document.querySelector("#audio");
        audio2.autoPlay = true;
        audio2.volume = 0;
        audio2.load();
      }
      // âm thanh nhạc nền  khi ấn MB
      else if (event.code === 'KeyB') {
        const audio3 = document.querySelector("#audio3");
        audio3.autoPlay = true;
        audio3.volume = 1;
        audio3.load();
      }
    })
    this.y += this.dy;

    // Gravity
    if (this.y + this.h < canvas.height) {
      this.dy += gravity;
      this.grounded = false;
    } else {
      this.dy = 0;
      this.grounded = true;
      this.y = canvas.height - this.h;
    }

    this.Draw();
  }
  //quy định về chiểu cao và thời gian chạm đất
  Jump() {
    if (this.grounded && this.jumpTimer == 0) {
      this.jumpTimer = 1;
      this.dy = -this.jumpForce;
    } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
      this.jumpTimer++;
      this.dy = -this.jumpForce - (this.jumpTimer / 50);
    }
  }
  //vẽ ra đối tượng người chơi bằng hình Vuông
  Draw() {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.closePath();
  }
}
//quy định về giao diện, khung hình của game
class Obstacle {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.dx = -gameSpeed;
  }

  Update() {
    this.x += this.dx;
    this.Draw();
    this.dx = -gameSpeed;
  }
  //vẽ các chướng ngại vật
  Draw() {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.closePath();
  }
}

class Text {
  constructor(t, x, y, a, c, s) {
    this.t = t;
    this.x = x;
    this.y = y;
    this.a = a;
    this.c = c;
    this.s = s;
  }
  //vẽ khung chứa điểm và điểm cao nhất
  Draw() {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.font = this.s + "px sans-serif";
    ctx.textAlign = this.a;
    ctx.fillText(this.t, this.x, this.y);
    ctx.closePath();
  }
}

// Random chiều cao + cách sàn của khối chữ nhật
function SpawnObstacle() {
  let size = RandomIntInRange(20, 70);
  let type = RandomIntInRange(0, 1);
  let obstacle = new Obstacle(canvas.width + size, canvas.height - size, size, size, '#2484E4');

  if (type == 1) {
    obstacle.y -= player.originalHeight - 10;
  }
  obstacles.push(obstacle);
}
// Random chiều cao + cách sàn của khối Qùa Tặng
function QuaTang() {

  setTimeout(() => {
    let size = RandomIntInRange(10, 50);
    let type = RandomIntInRange(0, 3);
    let obstacle = new Obstacle(canvas.width + size, canvas.height - size, size, size, '#fbbc05');
    if (type == 0) {
      obstacle.y -= player.originalHeight - 5;
      score+5;
    }
    if (type == 1 ) {
      obstacle.y -= player.originalHeight - 100;
      score+10;
    }
    if (type == 2) {
      obstacle.y -= player.originalHeight - 200;
      score+15;
    }
    if (type == 3) {
      obstacle.y -= player.originalHeight - 300;
      score+20;
    }
    obstacles.push(obstacle);
  }, 7000);

}

function RandomIntInRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function Start() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.font = "20px sans-serif";
  gameSpeed = 3;
  gravity = 1;
  score = 0;
  highscore = 0;
  if (localStorage.getItem('highscore')) {
    highscore = localStorage.getItem('highscore');
  }
  player = new Player(25, 0, 50, 50, '#FF5858');
  // In ra điểm và Điểm cao
  scoreText = new Text("Điểm: " + score, 25, 25, "left", "#212121", "20");
  highscoreText = new Text("Điểm Cao Nhất: " + highscore, canvas.width - 25, 25, "right", "#212121", "20");

  requestAnimationFrame(Update);
}

let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;
function Update() {
  requestAnimationFrame(Update);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  spawnTimer--;
  if (spawnTimer <= 0) {
    SpawnObstacle();
    //QuaTang();
    console.log(obstacles);
    spawnTimer = initialSpawnTimer - gameSpeed * 8;

    if (spawnTimer < 60) {
      spawnTimer = 60;
    }
  }

  // so sánh điểm số hiện tại và điểm số cao nhất
  for (let i = 0; i < obstacles.length; i++) {
    let o = obstacles[i];

    if (o.x + o.w < 0) {
      obstacles.splice(i, 1);
    }

    if (player.x < o.x + o.w && player.x + player.w > o.x && player.y < o.y + o.h && player.y + player.h > o.y) {
      obstacles = [];
      score = 0;
      spawnTimer = initialSpawnTimer;
      gameSpeed = 3;
      window.localStorage.setItem('Điểm Cao Nhất', highscore);
      if (confirm("Game đã kết thúc!" + '\n' + "Bạn có muốn chơi lại?")) {
        console.log('Play Again');
      } else {
        // Trả về trang Index
        window.location.replace("index.html");
      }
    }

    o.Update();
  }

  player.Animate();

  //Tính điểm và In điểm, Điểm cao
  score++;
  scoreText.t = "Điểm: " + score;
  scoreText.Draw();

  if (score > highscore) {
    highscore = score;
    highscoreText.t = "Điểm Cao Nhất: " + highscore;
  }

  highscoreText.Draw();

  gameSpeed += 0.003;
}

Start();