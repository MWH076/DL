const clientId = '1292562339702505522';
const redirectUri = 'https://mwh076.github.io/DL/';

document.getElementById('login-btn').addEventListener('click', () => {
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=identify%20guilds`;
    window.location.href = discordAuthUrl;
});

window.onload = async () => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get('access_token');

    if (accessToken) {
        document.getElementById('home').classList.add('d-none');
        document.getElementById('dashboard').classList.remove('d-none');

        const guilds = await fetchGuilds(accessToken);
        displayGuilds(guilds);
    }
};

async function fetchGuilds(accessToken) {
    const response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    const guilds = await response.json();

    return guilds.filter(guild => guild.owner || (guild.permissions & 0x20) === 0x20);
}

function displayGuilds(guilds) {
    const guildList = document.getElementById('guild-list');
    guilds.forEach(guild => {
        const guildCard = document.createElement('div');
        guildCard.classList.add('col-md-4', 'server-card');

        guildCard.innerHTML = `
      <img src="https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png" alt="${guild.name}" />
      <h3>${guild.name}</h3>
    `;
        guildList.appendChild(guildCard);
    });
}
