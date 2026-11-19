# HLD — Atlas personal de historia y lecturas

Estado: diseño inicial en discusión. Este documento describe el objetivo y las
decisiones de alto nivel; todavía no implica que las funciones estén implementadas.

## 1. Visión

Crear un sitio web personal para explorar la historia, desde el origen del universo
hasta el presente documentado, y guiar un proyecto de lectura de largo plazo.

La experiencia combinará una línea de tiempo con zoom y vistas de consulta
inspiradas en Notion: fichas, listas, filtros y relaciones entre acontecimientos,
libros y fuentes. La inspiración es funcional, no una copia de su interfaz.

El sitio permitirá identificar qué hitos se han leído, descubrir libros relacionados
y construir una interpretación propia de su cronología a partir de las lecturas.

## 2. Decisiones acordadas

| Tema | Decisión |
| --- | --- |
| Publicación | Repositorio público y sitio estático en GitHub Pages. |
| Tecnología | JavaScript con Astro para generación estática y React para las islas interactivas, sin servidor de aplicación ni base de datos remota. |
| Datos persistentes | Archivos YAML versionados en el repositorio. |
| Organización | Libros en su propio catálogo e hitos repartidos en archivos por grandes periodos. |
| Cobertura inicial | Panorama desde el origen del universo hasta hoy, con hitos seleccionados y expansión progresiva. |
| Edición | Para la prueba inicial, la web abrirá los YAML en el editor de GitHub, usando la sesión y los permisos de GitHub del usuario. El editor propio con exportación queda como propuesta posterior. |
| Idiomas | Interfaz y contenido en español e inglés. |
| Apariencia | Exclusivamente oscura, con un sistema de temas fácil de cambiar y extender. No habrá modo claro. |
| Calidad visual | Experiencia cuidada, atractiva y animada desde la primera versión; no una interfaz básica con decoración añadida al final. |
| Progreso | Estados explícitos para hitos y libros. |
| Documentación | Diseño en `HLD.md`; `README.md` breve y de alto nivel. |

## 3. Alcance y límites

La visión es global: distintas culturas, regiones y países, incluyendo sociedades
que no corresponden a fronteras actuales. También abarca cosmología, historia de
la Tierra, evolución, prehistoria e historia humana.

No se promete registrar literalmente todo lo ocurrido ni todo lo documentado.
El catálogo será ampliable y mostrará sus límites: cobertura por periodo, región
y tema, fuentes disponibles y fecha de revisión. La ausencia de un hito no
significa que no haya ocurrido nada en esa región o periodo.

Las divisiones tradicionales, como Edad Antigua o Edad Media, no se aplicarán
automáticamente a todas las culturas. La partición de archivos facilitará el
mantenimiento, pero no impondrá una única periodización a la navegación.

El presente será el contenido de la última actualización publicada, no un flujo
automático de noticias. Las afirmaciones sobre acontecimientos recientes deberán
tener fuente y fecha de consulta.

## 4. Experiencia de uso

### Exploración

- Acercar y alejar la línea de tiempo: universo, grandes periodos, siglos, años
  y días cuando la precisión de las fuentes lo permita.
- Desplazarse a una fecha o periodo y abrir la ficha de un hito.
- Consultar una vista de lista alternativa a la línea de tiempo.
- Buscar y filtrar por periodo, lugar o cultura, tema, lectura e idioma.
- Cambiar entre español e inglés sin perder el contexto de navegación.

### Apariencia

El sitio será siempre oscuro, independientemente de la preferencia del sistema
operativo. Cambiar de tema significará cambiar entre variantes oscuras, no alternar
entre modo claro y oscuro.

Se propone un selector de temas con preferencia persistida localmente en el
navegador. Esta preferencia visual no modificará los YAML del catálogo ni necesitará
un commit. Las paletas concretas y el tema predeterminado quedan por definir.

### Dirección visual y movimiento

La calidad visual forma parte del producto, no de una mejora opcional posterior.
La referencia propuesta es un atlas histórico interactivo con tratamiento editorial:
inmersivo al explorar y tranquilo al leer. No se busca una tabla administrativa
ni una plantilla genérica de tarjetas.

- La línea de tiempo será el elemento protagonista, con jerarquía clara entre
  periodos, agrupaciones e hitos y transiciones continuas al cambiar de escala.
- La composición combinará tipografía expresiva en títulos con texto cómodo para
  lectura prolongada, espacio generoso y detalles gráficos propios de la cronología.
- Las superficies oscuras tendrán profundidad mediante capas, bordes y acentos
  contenidos; los efectos decorativos no competirán con fechas, fuentes o notas.
- Las fichas y la biblioteca incorporarán imágenes y portadas cuando haya recursos
  con permisos adecuados; su ausencia no dejará espacios rotos ni bloqueará la lectura.
- Abrir un hito, filtrar, cambiar de tema y registrar una lectura tendrá respuestas
  visuales coherentes. Las transiciones ayudarán a entender qué cambió y dónde.

El movimiento no será constante por defecto: no habrá reproducción automática
decorativa que distraiga de la lectura, ni desplazamiento secuestrado. Se respetará
`prefers-reduced-motion`, reduciendo las animaciones no esenciales sin perder
información ni funcionalidad.

Antes de desarrollar toda la interfaz, se propone validar una muestra visual
representativa: línea de tiempo, ficha de hito y biblioteca, en escritorio y móvil.
La identidad gráfica y las referencias concretas se acordarán con esa muestra.

### Ficha de un hito

Mostrará título, resumen, fecha o intervalo adoptado, incertidumbre, lugares,
culturas, temas y fuentes. Incluirá libros relacionados y las afirmaciones
cronológicas extraídas de ellos, con localizadores como capítulo o página.

Se podrá marcar el hito como leído o no leído y registrar notas personales.
Leer un libro no marcará automáticamente todos sus hitos como leídos, ni leer
un hito implicará haber terminado los libros asociados.

### Biblioteca

Cada libro tendrá su ficha, idioma, edición, estado de lectura e hitos relacionados.
Una obra que cubra varios periodos podrá vincularse con múltiples hitos.

Las páginas pertenecen a una edición concreta. Se conservará esa referencia para
no confundir ediciones, traducciones o formatos.

### Contraste de fechas

El usuario podrá registrar lo que propone cada fuente y elegir una fecha propia.
Por ejemplo, tras consultar tres libros, podrá adoptar la fecha en la que coinciden
y explicar el criterio. No será obligatorio consultar tres libros.

Las afirmaciones originales permanecerán separadas de la fecha adoptada. No se
calculará una fecha por votación, promedio o coincidencia automática: varias obras
pueden depender de una misma fuente y no constituir evidencia independiente.

## 5. Modelo de información propuesto

Los siguientes nombres de archivos y campos son una propuesta, no un contrato
definitivo del formato.

| Entidad | Contenido principal |
| --- | --- |
| Hito | Identificador estable, textos bilingües, cronología adoptada, etiquetas y relaciones. |
| Obra | Título original, títulos traducidos disponibles, autores y descripción bilingüe. |
| Edición | Obra, idioma, editorial, año, formato e ISBN cuando exista. |
| Fuente | Libro/edición, artículo, publicación científica, archivo u otro documento consultable. |
| Afirmación cronológica | Hito, fuente, fecha propuesta, localizador y notas de interpretación. |
| Registro de lectura | Identificador del hito o libro, estado, fechas de lectura opcionales y notas. |
| Vocabulario | Periodos, lugares, culturas y temas con identificadores y nombres traducidos. |

Los identificadores no dependerán del título traducido ni de la fecha, ya que ambos
pueden cambiar. Las relaciones usarán identificadores, no copias de las fichas.

El progreso de los libros se registrará por obra, con la edición leída asociada
cuando se conozca. Queda por precisar el tratamiento de relecturas y lecturas de
varias ediciones de una misma obra.

Estados iniciales propuestos:

- Hitos: `unread`, `read`.
- Libros: `unread`, `reading`, `read`.

Los valores internos serán independientes del idioma de la interfaz.

### Organización orientativa

```text
data/
  catalog.yaml
  events/
    cosmos.yaml
    earth-and-life.yaml
    human-origins.yaml
    ancient-world.yaml
    medieval-world.yaml
    early-modern-world.yaml
    modern-world.yaml
    contemporary-world.yaml
  books.yaml
  editions.yaml
  sources.yaml
  claims.yaml
  reading.yaml
  vocabularies.yaml
```

`catalog.yaml` enumerará los archivos que debe cargar el sitio, su versión de
esquema y los metadatos de cobertura y revisión. Se podrán subdividir archivos
grandes sin modificar los identificadores ni duplicar acontecimientos.

Los límites concretos de cada archivo se definirán al preparar el catálogo.
Los acontecimientos que crucen periodos tendrán una sola ficha.

## 6. Fechas y escalas temporales

No se utilizará `Date` de JavaScript como representación universal de la cronología:
no cubre adecuadamente miles de millones de años ni expresa incertidumbre.

El modelo distinguirá:

- Un instante de un acontecimiento que dura un intervalo.
- Una fecha exacta de una aproximación o un rango de fechas posibles.
- La precisión disponible: día, mes, año, siglo o magnitud científica.
- La fecha expresada por la fuente de su normalización para ordenar y visualizar.
- Un extremo desconocido de un intervalo de un acontecimiento todavía en curso.

Para fechas históricas, se propone una representación estructurada con año
astronómico interno: año `0` equivale a 1 a. C. y año `-1` a 2 a. C. La interfaz
mostrará a. C./d. C. o BCE/CE según el idioma, sin presentar un año cero histórico.

El calendario original se conservará cuando sea relevante. Cualquier conversión
al calendario de visualización deberá indicar el calendario de destino y su fuente
o regla; no se convertirán fechas ambiguas silenciosamente.

Para cosmología y geología se admitirán edades con unidad y referencia temporal
explícitas. No se asumirá que «antes del presente» significa la fecha de hoy:
por ejemplo, BP suele usar 1950 como referencia y debe declararse.

Se derivará una coordenada numérica común únicamente para ordenación y dibujo.
La visualización no deberá inventar precisión que los datos originales no tienen.
El formato exacto y los límites de precisión se concretarán antes de implementar.

### Comportamiento del zoom

Se propone una navegación multiescala con niveles y agrupación de hitos. Una única
vista lineal desde el Big Bang haría ilegible casi toda la historia humana.

Dentro de cada ventana, la escala será explícita. Si se introduce una vista
logarítmica o una compresión temporal, deberá indicarse claramente; nunca se
mostrarán distancias visuales no proporcionales como si lo fueran.

Los grupos se desplegarán al acercarse. Los intervalos e incertidumbres tendrán
representaciones distintas y etiquetas accesibles.

## 7. Arquitectura propuesta

### Prueba inicial: solo GitHub

El prototipo utiliza Astro y React, carga los YAML durante el build y publica
HTML estático en GitHub Pages. Incluye una muestra bilingüe de hitos y libros,
selección de capítulos, fichas y tres variantes oscuras: Tinta, Musgo y Ciruela.
Todavía no implementa zoom temporal, búsqueda ni edición dentro de la página.

Los botones de edición abren el archivo correspondiente mediante
`https://github.com/ricardoguque/history/edit/main/data/...`. La autenticación,
la edición, el commit y, cuando corresponda, el pull request suceden en GitHub.
La página no conoce contraseñas ni recibe permisos para escribir en el repositorio.
No se necesitan secrets de usuario, contraseña ni tokens personales.

El flujo activo de esta prueba es:

```text
Página pública -> Editar en GitHub -> Sesión y permisos de GitHub
             -> Cambio incorporado a main -> Validación y build -> GitHub Pages
```

Los cambios solo se reflejan en la web tras incorporarse a `main` y completarse
el despliegue. Abrir o crear un PR no modifica la versión publicada. La posibilidad
de guardar directamente, crear una rama o proponer cambios depende de los permisos
y reglas del repositorio; el sitio no los omite ni los sustituye.

### Arquitectura objetivo del editor con exportación

El siguiente flujo describe una evolución posible, no el editor del prototipo:

```text
YAML del repositorio
        |
        v
Validación de datos y generación estática con Astro
        |
        v
Sitio estático y datos de consulta -> GitHub Pages
        |
        v
Navegador: islas React para explorar, editar y exportar YAML
        |
        v
Usuario revisa y guarda los archivos en GitHub
        |
        v
Nuevo build y publicación
```

El build validará los YAML y podrá generar JSON e índices de búsqueda para el
navegador. Esos artefactos serán derivados: los YAML seguirán siendo la fuente
de verdad. El navegador tendrá acceso a los datos editables de la misma versión
publicada para producir las exportaciones.

### Astro e islas React

Astro generará HTML estático para las páginas, el contenido editorial y las fichas
que no requieran interacción. React se reservará para la exploración temporal,
los filtros, los estados de lectura y el editor con exportación.

Las zonas que deban coordinarse continuamente, como la línea de tiempo, sus filtros
y la selección de un hito, podrán formar una misma isla React. No se fragmentará
la interfaz en islas independientes si eso complica compartir el estado.
Los borradores tendrán una única fuente de estado en el navegador.

Cada isla cargará su JavaScript cuando lo necesite: las funciones principales
de exploración al iniciar su uso y las secundarias cuando sean visibles o se
abran. El contenido de consulta no dependerá innecesariamente de React.

Se usará la salida estática de Astro; no se requerirán SSR ni adaptadores de
servidor. La biblioteca de línea de tiempo, el procesamiento de YAML y los
componentes de interfaz siguen abiertos. Se favorecerán dependencias pequeñas
y una solución mantenible en JavaScript y JSX.

### Sistema de temas oscuros

La apariencia se definirá mediante variables CSS semánticas compartidas por Astro
y React: fondo, superficies, texto, bordes, acento, foco y estados de lectura.
Los componentes consumirán esos tokens en lugar de fijar colores de una paleta.

Cada tema declarará sus valores bajo un identificador en el elemento raíz
del documento, por ejemplo `data-theme`. Agregar o ajustar una paleta no deberá
requerir cambios en la lógica de los componentes.

El tema guardado se aplicará antes del primer pintado para evitar destellos.
Sin preferencia guardada, se usará el tema oscuro predeterminado. El CSS declarará
`color-scheme: dark` para los controles nativos; no se activará un modo claro
mediante `prefers-color-scheme`.

La línea de tiempo y cualquier gráfico también deberán consumir la paleta activa.
Todas las variantes conservarán contraste legible, foco visible y estados que no
dependan únicamente del color.

### Implementación del movimiento

Se priorizarán transiciones CSS para estados simples y animaciones coordinadas en
React cuando la exploración lo requiera. Una biblioteca de animación se elegirá
solo si aporta valor al prototipo; no se presupone que haga falta WebGL ni 3D.

Los efectos favorecerán `transform` y `opacity` cuando corresponda, evitarán
recalcular continuamente el layout y no bloquearán los controles durante una
transición. Los valores de duración y suavizado serán tokens compartidos.

La publicación se propone mediante GitHub Actions, usando una única ruta de
validación y build tanto localmente como en CI. Los recursos deberán funcionar
bajo la subruta de GitHub Pages del repositorio, no solo en la raíz de un dominio.

## 8. Edición y persistencia

GitHub Pages no escribirá directamente en el repositorio. La primera versión no
requerirá cuentas, tokens de GitHub en el navegador ni un backend.

En la prueba inicial, toda la edición de contenido y progreso ocurre en GitHub.
La página no guarda borradores de contenido en el navegador; únicamente recuerda
el tema visual. Editar un archivo requiere la sesión de GitHub del usuario.

### Editor propio: propuesta posterior

Los siguientes pasos y reglas de borradores corresponden a una posible evolución:

1. El usuario abre la versión publicada y modifica un hito, una relación o un estado.
2. Los cambios quedan como borrador local, claramente distintos de lo publicado.
3. La aplicación valida y permite descargar los YAML completos de los archivos afectados.
4. El usuario revisa el diff y los guarda mediante un commit en el repositorio.
5. El build valida y publica una nueva versión.

Marcar como leído también es una edición: no se considerará guardado en GitHub
hasta completar ese flujo. Se propone conservar el borrador en almacenamiento
local para sobrevivir a recargas, sin tratarlo como respaldo ni sincronización
entre dispositivos.

La exportación deberá incluir todos los archivos afectados por una edición y
mantener la integridad de sus referencias. Antes de descartar o reemplazar un
borrador se hará visible que existen cambios pendientes.

Los borradores identificarán la versión de datos de la que parten. Si el catálogo
publicado cambia, se detectará la diferencia y se pedirá revisar o conciliar los
cambios antes de reutilizarlos; no habrá sobrescritura silenciosa.

El serializador deberá conservar todos los campos admitidos por el esquema.
La política sobre preservación de comentarios y formato manual del YAML sigue
pendiente y debe definirse antes de implementar el editor.

Los estados de lectura y notas que se incorporen a los YAML serán públicos,
igual que el resto del repositorio. Esta versión no contempla notas privadas.

## 9. Contenido, fuentes e idiomas

El catálogo inicial será una selección documentada, no una lista presentada como
exhaustiva. Las fuentes científicas serán especialmente relevantes para cosmología,
geología y evolución; los libros no serán el único tipo de evidencia admitido.

Cada hito publicado deberá tener al menos una fuente identificable. Se distinguirán
hechos documentados, estimaciones e interpretaciones debatidas. Las recomendaciones
de libros tendrán una breve justificación de su relación con el periodo o hito;
una recomendación no implicará que el usuario haya leído esa obra.

Los resúmenes serán originales y se enlazará a las fuentes; no se copiarán libros
ni materiales protegidos. Deben definirse las licencias del código y del catálogo
antes de incorporar datos externos.

Los textos editoriales tendrán campos `es` y `en`. Los títulos originales,
nombres propios y datos bibliográficos se conservarán sin inventar traducciones
o ediciones. Las citas o notas de lectura podrán mantenerse en su idioma original.

Durante la preparación podrá haber traducciones pendientes, señaladas como tales.
La propuesta para publicar es exigir ambos idiomas en los campos editoriales
obligatorios, en vez de presentar una traducción faltante como si estuviera completa.

## 10. Primera versión y evolución

### Prueba técnica actual

Validar primero lectura de YAML, diseño oscuro, islas React, edición delegada a
GitHub y generación estática. Los datos son ejemplos, no un catálogo completo ni
el esquema temporal definitivo.

Para ejecutarla localmente con Node.js 24:

```sh
npm ci
npm test
npm run build
npm run preview
```

La vista previa se abre bajo `/history/`; la versión inglesa está en `/history/en/`.
Para desarrollo interactivo se puede usar `npm run dev`.

Para publicar, una cuenta con permisos deberá incorporar los archivos a `main`
y configurar **Settings → Pages → Build and deployment → Source: GitHub Actions**.
El workflow valida y construye los PR sin desplegarlos, y publica los cambios de
`main`. Utiliza el token automático del workflow con permisos de despliegue:
no requiere configurar credenciales personales como secrets.

Los enlaces de edición solo funcionarán cuando los YAML existan en la rama
`main` del repositorio remoto.

### Primera versión funcional

- Catálogo pequeño pero conectado, con hitos representativos de todas las grandes escalas.
- Línea de tiempo con zoom, agrupación, ficha de hito y vista de lista.
- Búsqueda y filtros básicos por periodo, lugar/cultura, tema y lectura.
- Biblioteca, ediciones y relaciones entre hitos y fuentes.
- Registro de fechas propuestas por las fuentes y selección manual de la fecha adoptada.
- Estados de lectura, edición local y exportación de YAML.
- Interfaz y contenido editorial en español e inglés.
- Apariencia exclusivamente oscura, con tokens de tema y selector de variantes oscuras.
- Diseño visual propio y movimiento coherente en exploración, fichas y biblioteca.
- Publicación estática reproducible en GitHub Pages.

La cantidad de hitos y libros iniciales se acordará antes de poblar el catálogo.
Primero se verificará el modelo con ejemplos de cosmología, una fecha antigua
incierta, fechas en a. C./d. C., un intervalo y fuentes con fechas discrepantes.

### Evolución posterior

Ampliar la cobertura y las herramientas de investigación según el uso real:
comparación de cronologías regionales, mapas, relaciones entre hitos y sesiones
de relectura. No forman parte automática de la primera versión.

Quedan fuera inicialmente la edición colaborativa multiusuario, la escritura
directa a GitHub desde la web, la sincronización de borradores entre dispositivos,
los contenidos completos de libros y la recopilación automática indiscriminada.

## 11. Criterios de calidad y aceptación

- Los datos inválidos, identificadores duplicados y referencias rotas impedirán publicar.
- La validación cubrirá traducciones obligatorias, estados, fechas y extremos de intervalos.
- Corregir la fecha o el título de un hito no romperá sus relaciones ni su progreso.
- Las afirmaciones de las fuentes se conservarán al cambiar la fecha adoptada.
- La cronología ordenará correctamente fechas antiguas, modernas y edades científicas.
- La incertidumbre será visible y no se confundirá con la duración de un acontecimiento.
- Un cambio web exportado y guardado en GitHub reaparecerá tras la siguiente publicación.
- Los errores de carga, validación, almacenamiento y exportación serán visibles.
- El sitio funcionará en móvil y escritorio, con navegación por teclado y una
  alternativa textual accesible a la línea de tiempo.
- Los estados no dependerán únicamente del color para distinguirse.
- Cambiar de tema no reiniciará la navegación, los filtros ni los borradores.
- El tema elegido persistirá al recargar; la primera carga y los controles nativos
  también serán oscuros.
- La muestra visual se revisará en móvil y escritorio antes de extender sus
  patrones al resto del sitio; una plantilla sin trabajar no cumplirá el objetivo visual.
- Las animaciones mantendrán el contexto al navegar y no impedirán leer o interactuar.
  Con movimiento reducido, todas las funciones e indicaciones seguirán disponibles.
- La agrupación evitará dibujar todos los hitos simultáneamente; el presupuesto
  concreto de rendimiento se fijará cuando exista un catálogo representativo.

## 12. Decisiones pendientes

| Decisión | Propuesta inicial |
| --- | --- |
| Nombre público y paletas oscuras | Por definir; interfaz centrada en lectura y exploración, sin modo claro. |
| Identidad visual y animación | Validar una muestra de atlas editorial interactivo antes de extender el diseño; biblioteca de animación por decidir. |
| Tamaño y selección del catálogo inicial | Muestra global revisable, evitando que una sola región represente toda la historia humana. |
| Periodos y vocabularios | Definir etiquetas globales y regionales sin imponer límites europeos a todas las culturas. |
| Formato temporal definitivo | Probar casos científicos e históricos antes de cerrar el esquema. |
| Bibliotecas de interfaz y datos | Astro y React acordados; elegir biblioteca temporal, componentes y herramientas YAML tras un prototipo pequeño. |
| Relecturas y varias ediciones | Resolver si basta un estado por obra o se requieren sesiones de lectura. |
| Exportación y formato YAML | Acordar cómo se preservan comentarios, orden y formato al editar desde la web. |
| Licencias y fuentes de arranque | Elegir licencias y verificar condiciones antes de importar contenido. |

El siguiente paso de diseño será acordar una muestra de hitos y libros, y usarla
para concretar el esquema YAML y el comportamiento de la línea de tiempo.
