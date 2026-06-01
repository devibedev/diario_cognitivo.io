import { DocumentationSection } from '../types';

export const documentations: DocumentationSection[] = [
  {
    id: "alzheimer",
    title: "Alzheimer y Demencia",
    category: "Neurología y Prevención",
    icon: "Brain",
    summary: "Información crucial sobre los síntomas tempranos, etapas de la enfermedad y estrategias activas de estimulación.",
    content: [
      {
        subtitle: "¿Qué es el Alzheimer?",
        paragraphs: [
          "La enfermedad de Alzheimer es una afección progresiva que daña las neuronas y afecta gradualmente la memoria, el pensamiento y las capacidades funcionales cotidianas. No es una consecuencia normal del envejecimiento celular, sino una patología de carácter degenerativo.",
          "Estudios científicos modernos demuestran que, aunque el Alzheimer aún no tiene cura definitiva, el diagnóstico temprano combinado con terapia cognitiva agresiva y hábitos de vida saludables puede retrasar el deterioro de la autonomía del paciente hasta en un 40%."
        ],
        tips: [
          "Mantente alerta a los cambios sutiles: olvidar citas reiteradamente o desorientarse en lugares familiares requiere atención médica.",
          "La neuroplasticidad se mantiene activa toda la vida: aprender nuevas actividades (como un instrumento o un idioma) estimula los circuitos de reserva cognitiva."
        ],
        warnings: [
          "No confundas el olvido benigno (olvidar dónde dejaste las llaves temporalmente) con el patológico (olvidar la función que tienen las llaves)."
        ]
      },
      {
        subtitle: "Estrategias de Combate y Ejercitación Diaria",
        paragraphs: [
          "La estimulación mental diaria es un pilar fundamental en la resistencia contra el Alzheimer. Al retar activamente a la memoria a través de ejercicios visuales, lingüísticos y de cálculo, forzamos al cerebro a tender puentes sinápticos alternativos.",
          "El uso de diarios de orientación, donde el paciente escribe y lee sus memorias inmediatas todos los días, refuerza la retención a corto plazo y combate la desconexión del entorno lineal temporal."
        ],
        tips: [
          "Realiza rompecabezas aritméticos y de lógica durante 15 a 20 minutos al día para activar la corteza prefrontal.",
          "Asocia nuevos rostros con nombres y asócialos con objetos para reforzar las conexiones hipocampales."
        ]
      }
    ]
  },
  {
    id: "mental-health",
    title: "Trastornos Mentales y Neblina Cognitiva",
    category: "Salud Mental",
    icon: "HeartPulse",
    summary: "Comprende cómo el estrés crónico, la depresión y la ansiedad desencadenan bloqueos severos de memoria y atención.",
    content: [
      {
        subtitle: "La Depresión y la Ansiedad como Ladrones de Memoria",
        paragraphs: [
          "Muchos cuadros clínicos diagnosticados apresuradamente como demencia senil en realidad corresponden a 'pseudodemencias depresivas'. El estrés crónico y los estados depresivos saturan el organismo de cortisol, una hormona que en exceso inhibe y encoge el hipocampo (el epicentro de la memoria a corto plazo).",
          "La falta de atención selectiva inducida por la ansiedad hace que el cerebro nunca logre codificar el recuerdo original. Si no prestas atención debido a un pensamiento obsesivo, el recuerdo simplemente nunca se archiva."
        ],
        tips: [
          "Combate la neblina mental reduciendo la multitarea. Concéntrate en una sola actividad respirando de manera consciente.",
          "La meditación y las sesiones de relajación sistémica reducen los niveles de cortisol circulante, permitiendo al hipocampo reconectar y regenerarse."
        ],
        warnings: [
          "La fatiga emocional acumulada no es flojera; es un factor químico que desestabiliza tus neurotransmisores vitales."
        ]
      },
      {
        subtitle: "Sanando la Neblina Cognitiva (Brain Fog)",
        paragraphs: [
          "Para recuperar la lucidez intelectual tras periodos de trauma mental, depresión o burnout laboral, es vital restablecer el equilibrio químico cerebral. Esto se logra mediante una dieta rica en ácidos grasos Omega-3, antioxidantes, y un sueño reparador continuo.",
          "El registro escrito en un diario de emociones y recuerdos diarios actúa como un cable a tierra que quita presión a la memoria de trabajo disminuyendo el estrés y la rumia mental."
        ],
        tips: [
          "Escribe tus preocupaciones antes de dormir para vaciar tu memoria operativa.",
          "Haz pausas activas de 5 minutos cada hora para oxigenar tu cerebro y reanudar la síntesis de dopamina."
        ]
      }
    ]
  },
  {
    id: "aging",
    title: "Senectud Autónoma y Saludable",
    category: "Gerontología",
    icon: "CalendarRange",
    summary: "Guía fisiológica aplicable al adulto mayor para preservar la agilidad neuronal, motricidad y reserva sináptica.",
    content: [
      {
        subtitle: "El Envejecimiento Cerebral Exitoso",
        paragraphs: [
          "La senectud no equivale a la pérdida inexorable de tus capacidades cognitivas. Se puede envejecer manteniendo un cerebro ágil, rápido y saludable. La diferencia reside en la construcción previa y continua de una potente 'reserva cognitiva'.",
          "Esta reserva actúa como un colchón biológico: si algunas conexiones sinápticas se deterioran debido a la edad, el cerebro recurre a su denso mapa alternativo para seguir operando sin pérdida de funcionalidad ostensible."
        ],
        tips: [
          "El ejercicio físico moderado como caminar a buen ritmo estimula el Factor Neurotrófico Derivado del Cerebro (BDNF), que induce el crecimiento de nuevas neuronas.",
          "Mantén una vida social activa: conversar, debatir y reír con amigos moviliza la corteza prefrontal y parietal."
        ]
      },
      {
        subtitle: "Ejes Clave: Sueño, Dieta y Coordinación",
        paragraphs: [
          "Durante las fases profundas de sueño (etapa REM y ondas lentas), el cerebro activa su sistema glinfático, el cual se encarga de 'limpiar y barrer' los productos de desecho como las placas de proteína beta-amiloide asociadas al Alzheimer.",
          "Asimismo, la nutrición cerebral orientada a grasas saludables (aguacate, nueces, aceite de oliva virgen extra) y la estimulación de coordinación bilateral (como tejer, bailar o dibujar) mantienen activos ambos hemisferios corporales y cerebrales."
        ],
        tips: [
          "Asegura entre 7 y 8 horas de sueño profundo diarias; es el taller mecánico donde se consolidan tus memorias.",
          "Consume bayas negras y arándanos, cargados de antocianinas que protegen tus neuronas de la oxidación acelerada."
        ]
      }
    ]
  },
  {
    id: "caregivers",
    title: "Manual Práctico para Cuidadores",
    category: "Apoyo Familiar",
    icon: "UsersRound",
    summary: "Cómo brindar asistencia compasiva, gestionar la frustración y crear entornos seguros de memoria asistida.",
    content: [
      {
        subtitle: "El Arte de Acompañar sin Invalidar",
        paragraphs: [
          "Cuidar a un familiar directo que atraviesa por un proceso de demencia senil o Alzheimer interroga profundamente nuestra resiliencia emocional. El pilar de oro de la comunicación interactiva es 'validar sus sentimientos en lugar de contradecir su realidad'.",
          "Corregir rígidamente a una persona que confunde el año actual o el nombre de un familiar solo genera un aumento de la hormona del estrés, hostilidad o aislamiento profundo."
        ],
        tips: [
          "Usa la técnica de redirección en lugar del enfrentamiento directo: si el paciente insiste en querer ir a una casa del pasado, guíale hablándole con calidez de lo hermosa que es esa memoria.",
          "Utiliza notas adhesivas, fotos etiquetadas y relojes analógicos grandes para proporcionar anclajes visuales de orientación."
        ],
        warnings: [
          "Cuidar requiere cuidarse. El síndrome del cuidador quemado degrada tu propia salud y reduce la calidad de la asistencia prestada al paciente."
        ]
      },
      {
        subtitle: "Adaptaciones del Entorno Físico Seguras",
        paragraphs: [
          "Un hogar estructurado y predecible reduce la sobreestimulación y la desorientación. Organizar los armarios, mantener una iluminación uniforme (evitando sombras que puedan asustarles en su mente deteriorada) y rotular estanterías previene accidentes graves.",
          "Mantener rutinas fijas de alimentación, aseo y socialización proporciona una estructura rítmica reconfortante que disminuye la ansiedad vespertina (efecto de puesta de sol o 'sundowning')."
        ],
        tips: [
          "Establece una secuencia fija de actividades diarias: la predictibilidad ofrece seguridad emocional.",
          "Haz que el paciente colabore en pequeñas actividades domésticas mecánicas para que conserve su sentimiento de utilidad."
        ]
      }
    ]
  }
];
