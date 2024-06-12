(() => {
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type } = obj;

    if (type === "New") {
      // observer();
      addObserverIfDesiredNodeAvailable();
    }
  });

  var observer = (target) => {
    // const target = document.getElementById("movie_player");

    const config = { childList: true, subtree: true };

    const callback = (mutationList, obs) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          var node = document.getElementsByClassName("ytp-skip-ad-button")[0];
          if (node) {
            console.log("skipped");
            node.click();
          } else if (
            document.getElementsByClassName("ytp-ad-skip-button-modern")[0]
          ) {
            node = document.getElementsByClassName(
              "ytp-ad-skip-button-modern"
            )[0];
            console.log("skipped");
            node.click();
          } else {
            var error = document.getElementsByClassName(
              "yt-playability-error-supported-renderers"
            )[0];
            if (error) {
              location.reload();
            }
            var temp = document.getElementById("movie_player");
            if (temp.classList.contains("ad-showing")) {
              let video = document.querySelector("video");
              //if (video.duration) video.currentTime = video.duration; // This doesn't work anymore, triggers ad block policy. SAD
              video.playbackRate = 4;
              // console.log("sped up");
            }
          }
        }
      }
    };

    const o = new MutationObserver(callback);
    o.observe(target, config);
  };

  var addObserverIfDesiredNodeAvailable = () => {
    var composeBox = document.getElementById("movie_player");
    if (!composeBox) {
      //The node we need does not exist yet.
      //Wait 500ms and try again
      window.setTimeout(addObserverIfDesiredNodeAvailable, 500);
      return;
    }
    observer(composeBox);
  };

  addObserverIfDesiredNodeAvailable();

  // observer();
})();
