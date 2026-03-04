# References — DocForge

## APIs

- [API de Generación de PDF — DocForge](./integration.md) — Documentación completa de los endpoints REST para generar y descargar documentos PDF, incluyendo campos por template, errores y comportamiento del campo `amount`
- [numerosaletras.com](http://numerosaletras.com/Home/ConvertirNumerosALetras?numero=1000) — API externa de conversión de números a texto en español. Se invoca en cada generación de PDF vía HTTP GET. Dependencia crítica de runtime

## Repositorios

- [doc-forge](./onboarding.md) — Repositorio principal del microservicio DocForge con el código fuente completo, templates PdfKit, configuración de deploy con Docker y CapRover

## Herramientas

- [CapRover](https://caprover.com/) — Plataforma PaaS open-source utilizada para el deploy automatizado. Permite despliegues con push al repositorio. Configurado vía `captain-definition` en la raíz del proyecto
- [PdfKit](https://pdfkit.org/) — Librería de generación de documentos PDF en Node.js utilizada como motor principal de renderizado. Permite crear PDFs programáticamente con control granular sobre texto, imágenes, fuentes y layout

## Documentación Externa

- [NestJS Documentation](https://docs.nestjs.com/) — Framework base del microservicio (v9). Referencia para módulos, controladores, servicios, pipes de validación, inyección de dependencias y ServeStaticModule
- [PdfKit API Reference](https://pdfkit.org/docs/getting_started.html) — Guía de la API de PdfKit incluyendo manejo de texto, imágenes, fuentes, paginación y `bufferPages`
- [CryptoJS Documentation](https://cryptojs.gitbook.io/docs/) — Librería de cifrado usada para enlaces temporales de descarga. DocForge usa AES para cifrar rutas de archivos y Base64 para la codificación del resultado
- [class-validator](https://github.com/typestack/class-validator) — Librería de validación basada en decoradores para validar los payloads de entrada. Define reglas en la clase `createDocumentDTO`
- [Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/) — Estrategia de build usada en el Dockerfile para separar compilación (stage builder) de ejecución (stage production) y optimizar el tamaño de la imagen
- [Axios](https://axios-http.com/docs/intro) — Cliente HTTP utilizado para las llamadas a la API `numerosaletras.com` desde `UtilService`
- [@nestjs/config](https://docs.nestjs.com/techniques/configuration) — Módulo de configuración que carga variables de entorno desde `.env` al arrancar la aplicación
- [@nestjs/serve-static](https://docs.nestjs.com/recipes/serve-static) — Módulo para servir archivos estáticos desde `public/` (imágenes de header, footer, firma, tabla de cuentas)
