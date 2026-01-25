// scripts/api.js - Full complete script

async function initApp() {
    const main = document.querySelector('main');
    main.innerHTML = ''; // Clear loading

    // Heading
    const heading = document.createElement('h1');
    heading.textContent = 'Users from JSONPlaceholder API';
    heading.classList.add('heading');
    main.appendChild(heading);

    // Search bar
    const searchContainer = document.createElement('div');
    searchContainer.classList.add('search-container');
    searchContainer.innerHTML = `
        <input type="text" id="searchInput" placeholder="Search users by name or email...">
    `;
    main.appendChild(searchContainer);

    // Location + Weather
    const locationDiv = document.createElement('div');
    locationDiv.classList.add('location');
    locationDiv.textContent = 'Getting your location...';
    main.appendChild(locationDiv);

    const weatherDiv = document.createElement('div');
    weatherDiv.classList.add('weather', 'hidden');
    main.appendChild(weatherDiv);

    // User list
    const userList = document.createElement('ul');
    userList.classList.add('user-list');
    main.appendChild(userList);

    const users = await fetchUsers(userList);

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase();
        userList.querySelectorAll('.user-item').forEach(item => {
            const name = item.dataset.name.toLowerCase();
            const email = item.dataset.email.toLowerCase();
            item.style.display = (name.includes(term) || email.includes(term)) ? '' : 'none';
        });
    });

    // Geolocation + Weather
    getGeolocation(locationDiv, weatherDiv);
}

async function fetchUsers(userList) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const users = await response.json();

        if (users.length === 0) {
            const item = document.createElement('li');
            item.textContent = 'No users found.';
            item.classList.add('user-item');
            userList.appendChild(item);
            return [];
        }

        for (const user of users) {
            const userItem = document.createElement('li');
            userItem.classList.add('user-item');
            userItem.dataset.name = user.name;
            userItem.dataset.email = user.email;

            userItem.innerHTML = `
                <strong>Name:</strong> ${user.name}<br>
                <strong>Email:</strong> ${user.email}
                <button class="toggle-details">Show Details</button>
                <button class="toggle-posts">Show Posts</button>
                <button class="toggle-albums">Show Albums</button>
            `;

            // Details container (static)
            const detailsContainer = document.createElement('div');
            detailsContainer.classList.add('details-container', 'hidden');
            detailsContainer.innerHTML = `
                <strong>Phone:</strong> ${user.phone}<br>
                <strong>Website:</strong> <a href="https://${user.website}" target="_blank">${user.website}</a><br>
                <strong>Company:</strong> ${user.company.name} — "${user.company.catchPhrase}"<br>
                <strong>Address:</strong> ${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}
            `;
            userItem.appendChild(detailsContainer);

            // Posts container
            const postsContainer = document.createElement('div');
            postsContainer.classList.add('posts-container', 'hidden');
            userItem.appendChild(postsContainer);

            // Albums container
            const albumsContainer = document.createElement('div');
            albumsContainer.classList.add('albums-container', 'hidden');
            userItem.appendChild(albumsContainer);

            userList.appendChild(userItem);

            // Toggle Details
            userItem.querySelector('.toggle-details').addEventListener('click', (e) => {
                detailsContainer.classList.toggle('hidden');
                e.target.textContent = detailsContainer.classList.contains('hidden') ? 'Show Details' : 'Hide Details';
            });

            // Toggle Posts
            userItem.querySelector('.toggle-posts').addEventListener('click', async (e) => {
                if (!postsContainer.classList.contains('hidden')) {
                    postsContainer.classList.add('hidden');
                    e.target.textContent = 'Show Posts';
                    return;
                }
                if (postsContainer.children.length === 0) {
                    e.target.textContent = 'Loading posts...';
                    e.target.disabled = true;
                    await fetchPostsForUser(user.id, postsContainer);
                    e.target.textContent = 'Hide Posts';
                    e.target.disabled = false;
                }
                postsContainer.classList.remove('hidden');
            });

            // Toggle Albums
            userItem.querySelector('.toggle-albums').addEventListener('click', async (e) => {
                if (!albumsContainer.classList.contains('hidden')) {
                    albumsContainer.classList.add('hidden');
                    e.target.textContent = 'Show Albums';
                    return;
                }
                if (albumsContainer.children.length === 0) {
                    e.target.textContent = 'Loading albums...';
                    e.target.disabled = true;
                    await fetchAlbumsForUser(user.id, albumsContainer);
                    e.target.textContent = 'Hide Albums';
                    e.target.disabled = false;
                }
                albumsContainer.classList.remove('hidden');
            });
        }

        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        const item = document.createElement('li');
        item.textContent = 'Error loading users.';
        item.classList.add('user-item', 'error');
        userList.appendChild(item);
        return [];
    }
}

// Fetch posts for a user + nested comments
async function fetchPostsForUser(userId, container) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const posts = await response.json();

        if (posts.length === 0) {
            container.innerHTML = '<p>No posts found for this user.</p>';
            return;
        }

        const postsList = document.createElement('ul');
        postsList.classList.add('posts-list');

        for (const post of posts) {
            const postItem = document.createElement('li');
            postItem.classList.add('post-item');
            postItem.innerHTML = `
                <strong>${post.title}</strong><br>
                ${post.body}<br>
                <button class="toggle-comments">Show Comments</button>
            `;

            const commentsContainer = document.createElement('div');
            commentsContainer.classList.add('comments-container', 'hidden');
            postItem.appendChild(commentsContainer);

            const commentsBtn = postItem.querySelector('.toggle-comments');
            commentsBtn.addEventListener('click', async () => {
                if (!commentsContainer.classList.contains('hidden')) {
                    commentsContainer.classList.add('hidden');
                    commentsBtn.textContent = 'Show Comments';
                    return;
                }
                if (commentsContainer.children.length === 0) {
                    commentsBtn.textContent = 'Loading comments...';
                    commentsBtn.disabled = true;
                    await fetchCommentsForPost(post.id, commentsContainer);
                    commentsBtn.textContent = 'Hide Comments';
                    commentsBtn.disabled = false;
                }
                commentsContainer.classList.remove('hidden');
            });

            postsList.appendChild(postItem);
        }

        container.appendChild(postsList);
    } catch (error) {
        console.error('Error fetching posts:', error);
        container.innerHTML = '<p class="error">Error loading posts.</p>';
    }
}

async function fetchCommentsForPost(postId, container) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const comments = await response.json();

        if (comments.length === 0) {
            container.innerHTML = '<p>No comments yet.</p>';
            return;
        }

        const commentsList = document.createElement('ul');
        commentsList.classList.add('comments-list');

        comments.forEach(comment => {
            const commentItem = document.createElement('li');
            commentItem.classList.add('comment-item');
            commentItem.innerHTML = `
                <strong>${comment.name}</strong> (${comment.email})<br>
                ${comment.body}
            `;
            commentsList.appendChild(commentItem);
        });

        container.appendChild(commentsList);
    } catch (error) {
        console.error('Error fetching comments:', error);
        container.innerHTML = '<p class="error">Error loading comments.</p>';
    }
}

// Albums + Photos
async function fetchAlbumsForUser(userId, container) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/albums`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const albums = await response.json();

        if (albums.length === 0) {
            container.innerHTML = '<p>No albums found.</p>';
            return;
        }

        for (const album of albums) {
            const albumTitle = document.createElement('p');
            albumTitle.textContent = album.title;
            albumTitle.style.fontWeight = 'bold';
            container.appendChild(albumTitle);

            const grid = document.createElement('div');
            grid.classList.add('albums-grid');

            const photosResp = await fetch(`https://jsonplaceholder.typicode.com/albums/${album.id}/photos?_limit=6`);
            const photos = await photosResp.json();

            photos.forEach(photo => {
                const wrapper = document.createElement('div');
                const img = document.createElement('img');
                img.src = photo.thumbnailUrl;
                img.alt = photo.title;
                img.classList.add('album-thumb');
                img.title = photo.title;

                const title = document.createElement('div');
                title.textContent = photo.title;
                title.classList.add('album-title');

                wrapper.appendChild(img);
                wrapper.appendChild(title);
                grid.appendChild(wrapper);
            });

            container.appendChild(grid);
        }
    } catch (error) {
        console.error('Error fetching albums:', error);
        container.innerHTML = '<p class="error">Error loading albums.</p>';
    }
}

// Geolocation + Weather (Open-Meteo - no key needed)
function getGeolocation(locationDiv, weatherDiv) {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                locationDiv.textContent = `Your location: Latitude ${latitude.toFixed(4)}, Longitude ${longitude.toFixed(4)}`;

                try {
                    const weatherResp = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`
                    );
                    const data = await weatherResp.json();
                    const temp = data.current.temperature_2m;
                    const code = data.current.weather_code;

                    const weatherDescriptions = {
                        0: 'Clear sky',
                        1: 'Mainly clear',
                        2: 'Partly cloudy',
                        3: 'Overcast',
                        45: 'Fog',
                        51: 'Light drizzle',
                        61: 'Light rain',
                        63: 'Rain',
                        65: 'Heavy rain',
                        80: 'Rain showers',
                        95: 'Thunderstorm'
                    };
                    const desc = weatherDescriptions[code] || 'Unknown weather';

                    weatherDiv.innerHTML = `Current weather: <strong>${temp}°C</strong> — ${desc}`;
                    weatherDiv.classList.remove('hidden');
                } catch (err) {
                    weatherDiv.textContent = 'Could not fetch weather data.';
                    weatherDiv.classList.add('error');
                    weatherDiv.classList.remove('hidden');
                }
            },
            (error) => {
                let message = 'Location access denied or unavailable.';
                if (error.code === error.PERMISSION_DENIED) message = 'You denied location access.';
                if (error.code === error.POSITION_UNAVAILABLE) message = 'Location info unavailable.';
                if (error.code === error.TIMEOUT) message = 'Location request timed out.';
                locationDiv.textContent = message;
                locationDiv.classList.add('error');
                weatherDiv.classList.add('hidden');
            }
        );
    } else {
        locationDiv.textContent = 'Geolocation not supported by your browser.';
        locationDiv.classList.add('error');
        weatherDiv.classList.add('hidden');
    }
}

// Start the app
initApp();