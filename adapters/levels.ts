import { Level } from "@/types";

// Traducir los niveles de inglés a español para mostrar en la interfaz de usuario.
export const adapterLevels = (level: Level) => {
    const levelsSpanish = [
        {
            level: 'gold',
            label: 'Oro',
        },
        {
            level: 'silver',
            label: 'Plata',
        },
        {
            level: 'bronze',
            label: 'Bronce',
        },
    ];

    return levelsSpanish.find((l) => l.level === level)?.label ?? 'Nivel desconocido';
}