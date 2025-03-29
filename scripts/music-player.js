let player;
let currentTrackIndex = 0;
let isPlaying = false;
let currentAlbum = 'All';

const playlist = [
    { 
        songId: "VjJtH7xM8G4", 
        title: "Nanchaku", 
        artist: "Seedhe Maut ft. MC Stan", 
        album: "न (Na)", 
        art: "https://imgs.search.brave.com/RM3wy9NUaIMB5KzjSMNYKGwrUZUWnvECiLhutDsZmOM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sYXN0/Zm0uZnJlZXRscy5m/YXN0bHkubmV0L2kv/dS8zMDB4MzAwLzQ1/YmIyNjVmNmEyODYw/MmVlM2FiMzk4MGQw/NzNlMTA1LmpwZw" 
    },
    { 
        songId: "Ecs-foVS74Q", 
        title: "Kodak", 
        artist: "Seedhe Maut ft. King", 
        album: "Monopoly Moves (MM)", 
        art: "https://i.ytimg.com/vi/Ecs-foVS74Q/mqdefault.jpg" 
    },
    { 
        songId: "k-6ZDSIMEtY", 
        title: "Maina", 
        artist: "Seedhe Maut x Sez on the Beat", 
        album: "Nayaab", 
        art: "https://i.ytimg.com/vi/k-6ZDSIMEtY/mqdefault.jpg" 
    },
    { 
        songId: "1JzacUVA6w8", 
        title: "Tour Shit", 
        artist: "Seedhe Maut", 
        album: "Single", 
        art: "https://i.ytimg.com/vi/1JzacUVA6w8/mqdefault.jpg" 
    },
    { 
        songId: "vgpH9go537Q", 
        title: "TT/Shutdown", 
        artist: "Seedhe Maut", 
        album: "Single", 
        art: "https://i.ytimg.com/vi/vgpH9go537Q/mqdefault.jpg" 
    },
    { 
        songId: "VEQ-XJWiQMM", 
        title: "11K", 
        artist: "Seedhe Maut", 
        album: "Far From Over (EP)", 
        art: "https://i.ytimg.com/vi/VEQ-XJWiQMM/mqdefault.jpg" 
    },
    { 
        songId: "YuWUJg3Kdks", 
        title: "Namastute", 
        artist: "Seedhe Maut x Sez on the Beat", 
        album: "न (Na)", 
        art: "https://imgs.search.brave.com/RM3wy9NUaIMB5KzjSMNYKGwrUZUWnvECiLhutDsZmOM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sYXN0/Zm0uZnJlZXRscy5m/YXN0bHkubmV0L2kv/dS8zMDB4MzAwLzQ1/YmIyNjVmNmEyODYw/MmVlM2FiMzk4MGQw/NzNlMTA1LmpwZw"  
    },
    {  
        songId: "XCIYHCXQoxQ",
        title: "Red",
        artist: "Seedhe Maut",
        album: "Kshama",
        art: "https://i.ytimg.com/vi/XCIYHCXQoxQ/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCfH5HnxxT4hY1dVn0u7BZPUJZJTQ"
    },
    { 
        songId: "k9vnITNHqoM", 
        title: "Natkhat", 
        artist: "Seedhe Maut", 
        album: "न (Na)", 
        art: "https://imgs.search.brave.com/RM3wy9NUaIMB5KzjSMNYKGwrUZUWnvECiLhutDsZmOM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sYXN0/Zm0uZnJlZXRscy5m/YXN0bHkubmV0L2kv/dS8zMDB4MzAwLzQ1/YmIyNjVmNmEyODYw/MmVlM2FiMzk4MGQw/NzNlMTA1LmpwZw" 
    },
    { 
        songId: "5g4C7JNkRvE", 
        title: "Nafrat", 
        artist: "Seedhe Maut", 
        album: "न (Na)", 
        art: "https://imgs.search.brave.com/RM3wy9NUaIMB5KzjSMNYKGwrUZUWnvECiLhutDsZmOM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sYXN0/Zm0uZnJlZXRscy5m/YXN0bHkubmV0L2kv/dS8zMDB4MzAwLzQ1/YmIyNjVmNmEyODYw/MmVlM2FiMzk4MGQw/NzNlMTA1LmpwZw" 
    },
    { 
        songId: "3buqwoYKkL4", 
        title: "Namcheen", 
        artist: "Seedhe Maut", 
        album: "न (Na)", 
        art: "https://imgs.search.brave.com/RM3wy9NUaIMB5KzjSMNYKGwrUZUWnvECiLhutDsZmOM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sYXN0/Zm0uZnJlZXRscy5m/YXN0bHkubmV0L2kv/dS8zMDB4MzAwLzQ1/YmIyNjVmNmEyODYw/MmVlM2FiMzk4MGQw/NzNlMTA1LmpwZw" 
    },
    { 
        songId: "nTK0OEAzctM", 
        title: "Nawazuddin", 
        artist: "Seedhe Maut", 
        album: "न (Na)", 
        art: "https://imgs.search.brave.com/RM3wy9NUaIMB5KzjSMNYKGwrUZUWnvECiLhutDsZmOM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sYXN0/Zm0uZnJlZXRscy5m/YXN0bHkubmV0L2kv/dS8zMDB4MzAwLzQ1/YmIyNjVmNmEyODYw/MmVlM2FiMzk4MGQw/NzNlMTA1LmpwZw" 
    },
    { 
        songId: "GMGi2p63ga0", 
        title: "Nadaan", 
        artist: "Seedhe Maut", 
        album: "न (Na)", 
        art: "https://imgs.search.brave.com/RM3wy9NUaIMB5KzjSMNYKGwrUZUWnvECiLhutDsZmOM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sYXN0/Zm0uZnJlZXRscy5m/YXN0bHkubmV0L2kv/dS8zMDB4MzAwLzQ1/YmIyNjVmNmEyODYw/MmVlM2FiMzk4MGQw/NzNlMTA1LmpwZw" 
    },
    { 
        songId: "14DWUa_6BvI", 
        title: "Nazarbhattu Freestyle", 
        artist: "Seedhe Maut", 
        album: "न (Na)", 
        art: "https://imgs.search.brave.com/RM3wy9NUaIMB5KzjSMNYKGwrUZUWnvECiLhutDsZmOM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sYXN0/Zm0uZnJlZXRscy5m/YXN0bHkubmV0L2kv/dS8zMDB4MzAwLzQ1/YmIyNjVmNmEyODYw/MmVlM2FiMzk4MGQw/NzNlMTA1LmpwZw" 
    },
    { 
        songId: "t7XowdWvKfI", 
        title: "Na Jaaye", 
        artist: "Seedhe Maut", 
        album: "न (Na)", 
        art: "https://imgs.search.brave.com/RM3wy9NUaIMB5KzjSMNYKGwrUZUWnvECiLhutDsZmOM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sYXN0/Zm0uZnJlZXRscy5m/YXN0bHkubmV0L2kv/dS8zMDB4MzAwLzQ1/YmIyNjVmNmEyODYw/MmVlM2FiMzk4MGQw/NzNlMTA1LmpwZw" 
    },
    {  
        songId: "AM0BdQZ4A8c",
        title: "Ice",
        artist: "Seedhe Maut",
        album: "Kshama",
        art: "/assets/images/kshama.png"
    },
    {  
        songId: "hLjlYKr6jVs",
        title: "Gourmet shit!",
        artist: "Seedhe Maut ft. Raftaar",
        album: "Kshama",
        art: "/assets/images/kshama.png"
    },
    {  
        songId: "ffywND5jorM",
        title: "Moon comes up",
        artist: "Seedhe Maut ft. Baadshah",
        album: "Kshama",
        art: "/assets/images/kshama.png"
    },
    {  
        songId: "aQS_yIptKAU",
        title: "Round 3",
        artist: "Seedhe Maut",
        album: "Kshama",
        art: "/assets/images/kshama.png"
    },
    {  
        songId: "l99lMQ0y05E",
        title: "Naraaz",
        artist: "Seedhe Maut",
        album: "Kshama",
        art: "/assets/images/kshama.png"
    },
    {  
        songId: "WIWwS6U-kHE",
        title: "Brahamachari",
        artist: "Seedhe Maut ft. Raga , GhAatak",
        album: "Kshama",
        art: "/assets/images/kshama.png"
    },
    {  
        songId: "oLzLSQZRZj4",
        title: "Shakti aur Kshama",
        artist: "Seedhe Maut",
        album: "Kshama",
        art: "/assets/images/kshama.png"
    },


    
    
];

// Fallback image if album art fails
const fallbackImage = "https://via.placeholder.com/300x300.png?text=Seedhe+Maut";

// Get unique albums
function getAlbums() {
    return ['All', ...new Set(playlist.map(track => track.album))];
}

// Render Album List
function renderAlbumList() {
    const albumListEl = document.querySelector('#albumList');
    const albums = getAlbums();
    albumListEl.innerHTML = '';
    albums.forEach(album => {
        const li = document.createElement('li');
        li.textContent = album;
        li.className = album === currentAlbum ? 'active' : '';
        li.addEventListener('click', () => {
            currentAlbum = album;
            filterAndRenderPlaylist();
            albumListEl.querySelectorAll('li').forEach(item => {
                item.className = item.textContent === currentAlbum ? 'active' : '';
            });
        });
        albumListEl.appendChild(li);
    });
}

// Filter and Render Playlist
function filterAndRenderPlaylist() {
    const playlistEl = document.querySelector('#playlist');
    const filteredPlaylist = currentAlbum === 'All' ? playlist : playlist.filter(track => track.album === currentAlbum);
    playlistEl.innerHTML = '';
    filteredPlaylist.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = `${track.title} - ${track.artist}`;
        li.className = index === currentTrackIndex && track.songId === playlist[currentTrackIndex].songId ? 'active' : '';
        li.addEventListener('click', () => loadAndPlay(filteredPlaylist.indexOf(track)));
        playlistEl.appendChild(li);
    });
}

// Load Track
function loadTrack(index) {
    const filteredPlaylist = currentAlbum === 'All' ? playlist : playlist.filter(track => track.album === currentAlbum);
    currentTrackIndex = (index < 0) ? filteredPlaylist.length - 1 : (index >= filteredPlaylist.length) ? 0 : index;
    const track = filteredPlaylist[currentTrackIndex];
    const trackTitle = document.querySelector('#trackTitle');
    const albumName = document.querySelector('#albumName');
    const albumArt = document.querySelector('#albumArt');
    const playerDiv = document.querySelector('#ytplayer');
    const loadingScreen = document.querySelector('#loadingScreen');

    trackTitle.textContent = track.title;
    albumName.textContent = `${track.artist} - ${track.album}`;
    albumArt.src = track.art;
    albumArt.onerror = () => {
        albumArt.src = fallbackImage;
    };
    playerDiv.innerHTML = `<iframe id="yt-iframe" src="https://www.youtube.com/embed/${track.songId}?enablejsapi=1&autoplay=0" frameborder="0" allowfullscreen></iframe>`;
    
    player = new YT.Player('yt-iframe', {
        events: {
            'onReady': (event) => {
                loadingScreen.style.display = 'none';
                if (isPlaying) event.target.playVideo();
            },
            'onStateChange': (event) => {
                if (event.data === YT.PlayerState.ENDED) loadAndPlay(currentTrackIndex + 1);
                isPlaying = event.data === YT.PlayerState.PLAYING;
                const playPauseBtn = document.querySelector('.play-pause');
                playPauseBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
            },
            'onError': (event) => {
                console.error(`Skipping ${track.title} - YouTube Error: ${event.data}`);
                loadAndPlay(currentTrackIndex + 1);
            }
        }
    });

    const playlistEl = document.querySelector('#playlist');
    playlistEl.querySelectorAll('li').forEach((li, i) => li.className = i === currentTrackIndex ? 'active' : '');
}

function togglePlayPause() {
    if (!player) return;
    if (isPlaying) player.pauseVideo();
    else player.playVideo();
}

function loadAndPlay(index) {
    isPlaying = true;
    loadTrack(index);
}

function onYouTubeIframeAPIReady() {
    loadTrack(currentTrackIndex);
}

document.addEventListener('DOMContentLoaded', () => {
    const playPauseBtn = document.querySelector('.play-pause');
    const prevBtn = document.querySelector('#prevBtn');
    const nextBtn = document.querySelector('#nextBtn');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', () => loadAndPlay(currentTrackIndex - 1));
    nextBtn.addEventListener('click', () => loadAndPlay(currentTrackIndex + 1));

    // Hamburger Menu Toggle
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    renderAlbumList();
    filterAndRenderPlaylist();
});