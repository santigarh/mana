import type { Pasaje } from './types'

// ═══════════════════════════════════════════════════════════════
//  BANCO DE PASAJES — 66 versículos en 6 categorías
// ═══════════════════════════════════════════════════════════════

export const PASAJES: Pasaje[] = [
  // ── IDENTIDAD EN CRISTO (11) ─────────────────────────────────
  {
    id: 'id-01',
    referencia: 'Gálatas 2:20',
    texto: 'Con Cristo estoy juntamente crucificado, y ya no vivo yo, mas vive Cristo en mí; y lo que ahora vivo en la carne, lo vivo en la fe del Hijo de Dios, el cual me amó y se entregó a sí mismo por mí.',
    categoria: 'identidad',
  },
  {
    id: 'id-02',
    referencia: '2 Corintios 5:17',
    texto: 'De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.',
    categoria: 'identidad',
  },
  {
    id: 'id-03',
    referencia: 'Juan 1:12',
    texto: 'Mas a todos los que le recibieron, a los que creen en su nombre, les dio potestad de ser hechos hijos de Dios.',
    categoria: 'identidad',
  },
  {
    id: 'id-04',
    referencia: 'Romanos 8:16-17',
    texto: 'El Espíritu mismo da testimonio a nuestro espíritu, de que somos hijos de Dios. Y si hijos, también herederos; herederos de Dios y coherederos con Cristo.',
    categoria: 'identidad',
  },
  {
    id: 'id-05',
    referencia: 'Efesios 1:4-5',
    texto: 'Según nos escogió en él antes de la fundación del mundo, para que fuésemos santos y sin mancha delante de él, en amor habiéndonos predestinado para ser adoptados hijos suyos por medio de Jesucristo.',
    categoria: 'identidad',
  },
  {
    id: 'id-06',
    referencia: '1 Pedro 2:9',
    texto: 'Mas vosotros sois linaje escogido, real sacerdocio, nación santa, pueblo adquirido por Dios, para que anunciéis las virtudes de aquel que os llamó de las tinieblas a su luz admirable.',
    categoria: 'identidad',
  },
  {
    id: 'id-07',
    referencia: 'Colosenses 3:3',
    texto: 'Porque habéis muerto, y vuestra vida está escondida con Cristo en Dios.',
    categoria: 'identidad',
  },
  {
    id: 'id-08',
    referencia: 'Efesios 2:10',
    texto: 'Porque somos hechura suya, creados en Cristo Jesús para buenas obras, las cuales Dios preparó de antemano para que anduviésemos en ellas.',
    categoria: 'identidad',
  },
  {
    id: 'id-09',
    referencia: 'Romanos 8:1',
    texto: 'Ahora, pues, ninguna condenación hay para los que están en Cristo Jesús, los que no andan conforme a la carne, sino conforme al Espíritu.',
    categoria: 'identidad',
  },
  {
    id: 'id-10',
    referencia: 'Salmos 139:14',
    texto: 'Te alabaré; porque formidables, maravillosas son tus obras; estoy maravillado, y mi alma lo sabe muy bien.',
    categoria: 'identidad',
  },
  {
    id: 'id-11',
    referencia: 'Jeremías 1:5',
    texto: 'Antes que te formase en el vientre te conocí, y antes que nacieses te santifiqué, te di por profeta a las naciones.',
    categoria: 'identidad',
  },

  // ── FE Y CONFIANZA (11) ──────────────────────────────────────
  {
    id: 'fe-01',
    referencia: 'Proverbios 3:5-6',
    texto: 'Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas.',
    categoria: 'fe',
  },
  {
    id: 'fe-02',
    referencia: 'Hebreos 11:1',
    texto: 'Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve.',
    categoria: 'fe',
  },
  {
    id: 'fe-03',
    referencia: 'Marcos 9:23',
    texto: 'Jesús le dijo: Si puedes creer, al que cree todo le es posible.',
    categoria: 'fe',
  },
  {
    id: 'fe-04',
    referencia: 'Filipenses 4:13',
    texto: 'Todo lo puedo en Cristo que me fortalece.',
    categoria: 'fe',
  },
  {
    id: 'fe-05',
    referencia: 'Isaías 41:10',
    texto: 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.',
    categoria: 'fe',
  },
  {
    id: 'fe-06',
    referencia: 'Salmos 46:1',
    texto: 'Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.',
    categoria: 'fe',
  },
  {
    id: 'fe-07',
    referencia: 'Mateo 17:20',
    texto: 'Si tuviereis fe como un grano de mostaza, diréis a este monte: Pásate de aquí allá, y se pasará; y nada os será imposible.',
    categoria: 'fe',
  },
  {
    id: 'fe-08',
    referencia: 'Romanos 10:17',
    texto: 'Así que la fe es por el oír, y el oír, por la palabra de Dios.',
    categoria: 'fe',
  },
  {
    id: 'fe-09',
    referencia: 'Números 23:19',
    texto: 'Dios no es hombre, para que mienta, ni hijo de hombre para que se arrepienta. ¿Lo dijo, y no lo hará? ¿Habló, y no lo ejecutará?',
    categoria: 'fe',
  },
  {
    id: 'fe-10',
    referencia: 'Salmos 37:4',
    texto: 'Deléitate asimismo en Jehová, y él te concederá las peticiones de tu corazón.',
    categoria: 'fe',
  },
  {
    id: 'fe-11',
    referencia: 'Josué 1:9',
    texto: 'Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.',
    categoria: 'fe',
  },

  // ── GRACIA Y MISERICORDIA (11) ───────────────────────────────
  {
    id: 'gr-01',
    referencia: 'Efesios 2:8-9',
    texto: 'Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios; no por obras, para que nadie se gloríe.',
    categoria: 'gracia',
  },
  {
    id: 'gr-02',
    referencia: 'Lamentaciones 3:22-23',
    texto: 'Por la misericordia de Jehová no hemos sido consumidos, porque nunca decayeron sus misericordias. Nuevas son cada mañana; grande es tu fidelidad.',
    categoria: 'gracia',
  },
  {
    id: 'gr-03',
    referencia: 'Romanos 5:8',
    texto: 'Mas Dios muestra su amor para con nosotros, en que siendo aún pecadores, Cristo murió por nosotros.',
    categoria: 'gracia',
  },
  {
    id: 'gr-04',
    referencia: '1 Juan 1:9',
    texto: 'Si confesamos nuestros pecados, él es fiel y justo para perdonar nuestros pecados, y limpiarnos de toda maldad.',
    categoria: 'gracia',
  },
  {
    id: 'gr-05',
    referencia: 'Salmos 103:10-11',
    texto: 'No ha hecho con nosotros conforme a nuestras iniquidades, ni nos ha pagado conforme a nuestros pecados. Porque como la altura de los cielos sobre la tierra, engrandeció su misericordia sobre los que le temen.',
    categoria: 'gracia',
  },
  {
    id: 'gr-06',
    referencia: 'Tito 3:5',
    texto: 'Nos salvó, no por obras de justicia que nosotros hubiéramos hecho, sino por su misericordia, por el lavamiento de la regeneración y por la renovación en el Espíritu Santo.',
    categoria: 'gracia',
  },
  {
    id: 'gr-07',
    referencia: 'Juan 3:16',
    texto: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
    categoria: 'gracia',
  },
  {
    id: 'gr-08',
    referencia: 'Romanos 8:38-39',
    texto: 'Por lo cual estoy seguro de que ni la muerte, ni la vida, ni ángeles, ni principados, ni potestades, ni lo presente, ni lo por venir, ni lo alto, ni lo profundo, ni ninguna otra cosa creada nos podrá separar del amor de Dios, que es en Cristo Jesús Señor nuestro.',
    categoria: 'gracia',
  },
  {
    id: 'gr-09',
    referencia: 'Miqueas 7:18',
    texto: '¿Qué Dios como tú, que perdona la maldad, y olvida el pecado del remanente de su heredad? No retuvo para siempre su enojo, porque se deleita en misericordia.',
    categoria: 'gracia',
  },
  {
    id: 'gr-10',
    referencia: 'Hebreos 4:16',
    texto: 'Acerquémonos, pues, confiadamente al trono de la gracia, para alcanzar misericordia y hallar gracia para el oportuno socorro.',
    categoria: 'gracia',
  },
  {
    id: 'gr-11',
    referencia: '2 Corintios 12:9',
    texto: 'Y me ha dicho: Bástate mi gracia; porque mi poder se perfecciona en la debilidad. Por tanto, de buena gana me gloriaré más bien en mis debilidades, para que repose sobre mí el poder de Cristo.',
    categoria: 'gracia',
  },

  // ── SUFRIMIENTO Y ESPERANZA (11) ────────────────────────────
  {
    id: 'su-01',
    referencia: 'Romanos 8:28',
    texto: 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.',
    categoria: 'sufrimiento',
  },
  {
    id: 'su-02',
    referencia: 'Santiago 1:2-4',
    texto: 'Hermanos míos, tened por sumo gozo cuando os halléis en diversas pruebas, sabiendo que la prueba de vuestra fe produce paciencia. Mas tenga la paciencia su obra completa, para que seáis perfectos y cabales, sin que os falte cosa alguna.',
    categoria: 'sufrimiento',
  },
  {
    id: 'su-03',
    referencia: '2 Corintios 4:17',
    texto: 'Porque esta leve tribulación momentánea produce en nosotros un cada vez más excelente y eterno peso de gloria.',
    categoria: 'sufrimiento',
  },
  {
    id: 'su-04',
    referencia: 'Salmos 34:18',
    texto: 'Cercano está Jehová a los quebrantados de corazón; y salva a los contritos de espíritu.',
    categoria: 'sufrimiento',
  },
  {
    id: 'su-05',
    referencia: 'Romanos 5:3-4',
    texto: 'Y no sólo esto, sino que también nos gloriamos en las tribulaciones, sabiendo que la tribulación produce paciencia; y la paciencia, prueba; y la prueba, esperanza.',
    categoria: 'sufrimiento',
  },
  {
    id: 'su-06',
    referencia: 'Apocalipsis 21:4',
    texto: 'Enjugará Dios toda lágrima de los ojos de ellos; y ya no habrá muerte, ni habrá más llanto, ni clamor, ni dolor; porque las primeras cosas pasaron.',
    categoria: 'sufrimiento',
  },
  {
    id: 'su-07',
    referencia: 'Isaías 43:2',
    texto: 'Cuando pases por las aguas, yo estaré contigo; y si por los ríos, no te anegarán. Cuando pases por el fuego, no te quemarás, ni la llama arderá en ti.',
    categoria: 'sufrimiento',
  },
  {
    id: 'su-08',
    referencia: 'Juan 16:33',
    texto: 'En el mundo tendréis aflicción; pero confiad, yo he vencido al mundo.',
    categoria: 'sufrimiento',
  },
  {
    id: 'su-09',
    referencia: '1 Pedro 5:10',
    texto: 'Mas el Dios de toda gracia, que nos llamó a su gloria eterna en Jesucristo, después que hayáis padecido un poco de tiempo, él mismo os perfeccione, afirme, fortalezca y establezca.',
    categoria: 'sufrimiento',
  },
  {
    id: 'su-10',
    referencia: 'Filipenses 4:7',
    texto: 'Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.',
    categoria: 'sufrimiento',
  },
  {
    id: 'su-11',
    referencia: 'Jeremías 29:11',
    texto: 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.',
    categoria: 'sufrimiento',
  },

  // ── ORACIÓN (11) ────────────────────────────────────────────
  {
    id: 'or-01',
    referencia: 'Mateo 6:9-10',
    texto: 'Vosotros, pues, oraréis así: Padre nuestro que estás en los cielos, santificado sea tu nombre. Venga tu reino. Hágase tu voluntad, como en el cielo, así también en la tierra.',
    categoria: 'oracion',
  },
  {
    id: 'or-02',
    referencia: 'Filipenses 4:6',
    texto: 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias.',
    categoria: 'oracion',
  },
  {
    id: 'or-03',
    referencia: '1 Tesalonicenses 5:17',
    texto: 'Orad sin cesar.',
    categoria: 'oracion',
  },
  {
    id: 'or-04',
    referencia: 'Mateo 7:7-8',
    texto: 'Pedid, y se os dará; buscad, y hallaréis; llamad, y se os abrirá. Porque todo aquel que pide, recibe; y el que busca, halla; y al que llama, se le abrirá.',
    categoria: 'oracion',
  },
  {
    id: 'or-05',
    referencia: 'Juan 15:7',
    texto: 'Si permanecéis en mí, y mis palabras permanecen en vosotros, pedid todo lo que queréis, y os será hecho.',
    categoria: 'oracion',
  },
  {
    id: 'or-06',
    referencia: 'Salmos 145:18',
    texto: 'Cercano está Jehová a todos los que le invocan, a todos los que le invocan de veras.',
    categoria: 'oracion',
  },
  {
    id: 'or-07',
    referencia: 'Romanos 8:26',
    texto: 'Y de igual manera el Espíritu nos ayuda en nuestra debilidad; pues qué hemos de pedir como conviene, no lo sabemos, pero el Espíritu mismo intercede por nosotros con gemidos indecibles.',
    categoria: 'oracion',
  },
  {
    id: 'or-08',
    referencia: 'Jeremías 33:3',
    texto: 'Clama a mí, y yo te responderé, y te enseñaré cosas grandes y ocultas que tú no conoces.',
    categoria: 'oracion',
  },
  {
    id: 'or-09',
    referencia: '1 Juan 5:14',
    texto: 'Y esta es la confianza que tenemos en él, que si pedimos alguna cosa conforme a su voluntad, él nos oye.',
    categoria: 'oracion',
  },
  {
    id: 'or-10',
    referencia: 'Salmos 66:19-20',
    texto: 'Mas ciertamente me escuchó Dios; atendió a la voz de mi súplica. Bendito sea Dios, que no echó de sí mi oración, ni de mí su misericordia.',
    categoria: 'oracion',
  },
  {
    id: 'or-11',
    referencia: 'Santiago 5:16',
    texto: 'La oración eficaz del justo puede mucho.',
    categoria: 'oracion',
  },

  // ── SERVICIO Y MISIÓN (11) ───────────────────────────────────
  {
    id: 'se-01',
    referencia: 'Mateo 28:19-20',
    texto: 'Por tanto, id, y haced discípulos a todas las naciones, bautizándolos en el nombre del Padre, y del Hijo, y del Espíritu Santo; enseñándoles que guarden todas las cosas que os he mandado.',
    categoria: 'servicio',
  },
  {
    id: 'se-02',
    referencia: 'Marcos 10:45',
    texto: 'Porque el Hijo del Hombre no vino para ser servido, sino para servir, y para dar su vida en rescate por muchos.',
    categoria: 'servicio',
  },
  {
    id: 'se-03',
    referencia: 'Gálatas 5:13',
    texto: 'Porque vosotros, hermanos, a libertad fuisteis llamados; solamente que no uséis la libertad como ocasión para la carne, sino servíos por amor los unos a los otros.',
    categoria: 'servicio',
  },
  {
    id: 'se-04',
    referencia: 'Mateo 5:16',
    texto: 'Así alumbre vuestra luz delante de los hombres, para que vean vuestras buenas obras, y glorifiquen a vuestro Padre que está en los cielos.',
    categoria: 'servicio',
  },
  {
    id: 'se-05',
    referencia: '1 Corintios 10:31',
    texto: 'Si, pues, coméis o bebéis, o hacéis otra cosa, hacedlo todo para la gloria de Dios.',
    categoria: 'servicio',
  },
  {
    id: 'se-06',
    referencia: 'Romanos 12:1',
    texto: 'Así que, hermanos, os ruego por las misericordias de Dios, que presentéis vuestros cuerpos en sacrificio vivo, santo, agradable a Dios, que es vuestro culto racional.',
    categoria: 'servicio',
  },
  {
    id: 'se-07',
    referencia: 'Proverbios 11:25',
    texto: 'El alma generosa será prosperada; y el que saciare, él también será saciado.',
    categoria: 'servicio',
  },
  {
    id: 'se-08',
    referencia: 'Lucas 6:38',
    texto: 'Dad, y se os dará; medida buena, apretada, remecida y rebosando darán en vuestro regazo; porque con la misma medida que medís, os volverán a medir.',
    categoria: 'servicio',
  },
  {
    id: 'se-09',
    referencia: 'Hechos 1:8',
    texto: 'Pero recibiréis poder, cuando haya venido sobre vosotros el Espíritu Santo, y me seréis testigos en Jerusalén, en toda Judea, en Samaria, y hasta lo último de la tierra.',
    categoria: 'servicio',
  },
  {
    id: 'se-10',
    referencia: 'Colosenses 3:23',
    texto: 'Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres.',
    categoria: 'servicio',
  },
  {
    id: 'se-11',
    referencia: 'Mateo 25:40',
    texto: 'Y respondiendo el Rey, les dirá: De cierto os digo que en cuanto lo hicisteis a uno de estos mis hermanos más pequeños, a mí lo hicisteis.',
    categoria: 'servicio',
  },
]

export const PASAJES_POR_CATEGORIA = PASAJES.reduce(
  (acc, pasaje) => {
    if (!acc[pasaje.categoria]) acc[pasaje.categoria] = []
    acc[pasaje.categoria].push(pasaje)
    return acc
  },
  {} as Record<string, Pasaje[]>,
)
