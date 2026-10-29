# Mango Range Challenge 🎯

Este proyecto es una solución técnica desarrollada en **React** para el reto técnico de Mango. Consiste en un componente personalizado de rango multirrango (`<Range />`) capaz de operar en dos modos de funcionamiento principales (rango continuo y rango de valores fijos), consumiendo datos de una API REST simulada creada con Express.

## 🛠️ Arquitectura y Decisiones de Diseño

El proyecto ha sido diseñado siguiendo principios de **Clean Architecture** y modularidad para garantizar la escalabilidad, mantenibilidad y desacoplamiento de componentes:

* **`src/components/Range`**: Componente totalmente reutilizable y agnóstico. Soporta navegación por mouse, táctil y accesibilidad mediante teclado (`ArrowLeft` / `ArrowRight`).
* **`src/services`**: Capa de abstracción de red utilizando Axios para la conexión con la API mock.
* **`src/pages`**: Contiene los dos ejercicios requeridos en el reto (`Exercise1` y `Exercise2`).
* **`src/infrastructure/persistence`**: Archivo JSON con la fuente de verdad de los datos mockeados.
* **Seguridad CORS y `.env`**: Servidor Express restringido por lista blanca (*whitelist*) de orígenes y configuración centralizada de puertos/URLs mediante archivo de entorno `.env`.

---

## 📋 Matriz de Cumplimiento de Requisitos (PDF)

A continuación se detalla cómo se resuelven técnicamente en el código los requerimientos específicos del enunciado:

### Ejercicio 1: Rango Normal Continuo (`/exercise1`)

1. **Componente personalizado (NO HTML5 native input):**
   * **Solución:** Se construyó un componente `<Range />` a medida utilizando contenedores estilizados de Emotion/MUI (`SliderTrackContainer`, `SliderProgressBar`, `Bullet`), eliminando el uso de `<input type="range">`.

2. **Arrastre de dos balas a través de la línea de alcance:**
   * **Solución:** Implementado en `Range.js` mediante escuchadores globales y locales de eventos de ratón y táctiles (`onMouseDown`, `onTouchStart`, `handleMouseMove`, `handleMouseUp`).
   * **Comportamiento:** La función `getPercentage` calcula dinámicamente la posición porcentual fluida de ambas balas sobre el track sin permitir que se crucen o solapen.

3. **Edición manual mediante clic en las etiquetas de moneda (Min/Máx):**
   * **Solución:** En modo continuo, los extremos utilizan componentes `TextField` interactivos. Al hacer clic, escribir un nuevo valor y presionar `Enter` o perder el foco (`onBlur`), se ejecutan las funciones sanitizadoras `handleBlurMin` y `handleBlurMax`.

4. **Restricción de límites (no superar min ni max):**
   * **Solución:** Si el usuario ingresa manualmente un valor menor al mínimo absoluto o mayor al máximo permitido, `handleBlurMin` y `handleBlurMax` acotan automáticamente el valor al límite válido correspondiente.

5. **Efectos de hover y cursor en las balas:**
   * **Solución:** Definidos en `Range.styles.js`. Al pasar el cursor sobre la bala (`:hover`), esta incrementa su tamaño de `14px` a `20px` y cambia el cursor a `grab`. Durante el arrastre activo (`isDragging`), el cursor se transforma en `grabbing`.

6. **Servicio HTTP simulado:**
   * **Solución:** Endpoint `GET /api/range-normal` en Express (`server.js`) que sirve los límites dinámicos desde `ranges.json`.

---

### Ejercicio 2: Rango de Valores Fijos (`/exercise2`)

1. **Selección exclusiva dentro de un array de valores fijos `[1.99, 5.99, 10.99, 30.99, 50.99, 70.99]`:**
   * **Solución:** Cuando se proporciona la prop `fixedValues`, el componente entra en modo fijo. `handleMouseMove` y `handleKeyDown` calculan el índice del array más cercano mediante una escala equidistante y saltan estrictamente entre los valores permitidos del array.

2. **Valores de moneda no modificables (sólo etiquetas estáticas):**
   * **Solución:** En modo fijo, el componente reemplaza los campos editables `TextField` por componentes `<Typography>` estáticos. Se valida explícitamente en los tests que los inputs `input-min` e `input-max` **no existen en el DOM**.

3. **Formato monetario estricto:**
   * **Solución:** La función `formatDisplay` aplica `.toFixed(2)` asegurando la visualización correcta de centavos (ej: `1.99€`, `70.99€`).

4. **Arrastre de balas y prevención de cruce:**
   * **Solución:** Las balas avanzan paso a paso por los índices del array. El valor de la bala mínima nunca puede tomar un índice igual o superior al de la bala máxima.

5. **Servicio HTTP simulado para rango fijo:**
   * **Solución:** Endpoint `GET /api/range-fixed` en Express (`server.js`) que devuelve el objeto `{ values: [...] }`.

---

## 🚀 Requisitos Previos

Asegúrate de tener instalado en tu sistema:

* **Node.js**: v16.x o superior
* **npm**: v8.x o superior

---

## ⚙️ Configuración del Entorno (`.env`)

Crea un archivo llamado `.env` en la raíz del proyecto (al mismo nivel que `package.json` y `server.js`) con las siguientes variables o copia el .env.example:

```env
# Configuración del Servidor Backend (Express)
PORT=5000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080,http://127.0.0.1:3000,http://127.0.0.1:8080

# Configuración del Cliente Frontend (React / API Client)
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

---

## 📦 Instalación

Clona o descarga el repositorio e instala todas las dependencias necesarias ejecutando:

```bash
npm install
```

---

## 🟢 Ejecución del Proyecto

Puedes levantar tanto el servidor de API Mock (`Express`) como el cliente Webpack (`React`) de forma simultánea con un solo comando:

```bash
npm start
```

Esto ejecutará `concurrently` abriendo automáticamente la aplicación en tu navegador en:  
👉 [**http://localhost:8080/exercise1**](http://localhost:8080/exercise1)

### Comandos de ejecución individual:

* **Servidor API Mock únicamente (Puerto 5000):**
  ```bash
  npm run start:api
  ```

* **Frontend React únicamente (Puerto 8080):**
  ```bash
  npm run start:app
  ```

---

## 🧪 Ejecución de Pruebas Unitarias e Integración

Se han desarrollado pruebas automatizadas exhaustivas utilizando **Jest** y **React Testing Library**, cubriendo:

1. **Pruebas del Componente `<Range />` (`Range.test.js`):**
   * Comprobación de límites estrictos (bloqueo de valores menores al mínimo o mayores al máximo).
   * Arrastre físico de balas (*dragging* con mouse y eventos táctiles).
   * Accesibilidad mediante teclado (`ArrowRight` / `ArrowLeft`).
   * Modo de etiquetas fijas no editables.

2. **Pruebas de Integración (`Exercise1.test.js` y `Exercise2.test.js`):**
   * **Camino Feliz (Éxito):** Muestra de estados de carga (`CircularProgress`) y renderizado correcto de datos obtenidos dinámicamente de la API.
   * **Camino de Error (Fallo de Red):** Verificación de captura de errores y renderizado de mensajes de fallo en pantalla si la API no responde.

Para ejecutar la suite completa de pruebas:

```bash
npm run test
```

---

## 📌 Rutas de la Aplicación

* **`http://localhost:8080/exercise1`**: **Ejercicio 1 - Rango Normal Continuo**  
  Permite seleccionar cualquier valor dentro de un rango continuo con límites dinámicos editables por input o arrastre de balas.

* **`http://localhost:8080/exercise2`**: **Ejercicio 2 - Rango de Valores Fijos**  
  Restringe la selección únicamente a los valores numéricos especificados por el servidor (`[1.99, 5.99, 10.99, 30.99, 50.99, 70.99]`), con formato monetario estricto y sin campos de texto editables.