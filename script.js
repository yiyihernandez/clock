let timeOffset = 0;
let activeAlarm = null;
let isMuted = false;
let currentTema = 'normal';
let library = []; 
let alarmaSonando = false; 
let globalVolume = 1.0; 
let esPersonalizado = false; // Nueva variable para bloquear el color amarillo

const musicaFNF = new Audio('alarmamusica.mp3'); 
musicaFNF.loop = true;
let alertaFinal = new Audio('ding.mp3'); //

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
    musicaFNF.pause(); 
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
    if (currentTema === 'fnf' && !isMuted) musicaFNF.play();
}

function cambiarTema(tema) {
    // Si el usuario cambia de tema manualmente, desactivamos el modo personalizado
    esPersonalizado = false; 
    currentTema = tema;
    
    document.body.className = 'tema-' + tema;
    document.body.classList.remove('upload-color-active'); 

    document.querySelectorAll('.bubble').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(tema === 'fnf' ? 'btnFNF' : 'btnNormal');
    if(btn) btn.classList.add('active');

    if (tema === 'normal') {
        musicaFNF.pause();
        musicaFNF.currentTime = 0;
        alertaFinal.pause();
        alertaFinal = new Audio('ding.mp3'); //
        alertaFinal.volume = globalVolume;
    } else if (tema === 'fnf') {
        if (!isMuted && !alarmaSonando) musicaFNF.play().catch(() => {});
        alertaFinal.pause();
        alertaFinal = new Audio('alarmaterminar.mp3'); 
        alertaFinal.volume = globalVolume;
    }
}

function saveCustomSound() {
    const fileInput = document.getElementById('userAudioInput');
    if (fileInput && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newSound = { 
                name: document.getElementById('customName').value || "Sonido Pro", 
                icon: document.getElementById('iconSelect').value, 
                url: e.target.result 
            };
            library.push(newSound);
            updateSoundList();
            
            // Forzamos el estado amarillo al subir
            esPersonalizado = true;
            document.body.classList.add('upload-color-active'); //
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function updateSoundList() {
    const list = document.getElementById('soundList');
    if (!list) return;
    list.innerHTML = '';
    library.forEach((sound) => {
        const div = document.createElement('div');
        div.className = 'sound-item-pro';
        div.innerHTML = `<i class="fas ${sound.icon}"></i> ${sound.name}`;
        div.onclick = () => {
            alertaFinal.pause();
            alertaFinal = new Audio(sound.url);
            alertaFinal.volume = globalVolume;
            alertaFinal.loop = true;
            
            // PERSISTENCIA AMARILLA: Al seleccionar un sonido, bloqueamos el color
            esPersonalizado = true;
            document.body.classList.add('upload-color-active'); //
            
            // Quitamos el estado 'active' de los otros iconos para que sepa que está en modo "Custom"
            document.querySelectorAll('.bubble').forEach(b => b.classList.remove('active'));
            
            alert("Sonido personalizado activado: " + sound.name);
        };
        list.appendChild(div);
    });
}

// Controles de volumen y ajustes permanecen igual...
function setVolume(v) {
    globalVolume = v;
    musicaFNF.volume = v;
    alertaFinal.volume = v;
    const label = document.getElementById('volLabel');
    if (label) label.innerText = Math.round(v * 100) + "%";
}

function setAlarm() {
    const input = document.getElementById("alarmTime").value;
    if (input) { activeAlarm = input; alert("Alarma programada"); }
}

function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

setInterval(updateClock, 1000);
updateClock();