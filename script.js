let timeOffset = 0;
let activeAlarm = null;
let isMuted = false;
let currentTema = 'normal';
let library = []; // Aquí guardaremos los sonidos del usuario

// Sonidos iniciales
let musicaFNF = new Audio('alarmamusica.mp3');
musicaFNF.loop = true;
let alertaFinal = new Audio('alarmaterminar.mp3');

// 1. Guardar sonido personalizado
function saveCustomSound() {
    const file = document.getElementById('userAudioInput').files[0];
    const name = document.getElementById('customName').value || "Mi Sonido";
    const icon = document.getElementById('iconSelect').value;

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newSound = { name, icon, url: e.target.result };
            library.push(newSound);
            updateSoundList();
            alert(`Sonido "${name}" guardado en la biblioteca.`);
        };
        reader.readAsDataURL(file);
    } else {
        alert("Selecciona un archivo primero.");
    }
}

function updateSoundList() {
    const list = document.getElementById('soundList');
    list.innerHTML = '';
    library.forEach((sound, index) => {
        const div = document.createElement('div');
        div.className = 'sound-item';
        div.innerHTML = `<i class="fas ${sound.icon}"></i> ${sound.name}`;
        div.onclick = () => selectAlarma(index);
        list.appendChild(div);
    });
}

function selectAlarma(index) {
    const sound = library[index];
    alertaFinal = new Audio(sound.url);
    document.getElementById('activeAlarmName').innerText = sound.name;
    document.getElementById('activeAlarmIcon').className = `fas ${sound.icon}`;
    document.getElementById('currentAlarmInfo').style.display = 'block';
    alert(`Alarma establecida con: ${sound.name}`);
}

// 2. Control de Volumen (Rueda y Manual)
document.getElementById('volumePanel').addEventListener('wheel', (e) => {
    e.preventDefault();
    let change = e.deltaY > 0 ? -0.05 : 0.05;
    setVolume(Math.min(1, Math.max(0, musicaFNF.volume + change)));
});

function manualVolume() {
    let input = prompt("Volumen (0-100):", musicaFNF.volume * 100);
    if (input !== null) setVolume(parseInt(input) / 100);
}

function setVolume(v) {
    musicaFNF.volume = v; alertaFinal.volume = v;
    document.getElementById('volLabel').innerText = Math.round(v * 100) + "%";
}

// 3. Reloj y Alarma
function updateClock() {
    let now = new Date();
    now.setMilliseconds(now.getMilliseconds() + timeOffset);
    let h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    let currentTime24 = h.toString().padStart(2, '0') + ":" + m.toString().padStart(2, '0');
    
    document.getElementById("time").innerText = `${h % 12 || 12}:${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
    document.getElementById("ampm").innerText = h >= 12 ? 'PM' : 'AM';

    if (activeAlarm === currentTime24) {
        musicaFNF.pause();
        alertaFinal.play();
        document.getElementById("clockWrapper").classList.add("alarm-ringing");
        document.getElementById("stopBtn").style.display = "block";
    }
}

// Resto de funciones (cambiarTema, setAlarm, stopAlarm, toggleMute, etc)
function cambiarTema(t) {
    currentTema = t; document.body.className = 'tema-' + t;
    document.querySelectorAll('.bubble').forEach(b => b.classList.remove('active'));
    document.getElementById(t === 'fnf' ? 'btnFNF' : 'btnNormal').classList.add('active');
    musicaFNF.pause();
    if (t === 'fnf' && !isMuted) musicaFNF.play().catch(() => {});
}

function setAlarm() { activeAlarm = document.getElementById("alarmTime").value; alert("Alarma lista"); }
function setClockTime() {
    const input = document.getElementById("alarmTime").value;
    if(input) {
        let [h, m] = input.split(':');
        let target = new Date(); target.setHours(h, m, 0);
        timeOffset = target - new Date();
    }
}

function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function stopAlarm() {
    activeAlarm = null; alertaFinal.pause(); alertaFinal.currentTime = 0;
    document.getElementById("clockWrapper").classList.remove("alarm-ringing");
    document.getElementById("stopBtn").style.display = "none";
    if (currentTema === 'fnf' && !isMuted) musicaFNF.play();
}

function toggleMute() {
    isMuted = !isMuted;
    const icon = document.getElementById("speakerIcon");
    if (isMuted) { musicaFNF.pause(); icon.className = "fas fa-volume-mute"; }
    else { if (currentTema === 'fnf') musicaFNF.play(); icon.className = "fas fa-volume-up"; }
}

setInterval(updateClock, 1000);
updateClock();