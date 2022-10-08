const imagesPaths = [
  "./images/apple.png",
  "./images/house.png",
  "./images/shoe.png",
  "./images/tree.png",
  "./images/cup.png",
  "./images/fist.png",
];
let hiddenImagesCount = 12;
let tempDisplayedImages = [];
let trackGameOnStart = false;
let startTime;
let timerInterval;
let flipCount = 0;
const time = document.getElementById("show-time");
const gridItems = document.getElementsByClassName("grid-item");
const gridContainer = document.getElementById("grid-container");
const flips = document.getElementById("flips");

function countRandomImages(arr, elem) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === elem) {
      count++;
    }
  }
  return count;
}

function makeRandom(num = 12) {
  let images = [];
  while (images.length < num) {
    const RandomImages = imagesPaths[Math.floor((Math.random() * num) / 2)];
    let imageCounter = countRandomImages(images, RandomImages);
    if (imageCounter < 2) {
      images.push(RandomImages);
    }
  }
  return images;
}

for (let i = 0; i < gridItems.length; i++) {
  gridItems[i].addEventListener("click", handleEvent);
}

function timer() {
  clearInterval(timerInterval);
  let second = 1,
    minute = 0,
    hour = 0;

  timerInterval = setInterval(function () {
    time.innerHTML =
      (hour ? hour + ":" : "") +
      (minute < 10 ? "0" + minute : minute) +
      ":" +
      (second < 10 ? "0" + second : second);
    second++;
    if (second === 60) {
      minute++;
      second = 0;
    }
    if (minute === 60) {
      hour++;
      minute = 0;
    }
  }, 1000);
}

function startTimer() {
  if (trackGameOnStart === false) {
    trackGameOnStart = true;
    startTime = new Date().getTime();
    timer();
  }
}

function handleEvent(event) {
  startTimer();
  showImage(event.srcElement.children[0]);
  if (tempDisplayedImages[0] != event.srcElement.children[0]) {
    tempDisplayedImages.push(event.srcElement.children[0]);
  }
  if (
    tempDisplayedImages.length === 2 &&
    tempDisplayedImages[0].src === tempDisplayedImages[1].src
  ) {
    tempDisplayedImages[0].parentElement.removeEventListener(
      "click",
      handleEvent
    );
    tempDisplayedImages[1].parentElement.removeEventListener(
      "click",
      handleEvent
    );
    tempDisplayedImages = [];
    hiddenImagesCount -= 2;
  }
  if (tempDisplayedImages.length > 1) {
    hideTempImages();
  }
  if (hiddenImagesCount === 0) {
    let endTime = new Date().getTime();
    let finalTime = (endTime - startTime) / 1000;
    setTimeout(() => {
      window.alert(
        `You played the game in ${finalTime.toFixed(
          1
        )} seconds with ${flipCount} moves.`
      ),
        3000;
    });
    location.reload();
  }
  flipCount++;
  flips.innerHTML = `Flips: ${flipCount}`;
}

function showImage(image) {
  image.style.visibility = "visible";
}

function hideImage(image) {
  image.style.visibility = "hidden";
}

function hideTempImages() {
  setTimeout(function () {
    for (let i = 0; i < tempDisplayedImages.length; i++) {
      hideImage(tempDisplayedImages[i]);
    }
    tempDisplayedImages = [];
  }, 300);
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    gridContainer.className = "default-twelve";
    randomizeImages(12);
  },
  false
);

function randomizeImages(num) {
  hiddenImagesCount = num;
  const randomImages = makeRandom(num);
  gridContainer.innerHTML = "";
  for (let i = 0; i < num; i++) {
    let elem = generateImage(randomImages[i], i);
    gridContainer.appendChild(elem);
  }
}

function generateImage(imagePath, num) {
  const gridItem = document.createElement("div");
  const image = document.createElement("img");
  gridItem.className = "grid-item";
  image.src = imagePath;
  image.id = `image${num}`;
  gridItem.appendChild(image);
  gridItem.addEventListener("click", handleEvent);
  return gridItem;
}

function gridSize() {
  flipCount = 0;
  clearInterval(timerInterval);
  trackGameOnStart = false;
  const selected = document.getElementById("selectOptions").value;
  if (selected === "four") {
    gridContainer.className = "four";
    randomizeImages(4);
  } else if (selected === "six") {
    gridContainer.className = "six";
    randomizeImages(6);
  } else if (selected === "eight") {
    gridContainer.className = "eight";
    randomizeImages(8);
  } else if (selected === "defaultTwelve") {
    gridContainer.className = "default-twelve";
    randomizeImages(12);
  } else if (selected === "twelve") {
    gridContainer.className = "twelve";
    randomizeImages(12);
  }
}

module.exports = {
  showImage,
  hideImage,
  handleEvent,
  randomizeImages,
  gridSize,
};
