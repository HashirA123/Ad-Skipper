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
          var node = document.getElementsByClassName(
            "ytp-ad-skip-button-modern"
          )[0];
          if (node) {
            console.log("skipped");
            node.click();
          } else {
            var temp = document.getElementById("movie_player");
            if (temp.classList.contains("ad-showing")) {
              let video = document.querySelector("video");
              video.playbackRate = 16;
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
