📺 YouTube Downloader Service
Este proyecto es una aplicación web full-stack de alto rendimiento diseñada para la extracción de metadatos y descarga de contenido (audio/video) desde YouTube. Utiliza una arquitectura desacoplada y modular para garantizar la escalabilidad y facilidad de mantenimiento.

🛠️ Tecnologías Utilizadas
Backend: Python 3.13 con FastAPI para la gestión de APIs asíncronas.

Procesamiento: yt-dlp para la interacción avanzada con servidores de streaming.

Frontend: HTML5, CSS3 con arquitectura modular y JavaScript Vanilla.

Entorno: Gestión de variables de entorno con .env y configuración de editor mediante .vscode.

📂 Arquitectura del Proyecto
El backend sigue un patrón de Arquitectura por Capas, lo que separa la lógica de los endpoints de la lógica de negocio y el procesamiento de archivos.

Plaintext
PAGINA WEB/
├── .vscode/                # Preferencias del editor (temas, colores y CodeLens)
├── backend/                # Lógica del servidor
│   ├── app/
│   │   ├── core/           # Configuración centralizada (config.py)
│   │   ├── models/         # Validación de datos y esquemas Pydantic (schemas.py)
│   │   ├── routes/         # Controladores de API (info.py, download.py)
│   │   ├── services/       # Lógica de negocio e integración (ytdlp_service.py)
│   │   ├── utils/          # Utilidades para gestión de archivos (file_manager.py)
│   │   └── main.py         # Punto de entrada de FastAPI
│   └── requirements.txt    # Dependencias de Python
├── downloads/              # Destino de descargas (excluido en control de versiones)
├── frontend/               # Interfaz de usuario
│   ├── assets/             # Recursos visuales (GIFs de carga, iconos y diseños)
│   ├── css/
│   │   ├── modules/        # Estilos CSS divididos por componentes (header, button, etc.)
│   │   └── styles.css      # Hoja de estilos global
│   ├── js/app.js           # Lógica interactiva del cliente
│   └── index.html          # Estructura principal de la aplicación
├── .env                    # Variables de entorno y configuración local
├── .gitignore              # Reglas de exclusión para Git (venv, descargas, caches)
└── test_api.http           # Suite de pruebas para REST Client (VS Code)


🚀 Flujo de Trabajo Técnico
Capa de Rutas (routes): Recibe las peticiones HTTP y valida los datos de entrada usando los esquemas de Pydantic definidos en models.

Capa de Servicio (services): Implementa la lógica de extracción mediante yt-dlp, manejando metadatos y streams de audio/video.

Capa de Utilidades (utils): Se encarga de la persistencia física de los archivos en la carpeta downloads/ de forma segura.

Frontend Modular: Los estilos están segmentados en modules/ para permitir cambios granulares sin afectar la integridad visual global del sitio.

🔧 Instalación y Ejecución
1. Preparar el Entorno
Se recomienda el uso de un entorno virtual para aislar las dependencias:

PowerShell
python -m venv venv
.\venv\Scripts\activate
pip install -r backend/requirements.txt
2. Lanzar el Backend
Ejecuta el servidor con detección automática de cambios limitada al código fuente para evitar reinicios por descargas de archivos:

PowerShell
uvicorn backend.app.main:app --reload --reload-dir backend
📝 Notas de Ingeniería
Optimización de Git: El repositorio mantiene un historial limpio de menos de 1MB gracias a una configuración estricta de .gitignore que omite archivos temporales, binarios pesados y entornos locales.

Depuración: Incluye una configuración de test_api.http para realizar pruebas de integración de los endpoints directamente desde el entorno de desarrollo, evitando la dependencia de herramientas externas.

👤 Autor
Neiber - Ingeniero Electrónico.