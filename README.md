# 🚀 Study Hub Engine (v0.2.0-alpha)

> "De Estudiante a Ingeniero: Documentando la ruta hacia NVIDIA."

Este proyecto es el motor de mi centro de mando personal para mi formación en **Análisis de Sistemas e Ingeniería de Software**. Lo que comenzó como una aplicación estática ha evolucionado a un **Motor SPA (Single Page Application)** capaz de procesar cualquier curso de forma dinámica.

## 🧠 Filosofía del Proyecto: Engine vs. Content
Para garantizar la escalabilidad y la limpieza legal del repositorio, he separado la **Lógica de Software (Engine)** del **Contenido Educativo (Content)**.

- **The Engine:** Este repositorio contiene el código puro (HTML/CSS/JS) para renderizar dashboards, tests interactivos y analíticas.
- **The Content:** Los cursos se cargan dinámicamente mediante archivos `.json` (Course Packs), permitiendo que la plataforma sea 100% agnóstica y privada.

## 🛠️ Características Principales
- **Importación Dinámica:** Carga cualquier curso instantáneamente arrastrando un archivo JSON.
- **Arquitectura SPA:** Navegación fluida sin recargas de página para una experiencia premium.
- **Gestión de Sesiones:** Seguimiento de racha (streak), sesiones de estudio y mejores puntajes en `localStorage`.
- **Diseño Glassmorphism:** Interfaz moderna y oscura optimizada para largas sesiones de estudio.

## 🚀 Cómo empezar
1. Clona este repositorio.
2. Abre `index.html` en cualquier navegador moderno.
3. Importa un curso compatible (Ejemplos en `_raw_materials/`).
   - Puedes ver la especificación del formato en [docs/COURSE_FORMAT.md](docs/COURSE_FORMAT.md).

## 🎯 El Compromiso
Mi meta es que, al finalizar mi ingeniería, este motor sea la base de una plataforma de estudio impulsada por IA. Este repositorio documenta la transición desde un estudiante que usa IA hasta un ingeniero que la construye.

## 🗺️ Roadmap Técnico
- [x] **v0.2.0:** Migración a arquitectura de motor SPA.
- [ ] **v0.3.0:** Implementación de visor de diapositivas PPT con comentarios de voz.
- [ ] **v0.4.0:** Integración de "Agile Quest" (Modo RPG de estudio).
- [ ] **v1.0.0:** Reemplazo de lógica Vanilla JS por React y backend en Supabase.

---
*Desarrollado con visión de ingeniería por **JP**.*
