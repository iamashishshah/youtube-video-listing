let currentPage = 1;
const limit = 10;
const options = { method: "GET", headers: { accept: "application/json" } };
let allVideos = [];

async function fetchVideosFromFreeApi(page) {
    try {
        const uri = `https://api.freeapi.app/api/v1/public/youtube/videos?page=${page}&limit=${limit}&query=javascript&sortBy=mostViewed`;
        const response = await fetch(uri, options);
        const videosData = await response.json();

        if (!videosData.success) {
            console.log("Error while fetching the videos from API");
        } else {
            allVideos = videosData.data.data;
            renderVideos(allVideos);
            updateButtons();
        }
    } catch (error) {
        console.log("Internal server error");
    }
}

fetchVideosFromFreeApi(currentPage);

function renderVideos(videosArray) {
    const layout = document.querySelector(".video-grid");
    layout.innerHTML = "";

    videosArray.forEach((video) => {
        const videosMetaData = video.items.snippet;
        console.log(videosMetaData)

        const anchorTag = document.createElement("a");
        anchorTag.href = `https://www.youtube.com/watch?v=${video.items.id}`;
        anchorTag.target = "_blank";

        const videoCard = document.createElement("div");
        videoCard.classList.add("video-card");

        const thumbnail = document.createElement("img");
        thumbnail.src = videosMetaData.thumbnails.high.url;
        thumbnail.alt = "Video Thumbnail";
        
        thumbnail.classList.add("thumbnail");

        const videoTitle = document.createElement("p");
        videoTitle.classList.add("video-title");

        const channelLogo = document.createElement("img");
        channelLogo.src = "./asset/channel-logo.png";
        channelLogo.alt = "channel logo";
        channelLogo.width = 44;
        channelLogo.height = 44;
        channelLogo.style.borderRadius = "50%";

        const videoTitleText = document.createTextNode(`${videosMetaData.title}`);

        videoTitle.appendChild(channelLogo);
        videoTitle.appendChild(videoTitleText);

        const channelName = document.createElement("p");
        channelName.classList.add("channel-name");
        channelName.textContent = videosMetaData.channelTitle;

        const checkIcon = document.createElement("img");
        checkIcon.src = "./asset/check-icon.png";
        checkIcon.alt = "verified-mark";

        channelName.appendChild(checkIcon);

        const videoMeta = document.createElement("p");
        videoMeta.classList.add("video-meta");

        const dateString = video.items.snippet.publishedAt;
        const date = new Date(dateString);
        const formattedDate = date
            .toLocaleDateString("IN-en", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            .replace(",", "");
            const formattedViewCount = formatViewCount(video.items.statistics.viewCount);
            videoMeta.textContent = `${formattedViewCount} views • ${formattedDate}`;
        // videoMeta.textContent = `${video.items.statistics.viewCount} views • ${formattedDate}`;
        videoCard.appendChild(thumbnail);
        videoCard.appendChild(videoTitle);
        videoCard.appendChild(channelName);
        videoCard.appendChild(videoMeta);
        anchorTag.appendChild(videoCard);
        layout.appendChild(anchorTag);
    });
}

document.getElementById("search-input").addEventListener("input", searchVideos);

function searchVideos(event) {
    const query = event.target.value.toLowerCase().trim();

    const filteredVideos = allVideos.filter(
        (video) =>
            video.items.snippet.title.toLowerCase().includes(query) ||
            video.items.snippet.channelTitle.toLowerCase().includes(query)
    );

    renderVideos(filteredVideos);
}

document.getElementById("prev-btn").addEventListener("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
        currentPage--;
        updatePage();
    }
    stayAtBottom();
});

document.getElementById("next-btn").addEventListener("click", function (e) {
    e.preventDefault();
    if (currentPage < 10) {
        currentPage++;
        updatePage();
    }
    stayAtBottom();
});

function updatePage() {
    fetchVideosFromFreeApi(currentPage);
    document.getElementById("page-number").textContent = `Page ${currentPage}`;
}

function updateButtons() {
    document.getElementById("prev-btn").disabled = currentPage === 1;
    document.getElementById("next-btn").disabled = currentPage === 10;
}

function stayAtBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

function formatViewCount(count) {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + "M"; // Convert to millions (1.2M)
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + "K"; // Convert to thousands (1.2K)
    } else {
        return count; // Show exact count if below 1000
    }
}