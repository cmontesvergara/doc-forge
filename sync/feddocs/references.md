# References — DocForge

## APIs

- [API de Generación de PDF — DocForge](./integration.md) — Documentación completa de los endpoints REST para generar y descargar documentos PDF. Incluye ejemplos reales de request y response para cada endpoint, junto con los códigos de error más comunes y una tabla de templates disponibles

## Repositorios

- [universalTemplate](./onboarding.md) — Repositorio principal del microservicio DocForge con el código fuente completo, templates PdfKit, configuración de deploy con Docker y CapRover, y archivos de entorno

## Herramientas

- [CapRover](https://caprover.com/) — Plataforma PaaS open-source utilizada para el deploy automatizado del servicio. Permite despliegues con un solo push al repositorio y gestiona el ciclo de vida de los contenedores Docker
- [PdfKit](https://pdfkit.org/) — Librería de generación de documentos PDF en Node.js utilizada como motor principal de renderizado. Permite crear PDFs programáticamente con control granular sobre texto, imágenes, fuentes y layout de páginas

## Documentación Externa

- [NestJS Documentation](https://docs.nestjs.com/) — Framework base del microservicio. Referencia completa para módulos, controladores, servicios, pipes de validación, inyección de dependencias y configuración de entornos
- [PdfKit API Reference](https://pdfkit.org/docs/getting_started.html) — Guía de uso y referencia detallada de la API de PdfKit para generar documentos PDF programáticamente, incluyendo manejo de texto, imágenes, fuentes personalizadas y paginación
- [CryptoJS Documentation](https://cryptojs.gitbook.io/docs/) — Librería de cifrado utilizada para proteger los enlaces temporales de descarga de archivos PDF generados. DocForge usa específicamente el algoritmo AES para cifrar y descifrar rutas de archivos
- [class-validator Documentation](https://github.com/typestack/class-validator) — Librería de validación basada en decoradores utilizada para validar los payloads de entrada en los endpoints del servicio. Define las reglas de validación directamente en las clases DTO
- [Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/) — Referencia para la estrategia de build multi-stage utilizada en el Dockerfile del proyecto, que permite optimizar el tamaño de la imagen de producción separando las etapas de compilación y ejecución
