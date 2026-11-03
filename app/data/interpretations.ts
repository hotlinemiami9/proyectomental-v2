import type { CenterId } from '~/types/chart'

export interface EditorialEntry {
  title: string
  body: string
}

export const typeContent: Record<string, EditorialEntry> = {
  Generator: {
    title: 'Energía sostenida para responder',
    body: 'Tu diseño se activa cuando algo del mundo te despierta una respuesta genuina. No necesitas empujar desde la mente: la energía aparece cuando hay algo que realmente te enciende.',
  },
  'Manifesting Generator': {
    title: 'Velocidad que aprende respondiendo',
    body: 'Puedes moverte rápido y abrir muchos caminos, pero tu claridad aparece cuando respondes antes de saltar. Informar a tiempo suele suavizar el impacto de tu ritmo.',
  },
  Projector: {
    title: 'Una mirada que guía cuando es invitada',
    body: 'Tu atención y tu forma de ver los sistemas son valiosas. La invitación y el reconocimiento permiten que esa mirada aterrice sin convertirte en el motor de todo.',
  },
  Manifestor: {
    title: 'Inicio e impacto',
    body: 'Tu energía está hecha para iniciar y abrir espacio. Informar antes de actuar no te quita libertad: reduce la resistencia que encuentran tus movimientos.',
  },
  Reflector: {
    title: 'Un espejo sensible del entorno',
    body: 'Tu experiencia cambia con el entorno y con el tiempo. Necesitas margen para observar cómo te afectan los ciclos antes de tomar una decisión importante.',
  },
}

export const authorityContent: Record<string, EditorialEntry> = {
  Sacral: {
    title: 'Una respuesta corporal inmediata',
    body: 'Tu autoridad se expresa como un sí o un no visceral en el momento. La mente puede explicarlo después; la señal útil llega antes.',
  },
  Emotional: {
    title: 'Claridad a través del tiempo',
    body: 'No conviene decidir en el pico emocional. La claridad aparece cuando la ola se asienta y puedes mirar la situación desde más de un estado.',
  },
  Splenic: {
    title: 'Una intuición silenciosa y momentánea',
    body: 'La señal esplénica suele ser breve y poco dramática. Se percibe en el cuerpo, en el momento, sin necesidad de repetirla.',
  },
  Ego: {
    title: 'Voluntad y compromiso',
    body: 'Tu autoridad pasa por preguntarte qué quieres comprometer de verdad. La voluntad auténtica sostiene; la obligación suele agotar.',
  },
  'Self-Projected': {
    title: 'La verdad que aparece al hablar',
    body: 'Necesitas escuchar tu propia voz en un espacio seguro. Hablar con alguien que no te corrija te ayuda a reconocer lo que ya sabes.',
  },
  Mental: {
    title: 'Claridad a través del diálogo',
    body: 'Tu proceso es mental y relacional. No necesitas una respuesta instantánea: necesitas conversar con las personas adecuadas y escuchar cómo suena tu verdad.',
  },
  Lunar: {
    title: 'La perspectiva de un ciclo completo',
    body: 'Tu autoridad necesita tiempo y contexto. Observa la misma decisión en distintos momentos antes de comprometerte.',
  },
}

export const profileContent: Record<string, EditorialEntry> = {
  '1/3': {
    title: 'Investigar y aprender haciendo',
    body: 'Necesitas bases sólidas y también permiso para equivocarte. La experiencia directa convierte la información en conocimiento propio.',
  },
  '1/4': {
    title: 'Fundamento y red cercana',
    body: 'Tu aprendizaje necesita profundidad y tu impacto crece a través de vínculos de confianza. La comunidad cercana es parte de tu forma de compartir.',
  },
  '2/4': {
    title: 'Talento natural y cercanía',
    body: 'Hay habilidades que fluyen sin esfuerzo aparente. Las personas cercanas suelen ser quienes te ven y te invitan a mostrarlas.',
  },
  '2/5': {
    title: 'Don natural y proyección',
    body: 'Tu talento puede atraer expectativas ajenas. La clave está en no confundir lo que otros proyectan con lo que tú realmente quieres ofrecer.',
  },
  '3/5': {
    title: 'Experimentar y resolver',
    body: 'Aprendes probando, ajustando y encontrando soluciones prácticas. Tu experiencia puede ser útil para otros cuando no se convierte en una receta rígida.',
  },
  '3/6': {
    title: 'Experiencia y perspectiva',
    body: 'Tu recorrido combina prueba, error y una mirada cada vez más amplia. Con el tiempo, lo vivido se convierte en una forma de orientar sin imponer.',
  },
  '4/6': {
    title: 'Vínculos y madurez',
    body: 'Tu influencia circula por relaciones y comunidades. La distancia con el tiempo te permite convertir la experiencia en una perspectiva más serena.',
  },
  '4/1': {
    title: 'Base firme y red',
    body: 'Necesitas investigar antes de compartir y cuidar los vínculos desde los que enseñas. Tu autoridad crece cuando hay fundamento y confianza.',
  },
  '5/1': {
    title: 'Soluciones prácticas con base',
    body: 'Otros pueden verte como alguien que resuelve. Tu credibilidad aumenta cuando la respuesta nace de una investigación real y no de la expectativa ajena.',
  },
  '5/2': {
    title: 'Talento puesto a prueba',
    body: 'Hay un don natural que se vuelve visible a través de las invitaciones. Aprender a distinguir la proyección de la oportunidad real es parte del proceso.',
  },
  '6/2': {
    title: 'Observar, encarnar y compartir',
    body: 'Tu vida puede vivirse en capas: explorar, retirarte a observar y volver con una perspectiva más madura. El talento natural necesita tiempo para asentarse.',
  },
  '6/3': {
    title: 'Sabiduría que nace de la experiencia',
    body: 'La prueba y el error forman parte de tu aprendizaje. Con el tiempo, lo vivido se convierte en una mirada más amplia y menos reactiva.',
  },
}

export const centerContent: Record<CenterId, EditorialEntry> = {
  head: {
    title: 'Cabeza',
    body: 'Centro de inspiración y presión mental. Cuando está definido, hay una forma constante de pensar preguntas; cuando está abierto, las preguntas ajenas pueden sentirse especialmente intensas.',
  },
  ajna: {
    title: 'Ajna',
    body: 'Centro de conceptualización y creencia. Define cómo se organizan las ideas y qué grado de certeza mental necesitas para sentirte cómodo.',
  },
  throat: {
    title: 'Garganta',
    body: 'Centro de expresión y manifestación. Conecta la energía interna con la palabra, la acción y la forma en que te das a conocer.',
  },
  g: {
    title: 'Centro G',
    body: 'Centro de identidad, dirección y amor. Cuando está definido, hay una sensación más estable de hacia dónde vas; cuando está abierto, la dirección se descubre en relación con el entorno.',
  },
  heart: {
    title: 'Corazón',
    body: 'Centro de voluntad, ego y valor. Define cómo te comprometes, qué sostienes y cómo negocian tu deseo y tu sentido de merecimiento.',
  },
  sacral: {
    title: 'Sacral',
    body: 'Centro de energía vital y respuesta. Es la fuente de la energía sostenida para el trabajo y la creatividad cuando hay una respuesta genuina.',
  },
  solarplexus: {
    title: 'Plexo solar',
    body: 'Centro emocional y de sensibilidad. Define si experimentas las emociones de forma ondulante y necesitas tiempo para llegar a claridad.',
  },
  spleen: {
    title: 'Bazo',
    body: 'Centro de instinto, salud y conciencia corporal. Su señal es rápida y silenciosa; cuando está abierto, conviene no confundir miedo con intuición.',
  },
  root: {
    title: 'Raíz',
    body: 'Centro de presión, impulso y adrenalina. Define cómo gestionas el tiempo y la presión de empezar o terminar las cosas.',
  },
}

export function getTypeContent(type: string) {
  return (
    typeContent[type] ?? {
      title: 'Tu configuración',
      body: 'Esta carta describe una forma particular de procesar la energía y tomar decisiones. Úsala como una invitación a observarte, no como una etiqueta fija.',
    }
  )
}

export function getAuthorityContent(authority: string) {
  return (
    authorityContent[authority] ?? {
      title: 'Tu autoridad interna',
      body: 'La autoridad es tu forma más fiable de decidir. Observa cómo se manifiesta en tu cuerpo y en tu proceso antes de convertirla en una regla mental.',
    }
  )
}

export function getProfileContent(profile: string) {
  return (
    profileContent[profile] ?? {
      title: 'Tu perfil',
      body: 'El perfil describe una manera de aprender, relacionarte y expresar tu proceso. Es una capa de observación, no una definición cerrada.',
    }
  )
}
