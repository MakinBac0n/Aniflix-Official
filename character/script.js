const characters = [
  {
    id: "default",
    name: "Default Character",
    status: "Default",
    img: "TemplateCharacter-x6.png",
    unlockKey: "default",
    unlockHint: "Always available"
  },
  {
    id: "luffy",
    name: "Luffy",
    status: "Character unlocked!",
    img: "LuffyCharacter-x6.png",
    unlockKey: "onepiece",
    unlockHint: "Watch One Piece"
  },
  {
    id: "denji",
    name: "Denji",
    status: "Character unlocked!",
    img: "DenjiCharacter-6x.png",
    unlockKey: "chainsaw",
    unlockHint: "Watch Chainsaw Man"
  },
  {
    id: "gon",
    name: "Gon",
    status: "Character unlocked!",
    img: "GonCharacter-6x.png",
    unlockKey: "hxh",
    unlockHint: "Watch Hunter x Hunter"
  },
  {
    id: "lain",
    name: "Lain",
    status: "Character unlocked!",
    img: "LainCharacter-x6.png",
    unlockKey: "lain",
    unlockHint: "Locked"
  }
];

let currentIndex = 0;

const selectedName = document.getElementById("selectedName");
const selectedStatus = document.getElementById("selectedStatus");
const selectedImage = document.getElementById("selectedImage");
const selectBtn = document.getElementById("selectBtn");
const thumbnailRow = document.getElementById("thumbnailRow");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

function isUnlocked(character) {
  return character.unlockKey === "default" || localStorage.getItem(`videoCompleted_${character.unlockKey}`) === "true";
}

function getSavedCharacterIndex() {
  const savedId = localStorage.getItem("selectedCharacter") || "default";
  const savedIndex = characters.findIndex((character) => character.id === savedId && isUnlocked(character));

  return savedIndex >= 0 ? savedIndex : 0;
}

function wrapIndex(index) {
  if (index < 0) {
    return characters.length - 1;
  }

  if (index >= characters.length) {
    return 0;
  }

  return index;
}

function updateDisplay() {
  const character = characters[currentIndex];
  const unlocked = isUnlocked(character);
  const selectedId = localStorage.getItem("selectedCharacter") || "default";
  const isSelected = selectedId === character.id;

  selectedName.textContent = character.name;
  selectedStatus.textContent = unlocked ? (isSelected ? "Selected" : character.status) : `Character locked! ${character.unlockHint}`;
  selectedImage.src = character.img;
  selectedImage.alt = `${character.name} character`;
  selectedImage.classList.toggle("is-locked", !unlocked);

  if (selectBtn) {
    selectBtn.disabled = !unlocked;
    selectBtn.textContent = unlocked ? (isSelected ? "Selected" : "Use Character") : "Locked";
  }

  document.querySelectorAll(".thumbnail").forEach((button, index) => {
    const thumbnailCharacter = characters[index];
    const thumbnailUnlocked = isUnlocked(thumbnailCharacter);
    const lockLabel = button.querySelector("small");

    button.classList.toggle("is-active", index === currentIndex);
    button.classList.toggle("is-locked", !thumbnailUnlocked);
    button.setAttribute("aria-current", index === currentIndex ? "true" : "false");

    if (lockLabel) {
      lockLabel.textContent = thumbnailUnlocked ? "Unlocked" : "Locked";
    }
  });
}

function selectCharacter(index) {
  currentIndex = wrapIndex(index);
  updateDisplay();
}

function saveSelectedCharacter() {
  const character = characters[currentIndex];

  if (!isUnlocked(character)) {
    return;
  }

  localStorage.setItem("selectedCharacter", character.id);
  updateDisplay();
}

function buildThumbnails() {
  thumbnailRow.innerHTML = "";

  characters.forEach((character, index) => {
    const button = document.createElement("button");
    button.className = "thumbnail";
    button.type = "button";
    button.setAttribute("aria-label", `View ${character.name}`);

    const image = document.createElement("img");
    image.src = character.img;
    image.alt = "";

    const label = document.createElement("span");
    label.textContent = character.name.replace(" Character", "");

    const lock = document.createElement("small");
    lock.textContent = isUnlocked(character) ? "Unlocked" : "Locked";

    button.append(image, label, lock);
    button.addEventListener("click", () => selectCharacter(index));
    thumbnailRow.appendChild(button);
  });
}

rightBtn.addEventListener("click", () => selectCharacter(currentIndex + 1));
leftBtn.addEventListener("click", () => selectCharacter(currentIndex - 1));

if (selectBtn) {
  selectBtn.addEventListener("click", saveSelectedCharacter);
}

currentIndex = getSavedCharacterIndex();
buildThumbnails();
updateDisplay();
