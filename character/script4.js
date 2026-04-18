const videoConfig = {
  anime: "lain",
  title: "Serial Experiments Lain",
  videoId: "s-g0NqrBJ0w"
};

setupUnlockVideo(videoConfig);

function setupUnlockVideo(config) {
  const title = document.getElementById("videoTitle");
  const status = document.getElementById("status");
  const unlockBtn = document.getElementById("unlockBtn");
  let finished = false;

  title.textContent = config.title;
  status.textContent = `Character locked! Finish ${config.title} to unlock.`;
  unlockBtn.disabled = true;
  unlockBtn.textContent = "Unlock Character";

  function saveUnlock() {
    const unlocked = JSON.parse(localStorage.getItem("unlockedCharacters")) || [];

    if (!unlocked.includes(config.anime)) {
      unlocked.push(config.anime);
      localStorage.setItem("unlockedCharacters", JSON.stringify(unlocked));
    }

    localStorage.setItem(`videoCompleted_${config.anime}`, "true");
  }

  function showDesignButton() {
    saveUnlock();
    status.textContent = "Character unlocked!";
    unlockBtn.disabled = false;
    unlockBtn.textContent = "Design Character";
    unlockBtn.classList.add("unlocked");
    unlockBtn.onclick = () => {
      window.location.href = `character.html?anime=${encodeURIComponent(config.anime)}`;
    };
  }

  window.onYouTubeIframeAPIReady = () => {
    new YT.Player("player", {
      width: 560,
      height: 315,
      videoId: config.videoId,
      playerVars: {
        rel: 0,
        playsinline: 1
      },
      events: {
        onStateChange(event) {
          if (event.data === YT.PlayerState.ENDED && !finished) {
            finished = true;
            alert("Video complete! Press OK to unlock your character.");
            showDesignButton();
          }
        }
      }
    });
  };
}
