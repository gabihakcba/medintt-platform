/**
 * Resuelve el valor de un objeto basado en un selector.
 * El selector puede ser:
 * - Una key simple: 'id'
 * - Una ruta anidada: 'Account.id'
 * - Una función callback: (item) => item.id
 */
export function resolveItemData<T>(item: T, selector: string | ((item: T) => any)): any {
    // Caso 1: Es una función (callback)
    if (typeof selector === 'function') {
        return selector(item);
    }

    // Caso 2: Es un string
    if (typeof selector === 'string') {
        // Si tiene puntos, es acceso profundo (ej: 'Account.id')
        if (selector.includes('.')) {
            return selector.split('.').reduce((acc, part) => acc && acc[part], item as any);
        }
        // Acceso directo
        return (item as any)[selector];
    }

    return null;
}