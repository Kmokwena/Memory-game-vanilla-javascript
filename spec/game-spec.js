const { JSDOM } = require("jsdom");
const fs = require("fs");
const index = fs.readFileSync("./index.html", "utf-8");
const window = new JSDOM(index, "index.html").window;
global.document = window.document;
global.window = window;
global.location = {
  reload: function () {
    return;
  },
};
window.alert = function () {
  return;
};
const {
  showImage,
  hideImage,
  handleEvent,
  gridSize,
  randomizeImages,
} = require("../src/game");
const firstImage = document.createElement("img");
const secondImage = document.createElement("img");
const gridContainer = document.getElementById("grid-container");

describe("show image function", function () {
  it("should show an image when clicked", function () {
    showImage(secondImage);
    expect(secondImage.style.visibility).toBe("visible");
  });
});
describe("hide image function", function () {
  it("should hide an image", function () {
    hideImage(firstImage);
    expect(firstImage.style.visibility).toBe("hidden");
  });
});

describe("handle event function", function () {
  beforeEach(function () {
    jasmine.clock().install();
  });

  afterEach(function () {
    jasmine.clock().uninstall();
  });

  it("should hide images if they are not the same", function () {
    const firstImage = document.getElementById("image0");
    const secondImage = document.getElementById("image1");

    firstImage.src = "./images/apple.png";
    secondImage.src = "./images/cup.png";

    firstImage.parentElement.addEventListener("click", handleEvent);
    secondImage.parentElement.addEventListener("click", handleEvent);

    Event = document.createEvent("customEvent");
    Event.initEvent("click");
    firstImage.parentElement.dispatchEvent(Event);
    secondImage.parentElement.dispatchEvent(Event);

    jasmine.clock().tick(1000);

    expect(firstImage.style.visibility).toBe("hidden");
    expect(secondImage.style.visibility).toBe("hidden");
  });
  it("should show images if they are the same", function () {
    const firstImage = document.getElementById("image0");
    const secondImage = document.getElementById("image1");

    firstImage.src = "./images/apple.png";
    secondImage.src = "./images/apple.png";

    firstImage.addEventListener("click", handleEvent);
    secondImage.addEventListener("click", handleEvent);

    Event = document.createEvent("customEvent");
    Event.initEvent("click");
    firstImage.parentElement.dispatchEvent(Event);
    secondImage.parentElement.dispatchEvent(Event);

    jasmine.clock().tick(301);
    expect(firstImage.style.visibility).toBe("visible");
    expect(secondImage.style.visibility).toBe("visible");
  });
  it("should show time after the game is played and number of moves it took the player to finish", function () {
    randomizeImages(2);
    const firstImage = document.getElementById("image0");
    const secondImage = document.getElementById("image1");

    firstImage.parentElement.addEventListener("click", handleEvent);
    secondImage.parentElement.addEventListener("click", handleEvent);
    spyOn(window, "alert");

    Event = document.createEvent("customEvent");
    Event.initEvent("click");
    firstImage.parentElement.dispatchEvent(Event);
    secondImage.parentElement.dispatchEvent(Event);

    jasmine.clock().tick(1000);

    expect(window.alert).toHaveBeenCalledWith(jasmine.any(String));
  });
});

describe("gridSize function", function () {
  it("should display four tiles when 2X2 is selected", function () {
    document.getElementById("selectOptions").value = "four";
    gridSize();
    expect(gridContainer.children.length).toBe(4);
  });
  it("should display six tiles when 3X2 is selected", function () {
    document.getElementById("selectOptions").value = "six";
    gridSize();
    expect(gridContainer.children.length).toBe(6);
  });
  it("should display the default option, 12 tiles, 4X3", function () {
    document.getElementById("selectOptions").value = "defaultTwelve";
    gridSize();
    expect(gridContainer.children.length).toBe(12);
  });
  it("should display eight tiles when 2x4 is selected", function () {
    document.getElementById("selectOptions").value = "eight";
    gridSize();
    expect(gridContainer.children.length).toBe(8);
  });
});
