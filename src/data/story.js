// ════════════════════════════════════════════════════════════════════
//  NUESTRA HISTORIA · AQUÍ SE EDITA TODO LO PERSONAL
// ════════════════════════════════════════════════════════════════════
//  REGLAS (solo tres):
//  1. Escribe SIEMPRE entre comillas "así" y no borres las comas del final.
//  2. Lo que está entre [corchetes] es un marcador: reemplázalo por tu texto.
//     (En la página se ve subrayado con línea punteada para que no se te pase ninguno.)
//  3. Si dejas algo vacío ("") esa parte simplemente no se muestra.
//  Las historias largas van entre `comillas invertidas`; deja una línea en blanco
//  entre párrafos. No uses ` ni ${ dentro del texto.
//  Las fechas se escriben AÑO-MES-DÍA, por ejemplo "2026-03-14".
//  Las fotos: solo el nombre del archivo guardado en public/images/
// ════════════════════════════════════════════════════════════════════

export const story = {
  // ── Título y vista previa al compartir el enlace ───────────────────
  site: {
    title: "Nuestra historia",
    description: "Hola Lysmarcita",
    url: "", // Cuando publiques, pega aquí tu enlace: "https://nuestra-historia.vercel.app"
  },

  names: {
    her: "Lysmar",
    me: "Enmanuel",
  },

  // ── Fechas clave (formato "AAAA-MM-DD"). Déjalas vacías hasta tenerlas. ──
  dates: {
    met: "2025-09-04",       // 2025-
    started: "2026-05-19",   // el día que empezamos a salir
    together: "2026-06-24",  // el día oficial en que nos hicimos novios  (el contador usa esta)
  },

  // ── Pantalla de bienvenida ─────────────────────────────────────────
  welcome: {
    title: "Hay historias que comienzan mucho antes de tener un nombre.",
    subtitle: "Esta es un poquito de la nuestra.",
    button: "Comenzar nuestro viaje",
    photo: "portada.jpg", // ej. "portada.jpg"  (opcional)
  },

  // ── Capítulos de la línea de tiempo (el texto de cada uno es opcional) ──
  chapters: [
    { id: 1, title: "Todo comenzó antes", text: "" },
    { id: 2, title: "Poco a poco", text: "" },
    { id: 3, title: "El comienzo de nosotros", text: "" },
    { id: 4, title: "Nuestros primeros cuatro meses", text: "" },
  ],

  // ── Última tarjeta de la línea de tiempo ───────────────────────────
  timelineEnd: { text: "Y así llegamos hasta hoy.", button: "Seguir" },

  // ── RECUERDOS ──────────────────────────────────────────────────────
  //  Para añadir uno: copia un bloque { ... }, pégalo y cambia sus datos.
  //  "chapter" es el número del capítulo (1 a 4). Dentro de cada capítulo
  //  los recuerdos salen en el orden en que están escritos aquí.
  memories: [
    {
      chapter: 1,
      date: "2025-09-04",                                   // "2026-01-20"
      title: "El día en que nos conocimos",
      summary: "Mi prima la odiosa",
      photo: "2.jpg",                                  // foto principal: "conocernos.jpg"
      photos: [],                                 // fotos extra: ["conocernos-2.jpg", "conocernos-3.jpg"]
      story: `Ese día estaba super nervioso por el EPJ y recuerdo que yo llamo a Estebany para preguntarle donde venie ella y voy como a buscar y viene contigo con unas cosas y yo la saludo a ella y te saludo a ti con un *hola prima* y digo *quieres que te ayude?* y tu con mucho odio me dijiste *no* JAJAJAJA.
`,
      song: { title: "El ingeniero", artist: "Alleh y Yorghaki", url: "https://www.youtube.com/watch?v=_OF-AaUlxCg&pp=ygUMZWwgaW5nZW5pZXJv" },   // url: enlace de Spotify o YouTube
      detail: "Fue tanto el odio que me tenias que no tenemos ni una foto juntos JAJAJA",                                 // broma interna, frase, detalle solo nuestro
    },
    {
      chapter: 2, date: "2025-11-23", title: "Ya se había encendido algo",
      summary: "Los rumores estaban, pero nada que ver", photo: "cap2.jpg", photos: ["fotonov1.jpg", "fotonov2.jpg"],
      story: "Que te cuento AJAJAJA, bueno la verdad ya había pasado un tiempo desde que me tome el atrevimiento de pedirle tu número de telefono a tus primas y nada el tiempo paso, fuimos hablando, fue creciendo un poquito la confianza (aunque me tratabas mal) hasta que llego nuestro segundo acoplamiento, que recuerdo que todos estaban en casa de Nore (tu no) y yo estaba revisando el telefono y le dije a Jasmin *Lysmar tal cosa*... No sabía donde meterme y la verdad es tu no me gustabas (o eso creía yo), pero ahí comenzo una joda y al día siguiente de lo ocurrido te conté lo que pasó y nos tomamos nuestra primera fotito juntos (que tipo tan gei vale JAJAJJA)",
      song: { title: "Carita Linda", artist: "Rauw alejandro", url: "https://www.youtube.com/watch?v=OajhPIFvusk" }, detail: "La canción me recuerda a ti chiqui",
    },
    {
      chapter: 2, date: "2026-05-15", title: "Un poolcito o que?",
      summary: "Me rayaste la pintura bro", photo: "poolcito.jpg", photos: ["pool.jpg", "jajaja.jpg",],
      story: "Aún recuerdo con muchisima claridad esa noche, jugando pool, ya tu estabas loquita por mi (no me sorprendía la verdad JAJAJA), yo creo que aquí aún no querias aceptar que yo te gustaba, pero si tenías el pensamiento y llegaste a soñar con eso y con el acontecimiento que pasó horas despues (POR QUEEEEEEE.... jajajjajaja).",
      song: { title: "Las primeras veces", artist: "Morat", url: "https://www.youtube.com/watch?v=H4nwb_4D-Q4" }, detail: "",
    },
    {
      chapter: 2, date: "2026-05-19", title: "La primera vez que salimos juntos",
      summary: "Que pasticho tan bueno, se prestó", photo: "mayo19.jpg", photos: ["mayo191.jpg", "mayo192.jpg", "mayo193.jpg"],
      story: "La verdad no recuerdo muy bien como se dío esto (o si ya habíamos salido solos antes), pero si recuerdo que ese fue el momento en que los dos dimos click en lo que pasaba y ya para este momento todo el odio que tenias que me tenias fue bajando poco (epa, pa cuando unos pastichitos en Forli?).",
      song: { title: "Tranquila te puedes enamorar", artist: "Alleh y Yorghaki", url: "https://www.youtube.com/watch?v=hwLdMcTJRtE" }, detail: "",
    },
    {
      chapter: 2, date: "2026-05-31", title: "Todo fue gracias a EPJ",
      summary: "GRACIAS PUJADAS, LO HICISTE SUPER REAL!.", photo: "epjteques.jpg", photos: [],
      story: "Recuerdo que este fue tu primer servicio en el movimiento y me estuviste teniendo al tanto de todo, las fotos de con los muchachos, pou jorungandose una teta y la verdad fue muy bonito ver como te sentías en tu sericio",
      song: { title: "Color Esperanza", artist: "Diego Torres", url: "https://www.youtube.com/watch?v=Nb1VOQRs-Vs" }, detail: "Recuerdo que hubo tremendo show por esta foto, nawara JAJAJAJA",
    },
    {
      chapter: 3, date: "2026-06-24", title: "El día en que nos hicimos novios",
      summary: "El día en el que el mundo se movió y nuestro amor se juntó", photo: "novios.png", photos: ["noviosxd.jpg"],
      story: "Fue demasiado loco pensar en que ese día fue que lo volvimos oficial y que casualmente ese día venezuela se movio por completo. Es loco pensar en eso de pana que si, o sea, que probabilidades había?, pero me dejó una valiosa lección : no todo es malo, incluso en los malos momentos hay cosas que te pueden alegrar la vida.",
      song: { title: "Catira", artist: "Yorghaki", url: "https://www.youtube.com/watch?v=zGz8rNWtHsk" }, detail: "Estabas negra, pero pusé la canción Catira porque estab buenisima.",
    },
    {
      chapter: 4, date: "2026-08-02", title: "Epj siguió haciendo de la suyas",
      summary: "Ya todos se lo imaginaban", photo: "noviosepj.jpg", photos: ["epjchicos.jpg"],
      story: "Este fue mi primer servicio y la verdad fue muy chulo me encantó y recuerdo que ya aquí todo el mundo se imaginaba algo, pero nosotros seguiamos en secreto (menos Estef y la monjita)",
      song: { title: "el seCreto", artist: "Yorghaki", url: "https://www.youtube.com/watch?v=y8ndS-L8_mY" }, detail: "",
    },
    {
      chapter: 4, date: "2026-09-16", title: "Ahora somos guías?",
      summary: "Ya nos conociamos, solo teniamos que encontrarnos.", photo: "rfg1.jpg", photos: ["rfg2.jpg"],
      story: "Ahora somos guías novios JAJAJA. Me sigue sorprendiendo esto, que nos conocimos gracias a el encuentro de promoción juvenil y ahora somos guías del mismo movimiento que vio e hizo que nos juntaramos, porque ya nos conociamos, solo faltaba encontrarnos.",
      song: { title: "Bajo la mesa", artist: "Morat y Sebastián Yatra", url: "https://www.youtube.com/watch?v=hVR5KK2T8zQ" }, detail: "",
    },
    {
      chapter: 4, date: "Gracias", title: "Muchas risas",
      summary: "Me haces muy feliz", photo: "feliz1.jpg", photos: ["feliz2.jpg", "feliz3.jpg"],
      story: "Lys, no sabes lo feliz que me hace ser parte de tu vida y que tu seas parte de la mía, gracias por todos los momentos inolvidables y las experiencias tan hermosas que me llevo desde el día en que te conocí ",
      song: { title: "Aprender A Quererte", artist: "Morat", url: "https://www.youtube.com/watch?v=OukQDrJ7QRQ" }, detail: "",
    },
    {
      chapter: 4, date: "2026-10-14", title: "Nuestro cuarto mes]",
      summary: "mi fc", photo: "4m.jpg", photos: ["4m1.jpg"],
      story: "A través de estos cuatro meses me has regalado experiencias inolvidables; he vivido cosas fascinantes a tu lado. Sé que tal vez pueda parecer una tontería o una estupidez para algunos, pero la fiesta de cumpleaños que me hiciste es algo que nunca nadie había hecho por mí. Pasar mi cumpleaños con la persona que realmente amo, con cada uno de tus detalles, es algo que jamás voy a olvidar.Sé que a veces te hago molestar mucho y que no siempre es fácil conmigo, pero créeme que te amo profundamente. Te extraño muchísimo y tengo el deseo sincero de hacer las cosas muy bien contigo. Gracias por estos cuatro meses tan bonitos. Espero que sigan siendo muchos más, para que podamos seguir llenando esta página juntos hasta completarla.",
      song: { title: "En Un Solo Día", artist: "Morat", url: "https://www.youtube.com/watch?v=FsLHwqlFajQ" }, detail: "",
    },
  ],

  // ── Sección del contador ───────────────────────────────────────────
  //  {tiempo} se reemplaza solo: "Cuatro meses", "Cinco meses"...
  together: {
    phrase: "Cuatro meses de una historia que comenzó mucho antes.",
    photos: ["1.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg"], // hasta 3 fotos: ["juntos-1.jpg", "juntos-2.jpg", "juntos-3.jpg"]
  },

  // ── Final ──────────────────────────────────────────────────────────
  finale: {
    title: "Y lo más bonito es que todavía nos quedan muchísimas páginas por escribir.",
    message: "Lysmar te amo muchisimo, gracias por ser la mejor novia del mundo y lo siento si no soy el mejor expresandome o diciendo lo que siento",
    signature: "Enmanuel Valera",
    photo: "",
    button: "Volver a recorrer nuestra historia",
  },
}
