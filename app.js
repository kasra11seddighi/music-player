
const eye = document.querySelector('.music-eye');
const pupil = document.querySelector('.pupil');
const playBtn = document.querySelector(".play");
const music = document.querySelector(".audio");
const volumeBtn = document.querySelector("#volumeBtn");
let volumeOFmusic = music.volume;
const volumeInput = document.querySelector("#volume");
const timeDisplay = document.querySelector(".time-display");
const progress = document.querySelector(".progress");
const progressBar = document.querySelector(".progress-bar");
const liclik = document.querySelectorAll(".liclik");
const trackTitle = document.querySelector(".track-title");
const artistName = document.querySelector(".artist-name");
const AlbumCover = document.querySelector("#albumCover");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
let currentTrackIndex = 0;
const tracks = Array.from(liclik);
const addTrackBtn = document.querySelector("#addTrackBtn");
const playlist = document.querySelector(".playlist ul");


document.addEventListener('mousemove', (e) => {
  const rect = eye.getBoundingClientRect();
  const eyeX = rect.left + rect.width / 2;
  const eyeY = rect.top + rect.height / 2;

  let dx = e.clientX - eyeX;
  let dy = e.clientY - eyeY;

  const max = 12;
  const angle = Math.atan2(dy, dx);
  const distance = Math.min(max, Math.sqrt(dx*dx + dy*dy));

  const pupilX = distance * Math.cos(angle);
  const pupilY = distance * Math.sin(angle);

  pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
});

function playMusic() {
  if (music.paused) {
    music.play();
    playBtn.textContent = "⏸️";
  } else {
    music.pause();
    playBtn.textContent = "▶️";
  }
}


function volumeButten() {
  if (music.volume > 0) {
    music.volume = 0;
    volumeBtn.textContent = "🔈";
  } else {
    music.volume = volumeOFmusic;
    volumeBtn.textContent = "🔊";
  }
}


function volume() {
  music.volume = this.value / 100;
  if (music.volume === 0) {
    volumeBtn.textContent = "🔈";
  } else {
    volumeBtn.textContent = "🔊";
  }
}


function progr(event) {
  const width = progressBar.clientWidth;
  const clickX = event.offsetX;
  const duration = music.duration;
  if (!duration) return;
  music.currentTime = (clickX / width) * duration;
}


function showtime() {
  if (!music.duration) return;

  let minAll = Math.floor(music.duration / 60);
  let secAll = Math.floor(music.duration % 60);
  let minMoment = Math.floor(music.currentTime / 60);
  let secMoment = Math.floor(music.currentTime % 60);

  if (secAll < 10) secAll = "0" + secAll;
  if (secMoment < 10) secMoment = "0" + secMoment;
  if (minAll < 10) minAll = "0" + minAll;
  if (minMoment < 10) minMoment = "0" + minMoment;

  timeDisplay.textContent = `${minMoment}:${secMoment} / ${minAll}:${secAll}`;

  const percent = (music.currentTime / music.duration) * 100;
  progress.style.width = `${percent}%`;
}


function playTrack(index) {
  const li = tracks[index];
  const src = li.getAttribute("data-src");
  const cover = li.querySelector("img");
  const title = li.querySelector(".track-name");
  const artist = li.querySelector(".artist-name");

  music.src = src;
  music.play();
  playBtn.textContent = "⏸️";

  if (cover) AlbumCover.src = cover.src;
  if (title) trackTitle.innerHTML = title.innerHTML;
  if (artist) artistName.innerHTML = artist.innerHTML;

  currentTrackIndex = index;
}


function nextTrack() {
  let nextIndex = currentTrackIndex + 1;
  if (nextIndex >= tracks.length) nextIndex = 0;
  playTrack(nextIndex);
}


function prevTrack() {
  let prevIndex = currentTrackIndex - 1;
  if (prevIndex < 0) prevIndex = tracks.length - 1;
  playTrack(prevIndex);
}


tracks.forEach((li, index) => {
  const audioSrc = li.getAttribute("data-src");
  const trackTimeElem = li.querySelector(".track-time");

  // دریافت زمان واقعی ترک
  const tempAudio = new Audio(audioSrc);
  tempAudio.addEventListener("loadedmetadata", () => {
    let min = Math.floor(tempAudio.duration / 60);
    let sec = Math.floor(tempAudio.duration % 60).toString().padStart(2, "0");
    trackTimeElem.textContent = `${min}:${sec}`;
  });

  // کلیک روی ترک
  li.addEventListener("click", () => {
    playTrack(index);
  });
});

addTrackBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "audio/*";
  input.click();

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    // ایجاد المان لیست جدید
    const li = document.createElement("li");
    li.classList.add("liclik");
    li.setAttribute("data-src", url);

    li.innerHTML = `
      <img src="/public/image/1.jpg" alt="Album Cover">
      <div class="track-details">
        <p class="track-name">${file.name}</p>
        <p class="artist-name">Unknown Artist</p>
        <p class="track-time">00:00</p>
      </div>
    `;

    playlist.appendChild(li);
    tracks.push(li); // اضافه کردن به آرایه tracks برای Next/Prev

    // دریافت طول ترک و آپدیت زمان
    const tempAudio = new Audio(url);
    const trackTimeElem = li.querySelector(".track-time");
    tempAudio.addEventListener("loadedmetadata", () => {
      let min = Math.floor(tempAudio.duration / 60);
      let sec = Math.floor(tempAudio.duration % 60).toString().padStart(2, "0");
      trackTimeElem.textContent = `${min}:${sec}`;
    });

    // کلیک روی ترک جدید
    li.addEventListener("click", () => {
      const index = tracks.indexOf(li);
      playTrack(index);
    });
  });
});


nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);
playBtn.addEventListener("click", playMusic);
volumeBtn.addEventListener("click", volumeButten);
volumeInput.addEventListener("input", volume);
progressBar.addEventListener("click", progr);
music.addEventListener("timeupdate", showtime);