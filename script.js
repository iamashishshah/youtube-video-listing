const uri = 'https://api.freeapi.app/api/v1/public/youtube/videos';

const url = 'https://api.freeapi.app/api/v1/public/youtube/videos?page=1&limit=10&query=javascript&sortBy=keep%2520one%253A%2520mostLiked%2520%257C%2520mostViewed%2520%257C%2520latest%2520%257C%2520oldest';
const options = { method: 'GET', headers: { accept: 'application/json' } };

let allVideos = [];

async function fetchVideosFromFreeApi() {
    try {
        const response = await fetch(uri, options);
        const r1 = await fetch(url, options)
        console.log(await r1.json())
        const videosData = await response.json();

        if (!videosData.success) {
            console.log('Error while fetching the videos from api');
        } else {
            allVideos = videosData.data.data;

            renderVideos(allVideos);
        }
    } catch (error) {
        console.log('Internal server error');
    }
}

fetchVideosFromFreeApi();

function renderVideos(vidoesArray) {
    const layout = document.querySelector('.video-grid');
    console.log(layout);
    layout.innerHTML = '';

    vidoesArray.forEach((video) => {
        console.log(video.items.id);

        const videosMetaData = video.items.snippet;

        const anchorTag = document.createElement('a');
        anchorTag.href = `https://www.youtube.com/watch?v=${video.items.id}`;
        anchorTag.target = '_blank';

        const videoCard = document.createElement('div');
        videoCard.classList.add('video-card');

        const thumbnail = document.createElement('img');
        thumbnail.src = videosMetaData.thumbnails.high.url;
        thumbnail.alt = 'Video Thumbnail';
        thumbnail.classList.add('thumbnail');

        const videoTitle = document.createElement('p');
        videoTitle.classList.add('video-title');

        const channelLogo = document.createElement('img');
        channelLogo.src = './asset/channel-logo.png';
        channelLogo.alt = 'channel logo';
        channelLogo.width = 44;
        channelLogo.height = 44;
        channelLogo.style.borderRadius = '50%';

        const videoTitleText = document.createTextNode(
            `${videosMetaData.title}`
        );

        videoTitle.appendChild(channelLogo);
        videoTitle.appendChild(videoTitleText);

        const channelName = document.createElement('p');
        channelName.classList.add('channel-name');
        channelName.textContent = videosMetaData.channelTitle;

        const checkIcon = document.createElement('img');
        checkIcon.src = './asset/check-icon.png';
        checkIcon.alt = 'verified-mark';

        channelName.appendChild(checkIcon);

        const videoMeta = document.createElement('p');
        videoMeta.classList.add('video-meta');

        const dateString = video.items.snippet.publishedAt;
        const date = new Date(dateString);
        const formattedDate = date
            .toLocaleDateString('IN-en', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            })
            .replace(',', '');

        videoMeta.textContent = `${video.items.statistics.viewCount} views • ${formattedDate}`;
        videoCard.appendChild(thumbnail);
        videoCard.appendChild(videoTitle);
        videoCard.appendChild(channelName);
        videoCard.appendChild(videoMeta);
        anchorTag.appendChild(videoCard);
        layout.appendChild(anchorTag);
    });
}

document.getElementById('search-input').addEventListener('input', searchVideos);

function searchVideos(event) {
    const query = event.target.value.toLowerCase().trim();

    const filteredVideos = allVideos.filter(
        (video) =>
            video.items.snippet.title.toLowerCase().includes(query) ||
            video.items.snippet.channelTitle.toLowerCase().includes(query)
    );

    renderVideos(filteredVideos);
}
