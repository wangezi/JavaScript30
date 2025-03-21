/* Get Our Elements 取得元素 */
const player = document.querySelector(".player"); // 取得整個播放器容器

const video = player.querySelector(".viewer"); // 取得影片元素

const progress = player.querySelector(".progress"); // 取得進度條容器

const progressBar = player.querySelector(".progress__filled"); // 取得用來顯示播放進度的條狀元素

const toggle = player.querySelector(".toggle"); // 取得播放/暫停按鈕

const skipButtons = player.querySelectorAll("[data-skip]"); // 取得所有有 data-skip 屬性的按鈕（用於快轉或倒退）

const ranges = player.querySelectorAll(".player__slider"); // 取得所有的滑桿（通常用來調整音量或播放速度）

/* Build out functions 建立功能 */

// 切換播放與暫停狀態
function togglePlay() {
  //   if (video.paused) {
  //     video.play();
  //   } else {
  //     video.pause();
  //   }
  // 原本的寫法是用 if 判斷，但這裡使用簡潔的寫法：
  // 如果影片為暫停狀態，則播放；否則暫停
  const method = video.paused ? "play" : "pause";

  video[method](); // 根據狀態呼叫 video.play() 或 video.pause()
}

// 當影片播放或暫停時更新按鈕圖示
function updateButton() {
  // console.log("Update the button");

  // 判斷目前影片狀態，決定顯示的圖示：暫停時顯示播放圖示，播放時顯示暫停圖示
  const icon = this.paused ? "►" : "❚ ❚";

  toggle.textContent = icon; // 更新按鈕的文字內容
  //   console.log(icon);
}

// 快轉或倒退影片（依據 data-skip 的數值）
function skip() {
  //   console.log(this.dataset.skip);

  // 將按鈕上設定的 data-skip 屬性值轉換成浮點數後，加到目前的播放時間
  video.currentTime += parseFloat(this.dataset.skip);
}

// 調整影片屬性（如音量、播放速度）
// 這裡利用 input 的 name 屬性與 value 來動態改變影片對應的屬性
function handleRangeUpdate() {
  //   console.log(this.name);
  //   console.log(this.value);
  video[this.name] = this.value;
}

// 更新進度條，隨著影片播放進度改變進度條的寬度
function handleProgress() {
  // 計算播放進度百分比
  const percent = (video.currentTime / video.duration) * 100;

  // 利用 flexBasis 屬性設定進度條填滿的寬度
  progressBar.style.flexBasis = `${percent}%`;
}

// 當使用者點擊或拖曳進度條時，根據滑鼠點擊位置調整影片播放時間
function scrub(e) {
  //   console.log(e);

  // 透過事件物件 e 的 offsetX 屬性取得點擊位置，再換算成影片的時間
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

/* Hook up the event listeners 連接事件監聽器 */

video.addEventListener("click", togglePlay); // 當點擊影片時，切換播放/暫停狀態

video.addEventListener("play", updateButton); // 當影片開始播放時，更新播放/暫停按鈕的圖示

video.addEventListener("pause", updateButton); // 當影片暫停時，同樣更新按鈕圖示

video.addEventListener("timeupdate", handleProgress); // 當影片的播放進度改變時，更新進度條

toggle.addEventListener("click", togglePlay); // 當點擊播放/暫停按鈕時，切換影片狀態

skipButtons.forEach((button) => button.addEventListener("click", skip)); // 為所有快轉或倒退按鈕增加點擊事件

ranges.forEach((range) => range.addEventListener("change", handleRangeUpdate)); // 當滑桿數值改變時，更新影片的音量或播放速度

ranges.forEach((range) =>
  range.addEventListener("mousemove", handleRangeUpdate)
); // 當拖曳滑鼠在滑桿上移動時，也更新影片屬性（讓使用者可以即時預覽效果）

// 用來追蹤滑鼠是否按下，便於拖曳進度條時持續更新影片時間
let mousedown = false;
progress.addEventListener("click", scrub); // 當點擊進度條時，根據點擊位置跳轉影片
progress.addEventListener("mousemove", (e) => mousedown && scrub(e)); // 當滑鼠在進度條上移動時，若滑鼠按下則持續更新播放進度
progress.addEventListener("mousedown", () => (mousedown = true)); // 當滑鼠按下時，設定 mousedown 為 true
progress.addEventListener("mouseup", () => (mousedown = false)); // 當滑鼠放開時，設定 mousedown 為 false
