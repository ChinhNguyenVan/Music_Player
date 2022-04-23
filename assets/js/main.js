/**
 * Need to make a music player
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / Pause / Seek
 * 4. CD rotate
 * 5. Next / Prev
 * 6. Random
 * 7. Next / Repeat when end
 * 8. Active songs
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "MUSIC_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || "{}",
  songs: [
    {
      name: "Bông hoa đẹp nhất",
      singer: "Quân A.P",
      path: "./assets/music/BongHoaDepNhat.mp3",
      image: "https://i.ibb.co/gyVwmv3/bonghoadepnhat.jpg",
    },
    {
      name: "Cô gái M52",
      singer: "HuyR ft. Tùng Viu",
      path: "./assets/music/CoGaiM52.mp3",
      image: "https://i.ibb.co/z2g01vx/cogaim52.jpg",
    },
    {
      name: "Cùng anh",
      singer: "Ngọc Dolil",
      path: "./assets/music/CungAnh.mp3",
      image: "https://i.ibb.co/m8RZH4f/cunganh.jpg",
    },
    {
      name: "Đúng người đúng thời điểm",
      singer: "Thanh Hưng",
      path: "./assets/music/DungNguoiDungThoiDiem.mp3",
      image: "https://i.ibb.co/kM9LRCC/dungnguoidungthoidiem.jpg",
    },
    {
      name: "Đừng như thói quen",
      singer: "JayKii FT Sara Lưu",
      path: "./assets/music/DungNhuThoiQuen.mp3",
      image: "https://i.ibb.co/VSS5hH4/dungnhuthoiquen.jpg",
    },
    {
      name: "Hơn cả yêu",
      singer: "Đức Phúc",
      path: "./assets/music/HonCaYeu.mp3",
      image: "https://i.ibb.co/FJ99qhJ/honcayeu.jpg",
    },
    {
      name: "Hồng Nhan",
      singer: "Jack",
      path: "./assets/music/HongNhan.mp3",
      image: "https://i.ibb.co/4sfrX0k/hongnhan.jpg",
    },
    {
      name: "Một đêm say(X)",
      singer: "Thịnh Suy",
      path: "./assets/music/MotDemSay.mp3",
      image: "https://i.ibb.co/JsWXf1x/motdemsay.jpg",
    },
    {
      name: "Người âm phủ",
      singer: "OSAD x VRT",
      path: "./assets/music/NguoiAmPhu.mp3",
      image: "https://i.ibb.co/CzHZJLb/nguoiamphu.jpg",
    },
    {
      name: "Người lạ ơi",
      singer: "Superbrothers x Karik x Orange",
      path: "./assets/music/NguoiLaOi.mp3",
      image: "https://i.ibb.co/qrYpBP4/nguoilaoi.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  render: function () {
    // Load list songs on page
    const htmls = this.songs.map((song, index) => {
      // console.log(song);
      return `
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }" data-index = ${index}>
               <div class="thumb"
                  style="background-image: url(${song.image})">
               </div>
               <div class="body">
                  <div class="title">${song.name}</div>
                  <div class="author">${song.singer}</div>
               </div>
               <div class='option'>
                  <i class="fas fa-ellipsis-h"></i>
               </div>
            </div>
         `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handEvents: function () {
    const _this = this;
    const cdWith = cd.offsetWidth;

    // Handle zoom in/ zoom out when scroll.
    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop;
      const newCdWith = cdWith - scrollTop;

      //When scroll too quick, It will be negative so Need to check newCdWidth greater than zero, if less than zero. Set cdWith = 0
      if (newCdWith > 0) {
        cd.style.width = newCdWith + "px";
      } else {
        cd.style.width = 0;
      }
      cd.style.opacity = newCdWith / cdWith;
    };

    // Handle click on song
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // when song played.
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // when song paused.
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // when the song bar changes
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Handle when rewind(Tua) song
    progress.onchange = function (e) {
      const seekTime = audio.duration / 100 * e.target.value;
      audio.currentTime = seekTime;
    };

    // Handle rotate cd when song play/pause
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000, //10second
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();

    // handle when click next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    // handle when click prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    // handle turn on/off randomBtn song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // handle repeat song when repeatBtn clicked
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // handle next song when audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    // Listen behavior when click into playlist
    playlist.onclick = function (e) {
      const songElement = e.target.closest(".song:not(.active)");
      if (songElement || !e.target.closest(".option")) {
        //Handle when click into song
        if (songElement) {
          _this.currentIndex = Number(songElement.dataset.index);
          _this.loadCurrentSong();
          audio.play();
          _this.render();
          _this.scrollToActiveSong();
        }

        //Handle when click into option
        if (!e.target.closest(".option")) {
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(function () {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // Assign config into application config
    this.loadConfig();

    // Define some attributes for object
    this.defineProperties();

    //Listen/handle events (DOM event)
    this.handEvents();

    //Load information current song for UI when play app
    this.loadCurrentSong();

    // Render list songs on page
    this.render();

    // Display state initial of button repeat and random

    randomBtn.classList.remove("active", this.isRandom);
    repeatBtn.classList.remove("active", this.isRepeat);
  },
};

app.start();
