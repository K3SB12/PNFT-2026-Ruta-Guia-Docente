import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Reading {
  id: string;
  title: string;
  content: string;
  pages?: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  readings: Reading[];
  progress: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CustomReading {
  id: string;
  title: string;
  summary: string;
  questions: Question[];
}

export interface ProductivityData {
  day: string;
  focus: number;
}

interface AppState {
  focusTime: number;
  pomodorosCompleted: number;
  flowtimeSessions: number;
  modules: Module[];
  flashcards: Record<string, Flashcard[]>;
  highlights: Record<string, string[]>;
  simulatorQuestions: Question[];
  simulatorScores: number[];
  customReadings: CustomReading[];
  completedReadings: Record<string, string[]>;
  productivityData: ProductivityData[];
}

interface AppContextType {
  state: AppState;
  addFocusTime: (seconds: number, type: 'pomodoro' | 'flowtime') => void;
  updateModuleProgress: (moduleId: string, progress: number) => void;
  addSimulatorScore: (score: number) => void;
  addCustomReading: (reading: CustomReading) => void;
  addHighlightAndFlashcard: (moduleId: string, readingId: string, text: string, question: string) => void;
  updateReadingPages: (moduleId: string, readingId: string, pages: string[]) => void;
  toggleReadingCompletion: (moduleId: string, readingId: string) => void;
  addSimulatorQuestion: (question: Question) => void;
  deleteSimulatorQuestion: (questionId: string) => void;
  updateSimulatorQuestion: (questionId: string, updatedQuestion: Question) => void;
  deleteFlashcard: (moduleId: string, flashcardId: string) => void;
  updateFlashcard: (moduleId: string, flashcardId: string, front: string, back: string) => void;
  addModule: (title: string, description: string) => void;
  updateModule: (moduleId: string, title: string, description: string) => void;
  deleteModule: (moduleId: string) => void;
  addReading: (moduleId: string, title: string) => void;
  updateReadingTitle: (moduleId: string, readingId: string, title: string) => void;
  deleteReading: (moduleId: string, readingId: string) => void;
  resetUserProgress: () => void;
  updateProductivityData: (data: ProductivityData[]) => void;
}

const generatePages = (title: string, firstPageContent: string, totalPages: number) => {
  const pages = [firstPageContent];
  for (let i = 2; i <= totalPages; i++) {
    pages.push(`[Página ${i}]\n\nContinuación del documento oficial: ${title}...\n\nEn esta sección se detallan los artículos, incisos y normativas correspondientes a esta página del documento. Como Asesor Nacional, es fundamental analizar este texto para comprender las implicaciones legales, técnicas o pedagógicas que aplican a su labor diaria en el Ministerio de Educación Pública.\n\nRecuerde que puede seleccionar cualquier parte de este texto para crear una tarjeta de estudio (flashcard) y repasarla más tarde en el Student Toolbox.\n\n(Nota: Este es un texto simulado para la página ${i}. En la versión final, aquí se cargará el texto extraído directamente del PDF oficial).`);
  }
  return pages;
};

const defaultModules: Module[] = [
  {
    id: 'm1',
    title: 'Módulo 1: Marco Jurídico y Ético del Servidor',
    description: 'Estatuto de Servicio Civil, Ley de Empleo Público (10159), Ley de Control Interno (8292).',
    progress: 0,
    readings: [
      {
        id: 'm1_r1',
        title: 'Estatuto de Servicio Civil',
        content: 'El Estatuto de Servicio Civil regula las relaciones entre el Poder Ejecutivo y sus servidores, con el propósito de garantizar la eficiencia de la administración pública y proteger a los trabajadores. Establece los principios de mérito y capacidad para el ingreso y ascenso en el régimen, asegurando la estabilidad laboral basada en la idoneidad comprobada.',
        pages: generatePages(
          'Estatuto de Servicio Civil', 
          'CAPÍTULO I\nDisposiciones Generales\n\nArtículo 1º.- El presente Estatuto y sus Reglamentos regularán las relaciones entre el Poder Ejecutivo y sus servidores, con el propósito de garantizar la eficiencia de la administración pública y proteger a los trabajadores.\n\nArtículo 2º.- Para los efectos de esta ley, el conjunto de empleados públicos que prestan sus servicios al Poder Ejecutivo, se denominará Servicio Civil.\n\nArtículo 3º.- Este Estatuto no será aplicable a los funcionarios que la Constitución Política exceptúa, ni a los que determine la ley.', 
          177
        )
      },
      {
        id: 'm1_r2',
        title: 'Ley Marco de Empleo Público (10159)',
        content: 'La Ley 10159 busca ordenar el empleo público, estableciendo la rectoría de MIDEPLAN. Bajo el principio de Estado como patrono único, se unifican las directrices de recursos humanos, garantizando equidad salarial (salario global) y estandarización en los procesos de reclutamiento, selección y evaluación del desempeño en todo el sector público.',
        pages: generatePages(
          'Ley Marco de Empleo Público (10159)',
          'TÍTULO I\nDisposiciones Generales\n\nArtículo 1.- Objeto de la ley. La presente ley tiene por objeto regular las relaciones estatutarias, de empleo público y de empleo mixto entre la Administración Pública y los servidores públicos, con la finalidad de asegurar la eficiencia y eficacia en la prestación de los servicios públicos.',
          54
        )
      },
      {
        id: 'm1_r3',
        title: 'Ley de Control Interno (8292) - Probidad',
        content: 'El Artículo 12 de la Ley 8292 define el deber de probidad. Obliga a todo funcionario a orientar su gestión a la satisfacción del interés público, demostrando rectitud, buena fe y transparencia. El Asesor Nacional debe velar por el estricto cumplimiento de estas normativas, evitando conflictos de interés y asegurando el uso eficiente de los recursos.',
        pages: generatePages(
          'Ley de Control Interno (8292)',
          'CAPÍTULO III\nDeberes del Jerarca y de los Titulares Subordinados\n\nArtículo 12.- Deberes del jerarca y de los titulares subordinados en el sistema de control interno. En materia de control interno, al jerarca y los titulares subordinados les corresponderá cumplir, entre otros, los siguientes deberes:\n\na) Velar por el adecuado desarrollo, mantenimiento y perfeccionamiento del sistema de control interno...',
          32
        )
      },
      {
        id: 'm1_r4',
        title: 'Reglamento Autónomo de Servicios',
        content: 'Establece las disposiciones disciplinarias, jornadas de trabajo y deberes específicos de los funcionarios del MEP. Define las faltas leves, graves y gravísimas, así como el debido proceso para la aplicación de sanciones, garantizando el derecho a la defensa del servidor público en todo momento.',
        pages: generatePages(
          'Reglamento Autónomo de Servicios',
          'TÍTULO I\nDisposiciones Generales\n\nArtículo 1.- El presente Reglamento Autónomo de Servicios tiene por objeto regular las relaciones de servicio entre el Ministerio de Educación Pública y sus servidores, estableciendo los derechos, deberes, prohibiciones y el régimen disciplinario aplicable.',
          85
        )
      }
    ]
  },
  {
    id: 'm2',
    title: 'Módulo 2: Gobernanza y Estructura Organizativa',
    description: 'Modelo de Gobernanza 2025 y Circular DM-0006-2025.',
    progress: 0,
    readings: [
      {
        id: 'm2_r1',
        title: 'Modelo de Gobernanza 2025',
        content: 'Redefine la estructura organizativa del MEP, buscando descentralizar la toma de decisiones operativas mientras se mantiene una rectoría estratégica centralizada. El objetivo es lograr una gestión más ágil y adaptada a las realidades de cada región educativa.',
        pages: generatePages('Modelo de Gobernanza 2025', 'Redefine la estructura organizativa del MEP, buscando descentralizar la toma de decisiones operativas mientras se mantiene una rectoría estratégica centralizada. El objetivo es lograr una gestión más ágil y adaptada a las realidades de cada región educativa.', 45)
      },
      {
        id: 'm2_r2',
        title: 'Circular DM-0006-2025',
        content: 'Establece los lineamientos para la reorganización de las direcciones regionales y su relación con el nivel central. Define claramente los canales de comunicación oficiales y los flujos de trabajo para la aprobación de proyectos tecnológicos en los centros educativos.',
        pages: generatePages('Circular DM-0006-2025', 'Establece los lineamientos para la reorganización de las direcciones regionales y su relación con el nivel central. Define claramente los canales de comunicación oficiales y los flujos de trabajo para la aprobación de proyectos tecnológicos en los centros educativos.', 12)
      },
      {
        id: 'm2_r3',
        title: 'Relación Técnica DRTE, DDC, IDP',
        content: 'La Dirección de Recursos Tecnológicos en Educación (DRTE) coordina estrechamente con la Dirección de Desarrollo Curricular (DDC) y el Instituto de Desarrollo Profesional (IDP) para asegurar que la dotación de equipo tecnológico esté alineada con los programas de estudio y la capacitación docente.',
        pages: generatePages('Relación Técnica DRTE, DDC, IDP', 'La Dirección de Recursos Tecnológicos en Educación (DRTE) coordina estrechamente con la Dirección de Desarrollo Curricular (DDC) y el Instituto de Desarrollo Profesional (IDP) para asegurar que la dotación de equipo tecnológico esté alineada con los programas de estudio y la capacitación docente.', 28)
      },
      {
        id: 'm2_r4',
        title: 'Gestión de Recursos en Regiones',
        content: 'Las Juntas de Educación y los Asesores Regionales deben asegurar que el equipamiento tecnológico se adquiera y utilice bajo estrictos criterios de sostenibilidad y transparencia institucional, priorizando las zonas de mayor vulnerabilidad socioeconómica.',
        pages: generatePages('Gestión de Recursos en Regiones', 'Las Juntas de Educación y los Asesores Regionales deben asegurar que el equipamiento tecnológico se adquiera y utilice bajo estrictos criterios de sostenibilidad y transparencia institucional, priorizando las zonas de mayor vulnerabilidad socioeconómica.', 34)
      }
    ]
  },
  {
    id: 'm3',
    title: 'Módulo 3: Transformación Digital e Inteligencia Artificial',
    description: 'Estrategia para la Transformación Digital 2025, Estrategia Nacional de IA.',
    progress: 0,
    readings: [
      {
        id: 'm3_r1',
        title: 'Estrategia de Transformación Digital',
        content: 'Busca dotar de conectividad de banda ancha y dispositivos adecuados a todos los centros educativos para el 2025. Contempla la modernización de la infraestructura de red y la migración de servicios administrativos a plataformas en la nube.',
        pages: generatePages('Estrategia de Transformación Digital', 'Busca dotar de conectividad de banda ancha y dispositivos adecuados a todos los centros educativos para el 2025. Contempla la modernización de la infraestructura de red y la migración de servicios administrativos a plataformas en la nube.', 60)
      },
      {
        id: 'm3_r2',
        title: 'Estrategia Nacional de IA',
        content: 'Define los principios éticos para la adopción de Inteligencia Artificial en el sector público y educativo. Promueve el uso de IA para personalizar el aprendizaje y optimizar la gestión administrativa, siempre bajo un marco de respeto a los derechos humanos.',
        pages: generatePages('Estrategia Nacional de IA', 'Define los principios éticos para la adopción de Inteligencia Artificial en el sector público y educativo. Promueve el uso de IA para personalizar el aprendizaje y optimizar la gestión administrativa, siempre bajo un marco de respeto a los derechos humanos.', 40)
      },
      {
        id: 'm3_r3',
        title: 'Modelo MITDE',
        content: 'El Modelo de Integración de Tecnologías Digitales en la Educación (MITDE) promueve la alfabetización digital como un eje transversal. No se trata solo de enseñar a usar herramientas, sino de integrarlas pedagógicamente en todas las asignaturas del currículo.',
        pages: generatePages('Modelo MITDE', 'El Modelo de Integración de Tecnologías Digitales en la Educación (MITDE) promueve la alfabetización digital como un eje transversal. No se trata solo de enseñar a usar herramientas, sino de integrarlas pedagógicamente en todas las asignaturas del currículo.', 25)
      },
      {
        id: 'm3_r4',
        title: 'Ciudadanía Digital',
        content: 'Fomenta el uso responsable, seguro y ético de las tecnologías. Incluye la enseñanza sobre la huella digital, la prevención del ciberacoso (cyberbullying) y la protección de la identidad digital de los estudiantes en entornos virtuales.',
        pages: generatePages('Ciudadanía Digital', 'Fomenta el uso responsable, seguro y ético de las tecnologías. Incluye la enseñanza sobre la huella digital, la prevención del ciberacoso (cyberbullying) y la protección de la identidad digital de los estudiantes en entornos virtuales.', 30)
      },
      {
        id: 'm3_r5',
        title: 'Protección de Datos y Algoritmos',
        content: 'Ante el avance de las tecnologías emergentes, es imperativo el diseño de protocolos rigurosos para la protección de datos personales. Se exige la implementación de una supervisión humana significativa (Human-in-the-loop) sobre los algoritmos utilizados para evaluar o perfilar estudiantes.',
        pages: generatePages('Protección de Datos y Algoritmos', 'Ante el avance de las tecnologías emergentes, es imperativo el diseño de protocolos rigurosos para la protección de datos personales. Se exige la implementación de una supervisión humana significativa (Human-in-the-loop) sobre los algoritmos utilizados para evaluar o perfilar estudiantes.', 50)
      }
    ]
  },
  {
    id: 'm4',
    title: 'Módulo 4: Gestión Curricular y PNFT 2026',
    description: 'Módulos PNFT 2026 de Preescolar, Primaria y Secundaria, Manual STEAM.',
    progress: 0,
    readings: [
      {
        id: 'm4_r1',
        title: 'PNFT 2026 - Preescolar',
        content: 'Se enfoca en el pensamiento computacional desconectado (unplugged) y la apropiación tecnológica temprana. Los niños desarrollan habilidades de secuenciación y resolución de problemas a través de juegos físicos y material concreto antes de usar pantallas.',
        pages: generatePages('PNFT 2026 - Preescolar', 'Se enfoca en el pensamiento computacional desconectado (unplugged) y la apropiación tecnológica temprana. Los niños desarrollan habilidades de secuenciación y resolución de problemas a través de juegos físicos y material concreto antes de usar pantallas.', 45)
      },
      {
        id: 'm4_r2',
        title: 'PNFT 2026 - Primaria',
        content: 'Introduce la programación en bloques (como Scratch) y conceptos básicos de robótica educativa. Los estudiantes comienzan a crear sus propios algoritmos simples y a comprender la relación entre el código y el comportamiento de un dispositivo físico.',
        pages: generatePages('PNFT 2026 - Primaria', 'Introduce la programación en bloques (como Scratch) y conceptos básicos de robótica educativa. Los estudiantes comienzan a crear sus propios algoritmos simples y a comprender la relación entre el código y el comportamiento de un dispositivo físico.', 65)
      },
      {
        id: 'm4_r3',
        title: 'PNFT 2026 - Secundaria',
        content: 'Profundiza en lenguajes de programación textual (como Python o JavaScript), análisis de datos y proyectos maker. Se fomenta la creación de soluciones tecnológicas funcionales para problemas específicos de su entorno.',
        pages: generatePages('PNFT 2026 - Secundaria', 'Profundiza en lenguajes de programación textual (como Python o JavaScript), análisis de datos y proyectos maker. Se fomenta la creación de soluciones tecnológicas funcionales para problemas específicos de su entorno.', 80)
      },
      {
        id: 'm4_r4',
        title: 'Manual STEAM',
        content: 'Integra Ciencia, Tecnología, Ingeniería, Artes y Matemáticas mediante proyectos interdisciplinarios. El enfoque STEAM busca romper los silos de las asignaturas tradicionales, promoviendo un aprendizaje holístico y basado en la indagación.',
        pages: generatePages('Manual STEAM', 'Integra Ciencia, Tecnología, Ingeniería, Artes y Matemáticas mediante proyectos interdisciplinarios. El enfoque STEAM busca romper los silos de las asignaturas tradicionales, promoviendo un aprendizaje holístico y basado en la indagación.', 120)
      },
      {
        id: 'm4_r5',
        title: 'Design Thinking y Retos',
        content: 'El Proceso de Diseño en Ingeniería se aplica mediante el Aprendizaje Basado en Retos. Los estudiantes empatizan con un problema, idean soluciones, construyen prototipos y los evalúan, desarrollando resiliencia y pensamiento crítico.',
        pages: generatePages('Design Thinking y Retos', 'El Proceso de Diseño en Ingeniería se aplica mediante el Aprendizaje Basado en Retos. Los estudiantes empatizan con un problema, idean soluciones, construyen prototipos y los evalúan, desarrollando resiliencia y pensamiento crítico.', 35)
      }
    ]
  },
  {
    id: 'm5',
    title: 'Módulo 5: Evaluación y Gestión de Proyectos',
    description: 'Reglamento de Evaluación de los Aprendizajes (REA), Lineamientos Técnicos 2026.',
    progress: 0,
    readings: [
      {
        id: 'm5_r1',
        title: 'Reglamento de Evaluación (REA)',
        content: 'Establece las pautas normativas para la valoración integral del desempeño estudiantil. Define los componentes de la calificación, los procesos de promoción y las adecuaciones curriculares necesarias para garantizar la equidad en la evaluación.',
        pages: generatePages('Reglamento de Evaluación (REA)', 'Establece las pautas normativas para la valoración integral del desempeño estudiantil. Define los componentes de la calificación, los procesos de promoción y las adecuaciones curriculares necesarias para garantizar la equidad en la evaluación.', 90)
      },
      {
        id: 'm5_r2',
        title: 'Lineamientos Técnicos 2026',
        content: 'Detalla los procedimientos específicos para la evaluación formativa y sumativa en las asignaturas tecnológicas. Enfatiza la necesidad de evaluar el proceso de creación tecnológica y no únicamente el producto final.',
        pages: generatePages('Lineamientos Técnicos 2026', 'Detalla los procedimientos específicos para la evaluación formativa y sumativa en las asignaturas tecnológicas. Enfatiza la necesidad de evaluar el proceso de creación tecnológica y no únicamente el producto final.', 40)
      },
      {
        id: 'm5_r3',
        title: 'Instrumentos de Evaluación',
        content: 'Se exige el uso de rúbricas analíticas y escalas de desempeño para medir habilidades observables. Estos instrumentos deben ser compartidos con los estudiantes antes de iniciar el proyecto para transparentar los criterios de éxito.',
        pages: generatePages('Instrumentos de Evaluación', 'Se exige el uso de rúbricas analíticas y escalas de desempeño para medir habilidades observables. Estos instrumentos deben ser compartidos con los estudiantes antes de iniciar el proyecto para transparentar los criterios de éxito.', 25)
      },
      {
        id: 'm5_r4',
        title: 'Componente Proyecto y TecnoPresta',
        content: 'El Componente Proyecto valida el logro de los Resultados de Aprendizaje (RdA) mediante actividades integradoras. Además, la plataforma TecnoPresta se utiliza para la correcta gestión de incidencias y el control de inventario del equipo tecnológico utilizado en estos proyectos.',
        pages: generatePages('Componente Proyecto y TecnoPresta', 'El Componente Proyecto valida el logro de los Resultados de Aprendizaje (RdA) mediante actividades integradoras. Además, la plataforma TecnoPresta se utiliza para la correcta gestión de incidencias y el control de inventario del equipo tecnológico utilizado en estos proyectos.', 30)
      }
    ]
  }
];

const defaultSimulatorQuestions: Question[] = [
  {
    id: 'q1',
    text: 'Un director de centro educativo le solicita a usted, como Asesor Nacional, que apruebe la compra de licencias de software privativo con fondos de la Junta de Educación, sin haber realizado un estudio de mercado ni considerar alternativas de software libre. Según la Ley de Control Interno (8292) y el deber de probidad, ¿cuál es la acción correcta?',
    options: [
      'Aprobar la compra inmediatamente para no retrasar el proceso educativo.',
      'Rechazar la solicitud y exigir un análisis de viabilidad técnica y económica que incluya opciones de software libre, garantizando el uso eficiente de los fondos públicos.',
      'Elevar el caso al Ministro de Educación para que tome la decisión final.',
      'Aprobar la compra pero con una advertencia escrita sobre futuras adquisiciones.'
    ],
    correctAnswer: 1,
    explanation: 'El deber de probidad (Art. 12, Ley 8292) obliga a administrar los recursos públicos con apego a los principios de legalidad, eficacia, economía y eficiencia.'
  },
  {
    id: 'q2',
    text: 'En el marco de la Estrategia Nacional de IA, un docente implementa un sistema automatizado para calificar ensayos de estudiantes. Varios padres se quejan de sesgos en las calificaciones. Como Asesor, ¿qué protocolo debe recomendar implementar de inmediato?',
    options: [
      'Prohibir el uso de IA en todo el centro educativo.',
      'Ignorar las quejas, ya que la IA es objetiva por naturaleza.',
      'Establecer un protocolo de supervisión humana significativa ("Human-in-the-loop") donde el docente revise y valide las calificaciones generadas por la IA.',
      'Cambiar el sistema de IA por uno más costoso.'
    ],
    correctAnswer: 2,
    explanation: 'La supervisión humana de algoritmos es un principio ético fundamental en la implementación de IA en educación para mitigar sesgos y asegurar la equidad.'
  },
  {
    id: 'q3',
    text: 'Durante la implementación del PNFT 2026, un docente de primaria tiene dificultades para integrar la "Robótica" en sus clases regulares. ¿Cuál es la mejor estrategia de mediación pedagógica que usted debe asesorar?',
    options: [
      'Enfocarse solo en la teoría de la robótica sin práctica.',
      'Aplicar el Proceso de Diseño en Ingeniería mediante el Aprendizaje Basado en Retos (Design Thinking), conectando la robótica con problemas reales de la comunidad.',
      'Dejar la robótica como una actividad extracurricular opcional.',
      'Comprar kits de robótica más avanzados y esperar que el docente aprenda solo.'
    ],
    correctAnswer: 1,
    explanation: 'El Manual STEAM y el PNFT 2026 promueven el Design Thinking y el aprendizaje basado en retos para una integración significativa de la tecnología.'
  }
];

const defaultFlashcards: Record<string, Flashcard[]> = {
  'm1': [
    { id: 'f1', front: '¿Qué establece el Art. 12 de la Ley 8292?', back: 'El deber de probidad: orientar la gestión a la satisfacción del interés público.' },
    { id: 'f2', front: '¿Qué implica el principio de Estado como patrono único?', back: 'Para efectos laborales, todas las instituciones del Estado central conforman un solo empleador.' }
  ]
};

const defaultProductivityData: ProductivityData[] = [
  { day: 'Lun', focus: 120 },
  { day: 'Mar', focus: 150 },
  { day: 'Mié', focus: 90 },
  { day: 'Jue', focus: 180 },
  { day: 'Vie', focus: 210 },
  { day: 'Sáb', focus: 240 },
  { day: 'Dom', focus: 0 },
];

const initialState: AppState = {
  focusTime: 0,
  pomodorosCompleted: 0,
  flowtimeSessions: 0,
  modules: defaultModules,
  flashcards: defaultFlashcards,
  highlights: {},
  simulatorQuestions: defaultSimulatorQuestions,
  simulatorScores: [],
  customReadings: [],
  completedReadings: {},
  productivityData: defaultProductivityData,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('idonet_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Merge saved progress into default modules to ensure new content/readings are always loaded
        const mergedModules = defaultModules.map(defaultMod => {
          const savedMod = parsed.modules?.find((m: Module) => m.id === defaultMod.id);
          if (savedMod) {
            const mergedReadings = defaultMod.readings.map(defaultReading => {
              const savedReading = savedMod.readings?.find((r: Reading) => r.id === defaultReading.id);
              return savedReading ? { ...defaultReading, pages: savedReading.pages, content: savedReading.content } : defaultReading;
            });
            return { ...defaultMod, progress: savedMod.progress, readings: mergedReadings };
          }
          return defaultMod;
        });

        // Ensure new fields exist if loading from older state
        return { 
          ...initialState, 
          ...parsed,
          highlights: parsed.highlights || {},
          modules: mergedModules,
          flashcards: parsed.flashcards || initialState.flashcards,
          completedReadings: parsed.completedReadings || {},
          simulatorQuestions: parsed.simulatorQuestions || defaultSimulatorQuestions,
          productivityData: parsed.productivityData || defaultProductivityData
        };
      } catch (e) {
        console.error('Failed to parse state', e);
      }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('idonet_state', JSON.stringify(state));
  }, [state]);

  const addFocusTime = (seconds: number, type: 'pomodoro' | 'flowtime') => {
    setState(prev => ({
      ...prev,
      focusTime: prev.focusTime + seconds,
      pomodorosCompleted: type === 'pomodoro' ? prev.pomodorosCompleted + 1 : prev.pomodorosCompleted,
      flowtimeSessions: type === 'flowtime' ? prev.flowtimeSessions + 1 : prev.flowtimeSessions,
    }));
  };

  const updateModuleProgress = (moduleId: string, progress: number) => {
    setState(prev => ({
      ...prev,
      modules: prev.modules.map(m => m.id === moduleId ? { ...m, progress } : m)
    }));
  };

  const toggleReadingCompletion = (moduleId: string, readingId: string) => {
    setState(prev => {
      const moduleReadings = prev.completedReadings[moduleId] || [];
      const isCompleted = moduleReadings.includes(readingId);
      
      const newModuleReadings = isCompleted 
        ? moduleReadings.filter(id => id !== readingId)
        : [...moduleReadings, readingId];

      const newCompletedReadings = {
        ...prev.completedReadings,
        [moduleId]: newModuleReadings
      };

      // Recalculate module progress
      const targetModule = prev.modules.find(m => m.id === moduleId);
      const totalReadings = targetModule ? targetModule.readings.length : 1;
      const newProgress = Math.round((newModuleReadings.length / totalReadings) * 100);

      return {
        ...prev,
        completedReadings: newCompletedReadings,
        modules: prev.modules.map(m => m.id === moduleId ? { ...m, progress: newProgress } : m)
      };
    });
  };

  const addSimulatorQuestion = (question: Question) => {
    setState(prev => ({
      ...prev,
      simulatorQuestions: [...prev.simulatorQuestions, question]
    }));
  };

  const deleteSimulatorQuestion = (questionId: string) => {
    setState(prev => ({
      ...prev,
      simulatorQuestions: prev.simulatorQuestions.filter(q => q.id !== questionId)
    }));
  };

  const updateSimulatorQuestion = (questionId: string, updatedQuestion: Question) => {
    setState(prev => ({
      ...prev,
      simulatorQuestions: prev.simulatorQuestions.map(q => 
        q.id === questionId ? updatedQuestion : q
      )
    }));
  };

  const deleteFlashcard = (moduleId: string, flashcardId: string) => {
    setState(prev => ({
      ...prev,
      flashcards: {
        ...prev.flashcards,
        [moduleId]: (prev.flashcards[moduleId] || []).filter(f => f.id !== flashcardId)
      }
    }));
  };

  const updateFlashcard = (moduleId: string, flashcardId: string, front: string, back: string) => {
    setState(prev => ({
      ...prev,
      flashcards: {
        ...prev.flashcards,
        [moduleId]: (prev.flashcards[moduleId] || []).map(f =>
          f.id === flashcardId ? { ...f, front, back } : f
        )
      }
    }));
  };

  const addSimulatorScore = (score: number) => {
    setState(prev => ({
      ...prev,
      simulatorScores: [...prev.simulatorScores, score]
    }));
  };

  const addCustomReading = (reading: CustomReading) => {
    setState(prev => ({
      ...prev,
      customReadings: [...prev.customReadings, reading]
    }));
  };

  const addHighlightAndFlashcard = (moduleId: string, readingId: string, text: string, question: string) => {
    setState(prev => {
      const readingHighlights = prev.highlights[readingId] || [];
      const moduleFlashcards = prev.flashcards[moduleId] || [];
      return {
        ...prev,
        highlights: {
          ...prev.highlights,
          [readingId]: [...readingHighlights, text]
        },
        flashcards: {
          ...prev.flashcards,
          [moduleId]: [
            ...moduleFlashcards,
            { id: `f_${Date.now()}`, front: question, back: text }
          ]
        }
      };
    });
  };

  const updateReadingPages = (moduleId: string, readingId: string, pages: string[]) => {
    setState(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id !== moduleId) return m;
        return {
          ...m,
          readings: m.readings.map(r => {
            if (r.id !== readingId) return r;
            return {
              ...r,
              pages,
              content: pages[0] || r.content // Update the main content to the first page
            };
          })
        };
      })
    }));
  };

  const addModule = (title: string, description: string) => {
    setState(prev => ({
      ...prev,
      modules: [...prev.modules, {
        id: `m_${Date.now()}`,
        title,
        description,
        progress: 0,
        readings: []
      }]
    }));
  };

  const updateModule = (moduleId: string, title: string, description: string) => {
    setState(prev => ({
      ...prev,
      modules: prev.modules.map(m => m.id === moduleId ? { ...m, title, description } : m)
    }));
  };

  const deleteModule = (moduleId: string) => {
    setState(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.id !== moduleId)
    }));
  };

  const addReading = (moduleId: string, title: string) => {
    setState(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id !== moduleId) return m;
        return {
          ...m,
          readings: [...m.readings, {
            id: `r_${Date.now()}`,
            title,
            content: '',
            pages: []
          }]
        };
      })
    }));
  };

  const updateReadingTitle = (moduleId: string, readingId: string, title: string) => {
    setState(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id !== moduleId) return m;
        return {
          ...m,
          readings: m.readings.map(r => r.id === readingId ? { ...r, title } : r)
        };
      })
    }));
  };

  const deleteReading = (moduleId: string, readingId: string) => {
    setState(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id !== moduleId) return m;
        return {
          ...m,
          readings: m.readings.filter(r => r.id !== readingId)
        };
      })
    }));
  };

  const resetUserProgress = () => {
    setState(prev => ({
      ...prev,
      focusTime: 0,
      pomodorosCompleted: 0,
      flowtimeSessions: 0,
      simulatorScores: [],
      completedReadings: {},
      modules: prev.modules.map(m => ({ ...m, progress: 0 }))
    }));
  };

  const updateProductivityData = (data: ProductivityData[]) => {
    setState(prev => ({
      ...prev,
      productivityData: data
    }));
  };

  return (
    <AppContext.Provider value={{ state, addFocusTime, updateModuleProgress, addSimulatorScore, addCustomReading, addHighlightAndFlashcard, updateReadingPages, toggleReadingCompletion, addSimulatorQuestion, deleteSimulatorQuestion, updateSimulatorQuestion, deleteFlashcard, updateFlashcard, addModule, updateModule, deleteModule, addReading, updateReadingTitle, deleteReading, resetUserProgress, updateProductivityData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
