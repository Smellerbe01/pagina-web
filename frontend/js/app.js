const BASE_URL = "http://127.0.0.1:8000";

document.getElementById("button_get_info")
.addEventListener("click", obtenerInfo);


//enlazar la barra de carga 
async function obtenerInfo() {
    const urlInput = document.getElementById("url");
    const url = urlInput.value;
    const loadingBar = document.getElementById("loading_container");

    // 0. LIMPIAR errores previos antes de empezar
    closeError(); 

    if (!url) {
        showError("❌ Por favor, ingresa una URL válida ❌");
        return;
    }

    // 1. MOSTRAR la barra y OCULTAR resultados previos
    loadingBar.classList.remove("hidden");
    document.getElementById("video_card").classList.add("hidden");
    document.getElementById("playlist_container").classList.add("hidden");

    try {
        const response = await fetch(`${BASE_URL}/info/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (!data.success) {
            // Aquí lanzamos el error que viene desde tu FastAPI
            throw new Error(data.error || "Error desconocido en el servidor");
        }

        // Lógica de decisión según el tipo de respuesta
        if (data.type === "video") {
            showSingleVideo(data); 
        } else if (data.type === "playlist") {
            showPlaylist(data.videos);
        }

    } catch (error) {
        console.error("Error en la petición:", error);
        // 2. REEMPLAZO del segundo alert
        showError("⚠️ " + error.message + " ⚠️");
    }
    finally {
        // 3. OCULTAR la barra pase lo que pase al final
        loadingBar.classList.add("hidden");
    }
}
function showError(mensaje) {
    const errorBox = document.getElementById('error-container');
    const errorMsg = document.getElementById('error-message');
    errorMsg.innerText = mensaje;
    errorBox.classList.remove('hidden');
}

function closeError() {
    const errorBox = document.getElementById('error-container');
    if (errorBox) errorBox.classList.add('hidden');
}

// 1. FUNCIÓN GENÉRICA PARA LLENAR CUALQUIER TARJETA
function fillCard(cardElement, videoData) {
    // Cálculo de tiempo
    const horas =Math.floor(videoData.duration / 3600);
    const minutes = Math.floor((videoData.duration % 3600) / 60);
    const seconds = (videoData.duration % 60).toString().padStart(2, "0");
    
    const tiempoFormateado = horas > 0 
    ? `${horas}:${minutes.toString().padStart(2, "0")}:${seconds}` 
    : `${minutes}:${seconds}`; 

    // Llenado de datos (usando selectores compatibles con ID y Clase)
    // El '.' busca clases, el '#' busca IDs. Buscamos ambos por seguridad.
    cardElement.querySelector("#video_title, .video_title_class").innerText = videoData.title || "No Title";
    cardElement.querySelector("#video_thumbnail, .video_thumbnail_class").src = videoData.thumbnail || "";
    cardElement.querySelector("#video_duration, .video_duration_class").innerText = `Duración: ${tiempoFormateado}`;

    // Configuración del botón de descarga
    const btn = cardElement.querySelector(".download-video-btn");
    if (btn) {
        btn.onclick = () => {
            if (typeof downloadVideo === 'function') {
                downloadVideo(videoData.id);
            } else {
                console.error("La función downloadVideo no está definida.");
            }
        };
    }
    // Botón de descargar audio
    const audioBtn = cardElement.querySelector(".download-audio-btn");
    if (audioBtn) {
        audioBtn.onclick = () => {
            if (typeof descargarAudio === 'function') {
                // Reconstruimos la URL de YouTube usando el ID
                const fullUrl = `https://www.youtube.com/watch?v=${videoData.id}`;
                descargarAudio(fullUrl);
            } else {
                console.error("La función descargarAudio no está definida.");
            }
        };
    }
}


// 2. MOSTRAR VIDEO ÚNICO
function showSingleVideo(videoData) {
    const card = document.getElementById("video_card");
    const playlistArea = document.getElementById("playlist_container");

    playlistArea.classList.add("hidden"); 
    card.classList.remove("hidden");
    
    // Un pequeño delay para que la animación de CSS 'show' funcione
    setTimeout(() => card.classList.add("show"), 10);
    
    fillCard(card, videoData);
}

// 3. MOSTRAR PLAYLIST CON IMÁGENES
function showPlaylist(videos) {
    const cardOriginal = document.getElementById("video_card");
    const playlistArea = document.getElementById("playlist_container");

    cardOriginal.classList.add("hidden");
    playlistArea.innerHTML = ""; // Limpiar lista anterior
    playlistArea.classList.remove("hidden");

    videos.forEach(video => {
        // Clonamos el diseño que ya hiciste en HTML
        const newCard = cardOriginal.cloneNode(true); 
        
        // --- LIMPIEZA IMPORTANTE DE IDs ---
        // Le quitamos el ID principal para que no se repita
        newCard.id = ""; 
        // También cambiamos los IDs internos por clases para la playlist
        newCard.querySelector("#video_title").className = "video_title_class";
        newCard.querySelector("#video_thumbnail").className = "video_thumbnail_class";
        newCard.querySelector("#video_duration").className = "video_duration_class";
        // Les quitamos el ID original
        newCard.querySelector(".video_title_class").id = "";
        newCard.querySelector(".video_thumbnail_class").id = "";
        newCard.querySelector(".video_duration_class").id = "";
        // ------------------------------------

        newCard.classList.remove("hidden"); // La hacemos visible
        
        fillCard(newCard, video);         // La llenamos con la info de este video (incluyendo imagen)
        playlistArea.appendChild(newCard); // La pegamos en la lista
        
        // Animación de aparición gradual
        setTimeout(() => newCard.classList.add("show"), 10);
    });
}

// Descargar Audio
async function descargarAudio(videoUrl) {
    // 1. Mostrar feedback (puedes cambiar el color del botón a naranja mientras descarga)
    try {
        const response = await fetch(`${BASE_URL}/download/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                url: videoUrl, 
                type: "audio" 
            })
        });

        if (!response.ok) throw new Error("Error en el servidor");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "audio_downloader.mp3"; // Nombre temporal
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (error) {
        console.error("Error:", error);
        showError("No se pudo descargar el audio. Verifica tu conexión.");
    }
}