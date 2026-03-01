let timeOffset = 0;
let activeAlarm = null;
let isMuted = false;
let currentTema = 'normal';
let library = []; // biblioteca usuario

// sonidos iniciales
const musicaFNF = new Audio('alarmamusica.mp3');
musicaFNF.loop = true;

const alertaNormal = new Audio('fantasma.mp3'); 
let alertaFinal = new Audio('alarmaterminar.mp3'); 

// sonido personalizado y cambiar color a amarillo
function saveCustomSound() {
    const fileInput = document.getElementById('userAudioInput');
    const file = fileInput.files[0];
    const name = document.getElementById('customName').value || "Sonido Personalizado";
    const icon = document.getElementById('iconSelect').value;

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newSound = { name, icon, url: e.target.result };
            library.push(newSound);
            updateSoundList();
            fileInput.value = ''; // reset input file
            document.getElementById('customName').value = ''; // lo mismo pero con name
            alert(`Sonido "${name}" guardado en la biblioteca.`);

            // activar amarillo
            document.body.classList.add('upload-color-active');
            

        };
        reader.readAsDataURL(file);
    } else {
        alert("Por favor selecciona un archivo primero.");
    }
}

function updateSoundList() {
    const list = document.getElementById('soundList');
    list.innerHTML = '';
    library.forEach((sound, index) => {
        const div = document.createElement('div');
        div.className = 'sound-item-pro';
        div.innerHTML = `<i class="fas ${sound.icon}"></i> ${sound.name}`;
        div.onclick = () => selectAlarma(index);
        list.appendChild(div);
    });
}

function selectAlarma(index) {
    const sound = library[index];
    alertaFinal = new Audio(sound.url); // reemplaza la alarma
    document.getElementById('activeAlarmName').innerText = sound.name;
    document.getElementById('activeAlarmIcon').className = `fas ${sound.icon}`;
    document.getElementById('currentAlarmInfo').style.display = 'block';
    alert(`Alarma establecida con: ${sound.name}`);
}

// volumen y mute
document.getElementById('volumePanel').addEventListener('wheel', (e) => {
    e.preventDefault();
    let change = e.deltaY > 0 ? -0.05 : 0.05;
    setVolume(Math.min(1, Math.max(0, musicaFNF.volume + change)));
});

function manualVolume() {
    let input = prompt("Volumen (0-100):", musicaFNF.volume * 100);
    if (input !== null) {
        let val = parseInt(input);
        if (!isNaN(val) && val >= 0 && val <= 100) {
            setVolume(val / 100);
        }
    }
}

function setVolume(v) {
    musicaFNF.volume = v; alertaFinal.volume = v; alertaNormal.volume = v;
    document.getElementById('volLabel').innerText = Math.round(v * 100) + "%";
}

function toggleMute() {
    isMuted = !isMuted;
    const icon = document.getElementById("speakerIcon");
    if (isMuted) {
        musicaFNF.pause();
        icon.className = "fas fa-volume-mute";
    } else {
        if (currentTema === 'fnf') musicaFNF.play().catch(() => {});
        icon.className = "fas fa-volume-up";
    }
}

// Temas
function cambiarTema(tema) {
    currentTema = tema;
    document.body.className = 'tema-' + tema;
    
    if (currentTema === 'fnf') {
        document.body.classList.remove('upload-color-active'); 
    } else {

    }

    document.querySelectorAll('.bubble').forEach(b => b.classList.remove('active'));
    document.getElementById(tema === 'fnf' ? 'btnFNF' : 'btnNormal').classList.add('active');
    document.getElementById('titulo').innerText = tema === 'fnf' ? "Friday Night Funkin'" : "Reloj Digital";

    musicaFNF.pause();
    if (tema === 'fnf' && !isMuted) musicaFNF.play().catch(() => {});
}

// Configuracion hr alarm
function updateClock() {
    let now = new Date();
    now.setMilliseconds(now.getMilliseconds() + timeOffset);

    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();

    // formato 24h
    let currentTime24 = h.toString().padStart(2, '0') + ":" + m.toString().padStart(2, '0');
    
    // formato vs 12h
    let ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    
    // formateo num
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;

    document.getElementById("time").innerText = `${h}:${m}:${s}`;
    document.getElementById("ampm").innerText = ampm;

    // alarma suena si/no
    if (activeAlarm === currentTime24) {
        activarAlerta();
    }
}

function activarAlerta() {
    musicaFNF.pause();
    // suena alarma personalizada o por defecto
    alertaFinal.play().catch(() => {});
    document.getElementById("clockWrapper").classList.add("alarm-ringing");
    document.getElementById("stopBtn").style.display = "block";
}

function stopAlarm() {
    activeAlarm = null;
    alertaFinal.pause();
    alertaFinal.currentTime = 0;
    document.getElementById("clockWrapper").classList.remove("alarm-ringing");
    document.getElementById("stopBtn").style.display = "none";
    
    if (currentTema === 'fnf' && !isMuted) musicaFNF.play().catch(() => {});
}

function setAlarm() {
    const input = document.getElementById("alarmTime").value;
    if (input) {
        activeAlarm = input;
        alert("Alarma programada");
    } else {
        alert("Por favor selecciona una hora.");
    }
}

function setClockTime() {
    const input = document.getElementById("alarmTime").value;
    if (input) {
        let [h, m] = input.split(':');
        let target = new Date();
        target.setHours(h, m, 0);
        // hr deseada y normal
        timeOffset = target - new Date();
        alert("Hora del reloj ajustada");
    }
}

function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

// inicio
setInterval(updateClock, 1000); // cada segundo
updateClock();