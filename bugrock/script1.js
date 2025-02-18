document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('checkStatus').addEventListener('click', async () => {
        const serverAddress = document.getElementById('serverAddress').value;
        const resultDiv = document.getElementById('result');

        if (!serverAddress) {
            resultDiv.innerHTML = '<p>Please enter a server address.</p>';
            return;
        }

        resultDiv.innerHTML = '<p>Checking status...</p>';

        try {
            const response = await fetch(`https://api.mcstatus.io/v2/status/bedrock/${serverAddress}`);
            if (!response.ok) {
                throw new Error('Server not found or unreachable.');
            }
            const data = await response.json();

            // Log the entire response to the console for debugging
            console.log(data);

            resultDiv.innerHTML = `
                <h2>Server Status</h2>
                <p><strong>Server Address:</strong> ${data.host || 'N/A[Offline]'}</p>
                <p><strong>IP Address:</strong> ${data.ip_address || '🚫[Offline]'}</p>
                <p><strong>Port:</strong> ${data.port || '🚫[Offline]'}</p>
                <p><strong>Version:</strong> ${data.version?.name || '🚫 [Undefined]'}</p>
                <p><strong>Protocol:</strong> ${data.version?.protocol || '🚫 [Undefined]'}</p>
                <p><strong>Players Online:</strong> ${data.players?.online || 0} / ${data.players?.max || 0}</p>
                <p><strong>MOTD:</strong> ${formatMOTD(data.motd?.raw || 'None Put :(')}</p>
                <p><strong>Is it Online?:</strong> ${data.online ? '✅' : '❌'}</p>
                <p><strong>Gamemode:</strong> ${data.gamemode || '🚫[Offline]'}</p>
                <p><strong>Edition:</strong> ${data.edition || 'Offline/Unavailable'}</p>
                <p><strong>Server ID:</strong> ${data.server_id || 'Unavailable'}</p>
                <p><strong>Software:</strong> ${data.software || 'Nothing Used lolol'}</p>
                <p><strong>Plugins:</strong> ${data.plugins?.join(', ') || 'None Used :/'}</p>
            `;
        } catch (error) {
            resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    });

    function formatMOTD(motd) {
        const colorCodes = {
            '0': 'black',
            '1': 'dark_blue',
            '2': 'dark_green',
            '3': 'dark_aqua',
            '4': 'dark_red',
            '5': 'dark_purple',
            '6': 'gold',
            '7': 'gray',
            '8': 'dark_gray',
            '9': 'blue',
            'a': 'green',
            'b': 'aqua',
            'c': 'red',
            'd': 'light_purple',
            'e': 'yellow',
            'f': 'white',
            'k': 'obfuscated',
            'l': 'bold',
            'm': 'strikethrough',
            'n': 'underline',
            'o': 'italic',
            'r': 'reset'
        };

        return motd.replace(/§([0-9a-fk-or])/g, (match, code) => {
            const style = colorCodes[code];
            if (style) {
                return `<span class="${style}">`;
            } else if (code === 'r') {
                return '</span>';
            }
            return match;
        }) + '</span>';
    }
});
