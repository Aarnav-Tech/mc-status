document.getElementById('checkStatus').addEventListener('click', async () => {
    const serverAddress = document.getElementById('serverAddress').value;
    const resultDiv = document.getElementById('result');

    if (!serverAddress) {
        resultDiv.innerHTML = '<p>Please enter a server address.</p>';
        return;
    }

    resultDiv.innerHTML = '<p>Checking status...</p>';

    try {
        const response = await fetch(`https://api.mcstatus.io/v2/status/java/${serverAddress}`);
        if (!response.ok) {
            throw new Error('Server not found or unreachable.');
        }
        const data = await response.json();

        // Log the entire response to the console for debugging
        console.log(data);

        // Function to format the MOTD
        const formatMOTD = (motd) => {
            if (!motd) return 'N/A';
            return motd.replace(/§([0-9a-fklmno])/g, (match, color) => {
                const colors = {
                    '0': '#000000', // Black
                    '1': '#0000AA', // Dark Blue
                    '2': '#00AA00', // Dark Green
                    '3': '#00AAAA', // Dark Aqua
                    '4': '#AA0000', // Dark Red
                    '5': '#AA00AA', // Dark Purple
                    '6': '#FFAA00', // Gold
                    '7': '#AAAAAA', // Gray
                    '8': '#555555', // Dark Gray
                    '9': '#5555FF', // Blue
                    'a': '#55FF55', // Green
                    'b': '#55FFFF', // Aqua
                    'c': '#FF5555', // Red
                    'd': '#FF55FF', // Light Purple
                    'e': '#FFFF55', // Yellow
                    'f': '#FFFFFF', // White
                    'k': 'font-weight: bold;', // Obfuscated
                    'l': 'font-weight: bold;', // Bold
                    'm': 'text-decoration: line-through;', // Strikethrough
                    'n': 'text-decoration: underline;', // Underline
                    'o': 'font-style: italic;', // Italic
                };
                return `<span style="color: ${colors[color] || '#FFFFFF'};">`;
            }).replace(/<\/span><span/g, '</span>');
        };

        resultDiv.innerHTML = `
            <h2>Server Status</h2>
            <p>
                <strong>Server Address:</strong> ${data.host || 'N/A'}
                ${data.icon ? `<img src="${data.icon}" alt="Server Icon" style="width: 30px; height: 30px; vertical-align: middle; margin-left: 10px;">` : ''}
            </p>
            <p><strong>IP Address:</strong> ${data.ip_address || '🚫'}</p>
            <p><strong>Port:</strong> ${data.port || '🚫'}</p>
            <p><strong>Version:</strong> ${data.version?.name_clean || '🚫 [Undefined]'}</p>
            <p><strong>Players Online:</strong> ${data.players?.online || 0} / ${data.players?.max || 0}</p>
            <p><strong>MOTD:</strong> <span>${formatMOTD(data.motd?.raw || 'None Put :(')}</span></p>
            <p><strong>EULA Blocked:</strong> ${data.eula_blocked ? '✅' : '❌'}</p>
            <p><strong>Mods:</strong> ${data.mods.length > 0 ? data.mods.join(', ') : 'None Used'}</p>
            <p><strong>Software:</strong> ${data.software || 'None Used/Unavailable'}</p>
            <p><strong>Plugins:</strong> ${data.plugins.length > 0 ? data.plugins.join(', ') : 'None Used'}</p>
            <p><strong>Is it Online?:</strong> ${data.online ? '✅' : '❌'}</p>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});