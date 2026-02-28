// ... (mantenemos tu lógica de getTime y setClockTime anterior)

function setAlarm() {
    var alarmTime = document.getElementById("alarmTime").value;
    var clockElement = document.getElementById("clockWrapper"); // El círculo
  
    if (alarmTime) {
      alert("Alarma configurada");
      
      var check = setInterval(function() {
        var now = new Date();
        // Aplicar desfase si existe (opcional)
        now.setMilliseconds(now.getMilliseconds() + (window.timeOffset || 0));
        
        var currentTime = now.getHours().toString().padStart(2, '0') + ":" + 
                          now.getMinutes().toString().padStart(2, '0');
  
        if (currentTime === alarmTime) {
          clockElement.classList.add("alarm-active"); // Inicia animación neón rojo
          // Opcional: Sonido
          // let audio = new Audio('alarma.mp3'); audio.play();
          
          setTimeout(() => {
            if(confirm("¡ALERTA! ¿Deseas apagar la alarma?")) {
                clockElement.classList.remove("alarm-active");
                clearInterval(check);
            }
          }, 500);
        }
      }, 1000);
    }
}