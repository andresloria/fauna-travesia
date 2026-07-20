// ============================================================
// fichas.js — INFORMACIÓN OFICIAL de cada especie del juego.
// Al liberar/rescatar un animal, el guía cuenta su ficha real: nombre
// científico, dónde vive, qué come, un dato y su situación de conservación.
// Es la parte educativa del juego: los datos son reales.
//
//   sci   nombre científico      hab  dónde vive en Costa Rica
//   come  alimentación           dato dato curioso (lo memorable)
//   cons  situación de conservación (en términos generales)
// ============================================================

export const FICHAS = {
  // ---------------- mamíferos ----------------
  perezoso:{sci:'Bradypus variegatus',hab:'bosques húmedos de ambas vertientes',come:'hojas, brotes y algunos frutos',dato:'Baja al suelo apenas una vez por semana, solo a hacer sus necesidades. En su pelo crecen algas que lo camuflan de verde.',cons:'Preocupación menor, pero lo atropellan y electrocutan mucho.'},
  perezoso_dos:{sci:'Choloepus hoffmanni',hab:'bosques húmedos, hasta 3.000 m',come:'hojas, frutos y a veces insectos',dato:'Es nocturno, a diferencia de su primo de tres dedos. Tiene dos dedos en las manos y tres en las patas.',cons:'Preocupación menor.'},
  mono_congo:{sci:'Alouatta palliata',hab:'bosques de todo el país',come:'sobre todo hojas, y frutos',dato:'Su aullido se escucha hasta 3 km: un hueso del cuello (el hioides) le funciona como caja de resonancia.',cons:'Vulnerable por la pérdida y fragmentación del bosque.'},
  monocara:{sci:'Cebus imitator',hab:'bosques secos y húmedos',come:'frutos, insectos, huevos, cangrejos',dato:'Usa herramientas: golpea conchas con piedras. Es de los primates más inteligentes de América.',cons:'Preocupación menor, pero sufre por darle comida la gente.'},
  mono_arana:{sci:'Ateles geoffroyi',hab:'bosques maduros y altos',come:'frutos maduros, sobre todo',dato:'Su cola es una quinta mano: agarra ramas y hasta recoge cosas. Es clave dispersando semillas grandes.',cons:'En peligro. Necesita bosque continuo y alto.'},
  mono_titi:{sci:'Saimiri oerstedii',hab:'solo el Pacífico sur (Manuel Antonio, Osa)',come:'insectos y frutos pequeños',dato:'Es el mono más pequeño de Costa Rica y solo vive aquí y en un pedacito de Panamá.',cons:'Vulnerable, con distribución muy reducida.'},
  jaguar:{sci:'Panthera onca',hab:'bosques de Corcovado, Tortuguero y Talamanca',come:'saínos, venados, tortugas, caimanes',dato:'Tiene la mordida más fuerte de los felinos según su tamaño: mata perforando el cráneo, no ahogando.',cons:'Casi amenazado; en Costa Rica quedan poblaciones pequeñas y aisladas.'},
  puma:{sci:'Puma concolor',hab:'de la costa a los páramos de Talamanca',come:'venados, saínos, guatusas',dato:'No ruge: ronronea y chilla. Es el felino con más nombres en América (puma, león de montaña, cougar).',cons:'Preocupación menor global, pero presionado por la cacería.'},
  manigordo:{sci:'Leopardus pardalis',hab:'bosques de todo el país',come:'roedores, aves, reptiles',dato:'En Costa Rica se le dice "manigordo" por sus patas notablemente grandes para su tamaño.',cons:'Preocupación menor, pero afectado por el tráfico de pieles y mascotas.'},
  caucel:{sci:'Leopardus wiedii',hab:'bosques densos, muy arborícola',come:'aves, roedores, monos pequeños',dato:'Gira los tobillos 180°: puede bajar de un tronco de cabeza, como una ardilla.',cons:'Casi amenazado.'},
  leon_brenero:{sci:'Herpailurus yagouaroundi',hab:'bordes de bosque y matorrales',come:'roedores, aves, reptiles',dato:'No parece gato: cuerpo alargado y patas cortas, como una nutria. Además es de los pocos felinos diurnos.',cons:'Preocupación menor, poco visto.'},
  tigrillo:{sci:'Leopardus tigrinus',hab:'montañas altas de Talamanca',come:'roedores y aves pequeñas',dato:'Es el felino más pequeño del país: pesa menos que muchos gatos domésticos.',cons:'Vulnerable; en Costa Rica es rarísimo.'},
  danta:{sci:'Tapirus bairdii',hab:'Corcovado, Talamanca, Tortuguero',come:'hojas, frutos y plantas acuáticas',dato:'Es el mamífero terrestre más grande de Costa Rica (hasta 300 kg) y "el jardinero del bosque": dispersa semillas enormes que nadie más traga.',cons:'En peligro. Es un símbolo de la conservación tica.'},
  saino:{sci:'Pecari tajacu',hab:'bosques secos y húmedos',come:'frutos, raíces, tubérculos',dato:'Tiene una glándula olorosa en el lomo con la que el grupo se marca: por eso huelen tan fuerte.',cons:'Preocupación menor.'},
  chancho_monte:{sci:'Tayassu pecari',hab:'bosques grandes y bien conservados',come:'frutos duros y palmas',dato:'Anda en manadas que pueden pasar de cien. Chasquean los colmillos en coro cuando se sienten amenazados.',cons:'En peligro; en Costa Rica desapareció de gran parte de su rango.'},
  venado:{sci:'Odocoileus virginianus',hab:'sabanas de Guanacaste y bosques abiertos',come:'hojas, brotes y frutos',dato:'Es el símbolo nacional de la fauna silvestre de Costa Rica desde 1995.',cons:'Preocupación menor.'},
  cabro_monte:{sci:'Mazama temama',hab:'bosques de montaña',come:'hojas, hongos y frutos caídos',dato:'Es solitario y silencioso; se le ve mucho menos que al venado cola blanca.',cons:'Datos insuficientes, pero afectado por la cacería.'},
  pizote:{sci:'Nasua narica',hab:'bosques de todo el país',come:'frutos, insectos, lagartijas',dato:'Las hembras y las crías andan en bandas ruidosas; los machos adultos van solos.',cons:'Preocupación menor; se acostumbra mal a la comida de la gente.'},
  mapache:{sci:'Procyon lotor',hab:'cerca de ríos, costas y pueblos',come:'de todo: frutos, cangrejos, basura',dato:'Sus manos son tan sensibles que "ve" con ellas: moja la comida para sentirla mejor.',cons:'Preocupación menor.'},
  mapache_cangrejero:{sci:'Procyon cancrivorus',hab:'manglares y ríos de tierras bajas',come:'cangrejos, moluscos, peces',dato:'Se diferencia del mapache común porque tiene el pelo más corto y las patas más largas.',cons:'Preocupación menor.'},
  martilla:{sci:'Potos flavus',hab:'copas del bosque húmedo',come:'frutos maduros y néctar',dato:'Tiene una lengua larguísima para sacar néctar: poliniza flores de noche. Su cola es prensil.',cons:'Preocupación menor, pero muy traficada como mascota.'},
  olingo:{sci:'Bassaricyon gabbii',hab:'bosques nubosos y húmedos',come:'frutos e insectos',dato:'Se confunde con la martilla, pero es más esbelto y su cola NO es prensil.',cons:'Preocupación menor.'},
  tolomuco:{sci:'Eira barbara',hab:'bosques de todo el país',come:'frutos, miel, roedores',dato:'Se le ha documentado cortar plátanos verdes, esconderlos y volver cuando ya maduraron: planifica.',cons:'Preocupación menor.'},
  grison:{sci:'Galictis vittata',hab:'bosques y sabanas de tierras bajas',come:'roedores, aves, reptiles',dato:'Parece un tejón chiquito con una franja clara en la frente. Es raro verlo.',cons:'Preocupación menor, poco conocido.'},
  nutria:{sci:'Lontra longicaudis',hab:'ríos y quebradas limpias',come:'peces y crustáceos',dato:'Donde hay nutria, el río está sano: es una especie indicadora de agua limpia.',cons:'Casi amenazada por la contaminación de ríos.'},
  comadreja:{sci:'Mustela frenata',hab:'zonas altas y bordes de bosque',come:'ratones, aves, huevos',dato:'Tiene un antifaz claro en la cara y es capaz de cazar presas más grandes que ella.',cons:'Preocupación menor.'},
  zorro_pelon:{sci:'Didelphis marsupialis',hab:'de bosques a patios de casa',come:'de todo: frutas, insectos, carroña',dato:'Es un marsupial: cría a sus hijos en una bolsa. Cuando se asusta, se hace el muerto de verdad (no lo decide).',cons:'Preocupación menor; muy útil comiendo garrapatas.'},
  oso_hormiguero:{sci:'Tamandua mexicana',hab:'bosques y bordes de todo el país',come:'hormigas y termitas',dato:'No tiene ni un diente: usa una lengua de casi 40 cm y garras para abrir nidos.',cons:'Preocupación menor.'},
  serafin:{sci:'Cyclopes didactylus',hab:'bosques húmedos, entre bejucos',come:'hormigas',dato:'Es el oso hormiguero más pequeño del mundo: cabe en una mano.',cons:'Preocupación menor, pero rarísimo de ver.'},
  armadillo:{sci:'Dasypus novemcinctus',hab:'bosques y potreros',come:'insectos, larvas, raíces',dato:'Siempre pare cuatro crías idénticas: son cuatrillizos del mismo óvulo.',cons:'Preocupación menor.'},
  tepezcuintle:{sci:'Cuniculus paca',hab:'cerca de ríos en el bosque',come:'frutos caídos y semillas',dato:'Es el roedor más perseguido por su carne, y a la vez un gran sembrador de árboles.',cons:'Preocupación menor, pero muy cazado.'},
  guatusa:{sci:'Dasyprocta punctata',hab:'bosques de todo el país',come:'semillas y frutos duros',dato:'Entierra semillas para después y olvida muchas: gracias a eso nacen árboles nuevos.',cons:'Preocupación menor.'},
  ardilla:{sci:'Sciurus variegatoides',hab:'bosques, parques y jardines',come:'semillas, frutos, flores',dato:'Cada ardilla puede enterrar cientos de semillas por temporada.',cons:'Preocupación menor.'},
  puercoespin:{sci:'Coendou mexicanus',hab:'bosques húmedos, en los árboles',come:'hojas, frutos y brotes',dato:'Tiene cola prensil y púas; es nocturno y muy lento.',cons:'Preocupación menor.'},
  murcielago:{sci:'(más de 110 especies en el país)',hab:'de cuevas a ciudades',come:'insectos, frutas, néctar o sangre según la especie',dato:'Más de la mitad de los mamíferos de Costa Rica son murciélagos. Polinizan y controlan plagas; solo 3 especies toman sangre.',cons:'Varias en riesgo por destrucción de refugios.'},
  coyote:{sci:'Canis latrans',hab:'sabanas, potreros y bordes',come:'roedores, frutos, carroña',dato:'Se adaptó tanto al ser humano que amplió su territorio en vez de reducirlo.',cons:'Preocupación menor.'},
  zorro_gris:{sci:'Urocyon cinereoargenteus',hab:'bosque seco y matorral',come:'roedores, frutos, insectos',dato:'Es el único cánido del mundo que trepa árboles con soltura.',cons:'Preocupación menor.'},
  manati:{sci:'Trichechus manatus',hab:'canales y lagunas del Caribe (Tortuguero)',come:'plantas acuáticas',dato:'Come hasta 50 kg de plantas al día. Las hélices de las lanchas son su mayor amenaza.',cons:'En peligro. En Costa Rica quedan muy pocos.'},
  delfin:{sci:'Tursiops truncatus y otras',hab:'ambas costas, sobre todo el Pacífico',come:'peces y calamares',dato:'Ve con sonido: emite chasquidos y arma una imagen con el eco.',cons:'Preocupación menor; sufre por redes y turismo mal manejado.'},
  ballena:{sci:'Megaptera novaeangliae',hab:'Pacífico (Marino Ballena, Osa)',come:'krill y peces pequeños',dato:'Costa Rica es el único lugar del mundo donde llegan jorobadas del hemisferio norte Y del sur, en temporadas distintas.',cons:'Preocupación menor tras su recuperación, aún vulnerable a choques con barcos.'},

  // ---------------- aves ----------------
  yiguirro:{sci:'Turdus grayi',hab:'jardines, cafetales y bosques',come:'frutos, lombrices, insectos',dato:'Es el ave nacional desde 1977. Su canto se intensifica justo antes de las lluvias: por eso dicen que "llama el agua".',cons:'Preocupación menor.'},
  quetzal:{sci:'Pharomachrus mocinno',hab:'bosques nubosos (Monteverde, Los Quetzales)',come:'aguacatillos, sobre todo',cons:'Casi amenazado; depende del bosque nuboso.',dato:'Para mayas y aztecas era sagrado: sus plumas valían más que el oro y estaba prohibido matarlo.'},
  lapa:{sci:'Ara macao',hab:'Pacífico central y sur (Carara, Osa)',come:'semillas, frutos, almendras de playa',dato:'Forma pareja de por vida y vuela siempre con su compañera. Puede vivir más de 50 años.',cons:'Preocupación menor global; en Costa Rica se recuperó gracias a proyectos de liberación.'},
  lapa_verde:{sci:'Ara ambiguus',hab:'Caribe norte (Sarapiquí, Tortuguero)',come:'semillas del almendro de montaña',dato:'Su vida depende de un solo árbol: el almendro de montaña. Sin ese árbol, no hay lapa verde.',cons:'En peligro crítico. Quedan pocos cientos en el país.'},
  tucan:{sci:'Ramphastos sulfuratus',hab:'bosques húmedos del Caribe y norte',come:'frutos, huevos y pichones',dato:'Su pico enorme es casi hueco y liviano; además le sirve para botar calor, como un radiador.',cons:'Casi amenazado por el tráfico de mascotas.'},
  tucan_castano:{sci:'Ramphastos ambiguus',hab:'bosques húmedos',come:'frutos y presas pequeñas',dato:'Es el tucán más grande del país; su llamado suena como un ladrido lejano.',cons:'Casi amenazado.'},
  cusingo:{sci:'Pteroglossus frantzii',hab:'Pacífico sur',come:'frutos e insectos',dato:'Duerme en huecos de árbol con toda la familia, doblando la cola sobre el lomo para que quepan.',cons:'Preocupación menor, pero de rango pequeño.'},
  tucancillo:{sci:'Aulacorhynchus prasinus',hab:'bosques de montaña',come:'frutos pequeños',dato:'Es el tucán más chiquito y verde: se camufla perfecto entre las hojas.',cons:'Preocupación menor.'},
  pajaro_campana:{sci:'Procnias tricarunculatus',hab:'Monteverde y montañas del Caribe',come:'frutos (aguacatillos)',dato:'Tiene uno de los cantos más fuertes del mundo animal: un "bong" metálico que se oye a kilómetros. Migra de altura según la fruta.',cons:'Vulnerable.'},
  oropendola:{sci:'Psarocolius montezuma',hab:'tierras bajas del Caribe',come:'frutos e insectos',dato:'Hace nidos colgantes de más de un metro, en colonias que parecen bolsas guindando del árbol.',cons:'Preocupación menor.'},
  colibri_fuego:{sci:'Panterpe insignis',hab:'solo montañas altas de Talamanca',come:'néctar e insectos diminutos',dato:'Solo existe en Costa Rica y el oeste de Panamá. Su garganta brilla naranja como brasa.',cons:'Preocupación menor, pero de rango muy pequeño.'},
  colibri_talamanca:{sci:'Eugenes spectabilis',hab:'páramos y bosques altos de Talamanca',come:'néctar e insectos',dato:'Vive tan alto y frío que de noche entra en letargo: baja su temperatura para no gastar energía.',cons:'Preocupación menor, endémico regional.'},
  ermitano:{sci:'Phaethornis guy',hab:'sotobosque húmedo',come:'néctar de heliconias',dato:'No defiende flores: hace rutas largas visitando plantas una por una, como un repartidor.',cons:'Preocupación menor.'},
  jacamar:{sci:'Galbula ruficauda',hab:'bordes de bosque',come:'mariposas y libélulas al vuelo',dato:'Caza mariposas en el aire y les quita las alas golpeándolas contra la rama antes de comérselas.',cons:'Preocupación menor.'},
  momoto:{sci:'Eumomota superciliosa',hab:'bosque seco de Guanacaste',come:'insectos y frutos',dato:'Mueve su cola en raqueta como un péndulo, aviso de "ya te vi" a los depredadores.',cons:'Preocupación menor.'},
  tangara_azul:{sci:'Thraupis episcopus',hab:'jardines, cafetales, pueblos',come:'frutos y néctar',dato:'Es de las aves más fáciles de ver en Costa Rica: viene a los bananos que la gente cuelga.',cons:'Preocupación menor.'},
  tangara_dorada:{sci:'Tangara icterocephala',hab:'bosques húmedos de media altura',come:'frutos e insectos',dato:'Anda en bandadas mixtas: varias especies distintas viajando juntas para vigilarse entre todas.',cons:'Preocupación menor.'},
  bienteveo:{sci:'Pitangus sulphuratus',hab:'todo el país, incluso ciudades',come:'insectos, peces pequeños, frutos',dato:'Su canto dice su nombre: "bien-te-veo". Es capaz de pescar en charcos.',cons:'Preocupación menor.'},
  garza:{sci:'Ardea alba',hab:'humedales, ríos y potreros',come:'peces, ranas, insectos',dato:'Casi la exterminan hace un siglo por sus plumas para sombreros; se recuperó al prohibirse.',cons:'Preocupación menor.'},
  espatula:{sci:'Platalea ajaja',hab:'manglares y humedales (Palo Verde)',come:'camarones y peces pequeños',dato:'Es rosada por los carotenos de lo que come, igual que los flamencos. Barre el agua con su pico de cuchara.',cons:'Preocupación menor, depende de humedales sanos.'},
  jabiru:{sci:'Jabiru mycteria',hab:'humedales de Guanacaste (Palo Verde)',come:'peces, ranas, culebras',dato:'Es la cigüeña más alta de América: llega a 1,4 m de altura.',cons:'En peligro en Costa Rica; quedan muy pocas parejas.'},
  tantalo:{sci:'Mycteria americana',hab:'humedales y manglares',come:'peces, que detecta al tacto',dato:'Pesca a ciegas: mete el pico abierto al agua y lo cierra por reflejo al sentir el pez.',cons:'Preocupación menor.'},
  ibis:{sci:'Eudocimus albus',hab:'manglares y esteros',come:'cangrejos e invertebrados',dato:'Su pico curvo es un detector: hurga en el lodo sin ver nada.',cons:'Preocupación menor.'},
  pelicano:{sci:'Pelecanus occidentalis',hab:'costas de ambos océanos',come:'peces',dato:'Se lanza en picada desde 20 m; tiene sacos de aire bajo la piel que amortiguan el golpe.',cons:'Preocupación menor.'},
  fragata:{sci:'Fregata magnificens',hab:'costas y islas',come:'peces voladores y comida robada',dato:'Roba comida a otras aves en pleno vuelo. El macho infla una bolsa roja enorme en el cuello para conquistar.',cons:'Preocupación menor.'},
  aguila_harpia:{sci:'Harpia harpyja',hab:'bosques grandes y maduros (Osa, Talamanca)',come:'monos y perezosos',dato:'Sus garras son más grandes que la mano de un adulto: arranca perezosos de las ramas.',cons:'Vulnerable, y prácticamente desaparecida de Costa Rica.'},
  caracara:{sci:'Caracara cheriway',hab:'sabanas y potreros',come:'carroña, insectos, huevos',dato:'Es un halcón que camina: pasa buen rato en el suelo buscando comida.',cons:'Preocupación menor.'},
  zopilote_negro:{sci:'Coragyps atratus',hab:'todo el país',come:'carroña',dato:'Encuentra la comida siguiendo al zopilote cabecirrojo, que sí tiene olfato.',cons:'Preocupación menor.'},
  zopilote_rojo:{sci:'Cathartes aura',hab:'todo el país',come:'carroña',dato:'Es de las poquísimas aves con buen olfato: huele un animal muerto a más de un kilómetro.',cons:'Preocupación menor.'},
  lechuza:{sci:'Tyto alba',hab:'campanarios, graneros y bosques',come:'ratones, sobre todo',dato:'Vuela sin hacer ruido gracias al borde afelpado de sus plumas, y tiene un oído desfasado que ubica presas en la oscuridad total.',cons:'Preocupación menor; gran aliada contra plagas.'},
  carpintero:{sci:'Melanerpes hoffmannii y otros',hab:'bosques, cafetales y jardines',come:'insectos bajo la corteza, frutos',dato:'Golpea hasta 20 veces por segundo; su cráneo y una lengua que le da la vuelta al cerebro amortiguan el impacto.',cons:'Preocupación menor.'},
  saltarin:{sci:'Chiroxiphia linearis',hab:'bosque seco y bordes',come:'frutos pequeños e insectos',dato:'Dos machos bailan coordinados para una hembra, saltando por turnos; su canto suena "to-le-do".',cons:'Preocupación menor.'},
  trogon:{sci:'Trogon spp.',hab:'bosques de todo el país',come:'frutos e insectos',dato:'Se queda inmóvil larguísimo rato; es pariente cercano del quetzal.',cons:'Preocupación menor.'},
  martin_pescador:{sci:'Megaceryle torquata y otros',hab:'ríos, esteros y manglares',come:'peces',dato:'Corrige la refracción del agua: calcula dónde está el pez de verdad, no dónde lo ve.',cons:'Preocupación menor.'},
  anhinga:{sci:'Anhinga anhinga',hab:'ríos lentos y lagunas',come:'peces que ensarta con el pico',dato:'Nada con el cuerpo sumergido y solo el cuello afuera: por eso le dicen "pato aguja" o ave serpiente.',cons:'Preocupación menor.'},
  tinamu:{sci:'Tinamus major',hab:'suelo del bosque húmedo',come:'frutos caídos y semillas',dato:'Pone huevos azul turquesa brillantes, de los más llamativos del mundo. El macho los incuba.',cons:'Casi amenazado por la cacería.'},
  chachalaca:{sci:'Ortalis cinereiceps',hab:'bordes de bosque y charrales',come:'frutos, hojas y flores',dato:'Al amanecer arma un escándalo en coro que se oye por todo el barrio.',cons:'Preocupación menor.'},
  loro:{sci:'Amazona autumnalis',hab:'tierras bajas de ambas vertientes',come:'frutos y semillas',dato:'Duerme en dormideros comunales de cientos de individuos y vuelve al mismo sitio cada tarde.',cons:'Preocupación menor, pero muy traficado como mascota.'},

  // ---------------- anfibios ----------------
  rana_ojos_rojos:{sci:'Agalychnis callidryas',hab:'bosques húmedos del Caribe',come:'insectos',dato:'No es venenosa: sus ojos rojos y costados azules sirven para sobresaltar al depredador un segundo y escapar.',cons:'Preocupación menor; es la cara del turismo tico.'},
  ranadardo:{sci:'Oophaga pumilio',hab:'hojarasca del Caribe',come:'hormigas y ácaros',dato:'La madre carga uno a uno a sus renacuajos a charquitos en bromelias y los alimenta con huevos infértiles.',cons:'Preocupación menor.'},
  rana_verdinegra:{sci:'Dendrobates auratus',hab:'bosques húmedos',come:'hormigas y termitas',dato:'Su veneno viene de lo que come: en cautiverio, sin esas hormigas, deja de ser venenosa.',cons:'Preocupación menor.'},
  rana_cristal:{sci:'Hyalinobatrachium spp.',hab:'quebradas de bosque',come:'insectos pequeños',dato:'Tiene la piel del vientre translúcida: se le ven el corazón y los intestinos.',cons:'Varias especies amenazadas por la pérdida de quebradas.'},
  rana_lechera:{sci:'Trachycephalus typhonius',hab:'bosques y charcos temporales',come:'insectos',dato:'Cuando la agarran suelta un látex blanco pegajoso e irritante.',cons:'Preocupación menor.'},
  rana_tungara:{sci:'Engystomops pustulosus',hab:'charcos de zonas abiertas',come:'insectos pequeños',dato:'Bate un nido de espuma donde pone los huevos, protegidos del sol y los depredadores.',cons:'Preocupación menor.'},
  rana_gladiadora:{sci:'Boana rosenbergi',hab:'quebradas del Pacífico sur',come:'insectos',dato:'El macho tiene un espolón filoso en el pulgar y pelea de verdad por su charco.',cons:'Preocupación menor.'},
  rana_payaso:{sci:'Dendropsophus ebraccatus',hab:'charcos y pantanos',come:'insectos pequeños',dato:'Puede poner huevos en el agua o en hojas, según haya depredadores: casi ninguna rana hace las dos cosas.',cons:'Preocupación menor.'},
  sapo_marino:{sci:'Rhinella marina',hab:'de bosques a ciudades',come:'de todo lo que le quepa',dato:'Sus glándulas del cuello son muy tóxicas para perros. Llevado a Australia, se volvió una plaga famosa.',cons:'Preocupación menor; aquí es nativo.'},
  sapo_dorado:{sci:'Incilius periglenes',hab:'solo el bosque nuboso de Monteverde',come:'insectos pequeños',dato:'Los machos eran de un naranja imposible. Se vio por última vez en 1989 y hoy se considera EXTINTO: es el símbolo mundial de la crisis de los anfibios.',cons:'Extinto. No queda ninguno.'},
  salamandra:{sci:'Bolitoglossa spp.',hab:'bosques nubosos y musgo',come:'insectos diminutos',dato:'No tiene pulmones: respira por la piel, por eso necesita humedad constante.',cons:'Varias especies amenazadas por el cambio climático.'},

  // ---------------- reptiles ----------------
  iguana:{sci:'Iguana iguana',hab:'árboles cerca de ríos y costas',come:'hojas, flores y frutos',dato:'De adulta es casi totalmente herbívora. En el campo le dicen "gallina de palo".',cons:'Preocupación menor, pero cazada por su carne y huevos.'},
  garrobo:{sci:'Ctenosaura similis',hab:'bosque seco de Guanacaste',come:'hojas, frutos, insectos',dato:'Es el lagarto terrestre más rápido registrado: corre a unos 35 km/h.',cons:'Preocupación menor.'},
  basilisco:{sci:'Basiliscus plumifrons',hab:'orillas de ríos del Caribe',come:'insectos y peces pequeños',dato:'Corre sobre el agua en dos patas: por eso le dicen "lagarto Jesucristo".',cons:'Preocupación menor.'},
  anolis:{sci:'Anolis spp.',hab:'de bosques a jardines',come:'insectos pequeños',dato:'Los machos despliegan una papada de color para marcar territorio y conquistar.',cons:'Preocupación menor.'},
  geco:{sci:'Varias especies',hab:'paredes de casas y bosques',come:'insectos atraídos por la luz',dato:'Se pega a paredes lisas por millones de pelitos microscópicos en los dedos.',cons:'Preocupación menor.'},
  cocodrilo:{sci:'Crocodylus acutus',hab:'ríos y esteros (Tárcoles)',come:'peces, aves, mamíferos',dato:'El puente sobre el río Tárcoles es el sitio más famoso del país para verlos desde arriba.',cons:'Vulnerable; se recuperó tras prohibirse su caza.'},
  caiman:{sci:'Caiman crocodilus',hab:'lagunas y canales',come:'peces, cangrejos, ranas',dato:'Es mucho más pequeño que el cocodrilo y tiene una cresta ósea entre los ojos, como anteojos.',cons:'Preocupación menor.'},
  boa:{sci:'Boa constrictor',hab:'bosques y fincas de todo el país',come:'roedores, aves, lagartijas',dato:'No es venenosa: aprieta hasta cortar la circulación. Es una gran controladora de ratas.',cons:'Preocupación menor; la matan por miedo sin razón.'},
  serpiente:{sci:'Bothrops asper',hab:'tierras bajas húmedas, cultivos',come:'roedores y ranas',dato:'Es la culebra responsable de la mayoría de mordeduras graves en Costa Rica. Ante una, alejarse: nunca tratar de matarla.',cons:'Preocupación menor. El suero antiofídico tico salva vidas en todo el mundo.'},
  bocaraca:{sci:'Bothriechis schlegelii',hab:'árboles y bananeras',come:'ranas, lagartijas, aves',dato:'Tiene escamas levantadas sobre los ojos que parecen pestañas. Es venenosa y arborícola.',cons:'Preocupación menor.'},
  lora:{sci:'Bothriechis lateralis',hab:'bosques de montaña',come:'ranas y roedores pequeños',dato:'Solo vive en montañas de Costa Rica y Panamá. Nace café y se vuelve verde brillante de adulta.',cons:'Preocupación menor, endémica regional.'},
  cascabel:{sci:'Crotalus simus',hab:'bosque seco de Guanacaste',come:'roedores',dato:'Avisa antes de morder agitando el cascabel, hecho de anillos de piel vieja.',cons:'Preocupación menor.'},
  matabuey:{sci:'Lachesis stenophrys',hab:'bosques húmedos del Caribe',come:'roedores grandes',dato:'Es la víbora más grande de América (hasta 3 m) y, raro entre las venenosas, pone huevos.',cons:'Vulnerable; necesita bosque bien conservado.'},
  coral:{sci:'Micrurus spp.',hab:'hojarasca de todo el país',come:'otras culebras y lagartijas',dato:'Su veneno es neurotóxico. Los "trucos" de los anillos NO son confiables en Costa Rica: mejor no tocar ninguna.',cons:'Preocupación menor.'},
  serpiente_mar:{sci:'Hydrophis platurus',hab:'mar abierto del Pacífico',come:'peces pequeños',dato:'Es la única serpiente marina del Pacífico americano y pasa toda su vida en el mar.',cons:'Preocupación menor.'},
  mica:{sci:'Spilotes pullatus',hab:'bosques y fincas',come:'roedores, aves y huevos',dato:'No es venenosa, pero infla el cuello y se hace la brava. Excelente trepadora.',cons:'Preocupación menor.'},
  bejuquilla:{sci:'Oxybelis aeneus',hab:'arbustos y matorrales',come:'lagartijas',dato:'Es tan delgada y quieta que se confunde con un bejuco seco.',cons:'Preocupación menor.'},

  // ---------------- tortugas ----------------
  tortuga_baula:{sci:'Dermochelys coriacea',hab:'anida en Playa Grande y el Caribe',come:'medusas',dato:'Es la tortuga más grande del mundo (hasta 700 kg) y la única sin caparazón duro: lo tiene de cuero. Bucea a más de 1.000 m.',cons:'En peligro crítico. La población del Pacífico tico cayó más del 90%.'},
  tortuga:{sci:'Chelonia mydas',hab:'anida en Tortuguero',come:'pastos marinos y algas',dato:'Tortuguero es uno de los sitios de anidación de tortuga verde más importantes del planeta.',cons:'En peligro; protegida desde hace décadas en Costa Rica.'},
  tortuga_carey:{sci:'Eretmochelys imbricata',hab:'arrecifes de ambas costas',come:'esponjas marinas',dato:'La cazaron casi hasta desaparecer por su caparazón, con el que hacían peines y adornos.',cons:'En peligro crítico.'},
  tortuga_lora:{sci:'Lepidochelys olivacea',hab:'Ostional y Nancite',come:'cangrejos, medusas, algas',dato:'Protagoniza las "arribadas": miles de hembras salen a desovar la misma noche en la misma playa.',cons:'Vulnerable.'},
  tortuga_cabezona:{sci:'Caretta caretta',hab:'Caribe, ocasional',come:'moluscos y cangrejos',dato:'Su cabezota aloja músculos potentísimos para triturar conchas.',cons:'Vulnerable.'},
  jicotea:{sci:'Trachemys spp.',hab:'ríos, lagunas y canales',come:'plantas, peces, insectos',dato:'Se le ve tomando sol en troncos, en fila; necesita el calor para digerir.',cons:'Preocupación menor.'},

  // ---------------- mar ----------------
  tiburon_martillo:{sci:'Sphyrna lewini',hab:'Isla del Coco y aguas del Pacífico',come:'peces y calamares',dato:'Su cabeza está llena de sensores eléctricos: detecta el latido de un pez escondido en la arena.',cons:'En peligro crítico por el aleteo.'},
  tiburon_ballena:{sci:'Rhincodon typus',hab:'Pacífico, cerca de Osa e Isla del Coco',come:'plancton, filtrando agua',dato:'Es el pez más grande del mundo (hasta 12 m) y es totalmente inofensivo.',cons:'En peligro.'},
  pez_vela:{sci:'Istiophorus platypterus',hab:'Pacífico abierto',come:'sardinas y calamares',dato:'Es de los peces más rápidos del mar: supera los 100 km/h y levanta su vela para arrear cardúmenes.',cons:'Vulnerable por la pesca.'},
  marlin:{sci:'Makaira nigricans',hab:'Pacífico abierto',come:'peces y calamares',dato:'Usa su pico para golpear y aturdir a los peces antes de comérselos.',cons:'Vulnerable.'},
  mantarraya:{sci:'Mobula birostris',hab:'Isla del Coco y Pacífico',come:'plancton',dato:'Tiene el cerebro más grande de todos los peces y parece reconocerse en un espejo.',cons:'En peligro.'},
  tiburon:{sci:'Varias especies',hab:'ambas costas',come:'peces e invertebrados',dato:'Los tiburones llevan más de 400 millones de años en el mar: son anteriores a los árboles.',cons:'Muchas especies amenazadas por el aleteo.'},

  // ---------------- invertebrados ----------------
  mariposa:{sci:'Morpho helenor',hab:'bosques húmedos',come:'de oruga: hojas; de adulta: fruta fermentada',dato:'Su azul no es pigmento: son escamas microscópicas que refractan la luz. Por debajo es café con ocelos.',cons:'Preocupación menor.'},
  mariposa_buho:{sci:'Caligo spp.',hab:'bosques y bananeras',come:'fruta madura y fermentada',dato:'Los ocelos de sus alas imitan los ojos de un búho y espantan a las aves.',cons:'Preocupación menor.'},
  mariposa_julia:{sci:'Dryas iulia',hab:'bordes de bosque y jardines',come:'néctar',dato:'Se le ha visto tomar lágrimas de tortugas y caimanes para conseguir sales.',cons:'Preocupación menor.'},
  hormiga_bala:{sci:'Paraponera clavata',hab:'bosques húmedos, base de árboles',come:'néctar y presas pequeñas',dato:'Su picadura es la más dolorosa registrada: puntaje máximo en la escala de Schmidt y el dolor dura horas.',cons:'Preocupación menor.'},
  escarabajo:{sci:'Dynastes hercules',hab:'bosques húmedos',come:'fruta madura; de larva, madera podrida',dato:'Puede cargar decenas de veces su propio peso; el macho usa su cuerno para pelear.',cons:'Preocupación menor, presionado por coleccionistas.'},
  abeja:{sci:'Apis mellifera y abejas sin aguijón',hab:'todo el país',come:'néctar y polen',dato:'Costa Rica tiene decenas de abejas nativas SIN aguijón, como la jicote, que hacen una miel medicinal.',cons:'En descenso por pesticidas.'},
  cangrejo:{sci:'Varias especies costeras',hab:'manglares y playas',come:'hojarasca y restos',dato:'Algunos migran en masa desde el bosque hasta el mar para soltar sus huevos con la marea.',cons:'Preocupación menor.'},
  tarantula:{sci:'Sericopelma y Aphonopelma',hab:'huecos en el suelo del bosque',come:'insectos y lagartijas pequeñas',dato:'Su mordida no es peligrosa para una persona; se defiende lanzando pelos urticantes con las patas.',cons:'Preocupación menor.'},

  // ---------------- variante legendaria del juego ----------------
  quetzaldorado:{sci:'Pharomachrus mocinno (variante dorada)',hab:'lo más alto del bosque nuboso',come:'aguacatillos silvestres',dato:'No existe en los libros: es un quetzal de plumaje dorado del que solo hablan las leyendas de montaña. Verlo, dicen, es señal de que el bosque todavía está sano.',cons:'Mítico. En la vida real, cuidá al quetzal y cuidás su leyenda.'},

  // ---------------- básicos (compañeros) ----------------
  perro:{sci:'Canis lupus familiaris',hab:'donde esté su gente',come:'omnívoro',dato:'En Costa Rica, el "zaguate" (perro criollo) es todo un símbolo: hay santuarios famosos dedicados a ellos.',cons:'Doméstico. Adoptá, no compres.'},
  gato:{sci:'Felis catus',hab:'casas y fincas',come:'carnívoro',dato:'Es cazador por instinto: mantenerlo dentro de casa protege a las aves y lagartijas del barrio.',cons:'Doméstico.'},
  comemaiz:{sci:'Sporophila corvina',hab:'charrales, potreros y jardines',come:'semillas de zacate',dato:'Su pico corto y grueso es una pinza perfecta para reventar semillas.',cons:'Preocupación menor.'},
};

// Etiqueta legible de bioma (para el texto de respaldo).
const BIO = { bosque:'el bosque', sabana:'la sabana', agua:'el agua', montana:'la montaña', noche:'la noche' };

// Devuelve la ESCENA de diálogo con la ficha del animal (para dialogo.js).
// `a` es el animal del juego (tiene key, n, bio, rarity…).
export function fichaEscena(a) {
  const f = FICHAS[a.key];
  if (!f) {
    return [
      { who:'guia', txt:`${a.n}. Vive en ${BIO[a.bio] || 'Costa Rica'}. Todavía tengo que estudiarlo bien, pero ya está a salvo.`, hi:[a.n] },
    ];
  }
  const linea = [];
  linea.push({ who:'guia', txt:`Ficha de campo: ${a.n} — ${f.sci}.`, hi:[a.n, f.sci] });
  linea.push({ who:'guia', txt:`Vive en ${f.hab}. Come ${f.come}.`, hi:[] });
  linea.push({ who:'guia', txt:f.dato, hi:[] });
  linea.push({ who:'guia', txt:`Conservación: ${f.cons}`, hi:['Conservación'] });
  return linea;
}

// ¿Tenemos ficha propia de esta especie?
export const tieneFicha = (key) => !!FICHAS[key];

// ---------- CONSEJO ante un hallazgo raro (legendario / extinto / ultra raro) ----------
// El guía reconoce al animal, cuenta lo esencial de su ficha y —sobre todo— AYUDA
// A DECIDIR: compara contra el equipo actual y dice qué aporta.
const AB_TXT = {
  poison:'derrite a los que aguantan mucho (su veneno ignora la defensa)',
  shield:'aguanta el primer golpe a la mitad, sirve de muro',
  heal:  'va curando al equipo mientras pelea',
  first: 'pega antes que nadie la primera vez',
  rage:  'se va poniendo más fuerte con cada ataque',
  thorns:'devuelve daño a quien lo toque',
};

export function consejoHallazgo(a, team = []) {
  const f = FICHAS[a.key];
  const esExt = a.rarity === 'extinto', esLeg = a.rarity === 'legendario';
  const linea = [];

  // 1) el reconocimiento
  if (esExt) {
    linea.push({ who:'guia', txt:`No puede ser… ${a.n}. Esta especie estaba dada por EXTINTA.`, hi:[a.n,'EXTINTA'] });
  } else if (esLeg) {
    linea.push({ who:'guia', txt:`Quedate quieto. Eso es ${a.n} — hay gente que se pasa la vida entera sin ver uno.`, hi:[a.n] });
  } else {
    linea.push({ who:'guia', txt:`Mirá… ${a.n}. No se ven todos los días por aquí.`, hi:[a.n] });
  }

  // 2) el dato de la ficha (lo educativo)
  if (f) {
    linea.push({ who:'guia', txt:`${f.sci}. ${f.dato}`, hi:[f.sci] });
    linea.push({ who:'guia', txt:`Conservación: ${f.cons}`, hi:['Conservación'] });
  }

  // 3) qué aporta al equipo (lo práctico)
  const habs = [a.ab, a.ab2, a.ab3].filter(Boolean);
  const nombres = { poison:'Veneno', shield:'Escudo', heal:'Regenera', first:'Primer golpe', rage:'Furia', thorns:'Púas' };
  if (habs.length) {
    const lista = habs.map(h => nombres[h] || h).join(' + ');
    const explica = AB_TXT[habs[0]] || '';
    linea.push({ who:'guia',
      txt:`En combate trae ${lista}${habs.length > 1 ? ` — ${habs.length} habilidades, algo que casi nadie tiene` : ''}. ${explica ? 'Su fuerte: ' + explica + '.' : ''}`,
      hi:[lista] });
  }

  // 4) la comparación honesta con lo que ya tenés
  if (team.length) {
    const flojo = team.reduce((m, x) => ((x.atk + x.hp) < (m.atk + m.hp) ? x : m), team[0]);
    const mejorAtk = Math.max(...team.map(x => x.atk));
    const lleno = team.length >= 5;
    if (a.atk > mejorAtk) {
      linea.push({ who:'guia', txt:`Pega más fuerte que cualquiera del refugio (${a.atk} contra ${mejorAtk}). Yo me lo llevaría.`, hi:['me lo llevaría'] });
    } else if (a.atk + a.hp > flojo.atk + flojo.hp) {
      linea.push({ who:'guia', txt:`Está mejor que ${flojo.n}, que es el más justo que traigo. Vos decidís.`, hi:[flojo.n] });
    } else {
      linea.push({ who:'guia', txt:`Ojo: viene bajo de nivel todavía. Tu equipo ya está más curtido — igual, con entrenamiento sube.`, hi:['bajo de nivel'] });
    }
    if (lleno) {
      linea.push({ who:'guia', txt:`Y el refugio está lleno: si lo rescatás, tenés que soltar a otro. Elegí con calma.`, hi:['está lleno'] });
    }
  }
  return linea;
}
