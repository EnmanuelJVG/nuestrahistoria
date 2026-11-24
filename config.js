/**
 * ============================================================================
 * ARCHIVO DE CONFIGURACIÓN CENTRAL - "NUESTRO WRAPPED: 5 MESES"
 * ============================================================================
 * ¡Hola! Este es el ÚNICO archivo que necesitas editar para personalizar toda
 * tu aplicación web (textos, nombres, fechas, estadísticas, fotos y música).
 *
 * REGLAS RÁPIDAS PARA EDITAR SIN ERRORES:
 * 1. Cambia únicamente lo que está dentro de las comillas ("...") o los números.
 * 2. No borres las comas (,) al final de cada línea ni las llaves ({ }).
 * 3. Si quieres escribir comillas dentro de un texto, usa comillas simples (')
 *    o comillas angulares (« ») para no romper el código.
 * 4. Guarda tus fotos y canción dentro de la carpeta "assets/" y asegúrate de
 *    que los nombres coincidan exactamente (respetando mayúsculas y minúsculas).
 * ============================================================================
 */

window.WRAPPED_CONFIG = {
  // --------------------------------------------------------------------------
  // 1. AJUSTES GENERALES DE NAVEGACIÓN Y MÚSICA
  // --------------------------------------------------------------------------
  configuracion: {
    // Tiempo (en milisegundos) que dura cada pantalla antes de avanzar sola.
    // 8000 = 8 segundos. Puedes subirlo a 10000 (10s) si la carta es más larga.
    duracionSlideMs: 8500,

    // true = avanza automáticamente entre pantallas (como Instagram Stories).
    // false = solo avanza cuando la persona toca la pantalla o desliza.
    // Nota: La portada (Slide 1) y la sorpresa (Slide 7) siempre esperan el clic.
    autoAvance: true,
  },

  musica: {
    // Ruta del archivo de audio en la carpeta assets/.
    // Coloca tu canción en MP3 dentro de "assets/" con el nombre "cancion.mp3"
    // o cambia aquí la ruta si le pones otro nombre (ej. "assets/nuestra-cancion.mp3").
    ruta: "assets/cancion.mp3",

    // Volumen inicial de la música (de 0.0 = silencio a 1.0 = máximo).
    volumen: 0.50,
  },

  // --------------------------------------------------------------------------
  // 2. DATOS DE LA PAREJA (Aparece discreto en la barra superior)
  // --------------------------------------------------------------------------
  pareja: {
    nombres: "Tú & Yo",
    fechaInicio: "24 de Junio",
    fechaCorte: "24 de Noviembre",
    // Códigos numéricos cortos que flanquean el diseño editorial (como 06 / 11)
    codigoInicio: "06",
    codigoFin: "11",
  },

  // --------------------------------------------------------------------------
  // 3. PANTALLA 1: PORTADA DE BIENVENIDA
  // --------------------------------------------------------------------------
  slide1_portada: {
    etiqueta: "24 JUN — 24 NOV • EDICIÓN ANIVERSARIO",
    titulo: "Nuestro Wrapped: 5 Meses",
    subtitulo:
      "Cinco meses coleccionando risas, miradas cómplices y momentos que quiero repetir siempre.",
    textoBoton: "Empezar",
  },

  // --------------------------------------------------------------------------
  // 4. PANTALLA 2: CONTADOR DEL TIEMPO
  // --------------------------------------------------------------------------
  slide2_tiempo: {
    encabezado: "Todo este tiempo juntos",
    contadores: [
      {
        valor: 5,
        etiqueta: "Meses",
        sufijo: "",
        separadorMiles: false,
      },
      {
        valor: 153,
        etiqueta: "Días",
        sufijo: "",
        separadorMiles: false,
      },
      {
        valor: 3672,
        etiqueta: "Horas juntos",
        sufijo: "",
        separadorMiles: true, // Muestra 3.672 en lugar de 3672
      },
    ],
    fraseDivertida:
      "...y todavía nos soportamos (de hecho lys, cada día te amo más.).",
  },

  // --------------------------------------------------------------------------
  // 5. PANTALLA 3: TOP 3 MOMENTOS FAVORITOS (Tarjetas estilo Polaroid)
  // --------------------------------------------------------------------------
  // Puedes reemplazar foto1.jpg, foto2.jpg y foto3.jpg en la carpeta assets/.
  // Tip: Las tarjetas recortan suavemente la foto (object-fit: cover) para que
  // ninguna imagen se estire ni se deforme, sea vertical u horizontal.
  slide3_momentos: {
    titulo: "Top 3 Momentos Favoritos",
    subtitulo: "Instantes que viven gratis en mi memoria",
    // true = aplica un filtro blanco y negro editorial elegante a las 3 fotos.
    // false = muestra las fotos con sus colores originales.
    fotosBlancoYNegro: true,
    momentos: [
      {
        foto: "assets/foto1.png",
        fecha: "24 de Junio",
        titulo: "El día que empezó nuestra historia",
      },
      {
        foto: "assets/foto2.png",
        fecha: "Agosto",
        titulo: "Risas infinitas y nuestra cita favorita",
      },
      {
        foto: "assets/foto3.png",
        fecha: "Noviembre",
        titulo: "Confirmando que contigo todo es mejor",
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 6. PANTALLA 4: ESTADÍSTICAS Y CHISTES INTERNOS
  // --------------------------------------------------------------------------
  slide4_estadisticas: {
    titulo: "Estadísticas & Chistes Internos",
    subtitulo: "Datos 100% científicos y verificados",

    // Dato numérico principal con animación de conteo rápido
    contadorDestacado: {
      etiqueta: "Veces que preguntamos «¿POR QUEEEEEEEEeeeeeee?»",
      valor: 847,
      nota: "Y siempre terminamos recordando lo mismo JAJAJA",
    },

    // Barras de progreso animadas (puedes editar textos y porcentajes de 0 a 100)
    barras: [
      {
        etiqueta: "Nivel de paciencia",
        porcentaje: 100,
        valorTexto: "100%",
        detalle: "Incluso cuando te hago molestar todo el día",
      },
      {
        etiqueta: "Probabilidad de que sueñes cosas que no hice ni haré",
        porcentaje: 92,
        valorTexto: "92%",
        detalle: "Evidencia completamente irrefutable",
      },
    ],

    // Tarjeta especial de chiste interno (cambia "[Tu Nombre]" por el nombre real)
    dormidoPrimero: {
      etiqueta: "Quien es la persona mas toxica de la relación?",
      nombre: "Lysmar",
      detalle: "Me preguntas quien me escribe cuando hablo con Wilfran",
    },
  },

  // --------------------------------------------------------------------------
  // 7. PANTALLA 5: NUESTRA BANDA SONORA (Estilo reproductor de Spotify)
  // --------------------------------------------------------------------------
  slide5_bandaSonora: {
    encabezado: "Nuestra Canción",
    // Foto cuadrada recomendada (1:1), aunque también se adapta sola sin deformarse
    caratula: "assets/portada-cancion.jpg",
    cancion: "For Lys",
    artista: "Camilo",
    duracionActual: "1:24",
    duracionTotal: "3:45",
    porcentajeProgreso: 42,
    porQueEsNuestra:
      "Y cada que te veo Siento que un milagro se dibuja y no lo creo Es como si el mismo Dios quisiera Que yo te quiera",
  },

  // --------------------------------------------------------------------------
  // 8. PANTALLA 6: EL MENSAJE SINCERO
  // --------------------------------------------------------------------------
  slide6_mensaje: {
    encabezado: "Un mensaje para ti",
    saludo: "Mi amor,",
    parrafos: [
      "Desde aquel 24 de junio hasta hoy, 24 de noviembre, estos 5 meses se han sentido como el capítulo más bonito de mi año.",
      "Gracias por tu risa, por tu paciencia, por cada abrazo que reinicia el mundo y por hacer que hasta los días más simples valgan la pena cuando estás tú.",
      "Ojalá este sea apenas el primer resumen de muchísimos meses y años más construyendo recuerdos juntos.",
    ],
    despedida: "Felices 5 meses. Gracias por elegirme cada día.",
    firma: "Con todo mi amor ❤️",
  },

  // --------------------------------------------------------------------------
  // 9. PANTALLA 7: LA SORPRESA FINAL (SISTEMA DE CUPONES SECRETOS)
  // --------------------------------------------------------------------------
  // Aquí configuras los códigos que tú guardarás en secreto y le irás dando
  // cuando ella se los gane o te los pida.
  // - No importa si ella los escribe en mayúsculas o minúsculas ("cita24" o "CITA24").
  // - Puedes cambiar el código, el título de "Felicidades..." y la explicación,
  //   e incluso agregar un 4to o 5to cupón copiando uno de los bloques { ... }.
  slide7_sorpresa: {
    preTitulo: "Una última cosa...",
    titulo: "Tu regalo de 5 meses",
    subtitulo:
      "Tengo 3 cupones secretos guardados para ti. Cuando te dé un código, escríbelo aquí para descubrir qué ganaste:",
    placeholderInput: "Escribe tu código aquí...",
    textoBoton: "Desbloquear cupón",
    mensajeError:
      "Ese código no es válido todavía, mi amor. Pídeme una pista o tu código secreto ❤️",

    cupones: [
      {
        // CUPÓN 1: Salida especial
        codigo: "CITA24",
        etiquetaLista: "Cupón I",
        tituloGanado: "¡Felicidades! Has ganado una entrada para ir a ver el juego de",
        descripcion:
          "Este cupón es una salida juntos al juego que ya compramos las entradas, solo faltaba que tu me dijeras : si o no.",
        notaPie: "Espero tu respuesta • Sin fecha de vencimiento",
      },
      {
        // CUPÓN 2: Cena romántica
        codigo: "CENA5M",
        etiquetaLista: "Cupón II",
        tituloGanado: "¡Felicidades! Has ganado una cena romántica",
        descripcion:
          "Este cupón es una cena para celebrar nuestros 5 meses: tú eliges tu restaurante o comida favorita y esta noche invita tu novio.",
        notaPie: "Incluye postre y todos los abrazos que quieras",
      },
      {
        // CUPÓN 3: Antojo + noche de mimos / pelis
        codigo: "DESEO5M",
        etiquetaLista: "Cupón III",
        tituloGanado: "¡Felicidades! Has ganado una tarde de antojos y mimos",
        descripcion:
          "Este cupón es un comodín para consentirte: vale por tu antojo favorito + sesión de pelis (tú eliges qué ver sin que yo me queje) y muchos mimos.",
        notaPie: "Canjeable en cualquier momento que quieras que te consienta",
      },
    ],
  },
};
