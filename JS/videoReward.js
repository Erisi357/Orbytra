(function () {
	const video = document.querySelector("#video");

	if (!video) {
		return;
	}

	const rewardAmount = parseInt(video.dataset.rewardAmount) || 50;
	const rewardId = video.dataset.rewardId || window.location.pathname;
	const rewardKey = `videoRewardClaimed:${rewardId}`;

	const videoUrl = new URL(video.src);
	videoUrl.searchParams.set("enablejsapi", "1");
	videoUrl.searchParams.set("origin", window.location.origin);
	video.src = videoUrl.toString();

	function giveVideoReward() {
		if (localStorage.getItem(rewardKey)) {
			alert("You already claimed this video reward.");
			return;
		}

		const currentOrbDust = parseInt(localStorage.getItem("orbDust")) || 0;
		const newOrbDust = currentOrbDust + rewardAmount;

		localStorage.setItem("orbDust", newOrbDust);
		localStorage.setItem(rewardKey, "true");
		alert(`Video complete! You earned ${rewardAmount} Orb Dust.`);
	}

	window.onYouTubeIframeAPIReady = function () {
		new YT.Player(video, {
			events: {
				onStateChange: function (event) {
					if (event.data === YT.PlayerState.ENDED) {
						giveVideoReward();
					}
				},
			},
		});
	};

	const youtubeScript = document.createElement("script");
	youtubeScript.src = "https://www.youtube.com/iframe_api";
	document.head.appendChild(youtubeScript);
})();
