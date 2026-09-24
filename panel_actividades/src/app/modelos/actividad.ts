export type EstadoActividad = 'pendiente' | 'en_progreso' | 'completada';

export type Prioridad = 'baja' | 'media' | 'alta';

export interface Actividad {
  id: number;
  titulo: string;
  estado: EstadoActividad;
  prioridad: Prioridad;
  creadaEn: string;
  destacada: boolean;
  descripcion: string; 
}

export const LIMITES = {
  tituloMin: 3,
  tituloMax: 80,
  descripcionMax: 300,
} as const;

export type FiltroEstado = EstadoActividad | 'todas';
export type FiltroPrioridad = Prioridad | 'todas';

export const ETIQUETAS = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completada: 'Completada',
} satisfies Record<EstadoActividad, string>;

// Helpers para mayor legibilidad
function esEstado(valor: unknown): valor is EstadoActividad {
  return valor === 'pendiente' || valor === 'en_progreso' || valor === 'completada';
}

function esPrioridad(valor: unknown): valor is Prioridad {
  return valor === 'baja' || valor === 'media' || valor === 'alta';
}

export function esColeccionActividades(valor: unknown): valor is Actividad[] {
  return Array.isArray(valor) && valor.every((item) => {
    if (typeof item !== 'object' || item === null) {
      return false;
    }

    const actividad = item as Partial<Actividad>;

    return (
      typeof actividad.id === 'number' &&
      typeof actividad.titulo === 'string' &&
      actividad.titulo.length >= LIMITES.tituloMin &&
      actividad.titulo.length <= LIMITES.tituloMax &&
      typeof actividad.creadaEn === 'string' &&
      !isNaN(Date.parse(actividad.creadaEn)) && 
      typeof actividad.destacada === 'boolean' &&
      typeof actividad.descripcion === 'string' &&
      actividad.descripcion.length <= LIMITES.descripcionMax && 
      esEstado(actividad.estado) &&
      esPrioridad(actividad.prioridad)
    );
  });
}
