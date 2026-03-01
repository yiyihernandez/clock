let timeOffset = 0;
let activeAlarm = null;
let isMuted = false;
let currentTema = 'normal';
let library = []; 
let alarmaSonando = false; 
let globalVolume = 1.0; 

const musicaFNF = new Audio('alarmamusica.mp3'); 
musicaFNF.loop = true;

// base
let alertaFinal = new Audio('ding.mp3'); 
// ------------------------------

document.addEventListener('click', () => {
    musicaFNF.load();
    alertaFinal.load();
}, { once: true });

function updateClock() {
    let now = new Date();
    now.setMilliseconds(now.getMilliseconds() + timeOffset);
    let h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    
    let currentTime24 = h.toString().padStart(2, '0') + ":" + m.toString().padStart(2, '0');
    let ampm = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12 || 12;

    document.getElementById("time").innerText = 
        `${h12.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    document.getElementById("ampm").innerText = ampm;

    if (activeAlarm === currentTime24 && s === 0 && !alarmaSonando) {
        activarAlerta();
    }
}

function activarAlerta() {
    alarmaSonando = true;
    musicaFNF.pause(); // apaga fnf/no mezclar
    
    alertaFinal.loop = true; 
    alertaFinal.volume = globalVolume;
    alertaFinal.currentTime = 0;
    alertaFinal.play().catch(e => console.log("Clic para sonido"));
    
    document.getElementById("clockWrapper").classList.add("alarm-ringing");
    document.getElementById("stopBtn").style.display = "block";
}

function stopAlarm() {
    alarmaSonando = false;
    activeAlarm = null;
    alertaFinal.pause();
    alertaFinal.loop = false;
    alertaFinal.currentTime = 0;
    
    document.getElementById("clockWrapper").classList.remove("alarm-ringing");
    document.getElementById("stopBtn").style.display = "none";
    

    if (currentTema === 'fnf' && !isMuted) {
        musicaFNF.play();
    }
}

function cambiarTema(tema) {
    currentTema = tema;
    document.body.className = 'tema-' + tema;
    document.body.classList.remove('upload-color-active'); 

    // botones
    document.querySelectorAll('.bubble').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(tema === 'fnf' ? 'btnFNF' : 'btnNormal');
    if(btn) btn.classList.add('active');

    // silencio
    if (tema === 'normal') {
        // azul
        musicaFNF.pause();
        musicaFNF.currentTime = 0;
    } else if (tema === 'fnf') {
        // rosado
        if (!isMuted && !alarmaSonando) {
            musicaFNF.play().catch(() => {});
        }
    }
}


function setVolume(v) {
    globalVolume = v;
    musicaFNF.volume = v;
    alertaFinal.volume = v;
    document.getElementById('volLabel').innerText = Math.round(v * 100) + "%";
}

function manualVolume() {
    let input = prompt("Volumen (0-100):", globalVolume * 100);
    if (input !== null) {
        let val = parseInt(input);
        if (!isNaN(val) && val >= 0 && val <= 100) setVolume(val / 100);
    }
}

function toggleMute() {
    isMuted = !isMuted;
    const icon = document.getElementById("speakerIcon");
    if (isMuted) {
        musicaFNF.pause();
        alertaFinal.muted = true;
        icon.className = "fas fa-volume-mute";
    } else {
        if (currentTema === 'fnf' && !alarmaSonando) musicaFNF.play();
        alertaFinal.muted = false;
        icon.className = "fas fa-volume-up";
    }
}

// amarillo
function saveCustomSound() {
    const fileInput = document.getElementById('userAudioInput');
    if (fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newSound = { 
                name: document.getElementById('customName').value || "Sonido Personalizado", 
                icon: document.getElementById('iconSelect').value, 
                url: e.target.result 
            };
            library.push(newSound);
            updateSoundList();
            document.body.classList.add('upload-color-active');
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function updateSoundList() {
    const list = document.getElementById('soundList');
    list.innerHTML = '';
    library.forEach((sound, index) => {
        const div = document.createElement('div');
        div.className = 'sound-item-pro';
        div.innerHTML = `<i class="fas ${sound.icon}"></i> ${sound.name}`;
        div.onclick = () => {
            alertaFinal.pause();
            alertaFinal = new Audio(sound.url);
            alertaFinal.volume = globalVolume;
            alertaFinal.loop = true;
            alert("Nueva alarma guardada: " + sound.name);
        };
        list.appendChild(div);
    });
}

function setAlarm() {
    const input = document.getElementById("alarmTime").value;
    if (input) { 
        activeAlarm = input; 
        alert("Alarma programada"); 
    }
}

function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

setInterval(updateClock, 1000);
updateClock();