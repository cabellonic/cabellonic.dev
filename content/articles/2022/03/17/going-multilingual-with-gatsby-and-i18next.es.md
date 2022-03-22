---
title: Cómo crear un blog multilingüe con Gatsby y i18next 
date: "2022-03-17"
excerpt: Crear un sitio web en múltiples idiomas puede ser una tarea relativamente sencilla, sobre todo cuando se trata de páginas pequeñas y sin mucha proyección de crecimiento, pero cuando se trata de un blog la cosa puede complicarse un poco. Mientras desarrollaba mi blog tuve que hacerle frente a este asunto y en este artículo quiero compartir la solución a la que llegué.
thumbnail: gatsby-plus-react-i18next.webp
tags: ["gatsby", "i18next", "typescript", "tutorial"]
---

Antes de empezar vamos a plantear las cosas que queremos lograr:
- Queremos crear un blog que maneje contenido a través de archivos Markdown.
- Necesitamos poder acceder a la web desde los diferentes idiomas, es decir, una URL diferente para cada idioma.  
- Buscamos también que cuando cambiemos el idioma en la página del artículo, éste cambie de idioma.
- Queremos poder detectar el idioma de nuestro navegador para que el cambio sea automático, pero no queremos forzar a que suceda siempre, porque queremos permitir que cualquier persona vea el contenido en el idioma que desee independientemente del idioma de su navegador.
- Queremos también que sea fácilmente escalable, para no tener que trabajar de nuevo en esto si algún día en el futuro queremos agregar otro idioma.

## Crear un blog en Gatbsy

Para crear un blog en Gatsby basado en archivos Markdown podemos simplemente utilizar un starter como [gatsby-starter-blog](https://www.gatsbyjs.com/starters/gatsbyjs/gatsby-starter-blog). En mi caso voy a empezar desde cero, pero si ya tienen su blog listo pueden saltar este paso.

En caso de que quieran crearlo desde cero conmigo pueden seguir la [documentación](https://www.gatsbyjs.com/docs/quick-start) de Gatsby para empezar rápidamente, o lo que a mi me gusta más, instalar la [CLI de Gatsby](https://www.gatsbyjs.com/docs/reference/gatsby-cli/) y ejecutar en consola `gatsby new`.

Al ejecutar `gatsby new` se nos preguntará por el nombre de nuestro proyecto, el nombre de la carpeta donde se guardará, yo lo llamé "Multilingual Blog".  
Una vez elegidos nos va a preguntar si vamos a utilizar algún CMS, no es nuestro caso así que seleccionamos "No". Nos preguntará también cómo vamos a estilizar nuestros componentes, algo que no vamos a tocar en este artículo.  
Finalmente nos pregunta si deseamos instalar plugins adicionales. **Para nuestro blog vamos a necesitar soporte para Markdown**. El resto de plugins queda a discreción de cada uno.

Una vez se haya terminado de configurar vamos a tener un proyecto con una estructura de carpetas como esta:

```
multilingual-blog/
├── public/
├── node_modules/
├── src/
│   ├── images/
│   └── pages/
│       ├── 404.js
│       └── index.js
└── gatsby-config.js
```

Vamos a necesitar un par de archivos extra que no vienen al crear el sitio desde la CLI de Gatsby.  
- El primero es agregar `gatsby-node.js` a la raíz del proyecto. Desde ese archivo vamos a poder configurar las URL y el contenido de las páginas dinámicas de nuestro sitio, entre otras cosas más.  
- Vamos a agregar la carpeta `blog` a la raíz del proyecto. En ella vamos a crear una subcarpeta para cada artículo que escribamos, y dentro de estas pondremos los archivos `index.lang.md`. **Por supuesto que `.lang` se va a reemplazar por el idioma que vayamos a utilizar**, para este ejemplo serán `en` (inglés) y `es` (español).  
- Vamos a adelantarnos y a crear la carpeta `locales` a la raíz del proyecto. Esta carpeta va a contener subcarpetas para cada idioma que vayamos a utilizar en nuestro blog (locales/en/, locales/es/, etc). Dentro de cada subcarpeta irá un archivo `common.json`, que es el archivo donde vamos a guardar las frases que necesitemos traducir.  
- Vamos a crear la carpeta `templates` dentro de la carpeta `src`. Esta carpeta va a contener los archivos de las páginas que vamos a crear programáticamente, en nuestro caso podríamos crear ya el archivo `article.js`.  
- Vamos a agregar el archivo `languages.js` a la raíz. En ese archivos vamos a exportar un objeto con los idiomas que vamos a utilizar, así en caso de que queramos escalar nuestro proyecto a más idiomas podemos cambiarlo directamente desde ahí.
- En un paso extra voy a cambiar la extensión de los archivos `.js` a `.tsx`, para poder utilizar TypeScript, el superset de JavaScript. **El código que publique a partir de ahora siempre será en TypeScript**.

Haciendo todo esto terminaríamos una estructura similar a esta:

```{4-12,18-19,21-23}
multilingual-blog/
├── public/
├── node_modules/
├── blog/
│   └── my-first-article/  << El nombre será la URL del artículo
│     ├── index.en.md
│     └── index.es.md
├── locales/
│   └── en/
│   │   └── common.json
│   └── es/
│       └── 404.json
├── src/
│   ├── images/
│   ├── pages/
│   │   ├── 404.tsx
│   │   └── index.tsx
│   └── templates/
│       └── article.tsx
├── gatsby-config.js
├── gatsby-node.js
├── languages.js
└── tsconfig.json
```

##### Configurar el archivo `tsconfig.json`

Para usar TypeScript en Gatsby es recomendable crear un archivo `tsconfig.json` en la raíz del archivo.  
Dejo el contenido de mi archivo, pero para más detalles siempre está [la documentación oficial](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

Tengo que mencionar que la propiedad `baseUrl` va a cambiar la forma en la que importo algunos archivos, de usar un path relativo a uno absoluto. En Visual Studio Code esto también se puede hacer con JavaScript creando un archivo similar llamado `jsconfig.json`.  
Para hacer efectivo este cambio hay que agregar un bloque de código a `gatsby-node.js`, pero es algo que haré más adelante.

```json{3}
{
  "compilerOptions": {
  "baseUrl": "src",
  "target": "es6",
  "module": "commonjs",
  "jsx": "react",
  "strict": true,
  "noImplicitAny": false,
  "esModuleInterop": true,
  "skipLibCheck": true,
  "forceConsistentCasingInFileNames": true
  }
}
```

##### Configurar el archivo `languages.js`

Acabamos de crear un archivo que va a exportar un objeto con los idiomas que vamos a utilizar en nuestro proyecto. En nuestro caso vamos a utilizar inglés y español, pero queremos que nuestra página predeterminada esté en inglés, así que el archivo que tenemos que crear sería así:

```JavaScript
module.exports = {
  __DEFAULT_LANGUAGE__: "en",
  __LANGUAGES__: ["en", "es"],
};
```

### Agregar `i18next` a nuestro proyecto

Para agregar i18next vamos a utilizar el plugin [gatsby-plugin-react-i18next](https://www.gatsbyjs.com/plugins/gatsby-plugin-react-i18next/), lo podemos hacer ejecutando el siguiente comando:

`npm install --save gatsby-plugin-react-i18next i18next react-i18next`

O bien mediante yarn:

`yarn add gatsby-plugin-react-i18next i18next react-i18next`

### Configurar `gatsby.config.js`

Habiendo hecho todo lo anterior nuestro archivo `gatsby-config.js` se va a ver algo así:

```JavaScript
module.exports = {
  siteMetadata: {
  title: `multilingual-blog`,
  siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [
  "gatsby-plugin-react-helmet",
  "gatsby-transformer-remark",
  {
    resolve: "gatsby-source-filesystem",
    options: {
    name: "pages",
    path: "./src/pages/",
    },
    __key: "pages",
  },
  ],
};
```

Antes de empezar con la configuración pueden eliminar el código correspondiente a `gatsby-source-filesystem`, ya que a continuación agregaremos el nuestro.  
Las variables dentro de `siteMetadata` las pueden modificar a gusto.

##### Importar el objeto con los idiomas de nuestro `languages.js`

Para hacerlo simplemente pegamos esta línea arriba del todo.  
Estas variables las vamos a utilizar más adelante cuando configuremos i18next.

```JavaScript
const { __DEFAULT_LANGUAGE__, __LANGUAGES__ } = require("./languages");
```

##### Agregar la carpeta `blog` y `locales` a `gatsby-source-filesystem`

Es importante agregar la carpeta `blog` para que Gatsby sepa que es ahí de dónde tiene que sacar los archivos `.md`, así como la carpeta `locales`, para que sepa de dónde tiene que sacar los archivos `.json` con nuestras traducciones.  
Lo hacemos agregando este bloque de código al arreglo de plugins.

```JavaScript{12}
{
  resolve: `gatsby-source-filesystem`,
  options: {
    path: `${__dirname}/blog`,
    name: `articles`,
  },
},
{
  resolve: `gatsby-source-filesystem`,
  options: {
    path: `${__dirname}/locales`,
    name: `locale`, // Este nombre es importante porque lo usaremos más adelante.
  },
},
```

##### Configurar `gatsby-plugin-react-i18next`

Ahora vamos a agregar y configurar el plugin `gatsby-plugin-react-i18next`.  
Pueden leer cada cosa más detallada en [su documentación](https://www.gatsbyjs.com/plugins/gatsby-plugin-react-i18next/), pero al final terminarán con un código similar a este dentro del arreglo de plugins.

```JavaScript{4,19}
{
  resolve: `gatsby-plugin-react-i18next`,
  options: {
    localeJsonSourceName: `locale`, // Debe ser el mismo nombre que usamos en la configuración anterior.
    defaultLanguage: __DEFAULT_LANGUAGE__,
    languages: __LANGUAGES__,
    redirect: true,
    generateDefaultLanguagePage: true,
    siteUrl: `https://example.com`,
    i18nextOptions: {
      interpolation: {
        escapeValue: false,
      },
      keySeparator: false,
      nsSeparator: false,
    },
    pages: [
      {
        matchPath: '/:lang/blog/:slug*', // La dirección de nuestro blog
        getLanguageFromPath: true,
      },
    ],
  },
},
```

##### El resultado de nuestra configuración

Con esto terminamos de configurar `gatsby-config.js`, el archivo completo quedaría así:

```JavaScript
const { __DEFAULT_LANGUAGE__, __LANGUAGES__ } = require("./languages");

module.exports = {
  siteMetadata: {
  title: `multilingual-blog`,
  siteUrl: `https://www.example.com`,
  },
  plugins: [
  "gatsby-plugin-react-helmet",
  "gatsby-transformer-remark",
  {
    resolve: `gatsby-source-filesystem`,
    options: {
    path: `${__dirname}/blog`,
    name: `articles`,
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
    path: `${__dirname}/locales`,
    name: `locale`, // Este nombre es importante porque lo usaremos más adelante.
    },
  },
  {
    resolve: `gatsby-plugin-react-i18next`,
    options: {
    localeJsonSourceName: `locale`, // Debe ser el mismo nombre que usamos en la configuración anterior.
    defaultLanguage: __DEFAULT_LANGUAGE__,
    languages: __LANGUAGES__,
    redirect: true,
    generateDefaultLanguagePage: true,
    siteUrl: `https://example.com/`,
    i18nextOptions: {
      interpolation: {
      escapeValue: false,
      },
      keySeparator: false,
      nsSeparator: false,
    },
    pages: [
      {
      matchPath: "/:lang/blog/:slug*", // La dirección de nuestro blog
      getLanguageFromPath: true,
      },
    ],
    },
  },
  ],
};
```

## Crear algunos artículos placeholders

Para poder testear bien nuestro blog vamos a crear un par de artículos placeholders, pero para eso tenemos que entender cómo vamos a generar la URL de los artículos, porque la estructura de nuestra carpeta está relacionada con esa tarea.

Nosotros agregamos la carpeta `blog` a la raíz de nuestro proyecto, y **es ahí donde vamos a agregar los artículos que vayamos escribiendo**.  
Como tenemos que escribir los artículos en más de un idioma, lo que vamos a hacer es **crear una carpeta para cada artículo**, y dentro de esa carpeta es donde vamos a tener nuestros archivos `.md` en los distintos lenguajes que necesitemos.  

**Este artículo va a tener que tener la misma URL en todos los idiomas**, para que podamos ver reflejado en él el cambio de idioma.  
Para lograr esto vamos a utilizar el nombre de la carpeta que creamos para cada artículo como slug de éste, algo que haremos más adelante cuando configuremos `gatsby-node.js`.

Por ahora, con esa idea en mente, vamos a crear un par de artículos para poder avanzar.  
En mi caso creé 3 artículos y mi estructura de carpetas quedó así:

```
multilingual-blog/
├── blog/
│   ├── my-first-article/
│   │   ├── index.en.md
│   │   └── index.es.md
│   ├── another-article/
│   │   ├── index.en.md
│   │   └── index.es.md
│   └── a-third-one/
│       ├── index.en.md
│       └── index.es.md
├── ...
```

Ahora veamos qué es lo que va dentro de cada `index.lang.md`.  
Como vamos a trabajar con ejemplos bien simplificados nuestros artículos solo tienen que tener un título, una fecha y su contenido.  
Dejo dos ejemplos:

**Archivo `blog/my-first-article/index.en.md`**
```Markdown
---
title: My first article 
date: "2022-03-17"
---

# Content of my first article

Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, perferendis a delectus nemo ad iure.  
Magni inventore ipsam ut nihil in maiores, culpa ipsum odit suscipit distinctio aut hic optio totam nemo tenetur, sunt assumenda?
```

**Archivo: `blog/my-first-article/index.es.md`**
```Markdown
---
title: Mi primer artículo 
date: "2022-03-17"
---

# Contenido de mi primer artículo

Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, perferendis a delectus nemo ad iure.  
Magni inventore ipsam ut nihil in maiores, culpa ipsum odit suscipit distinctio aut hic optio totam nemo tenetur, sunt assumenda?
```

> Para aprender más sobre Markdown lo mejor es leer su [documentación oficial](https://www.markdownguide.org/).

## Mostrar todos los artículos en la página de blog

Necesitamos mostrar la lista de los artículos que hayamos escrito en nuestro blog, pero antes, ya que estamos utilizando TypeScript, me parece una buena idea definir la interfaz que va a tener nuestro artículo.

##### Una interfaz para nuestros artículos

Voy a crear una nueva carpeta llamada `models` dentro de `src` en donde voy a guardar todas las interfaces que necesite, empezando por la de mis Artículos, que estará en el archivo `Article.ts`.  

Dijimos que teníamos que tener un título, una fecha y su contenido; estos datos ya los hemos definido cuando creamos nuestros artículos `.lang.md`. Al recuperar esos datos a través de GraphQL, vamos a recibirlos en un objeto llamado `frontmatter`, por lo que la interfaz de nuestro modelo debe ser así:

```TypeScript
export interface IArticle {
  id: string; // El id creado por Gatsby
  html: string; // El contenido creado por gatsby-source-filesystem
  frontmatter: {
    title: string;     //
    date: string;      // Nuestras variables
    content: string;   //
  }
}
```

Pueden encontrar más información sobre esto [en esta página de Gatsby](https://www.gatsbyjs.com/docs/how-to/routing/adding-markdown-pages/#frontmatter-for-metadata-in-markdown-files).

#### Crear la página de nuestro Blog

Cuando configuramos `gatsby-plugin-react-i18next` habíamos definido que nuestro blog iba a estar en `/:lang/blog/:slug*`, lo que quiere decir que la URL va a ser `example.com/lang/blog`, y nuestros artículos estarán en `example.com/lang/blog/my-first-article`.

Empecemos creando nuestro archivo `blog.tsx` en la carpeta `pages` dentro de `src`.  
En este archivo tenemos que incluir la query de GraphQL donde recogemos todos los artículos de nuestra web.  
Nos quedará algo así:

```TypeScript
import React from "react";
import { graphql, PageProps } from "gatsby";
// Models
import { IArticle } from "models/Article";

type BlogPageProps = {
  articles: {
    nodes: IArticle[];
  };
};

const BlogPage: React.FC<PageProps<BlogPageProps>> = ({ data }) => {
  const articles = data.articles.nodes;
  return (
    <main>
      <h1>Blog</h1>
      {articles.map((article) => {
        const { title } = article.frontmatter;
        return (
          <article key={article.id}>
            <h2>{title}</h2>
            <hr />
          </article>
        );
      })}
    </main>
  );
};

export default BlogPage;

export const BlogPageQuery = graphql`
  query BlogPageQuery {
    articles: allMarkdownRemark {
      nodes {
        id
        frontmatter {
          title
          date
        }
      }
    }
  }
`;
```

Puedes jugar con el constructor de queries que está en http://localhost:8000/__graphql.

Ahora si vamos a http://localhost:8000/blog deberíamos ver una lista de **todos los artículos que tenemos**, independientemente de su idioma.  
Intentemos agregar el idioma a la url.

## Manejar los idiomas de nuestra web

Si vamos a cualquier página de nuestra web y vemos la consola en el navegador nos vamos a encontrar con que nos está arrojando el siguiente error:

![Error en consola](/images/Console.webp)

Esto es porque `i18next` no tiene de dónde sacar nuestras traducciones, porque no hemos escrito la query que las recoge de nuestra carpeta `locales`.

Para arreglar eso simplemente **agregamos esta query en todas las páginas de nuestra web**, incluida la página del error 404.

```GraphQL
# El nombre de la Query debe ser distinto para cada página.
export const BlogPageQuery = graphql`
  query BlogPageQuery($language: String!) {
    locales: allLocale(
      filter: { ns: { in: ["common"] }, language: { eq: $language } }
    ) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`
```

**Es importante también que escriban al menos un objeto en los archivos `common.json` de cada idioma** para que éste se genere.  
Por ejemplo, en `en/common.json`:

```json
{
  "go_to_my_blog": "Go to my blog",
  "go_to_home": "Go to home",
  "my_articles": "My articles",
  "en": "English",
  "es": "Español"
}
```

Y en `es/common.json`:

```json
{
  "go_to_my_blog": "Ir a mi blog",
  "go_to_home": "Ir a inicio",
  "my_articles": "Mis artículos",
  "en": "English",
  "es": "Español"
}
```

Y para ponerlo en funcionamiento **vamos a crear una layout para nuestro sitio que nos permita cambiar el idioma de nuestra web** en cualquier página que estemos.

Si estamos usando TypeScript y cambiamos la configuración del `baseUrl` para importar archivos tenemos que agregar este bloque de código a nuestro `gatsby-node.js`

```JavaScript
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
    },
  });
};
```

Ahora sí ya podemos crear una carpeta llamada `components` dentro de `src` y dentro creo un archivo `Layout.tsx` con el siguiente código.

```TypeScript
import React from "react";
import { Helmet, useI18next, useTranslation } from "gatsby-plugin-react-i18next";
// Layout.module.css es un archivo de estilos muy básico que hice
import * as styles from "./Layout.module.css";

const Layout: React.FC = ({ children }) => {
  // language es el lenguaje activo en la página
  // languages es un arreglo con todos los lenguajes disponibles
  // changeLanguage es la función que nos permite cambiar de lenguaje
  const { language, languages, changeLanguage } = useI18next();
  // useTranslation() nos permite acceder a nuestras traducciones
  const { t } = useTranslation();
  return (
    <div>
      <Helmet>
        <title>Multilingual Blog</title>
      </Helmet>
      <header className={styles.header}>Multilingual Blog</header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        {languages.map((lang) => (
          <a
            key={lang}
            href="#"
            className={lang === language ? styles.active : ""}
            onClick={(e) => {
              e.preventDefault();
              changeLanguage(lang);
            }}
          >
            {t(lang)}
          </a>
        ))}
      </footer>
    </div>
  );
};

export default Layout;
```

Apliquemos ese layout a nuestra página de inicio.  
Borramos todo lo que venía en `pages/index.tsx` y creamos la nuestra.

```TypeScript
import React from "react";
import { graphql, PageProps } from "gatsby";
// Utilizar el Link de gatsby-plugin-react-i18next
// nos permite que las urls tengan el idioma que el usuario eligió
// sin la necesidad de tener que especificarlo
import { Link, useTranslation } from "gatsby-plugin-react-i18next";
// Components
import Layout from "components/Layout";

const HomePage: React.FC<PageProps> = ({}) => {
  const { t } = useTranslation();
  return (
    <Layout>
      <Link to="/blog">
        <h1>« {t("go_to_my_blog")} »</h1>
      </Link>
    </Layout>
  );
};

export default HomePage;

export const HomeQuery = graphql`
  query Home($language: String!) {
    locales: allLocale(
      filter: { ns: { in: ["common"] }, language: { eq: $language } }
    ) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
```

##### El resultado

![Cambiar idioma en la página de inicio](/images/Switch_home.gif)

También se puede hacer lo mismo con el resto de páginas. Voy a mostrar el caso de `blog.tsx` más adelante en el artículo.

## Configurar `gatsby-node.js`

Esta parte es la más importante.  
Se necesita entender y configurar correctamente los nodos de nuestros artículos que vamos a ir creando.  

##### Agregar nuevos nodos a nuestros artículos

Si bien cuando recuperamos nuestros artículos con graphql a través de la página `blog.tsx` pudimos acceder a su contenido, no tenemos forma de saber programáticamente en qué idioma está escrito y no hemos definido un slug, así que vamos a hacerlo ahora.

Para ello **vamos a agregar nuevos nodos con esta información a los archivos markdown a medida que estos se van creando**.  
Gatsby nos facilita la función `onCreateNode` para lograrlo.  
Voy a escribir el código de esta función explicandolo, pero toda la información la pueden encontrar en [la documentación de Gatsby](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/#onCreateNode).

```JavaScript
// createFilePath nos va a ayudar a crear la URL de nuestro artículo.
const { createFilePath } = require("gatsby-source-filesystem");

exports.onCreateNode = ({ node, actions, getNode }) => {
  // createNodeField es la función que va a crear los nuevos nodos.
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    // createFilePath va a devolver un string de esta manera:
    // /article-name/index.lang/
    // El split(".") lo utilizo para separar el idioma del resto.
    const [slug, language] = createFilePath({ node, getNode }).split(".");
    // Nos va a quedar:
    // slug = /article-name/index
    // language = lang/

    // Creamos el nodo para el idioma.
    createNodeField({
      node,
      // Language es el nombre del campo que vamos a recoger al hacer la query
      name: "language",
      // Language tiene el valor de "lang/"
      // Este split parte el string en el "/" del final, devolviendonos solo "lang"
      value: language.split("/")[0],
    });

    // Creamos el nodo para el slug.
    createNodeField({
      node,
      // Slug es el nombre del campo que vamos a recoger al hacer la query
      name: "slug",
      // Slug tiene el valor de "/article-name/index"
      // Este split parte el string en cada "/"
      // Recogiendo el segundo valor del array nos devuelve solo "article-name"
      value: slug.split("/")[1],
    });
  }
};
```

Esto lo que va a hacer es crear un nuevo campo llamado `fields` que va a agrupar la nueva información que hemos creado.  
Más información sobre `createNodeField` en [la documetanción de Gatsby](https://www.gatsbyjs.com/docs/reference/config-files/actions/#createNodeField)

##### Actualizar la interfaz de nuestro artículo

Ahora que agregamos el slug y el lenguaje a los nodos vamos a actualizar ese campo field en la interfaz del artículo.  
Nos va a quedar algo así:

```TypeScript{8-11}
export interface IArticle {
  id: string; // El id creado por Gatsby
  html: string; // El contenido creado por gatsby-source-filesystem
  frontmatter: {
    title: string;     //
    date: string;      // Nuestras variables
    content: string;   //
  };
  fields: {
    slug: string;
    language: string;
  };
}
```

##### Crear las URL de nuestros artículos

Ahora que ya hemos creado los slugs para cada artículo vamos a utilizarlos para crear la URL dinámica para sus páginas con la función `createPages`.  
En el código voy a comentar cada cosa, pero para entender más sobre esta función lean [la documentación de Gatsby](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/#createPages).

```JavaScript
// Path sirve para trabajar con las rutas de nuestros archivos.
const path = require("path");

exports.createPages = async ({ graphql, actions, reporter }) => {
  // Con createPage podemos crear cada página individualmente
  const { createPage } = actions;
  // Recogemos con graphql todos los archivos Markdown que hemos creado
  const result = await graphql(`
    {
      articles: allMarkdownRemark(limit: 1000) {
        nodes {
          id
          fields {
            slug
            language
          }
        }
      }
    }
  `);

  // Si ocurre algún error lo reportamos y detenemos la ejecución
  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading the page content`,
      result.errors
    );
    return;
  }

  // articles va a ser un arreglo de artículos
  const articles = result.data.articles.nodes;
  // El template de nuestros artículos
  // Aún no lo hemos creado, lo vamos a hacer en el siguiente paso
  const articleTemplate = path.resolve(`./src/templates/article.tsx`);

  // Recorremos el arreglo de artículos
  articles.forEach((article) => {
    // Del artículo solo necesitamos el id, el slug y el lenguaje
    const { id } = article;
    const { slug, language } = article.fields;
    // Creamos la página para cada uno de ellos
    createPage({
      // path va a ser la URL del artículo
      path: `/${language}/blog/${slug}`,
      // component es el template que vamos a usar
      component: articleTemplate,
      // En context están los parámetros que podemos pasar a nuestro template
      // Nos van a servir para hacer las queries de cada artículo
      context: {
        id,
        slug,
        language,
      },
    });
  });
};
```

## Crear y configurar un template para nuestros artículos

Si arrancamos el sitio vamos a tener un problema, porque aún nos falta crear el archivo `article.tsx` en la carpeta `templates`, así que creemos uno muy simple para este caso haciendo uso del layout ya creado.

```TypeScript
import React from "react";
import { graphql, PageProps } from "gatsby";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";
// Models
import { IArticle } from "models/Article";
// Components
import Layout from "components/Layout";

type ArticlePageProps = {
  article: IArticle;
};

const ArticlePage: React.FC<PageProps<ArticlePageProps>> = ({ data }) => {
  const { t } = useTranslation();
  const article = data.article;
  const { title, date } = article.frontmatter;
  const { language } = article.fields;
  // Cambio la forma en la que se muestra la fecha según el idioma elegido
  const formattedDate = new Date(date).toLocaleDateString(language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Layout>
      <h1>{title}</h1>
      <small>{formattedDate}</small>
      <main dangerouslySetInnerHTML={{ __html: article.html }} />
      <hr />
      <Link to="/blog">
        <h1>« {t("go_to_my_blog")} »</h1>
      </Link>
    </Layout>
  );
};

export default ArticlePage;

export const ArticlePageQuery = graphql`
  query ArticlePageQuery($language: String!, $slug: String!) {
    locales: allLocale(
      filter: { ns: { in: ["common"] }, language: { eq: $language } }
    ) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }

    article: markdownRemark(
      fields: { slug: { eq: $slug }, language: { eq: $language } }
    ) {
      html
      frontmatter {
        date
        title
      }
      fields {
        slug
        language
      }
    }
  }
`;
```

Esto se ve reflejado así en el DOM:

![Cambiar idioma en artículo](/images/Switch_article.gif)

## Actualizar `blog.tsx`

**Finalmente nos toca actualizar el archivo `blog.tsx`, encargado de renderizar todos los artículos**.  
A diferencia de cuando lo creamos, ya podemos enlazar cada artículo a su página, además de filtrarlos según el idioma que queramos.  

```TypeScript
import React from "react";
import { graphql, PageProps } from "gatsby";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";
// Components
import Layout from "components/Layout";
// Models
import { IArticle } from "models/Article";

type BlogPageProps = {
  articles: {
    nodes: IArticle[];
  };
};

const BlogPage: React.FC<PageProps<BlogPageProps>> = ({ data }) => {
  const { t } = useTranslation();
  const articles = data.articles.nodes;

  return (
    <Layout>
      <h1>{t("my_articles")}</h1>
      {articles.map((article) => {
        const { title } = article.frontmatter;
        const { slug } = article.fields;
        return (
          <Link to={`/blog/${slug}`} key={article.id}>
            <h2>{title}</h2>
          </Link>
        );
      })}
      <Link to="/">
        <h1>« {t("go_to_home")} »</h1>
      </Link>
    </Layout>
  );
};

export default BlogPage;

export const BlogPageQuery = graphql`
  query BlogPageQuery($language: String!) {
    locales: allLocale(
      filter: { ns: { in: ["common"] }, language: { eq: $language } }
    ) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }

    articles: allMarkdownRemark(
      filter: { fields: { language: { eq: $language } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      nodes {
        id
        frontmatter {
          title
          date
        }
        fields {
          slug
          language
        }
      }
    }
  }
`;
```

También ordené los archivos de manera que aparezcan los artículos más recientes en primer lugar.  

![Cambiar idioma en artículo](/images/Switch_blog.gif)

**Y con todo esto habríamos terminado de configurar un sitio muy simple en múltiples idiomas, fácil de escalar y mantener.**

## Consideraciones

Hay cosas que aún faltan por hacer, que puede que necesitemos, por ejemplo **si queremos paginar** nuestros artículos y mostrar solo una cantidad limitada por cada página **vamos a tener que crear las url dinámica**s** (`/blog/`, `/blog/2`, etc) **para cada uno de los idiomas que manejemos**.  
Es algo que no voy a hacer en este artículo porque ya es demasiado largo, pero igual en el futuro comparto mi forma de realizarlo.

> No puedo irme sin dejar el repositorio en el que trabajé haciendo este artículo.  
> Pueden acceder a el [clickeando aquí](https://github.com/cabellonic/multilingual-blog/tree/multilingual-blog-esp)