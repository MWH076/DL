const clientId = "1292562339702505522";
const redirectUri = "https://mwh076.github.io/DL/";
const apiEndpoint = "https://discord.com/api/oauth2/authorize";
const serverEndpoint = "https://discord.com/api/users/@me/guilds";
let accessToken = null;

const homeDiv = document.getElementById('home');
const serversDiv = document.getElementById('servers');
const serverListDiv = document.getElementById('server-list');
const loginBtn = document.getElementById('login-btn');

loginBtn.href = `${apiEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=identify%20guilds`;

window.onload = function () {
    const hash = window.location.hash;

    if (hash) {
        const params = new URLSearchParams(hash.replace('#', ''));
        accessToken = params.get('access_token');

        if (accessToken) {
            displayServers();
        } else {
            console.error('No access token found.');
        }
    }
};

async function displayServers() {
    try {
        const response = await fetch(serverEndpoint, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch servers. Token may be invalid or expired.');
        }

        const servers = await response.json();
        showServers(servers);
    } catch (error) {
        console.error('Error fetching servers:', error);
        alert('An error occurred. Please log in again.');
        window.location.href = loginBtn.href;
    }
}

function showServers(servers) {
    homeDiv.classList.add('d-none');
    serversDiv.classList.remove('d-none');

    serverListDiv.innerHTML = '';

    if (servers.length === 0) {
        serverListDiv.innerHTML = '<p>You are not a part of any Discord servers with permissions.</p>';
        return;
    }

    servers.forEach(server => {
        const serverCard = document.createElement('div');
        serverCard.classList.add('server-card');

        serverCard.innerHTML = `
            <h3>${server.name}</h3>
            <p>Owner: ${server.owner ? 'Yes' : 'No'}</p>
        `;

        serverListDiv.appendChild(serverCard);
    });
}
