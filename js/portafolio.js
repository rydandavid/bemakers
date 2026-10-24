/* =========================================================
   BEMAKERS · contenido del sitio (videos, fotos y marcas)
   Este es el único archivo que hace falta editar para cambiar
   el portafolio. Cuida las comas, las comillas y las llaves { }.
   ========================================================= */

/* ---------- VIDEOS (pestaña "Videos") ----------
   titulo / marca  Texto que se ve sobre el video.
   driveId         El texto entre /d/ y /view del enlace del archivo en Google Drive.
   formato         "horizontal" (16:9) o "vertical" (9:16).
   portada         Imagen en assets/portadas/ (fotograma del video).
   preview         Adelanto mudo de 6 s en assets/previews/ (se ve al pasar el mouse).
   archivo         Solo para videos locales: nombre del MP4 dentro de assets/videos/
                   (se usa en lugar de driveId).
   Los videos se acomodan solos en un mosaico, mezclando horizontales y verticales. */
window.PORTAFOLIO = [
  // Horizontales (16:9)
  { titulo: "Aftermovie 2026", marca: "Mannucci Motors", driveId: "16cSslsUeQs6XZ2hppJ1U60GLwUeow0_v", formato: "horizontal", portada: "16cSslsUeQs6XZ2hppJ1U60GLwUeow0_v.webp", preview: "mannucci-2026.mp4" },
  { titulo: "Mamá Primavera · Evento", marca: "Está Chévere TV", driveId: "1v4N_5YxgENHQ9AoDrZfQYmTpJCPGY1jN", formato: "horizontal", portada: "esta-chevere-mama-primavera.webp", preview: "esta-chevere-mama-primavera.mp4" },
  { titulo: "Anuncio Lancha", marca: "Tumi", driveId: "13LQfgiJJeVOG-_YBCtufpAk-wmjrBfUn", formato: "horizontal", portada: "anuncio-tumi.jpg", preview: "anuncio-tumi.mp4" },
  { titulo: "Resumen 2025", marca: "IE Adventista", driveId: "1qmPCEqGp8PH-LXo9iDLi5cjS6DaLpURi", formato: "horizontal", portada: "resumen-2025.jpg", preview: "resumen-2025.mp4" },
  { titulo: "Proyecto musical", marca: "UCAL", driveId: "17b6FA_ZvXXOVd_u-nst0osKh35gSP_Xm", formato: "horizontal", portada: "proyecto-ucal.jpg", preview: "proyecto-ucal.mp4" },
  { titulo: "Resumen 2024", marca: "IE Adventista", driveId: "1TtQ2abS_m0VpNLuamQzaqCKB1x7P1_wA", formato: "horizontal", portada: "resumen-2024.jpg", preview: "resumen-2024.mp4" },
  { titulo: "Entrevista estudiantil 2025", marca: "IE Adventista", driveId: "135gEo0c2TkcX0DM9BiD73vkGko0VKJLl", formato: "horizontal", portada: "entrevista-2025.jpg", preview: "entrevista-2025.mp4" },
  // Verticales (9:16)
  { titulo: "Aftermovie", marca: "Kalia", driveId: "1LFOMP535VyXII5AVmY4S1DMOBqDWhcIJ", formato: "vertical", portada: "kalia.webp", preview: "kalia.mp4" },
  { titulo: "Mike × Canoas", marca: "Canoas", driveId: "1TLFENb-vnJfIYeBzdR8CRftFNbGeln-l", formato: "vertical", portada: "1TLFENb-vnJfIYeBzdR8CRftFNbGeln-l.webp", preview: "canoas-aftermovie.mp4" },
  { titulo: "Hay niveles", marca: "Pizza D Meza", driveId: "1DEIkUEjXKzMnsDclI8j1n2nAfV84Cjsv", formato: "vertical", portada: "pizza-hay-niveles.webp", preview: "pizza-hay-niveles.mp4" },
  { titulo: "Barman", marca: "Qalikay", driveId: "1httOrxR3-NF0-VKR-nXpMKFi-5lYNGVI", formato: "vertical", portada: "qalikay-barman.webp", preview: "qalikay-barman.mp4" },
  { titulo: "Reel", marca: "EmisBrand", driveId: "1RnWskEZY_wl7TjlsEsy7g22Ph5AW6to6", formato: "vertical", portada: "emisbrand.webp", preview: "emisbrand.mp4" },
  { titulo: "Visual", marca: "Pizza D Meza", driveId: "1pC3369GFRn9pVOFuEV4PEeTpVWW0QLw6", formato: "vertical", portada: "pizza-visual.webp", preview: "pizza-visual.mp4" },
  { titulo: "Reel", marca: "Cataleya", driveId: "1Xx5acML68CZqQ3mF_Lj1CpsPaFyMtPFw", formato: "vertical", portada: "1Xx5acML68CZqQ3mF_Lj1CpsPaFyMtPFw.webp", preview: "cataleya-30fps.mp4" },
  { titulo: "Pizza menú", marca: "Pizza D Meza", driveId: "1ceQWo36rxGJN3LzbvzuunKDN0-ANv5Uc", formato: "vertical", portada: "pizza-menu.webp", preview: "pizza-menu.mp4" },
  { titulo: "Reel", marca: "Cataleya", driveId: "1yncK0SahM9bECumFnp2JWaufhX58hiZ3", formato: "vertical", portada: "1yncK0SahM9bECumFnp2JWaufhX58hiZ3.webp", preview: "cataleya-reel-2.mp4" }
];

/* ---------- FOTOGRAFÍAS (pestaña "Fotografías") ----------
   archivo   Nombre de la foto dentro de assets/fotos/.
   driveId   ID de Drive (se usa si no hay archivo).
   ratio     Ancho / alto de la foto (2:3 vertical = 0.6667).
   titulo    Texto alternativo (para lectores de pantalla).
   Cada foto se acomoda sola según su forma. */
window.FOTOS = [
  { archivo: "1uptt8P0OI8TVT_oDtt_zwTo1T-zGnYrF.webp", driveId: "1uptt8P0OI8TVT_oDtt_zwTo1T-zGnYrF", ratio: 0.6667, titulo: "Fotografía de portafolio · DSC2750" },
  { archivo: "1WvidCuWJ9LOVh4_1g69pUmfSmwyI-YSY.webp", driveId: "1WvidCuWJ9LOVh4_1g69pUmfSmwyI-YSY", ratio: 0.6667, titulo: "Fotografía de portafolio · DSC2779" },
  { archivo: "1wiJJ5wwsyIyTvLwb2taIpThPzCAixL5x.webp", driveId: "1wiJJ5wwsyIyTvLwb2taIpThPzCAixL5x", ratio: 0.6667, titulo: "Fotografía de portafolio · DSC2791" },
  { archivo: "10Wqloa0imFt7VrU9dl_bVbmwX6X3u_a2.webp", driveId: "10Wqloa0imFt7VrU9dl_bVbmwX6X3u_a2", ratio: 0.6667, titulo: "Fotografía de portafolio · DSC2796" },
  { archivo: "1-qP0saC_3C4bvKZm7_MJ66eXHa6Ws3zX.webp", driveId: "1-qP0saC_3C4bvKZm7_MJ66eXHa6Ws3zX", ratio: 0.6667, titulo: "Fotografía de portafolio · DSC2810" },
  { archivo: "1GDpGc0v44sR_XXqeWBvLX4-IAmftm_4j.webp", driveId: "1GDpGc0v44sR_XXqeWBvLX4-IAmftm_4j", ratio: 0.6667, titulo: "Fotografía de portafolio · DSC2814" },
  { archivo: "1bVJmuWpb-r-VPGv5qjXddegmit5kZPA3.webp", driveId: "1bVJmuWpb-r-VPGv5qjXddegmit5kZPA3", ratio: 0.6667, titulo: "Fotografía de portafolio · DSC2815" },
  { archivo: "1Ls3F1zgBtPIkHhfCa3R5c-UxTCdTA3_8.webp", driveId: "1Ls3F1zgBtPIkHhfCa3R5c-UxTCdTA3_8", ratio: 0.6667, titulo: "Fotografía de portafolio · DSC2830" },
  { archivo: "1UXEztxbxh0Ky7WRCRNG19IF_p8XsiiDN.webp", driveId: "1UXEztxbxh0Ky7WRCRNG19IF_p8XsiiDN", ratio: 0.6667, titulo: "Fotografía de portafolio · DSC2907" },
  { archivo: "1k42dxjyU2s2f1mqPdXD-4G2P2o0sXZU0.webp", driveId: "1k42dxjyU2s2f1mqPdXD-4G2P2o0sXZU0", ratio: 0.6667, titulo: "Fotografía de portafolio · DSC2909" },
  { archivo: "1qJ12ufgub5SERFL7LBgp_Y9AGmCW-y79.webp", driveId: "1qJ12ufgub5SERFL7LBgp_Y9AGmCW-y79", ratio: 0.6667, titulo: "Fotografía de portafolio · DSC2928" },
  { archivo: "1ZFUXElIqBO1BBp7gHiKw6K23DUwN4bnS.webp", driveId: "1ZFUXElIqBO1BBp7gHiKw6K23DUwN4bnS", ratio: 0.6667, titulo: "Fotografía de portafolio · DSC2931" }
];

/* ---------- MARCAS (franja "Proyectos y empresas en las que hemos trabajado") ----------
   archivo   Logo dentro de assets/clientes/.
   nombre    Nombre de la marca (texto alternativo).
   Para sumar una marca, copia su logo a esa carpeta y agrega una línea. */
window.CLIENTES = [
  { archivo: "fisioaxis.webp", nombre: "Fisioaxis" },
  { archivo: "canoas.webp", nombre: "Canoas" },
  { archivo: "cataleya.webp", nombre: "Cataleya Casa" },
  { archivo: "pizza-d-meza.webp", nombre: "Pizza D Meza" },
  { archivo: "qali-kay.webp", nombre: "Qali Kay" },
  { archivo: "educacion-adventista.webp", nombre: "Educación Adventista" },
  { archivo: "esta-chvre.webp", nombre: "Está Chvre TV" },
  { archivo: "tumi-oriente.webp", nombre: "Tumi Oriente" },
  { archivo: "maius.webp", nombre: "Maius Mineral Water" }
];
