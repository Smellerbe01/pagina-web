// frontend/js/utils.js

document.addEventListener('DOMContentLoaded', () => {
    const videoInput = document.getElementById('url');
    const clearBtn = document.getElementById('clear-btn');

    if (videoInput && clearBtn) {
        // Lógica para mostrar/ocultar el botón
        videoInput.addEventListener('input', () => {
            clearBtn.style.display = videoInput.value.length > 0 ? 'block' : 'none';
        });

        // Lógica para limpiar
        clearBtn.addEventListener('click', () => {
            videoInput.value = '';
            clearBtn.style.display = 'none';
            videoInput.focus();
            
            // Opcional: Si tienes mensajes de error o éxito visibles, 
            // podrías limpiarlos aquí también.
        });
    }
});