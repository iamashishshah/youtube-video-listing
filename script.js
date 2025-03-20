let currentPage = 1;
const limit = 10;
const options = { method: "GET", headers: { accept: "application/json" } };
let allVideos = [];

// Function to fetch videos from the Free API
async function fetchVideosFromFreeApi(page) {
    try {
        const uri = `https://api.freeapi.app/api/v1/public/youtube/videos?page=${page}&limit=${limit}&query=javascript&sortBy=mostViewed`;
        const response = await fetch(uri, options);
        const videosData = await response.json();

        if (!videosData.success) {
            console.log("Error while fetching the videos from API");
        } else {
            allVideos = videosData.data.data; // Store fetched videos
            renderVideos(allVideos); // Render videos in UI
            updateButtons(); // Update pagination button states
        }
    } catch (error) {
        console.log("Internal server error");
    }
}

// Initial fetch for videos
fetchVideosFromFreeApi(currentPage);

// Function to render videos in the UI
function renderVideos(videosArray) {
    const layout = document.querySelector(".video-grid");
    layout.innerHTML = ""; // Clear previous content before rendering new videos

    videosArray.forEach((video) => {
        const videosMetaData = video.items.snippet;


        const anchorTag = document.createElement("a");
        anchorTag.href = `https://www.youtube.com/watch?v=${video.items.id}`;
        anchorTag.target = "_blank";

        const videoCard = document.createElement("div");
        videoCard.classList.add("video-card");

        // Video thumbnail
        const thumbnail = document.createElement("img");
        thumbnail.src = videosMetaData.thumbnails.high.url;
        thumbnail.alt = "Video Thumbnail";
        thumbnail.classList.add("thumbnail");

        // Video title
        const videoTitle = document.createElement("p");
        videoTitle.classList.add("video-title");

        // Channel logo
        const channelLogo = document.createElement("img");
        channelLogo.src = "./asset/channel-logo.png";
        channelLogo.alt = "channel logo";
        channelLogo.width = 44;
        channelLogo.height = 44;
        channelLogo.style.borderRadius = "50%";

        const videoTitleText = document.createTextNode(`${videosMetaData.title}`);
        videoTitle.appendChild(channelLogo);
        videoTitle.appendChild(videoTitleText);

        // Channel name with verification icon
        const channelName = document.createElement("p");
        channelName.classList.add("channel-name");
        channelName.textContent = videosMetaData.channelTitle;

        const checkIcon = document.createElement("img");
        checkIcon.src = "./asset/check-icon.png";
        checkIcon.alt = "verified-mark";
        channelName.appendChild(checkIcon);

        // Video metadata (views & date)
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

        // Append elements to video card
        videoCard.appendChild(thumbnail);
        videoCard.appendChild(videoTitle);
        videoCard.appendChild(channelName);
        videoCard.appendChild(videoMeta);
        
        // Append video card to anchor tag
        anchorTag.appendChild(videoCard);
        layout.appendChild(anchorTag);
    });
}

// Event listener for search functionality
// Filters videos based on the title and channel name
function searchVideos(event) {
    const query = event.target.value.toLowerCase().trim();

    const filteredVideos = allVideos.filter(
        (video) =>
            video.items.snippet.title.toLowerCase().includes(query) ||
            video.items.snippet.channelTitle.toLowerCase().includes(query)
    );

    renderVideos(filteredVideos);
}

document.getElementById("search-input").addEventListener("input", searchVideos);

// Pagination: Previous button functionality
// Moves to previous page if not on first page
// Keeps the scroll position at bottom

document.getElementById("prev-btn").addEventListener("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
        currentPage--;
        updatePage();
    }
    stayAtBottom();
});

// Pagination: Next button functionality
// Moves to next page if not on last page (page 10)
// Keeps the scroll position at bottom

document.getElementById("next-btn").addEventListener("click", function (e) {
    e.preventDefault();
    if (currentPage < 10) {
        currentPage++;
        updatePage();
    }
    stayAtBottom();
});

// Fetch videos for the new page and update page number
function updatePage() {
    fetchVideosFromFreeApi(currentPage);
    document.getElementById("page-number").textContent = `Page ${currentPage}`;
}

// Update pagination button states based on the current page
function updateButtons() {
    document.getElementById("prev-btn").disabled = currentPage === 1;
    document.getElementById("next-btn").disabled = currentPage === 10;
}

// Ensure the window stays at the bottom when paginating
function stayAtBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

// Function to format view count (e.g., 1K, 1M, etc.)
function formatViewCount(count) {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + "M"; // Convert to millions (1.2M)
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + "K"; // Convert to thousands (1.2K)
    } else {
        return count; // Show exact count if below 1000
    }
}
