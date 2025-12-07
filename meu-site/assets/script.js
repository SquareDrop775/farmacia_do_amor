document.addEventListener('DOMContentLoaded', (event) => {
    // =========================================================
    // 1. Contador de Tempo (ANOS, MESES, DIAS, HORAS, MINUTOS, SEGUNDOS)
    // =========================================================

    // DATA DE INÍCIO DO NAMORO: 20 de Outubro de 2025 às 17:00
    // Lembrete: O JavaScript usa Mês-1 (Janeiro=0, Outubro=9)
    const startDate = new Date(2025, 9, 20, 17, 0, 0); 
    const countdownDisplay = document.getElementById('countdown-display');

    if (!countdownDisplay) {
        console.error("Erro: Elemento 'countdown-display' não encontrado no HTML.");
        return; 
    }
    
    function updateCountdown() {
        const now = new Date();
        let start = new Date(startDate.getTime()); // Cria uma cópia da data inicial

        const diff = now.getTime() - start.getTime();

        if (diff < 0) {
            countdownDisplay.innerHTML = `<span style="color: red;">Aguardando o início...</span>`;
            return;
        }

        // --- CÁLCULO DE ANO, MÊS, DIA (Subtração precisa de componentes) ---
        
        let years = now.getFullYear() - start.getFullYear();
        let months = now.getMonth() - start.getMonth();
        let days = now.getDate() - start.getDate();
        let hours = now.getHours() - start.getHours();
        let minutes = now.getMinutes() - start.getMinutes();
        let seconds = now.getSeconds() - start.getSeconds();

        // 1. Propagar "empréstimos" (Segundos -> Minutos -> Horas)
        if (seconds < 0) { seconds += 60; minutes--; }
        if (minutes < 0) { minutes += 60; hours--; }
        if (hours < 0) { hours += 24; days--; }
        
        // 2. Propagar "empréstimos" (Dias -> Meses)
        if (days < 0) {
            // Pega o número de dias do mês anterior
            const daysInPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            days += daysInPreviousMonth;
            months--;
        }
        
        // 3. Propagar "empréstimos" (Meses -> Anos)
        if (months < 0) {
            months += 12;
            years--;
        }

        // --- Formata o texto final ---
        
        const yearText = `${years} ano${years !== 1 ? 's' : ''}`;
        const monthText = `${months} mês${months !== 1 ? 'es' : ''}`;
        const dayText = `${days} dia${days !== 1 ? 's' : ''}`;

        countdownDisplay.innerHTML = `
            <span style="color: #1db954;">${yearText}</span>, 
            <span style="color: #1db954;">${monthText}</span>, 
            <span style="color: #1db954;">${dayText}</span><br>
            ${hours.toString().padStart(2, '0')}h : 
            ${minutes.toString().padStart(2, '0')}m : 
            ${seconds.toString().padStart(2, '0')}s
        `;
    }

    // Atualiza o contador a cada segundo
    setInterval(updateCountdown, 1000);
    updateCountdown();


    // =========================================================
    // 2. Player de Áudio (Novo Estilo de Barra e Controles)
    // =========================================================

    const audio = document.getElementById('audio');
    const btnPlayPause = document.getElementById('btnPlayPause'); 
    const progressBar = document.getElementById('progressBar');
    const currentTimeDisplay = document.getElementById('currentTimeDisplay');
    const durationDisplay = document.getElementById('durationDisplay');

    if (audio && btnPlayPause && progressBar && currentTimeDisplay && durationDisplay) {
        
        function formatTime(s) {
            if (isNaN(s) || s < 0) return '0:00';
            const m = Math.floor(s / 60);
            const sec = Math.floor(s % 60);
            return `${m}:${String(sec).padStart(2, '0')}`;
        }

        // Adiciona a cor verde ao progresso da barra
        function updateProgressFill() {
            const value = (progressBar.value - progressBar.min) / (progressBar.max - progressBar.min) * 100;
            // Usamos a variável CSS --accent para a cor verde
            progressBar.style.background = 'linear-gradient(to right, var(--accent) 0%, var(--accent) ' + value + '%, #333 ' + value + '%, #333 100%)';
        }

        // --- Eventos de Reprodução (Botão Principal) ---
        btnPlayPause.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                btnPlayPause.innerHTML = '⏸️'; // Ícone de Pause
            } else {
                audio.pause();
                btnPlayPause.innerHTML = '▶️'; // Ícone de Play
            }
        });
        
        // --- Atualização da Barra e Tempo ---
        audio.addEventListener('loadedmetadata', () => {
            progressBar.max = audio.duration;
            // O tempo restante é exibido como negativo na imagem de referência
            durationDisplay.textContent = formatTime(audio.duration); 
            currentTimeDisplay.textContent = formatTime(0);
            updateProgressFill();
        });

        audio.addEventListener('timeupdate', () => {
            const currentTime = audio.currentTime;
            progressBar.value = currentTime;
            currentTimeDisplay.textContent = formatTime(currentTime);
            // Exibe o tempo restante
            durationDisplay.textContent = `-${formatTime(audio.duration - currentTime)}`; 
            updateProgressFill();
        });
        
        // --- Controle Manual da Barra ---
        progressBar.addEventListener('input', () => {
            audio.currentTime = progressBar.value;
        });

        // --- Fim da Música ---
        audio.addEventListener('ended', () => {
            btnPlayPause.innerHTML = '▶️';
            audio.currentTime = 0; 
            progressBar.value = 0;
            updateProgressFill();
        });
    } else {
         console.warn("Aviso: Elementos do player de áudio não encontrados.");
    }

});
