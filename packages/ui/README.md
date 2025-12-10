# @medintt/ui

Librería de componentes de interfaz de usuario estandarizada para el ecosistema Medintt.
Esta librería envuelve **PrimeReact** e integra automáticamente **React Hook Form** y **Tailwind CSS**.

## 📚 Índice de Componentes

### Core & Layout

- [MedinttForm](./docs/MedinttForm.md) - Motor de formularios con layout automático.
- [MedinttTable](./docs/MedinttTable.md) - Tabla de datos con filtros, ordenamiento y acciones.
- [MedinttSidebar](./docs/MedinttSidebar.md) - Menú lateral de navegación.

### Inputs & Controles

- [MedinttButton](./docs/MedinttButton.md)
- [MedinttInputText](./docs/MedinttInputText.md)
- [MedinttInputNumber](./docs/MedinttInputNumber.md)
- [MedinttInputTextArea](./docs/MedinttInputTextArea.md)
- [MedinttPassword](./docs/MedinttPassword.md)
- [MedinttCheckbox](./docs/MedinttCheckbox.md)
- [MedinttCalendar](./docs/MedinttCalendar.md)
- [MedinttDropdown](./docs/MedinttDropdown.md)
- [MedinttMultiSelect](./docs/MedinttMultiSelect.md)
- [MedinttRadioButton](./docs/MedinttRadioButton.md)
- [MedinttChips](./docs/MedinttChips.md)

---

## 🛠 Guía de Desarrollo

### ¿Cómo agregar un nuevo componente?

1.  **Crear el componente:**
    Crea el archivo en `src/components/MedinttNuevoComponente.tsx`.
    Asegúrate de que extienda las props de PrimeReact y use `Controller` de `react-hook-form`.

2.  **Exportar:**
    Agrega la exportación en `src/index.ts`:

    ```typescript
    export * from "./components/MedinttNuevoComponente";
    ```

3.  **Integrar en MedinttForm (Opcional):**
    Si el componente debe ser soportado por el motor de JSON-to-Form:
    - Agrega su definición de tipo en `MedinttForm.tsx` (o `types.ts`).
    - Agrega el `case` en la función `renderField` dentro de `MedinttForm.tsx`.

4.  **Documentar:**
    Crea un archivo `.md` en la carpeta `docs/` explicando sus props y ejemplos.

### Estándar de Props `{...props}`

Todos los componentes están diseñados para aceptar las propiedades nativas de su contraparte en PrimeReact a través de la propagación de props (`...props`).

**Ejemplo:**
Si usas `<MedinttInputText>`, puedes pasarle cualquier propiedad válida de `InputText` de PrimeReact (como `keyfilter`, `tooltip`, `onFocus`) y funcionará automáticamente.
