const videos = {
  chainsaw: {
    label: "Chainsaw Man",
    videoId: "JMxlDSO9bOM"  
  },
  hxh: {
    label: "Hunter x Hunter",
    videoId: "d6kBeJjTGnY"
  },
  onepiece: {
    label: "One Piece",
    videoId: "AAEiOngOzIY"
  },
  seriallain: {
    label: "seriallain",
    videoId: "JMxlDSO9bOM"
  }
};

let unlockHandled = false;

function getAnimeFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("anime") || "chainsaw";
}

function goToAnime(anime) {
  window.location.href = `video1.html?anime=${encodeURIComponent(anime)}`;
}

function getUnlockedCharacters() {
  return JSON.parse(localStorage.getItem("unlockedCharacters")) || [];
}

function saveUnlockedCharacter(anime) {
  const unlocked = getUnlockedCharacters();

  if (!unlocked.includes(anime)) {
    unlocked.push(anime);
    localStorage.setItem("unlockedCharacters", JSON.stringify(unlocked));
  }

  localStorage.setItem(`videoCompleted_${anime}`, "true");
}

function setLockedState(videoLabel) {
  const unlockBtn = document.getElementById("unlockBtn");
  const status = document.getElementById("status");

  if (!unlockBtn || !status) {
    return;
  }

  status.textContent = `Character locked! Finish ${videoLabel} to unlock.`;
  unlockBtn.disabled = true;
  unlockBtn.textContent = "Unlock Character";
  unlockBtn.classList.remove("unlocked");
  unlockBtn.onclick = null;
}

function setUnlockedState(anime) {
  const unlockBtn = document.getElementById("unlockBtn");
  const status = document.getElementById("status");

  if (!unlockBtn || !status) {
    return;
  }

  saveUnlockedCharacter(anime);
  status.textContent = "Character unlocked!";
  unlockBtn.disabled = false;
  unlockBtn.textContent = "Design Character";
  unlockBtn.classList.add("unlocked");
  unlockBtn.onclick = () => {
    window.location.href = `character.html?anime=${encodeURIComponent(anime)}`;
  };
}

function showUnlockAlert() {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "9999";
    overlay.style.display = "grid";
    overlay.style.placeItems = "center";
    overlay.style.padding = "24px";
    overlay.style.background = "rgba(0, 0, 0, 0.72)";

    const box = document.createElement("div");
    box.style.width = "min(420px, 100%)";
    box.style.padding = "24px";
    box.style.border = "5px solid #000";
    box.style.borderRadius = "8px";
    box.style.background = "#fff";
    box.style.color = "#000";
    box.style.textAlign = "center";
    box.style.boxShadow = "9px 9px 0 #000";
    box.style.fontFamily = '"Maven Pro", Arial, Helvetica, sans-serif';

    const title = document.createElement("h2");
    title.textContent = "Video Complete!";
    title.style.margin = "0 0 10px";
    title.style.fontSize = "2rem";
    title.style.textTransform = "uppercase";

    const message = document.createElement("p");
    message.textContent = "You unlocked a character. Press OK to continue.";
    message.style.margin = "0 0 20px";
    message.style.fontWeight = "700";

    const okButton = document.createElement("button");
    okButton.type = "button";
    okButton.textContent = "OK";
    okButton.style.padding = "12px 24px";
    okButton.style.border = "3px solid #000";
    okButton.style.borderRadius = "8px";
    okButton.style.color = "#fff";
    okButton.style.background = "#000";
    okButton.style.font = "inherit";
    okButton.style.fontWeight = "800";
    okButton.style.textTransform = "uppercase";
    okButton.style.cursor = "pointer";

    okButton.addEventListener("click", () => {
      overlay.remove();
      resolve();
    });

    box.append(title, message, okButton);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    okButton.focus();
  });
}

async function handleVideoFinished() {
  if (unlockHandled) {
    return;
  }

  unlockHandled = true;
  const anime = getAnimeFromURL();

  await showUnlockAlert();
  setUnlockedState(anime);
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    handleVideoFinished();
  }
}

function onYouTubeIframeAPIReady() {
  const anime = getAnimeFromURL();
  const video = videos[anime];
  const videoFrame = document.getElementById("videoFrame");
  const status = document.getElementById("status");

  if (!videoFrame || !status) {
    return;
  }

  if (!video) {
    videoFrame.innerHTML = "<p>Video not found.</p>";
    status.textContent = "Choose a video from the gallery.";
    return;
  }

  new YT.Player("videoFrame", {
    width: 560,
    height: 315,
    videoId: video.videoId,
    playerVars: {
      rel: 0,
      playsinline: 1
    },
    events: {
      onStateChange: onPlayerStateChange
    }
  });

  if (localStorage.getItem(`videoCompleted_${anime}`) === "true") {
    unlockHandled = true;
    setUnlockedState(anime);
  } else {
    setLockedState(video.label);
  }
}

window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
