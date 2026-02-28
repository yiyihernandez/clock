let timeOffset = 0;
let activeAlarm = null;
let isMuted = false;

// Configuración de los sonidos
const musicaFondo = new Audio('alarmamusica.mp3'); 
musicaFondo.loop = true;

const sonidoAlerta = new Audio('alarmaterminar.mp3');
sonidoAlerta.loop = false;

function updateClock() {
    let now = new Date();
    now.setMilliseconds(now.getMilliseconds() + timeOffset);

    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();

    let currentTime24 = h.toString().padStart(2, '0') + ":" + m.toString().padStart(2, '0');

    let ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12; 
    
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;

    document.getElementById("time").innerText = `${h}:${m}:${s}`;
    document.getElementById("ampm").innerText = ampm;

    if (activeAlarm === currentTime24) {
        activarAlerta();
    }
}

// NUEVA FUNCIÓN: Controlar el silencio
function toggleMute() {
    isMuted = !isMuted;
    const icon = document.getElementById("speakerIcon");
    
    if (isMuted) {
        musicaFondo.pause();
        icon.className = "fas fa-volume-mute"; // Cambia el icono
    } else {
        // Solo reproducir si ya se ha interactuado con la página
        musicaFondo.play().catch(() => {});
        icon.className = "fas fa-volume-up"; // Vuelve al icono normal
    }
}

function reproducirMusicaFondo() {
    if (!isMuted) {
        musicaFondo.play().catch(error => {
            console.log("Esperando clic para iniciar música.");
        });
    }
}

function setAlarm() {
    const timeInput = document.getElementById("alarmTime").value;
    if (timeInput) {
        activeAlarm = timeInput;
        reproducirMusicaFondo();
        alert("Alarma programada.");
    }
}

function setClockTime() {
    const timeInput = document.getElementById("alarmTime").value;
    if (timeInput) {
        let [hours, minutes] = timeInput.split(':');
        let targetDate = new Date();
        targetDate.setHours(hours, minutes, 0);
        timeOffset = targetDate - new Date();
        reproducirMusicaFondo();
        alert("Hora ajustada.");
    }
}

function activarAlerta() {
    musicaFondo.pause();
    // La alerta suena SIEMPRE aunque esté en mute (por seguridad), 
    // pero puedes ponerle if(!isMuted) si prefieres silencio total.
    sonidoAlerta.play();
    
    document.getElementById("clockWrapper").classList.add("alarm-ringing");
    document.getElementById("stopBtn").style.display = "block";
}

function stopAlarm() {
    activeAlarm = null;
    sonidoAlerta.pause();
    sonidoAlerta.currentTime = 0;
    
    document.getElementById("clockWrapper").classList.remove("alarm-ringing");
    document.getElementById("stopBtn").style.display = "none";
    
    reproducirMusicaFondo();
}

setInterval(updateClock, 1000);
updateClock();