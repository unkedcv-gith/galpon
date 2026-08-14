import { FaqItem, WorkshopProgram, TimeSlot, Reservation, AttractionItem } from '../types';

export const BRAND_INFO = {
  name: 'El Galpón',
  tagline: 'Una excusa más para NO usar pantallas',
  subtitle: 'Nuestras actividades pensadas con un propósito: entretenimiento sano.',
  phone: '221 573-1047',
  whatsappUrl: 'https://wa.me/5492215731047',
  instagram: '@up.deportivoyrecreativo',
  instagramUrl: 'https://instagram.com/up.deportivoyrecreativo',
  hours: 'Lunes a Viernes de 7:30 a 17:00 hs (Talleres) | Sábados y Domingos (Cumpleaños)',
  address: 'El Galpón - Espacio Recreativo Deportivo',
};

export const TIME_SLOTS: TimeSlot[] = [
  {
    id: 'turn_morning',
    title: 'Turno Mañana',
    timeRange: '11:00 a 13:30 hs',
    description: 'Ideal para almorzar e iniciar el día con pura diversión deportiva.',
  },
  {
    id: 'turn_afternoon_1',
    title: 'Turno Tarde Temprano',
    timeRange: '15:00 a 17:30 hs',
    description: 'El turno preferido para merendar y juegos continuos.',
  },
  {
    id: 'turn_afternoon_2',
    title: 'Turno Tarde/Noche',
    timeRange: '18:30 a 21:00 hs',
    description: 'Perfecto para finalizar el fin de semana con la mejor energía.',
  },
];

export const ATTRACTIONS: AttractionItem[] = [
  {
    id: 'muro',
    title: 'Muro de Escalada',
    description: 'Paredes adaptadas con tomas de seguridad y colchonetas de protección.',
    icon: 'Mountain',
    staffSupervised: true,
  },
  {
    id: 'tirolesa',
    title: 'Tirolesa de Vuelo',
    description: 'Aventura aérea de gran velocidad con arnés y asistencia directa de profes.',
    icon: 'Zap',
    staffSupervised: true,
  },
  {
    id: 'circuitos',
    title: 'Circuitos Deportivos',
    description: 'Obstáculos, túneles, carrera de destreza y juegos de posta por equipos.',
    icon: 'Trophy',
    staffSupervised: false,
  },
  {
    id: 'telas_aros',
    title: 'Telas, Aros y Reloj Loco',
    description: 'Acrobacia, telas suspendidas, juego de esquivar y equilibrio dinámico.',
    icon: 'Activity',
    staffSupervised: true,
  },
  {
    id: 'elasticas',
    title: 'Camas Elásticas',
    description: 'Saltos y piruetas controladas bajo la guía de nuestros instructores.',
    icon: 'Smile',
    staffSupervised: true,
  },
  {
    id: 'arte_creatividad',
    title: 'Arte y Expresión Corporal',
    description: 'Taller creativo, pintura libre y dinámicas de movimiento lúdico.',
    icon: 'Palette',
    staffSupervised: false,
  },
];

export const WORKSHOP_PROGRAMS: WorkshopProgram[] = [
  {
    id: 'peques_en_accion',
    title: 'Peques en Acción',
    subtitle: 'Fitness y juego para los chicos',
    ageRange: 'De 3 a 6 años',
    schedule: 'Martes y Jueves (17:30 a 18:30 hs)',
    description: 'Desarrollo motriz, iniciación deportiva, esquivar obstáculos y juegos cooperativos en un entorno protegido.',
    highlights: ['Psicomotricidad', 'Juegos con pelotas y colchonetas', 'Profes especializados', 'Cero pantallas'],
    color: 'cyan',
    iconName: 'Baby',
  },
  {
    id: 'crossfteens',
    title: 'Crossfteens',
    subtitle: 'Fitness y agilidad para los chicos',
    ageRange: 'De 7 a 11 años',
    schedule: 'Martes y Jueves (18:30 a 19:30 hs)',
    description: 'Circuitos de agilidad, velocidad, salto y juegos en equipo diseñados para descargar energía de forma saludable.',
    highlights: ['Circuitos de alta agilidad', 'Desafíos en equipo', 'Muro y tirolesa', 'Entrenamiento funcional guiado'],
    color: 'pink',
    iconName: 'Dumbbell',
  },
  {
    id: 'talleres_diarios',
    title: 'Talleres Recreativos y de Cuidado',
    subtitle: 'Jornadas flexibles por día y hora',
    ageRange: 'Desde 45 días hasta 11 años',
    schedule: 'Lunes a Viernes (De 7:30 a 17:00 hs)',
    description: 'Vos elegís los días y la cantidad de horas. Espacio seguro de recreación, arte, música, ciencias y circuitos deportivos.',
    highlights: ['Horario flexible', 'Literatura, música y ciencias', 'Juegos sensoriales', 'Adaptado a cada edad'],
    color: 'lime',
    iconName: 'Clock',
  },
  {
    id: 'por_un_dia',
    title: 'Por Un Día, Algo Increíble',
    subtitle: '¿Hay paro en el cole o necesitás un lugar?',
    ageRange: 'Para todas las edades escolares',
    schedule: 'Lunes a Viernes (7:30 a 17:00 hs) - Cupos limitados',
    description: 'Un espacio donde tu peke juega, se mueve, crea y se divierte mientras vos hacés lo que necesitás.',
    highlights: ['Pase por día', 'Cuidado responsable', 'Pared de escalada y tirolesa', 'Mucha diversión'],
    color: 'yellow',
    iconName: 'ShieldCheck',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq_1',
    numberTag: '1',
    question: '¿Por qué damos solo 1 pancho por chico?',
    answer: 'A diferencia de una casita de fiestas convencional donde comen sentados durante 40 minutos con animación pasiva, en El Galpón los chicos COMEN EN 10 MINUTOS. Si comieran más en tan poco tiempo y luego salieran a correr, saltar en camas elásticas y dar vueltas carnero, vomitarían o se sentirían mal. Priorizamos la salud y seguridad de los pekes.',
    category: 'cumpleanos',
    highlight: 'Cuidado gastrointestinal para juego activo',
  },
  {
    id: 'faq_2',
    numberTag: '2',
    question: '¿Por qué el festejo dura 2 horas y media (2 1/2 hs)?',
    answer: 'El Galpón es un lugar donde los chicos hacen deporte de alta intensidad desde que llegan hasta que se van. Terminan realmente muy cansados y satisfechos. Hemos probado hacer festejos de 3 horas como el resto de los salones, pero los chicos en la última media hora ya no querían jugar porque no daban más del agotamiento sano.',
    category: 'cumpleanos',
    highlight: '2:30 hs exactas de máxima energía',
  },
  {
    id: 'faq_3',
    numberTag: '3',
    question: '¿Puede participar de todos los juegos cualquier invitado?',
    answer: 'El muro de escalada, tirolesa, tela, aro, reloj loco y camas elásticas están a cargo de profesores de educación física. Solo pueden subir los niños que tengan la pulsera correspondiente y estén a su cuidado directo. El resto de los invitados puede participar alegremente en todos los circuitos deportivos.',
    category: 'cumpleanos',
    highlight: 'Atracciones de altura supervisadas por profes',
  },
  {
    id: 'faq_4',
    numberTag: '4',
    question: '¿Se puede agregar más comida para el evento?',
    answer: 'Sí, por supuesto, pero SOLO para el sector de ADULTOS. Recordemos que los niños están haciendo deporte constante y comer de más les hace mal. Les pedimos que nos avisen qué catering o comida van a traer para aconsejarlos, ya que 2:30 hs pasan volando y a veces traen demasiada cantidad.',
    category: 'cumpleanos',
    highlight: 'Comida extra habilitada para adultos',
  },
  {
    id: 'faq_5',
    numberTag: '5',
    question: '¿Cómo funciona la Tarjeta Virtual e Invitaciones RSVP?',
    answer: 'Nosotros creamos una tarjeta virtual interactiva personalizada con un botón de "Confirmar Asistencia". Colocamos el número de celular que ustedes nos indiquen para que los mensajes de confirmación lleguen directo a su WhatsApp. Les pedimos insistir con las confirmaciones para definir el personal de profesores necesario.',
    category: 'cumpleanos',
    highlight: 'Tarjeta virtual digital con confirmador automático',
  },
  {
    id: 'faq_6',
    numberTag: '6',
    question: '¿Se congelan los precios con la seña?',
    answer: '¡Totalmente! Al abonar la seña no solo garantizás la reserva exclusiva del día y la fecha en el almanaque, sino que también CONGELAS EL VALOR TOTAL del evento contratado, protegiéndote contra cualquier aumento.',
    category: 'cumpleanos',
    highlight: 'Congelamiento de tarifa garantizado',
  },
  {
    id: 'faq_7',
    numberTag: '7',
    question: '¿Puedo invitar a más de 20 chicos?',
    answer: 'El contrato base cubre 20 chicos e incluye hasta 35 invitados totales (contando al cumpleañer@). Una semana antes del evento revisamos las confirmaciones de la tarjeta virtual para determinar si aplica el Adicional 1 (chicos 21 al 28) o el Adicional 2 (chicos 29 al 35).',
    category: 'cumpleanos',
    highlight: 'Base 20 niños, ampliable hasta 35',
  },
  {
    id: 'faq_8',
    numberTag: '8',
    question: '¿Puedo ir pagando en cuotas o adelantos mensuales?',
    answer: 'Sí! Podés ir realizando adelantos en efectivo. Solo coordinamos el día, horario y la sucursal para encontrarnos e ir abonando el saldo del evento a tu ritmo hasta la fecha del festejo.',
    category: 'cumpleanos',
    highlight: 'Planes de pago flexibles en efectivo',
  },
];

// Helper dates relative to today for initial demo
const today = new Date();
const formatDate = (offsetDays: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res_101',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    date: formatDate(3),
    slotId: 'turn_afternoon_1',
    slotTime: '15:00 a 17:30 hs',
    parentName: 'Mariana Gómez',
    parentPhone: '221 456-7890',
    parentEmail: 'mariana.gomez@gmail.com',
    childName: 'Felipe',
    childAge: 6,
    estimatedKids: 22,
    status: 'approved',
    depositPaid: true,
    depositAmount: 50000,
    additionalPackage: 'adicional_21_28',
    notes: 'Temática de dinosaurios. Consultaron por traer tarta dulce para adultos.',
    adultsFoodInfo: 'Traen mate, gaseosas y empanadas para el sector padres.',
  },
  {
    id: 'res_102',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    date: formatDate(5),
    slotId: 'turn_afternoon_2',
    slotTime: '18:30 a 21:00 hs',
    parentName: 'Gonzalo Pérez',
    parentPhone: '221 654-3210',
    parentEmail: 'gonzalo.p@hotmail.com',
    childName: 'Valentina',
    childAge: 8,
    estimatedKids: 18,
    status: 'pending',
    depositPaid: false,
    depositAmount: 0,
    additionalPackage: 'base_20',
    notes: 'Reserva realizada vía web. Pendiente revisión de pago de seña.',
  },
  {
    id: 'res_103',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    date: formatDate(10),
    slotId: 'turn_morning',
    slotTime: '11:00 a 13:30 hs',
    parentName: 'Carolina Rossi',
    parentPhone: '221 333-2211',
    parentEmail: 'caro.rossi@yahoo.com.ar',
    childName: 'Benjamín',
    childAge: 5,
    estimatedKids: 25,
    status: 'approved',
    depositPaid: true,
    depositAmount: 50000,
    additionalPackage: 'adicional_21_28',
    notes: 'Confirmó asistencia con la tarjeta virtual.',
  },
  {
    id: 'res_104',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    date: formatDate(12),
    slotId: 'turn_afternoon_1',
    slotTime: '15:00 a 17:30 hs',
    parentName: 'Lucía Fernández',
    parentPhone: '221 999-8877',
    parentEmail: 'lucia.f@gmail.com',
    childName: 'Mateo',
    childAge: 7,
    estimatedKids: 30,
    status: 'pending',
    depositPaid: false,
    depositAmount: 0,
    additionalPackage: 'adicional_29_35',
    notes: 'Solicitó asesoramiento sobre menú para adultos.',
  },
];

export const INITIAL_BLOCKED_DATES: { date: string; reason: string }[] = [
  {
    date: formatDate(1),
    reason: 'Mantenimiento preventivo Muro y Tirolesa',
  },
];
