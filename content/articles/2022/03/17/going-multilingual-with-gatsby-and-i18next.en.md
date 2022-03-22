---
title: Going multilingual with Gatsby and i18next
date: "2022-03-17"
excerpt: Creating a website in multiple languages can be a relatively simple task, especially when it comes to small pages and without much projection of growth, but when it comes to a blog things can get a little complicated. While developing my blog I had to deal with this issue and in this article I want to share the solution I came up with.
thumbnail: gatsby-plus-react-i18next.webp
tags: ["gatsby", "i18next", "typescript", "tutorial"]
---

Before we start let's state the things we want to achieve:
- We want to create a blog that handles content through Markdown files.
- We need to be able to access the web from different languages, that is, a different URL for each language.  
- We also want that when we change the language on the article page, it will change language.
- We want to be able to detect the language of our browser so that the change is automatic, but we do not want to force it to always happen, because we want to allow anyone to see the content in the language they want regardless of the language of their browser.
- We also want it to be easily scalable, so we don't have to work on this again if someday in the future we want to add another language.

## Create a blog in Gatbsy

To create a blog in Gatsby based on Markdown files we can simply use a starter like [gatsby-starter-blog](https://www.gatsbyjs.com/starters/gatsbyjs/gatsby-starter-blog). But in my case I'm going to start from scratch, but if you already have your blog ready you can skip this step.

In case you want to create it from scratch with me you can follow the Gatsby [documentation](https://www.gatsbyjs.com/docs/quick-start) to get started quickly, or what I like the most, install the [Gatsby CLI](https://www.gatsbyjs.com/docs/reference/gatsby-cli/) and run `gatsby new` in console.

When running `gatsby new` we will be asked for the name of our project, the name of the folder where it will be saved, I called it "Multilingual Blog".  
Once chosen it will ask us if we are going to use any CMS, this is not our case so we select "No". It will also ask us how we are going to style our components, something that we are not going to touch in this article.  
Finally it asks us if we want to install additional plugins. **For our blog we will need Markdown support**. The rest of the plugins are at your discretion.

Once the configuration is finished we will have a project with a folder structure like this:

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

We are going to need a couple of extra files that don't come with creating the site from the Gatsby CLI.  
- The first one is to add `gatsby-node.js` to the root of the project. From that file we will be able to configure the URLs and the content of the dynamic pages of our site, among other things.  
- We are going to add the `blog` folder to the root of the project. In it we are going to create a subfolder for each article that we write, and inside these we will put the `index.lang.md` files. **Of course `.lang` is going to be replaced by the language we are going to use**, for this example it will be `en` (English) and `es` (Spanish).  
- Let's go ahead and create the `locales` folder at the root of the project. This folder will contain subfolders for each language we are going to use in our blog (locales/en/, locales/en/, etc). Inside each subfolder will be a `common.json` file, which is the file where we are going to save the sentences we need to translate.  
- We are going to create the `templates` folder inside the `src` folder. This folder is going to contain the files of the pages that we are going to create programmatically, in our case we could already create the `article.js` file.  
- We are going to add the `languages.js` file to the root. In that file we are going to export an object with the languages we are going to use, so in case we want to scale our project to more languages we can change it directly from there.
- In an extra step I will change the extension of the `.js` files to `.tsx`, to be able to use TypeScript, the superset of JavaScript. **The code I publish from now on will always be in TypeScript.

Doing all this we would end up with a structure similar to this:

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

##### Configure the `tsconfig.json` file

To use TypeScript in Gatsby it is recommended to create a `tsconfig.json` file in the root of the file.  
I leave the content of my file, but for more details there is always [the official documentation](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

I have to mention that the `baseUrl` property will change the way I import some files, from using a relative path to an absolute one. In Visual Studio Code this can also be done with JavaScript by creating a similar file called `jsconfig.json`.  
To make this change effective you have to add a block of code to `gatsby-node.js`, but that is something I will do later.

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

##### Setting up the `languages.js` file

We have just created a file that is going to export an object with the languages that we are going to use in our project. In our case we are going to use English and Spanish, but we want our default page to be in English, so the file we have to create would be like this:

```JavaScript
module.exports = {
  __DEFAULT_LANGUAGE__: "en",
  __LANGUAGES__: ["en", "es"],
};
```

### Add `i18next` to our project

To add i18next we will use the plugin [gatsby-plugin-react-i18next](https://www.gatsbyjs.com/plugins/gatsby-plugin-react-i18next/), we can do it by running the following command:

`npm install --save gatsby-plugin-react-i18next i18next react-i18next`

Or using yarn

`yarn add gatsby-plugin-react-i18next i18next react-i18next`

### Configure `gatsby.config.js`

Having done all of the above our `gatsby-config.js` file will look something like this:

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

Before starting with the configuration you can remove the code corresponding to `gatsby-source-filesystem`, since we will add ours next.  
The variables inside `siteMetadata` can be modified as you wish.

##### Import the object with the languages of our `languages.js`.

To do this we simply paste this line at the top.  
We will use these variables later when we configure i18next.

```JavaScript
const { __DEFAULT_LANGUAGE__, __LANGUAGES__ } = require("./languages");
```

##### Add the `blog` folder and `locales` folder to `gatsby-source-filesystem`.

It is important to add the `blog` folder so that Gatsby knows that this is where it has to get the `.md` files from, as well as the `locales` folder, so that it knows where it has to get the `.json` files with our translations.  
We do this by adding this code block to the plugin array.

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
    name: `locale`, // This name is important because we will use it later.
  },
},
```

##### Configure `gatsby-plugin-react-i18next`.

Now let's add and configure the `gatsby-plugin-react-i18next` plugin.  
You can read everything in more detail in [their documentation](https://www.gatsbyjs.com/plugins/gatsby-plugin-react-i18next/), but in the end you will end up with code similar to this inside the plugin array.

```JavaScript{4,19}
{
  resolve: `gatsby-plugin-react-i18next`,
  options: {
    localeJsonSourceName: `locale`, // It must be the same name we used in the previous configuration.
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
        matchPath: '/:lang/blog/:slug*', // Our blog address
        getLanguageFromPath: true,
      },
    ],
  },
},
```

##### The result of our configuration

With this we finished configuring `gatsby-config.js`, the complete file would look like this:

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
    name: `locale`, // This name is important because we will use it later.
    },
  },
  {
    resolve: `gatsby-plugin-react-i18next`,
    options: {
    localeJsonSourceName: `locale`, // It must be the same name we used in the previous configuration.
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
      matchPath: '/:lang/blog/:slug*', // Our blog address
      getLanguageFromPath: true,
      },
    ],
    },
  },
  ],
};
```

## Create some placeholders articles

In order to test our blog properly we are going to create a couple of placeholder articles, but for that we have to understand how we are going to generate the URL of the articles, because the structure of our folder is related to that task.

We add the `blog` folder to the root of our project, and **that is where we are going to add the articles we are going to write**.  
Since we have to write the articles in more than one language, what we are going to do is **create a folder for each article**, and inside that folder is where we are going to have our `.md` files in the different languages we need.  

**This article is going to have to have the same URL in all the languages**, so that we can see reflected in it the change of language.  
To achieve this we are going to use the name of the folder we created for each article as the slug for it, something we will do later when we configure `gatsby-node.js`.

For now, with that idea in mind, let's create a couple of articles in order to move forward.  
In my case I created 3 articles and my folder structure looked like this:

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

Now let's see what goes inside each `index.lang.md`.  
As we are going to work with very simplified examples our articles only have to have a title, a date and its content.  
Here are two examples:

**File `blog/my-first-article/index.en.md`**
```Markdown
---
title: My first article 
date: "2022-03-17"
---

# Content of my first article

Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, perferendis a delectus nemo ad iure.  
Magni inventore ipsam ut nihil in maiores, culpa ipsum odit suscipit distinctio aut hic optio totam nemo tenetur, sunt assumenda?
```

**File: `blog/my-first-article/index.es.md`**
```Markdown
---
title: Mi primer artículo 
date: "2022-03-17"
---

# Contenido de mi primer artículo

Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, perferendis a delectus nemo ad iure.  
Magni inventore ipsam ut nihil in maiores, culpa ipsum odit suscipit distinctio aut hic optio totam nemo tenetur, sunt assumenda?
```

> To learn more about Markdown it is best to read its [official documentation](https://www.markdownguide.org/).

## Show all the articles on the blog page

We need to show the list of the articles we have written in our blog, but first, since we are using TypeScript, I think it is a good idea to define the interface that our article will have.

##### An interface for our articles

I'm going to create a new folder called `models` inside `src` where I'm going to save all the interfaces I need, starting with the one for my Articles, which will be in the `Article.ts` file.  

We said we had to have a title, a date and its content; these data we have already defined when we created our `.lang.md` articles. When retrieving that data through GraphQL, we are going to receive it in an object called `frontmatter`, so the interface of our model should look like this:



```TypeScript
export interface IArticle {
  id: string; // The id created by Gatsby
  html: string; // Article content created by gatsby-source-filesystem
  frontmatter: {
    title: string;     //
    date: string;      // Our variables
    content: string;   //
  }
}
```

You can find more information about this [on this Gatsby page](https://www.gatsbyjs.com/docs/how-to/routing/adding-markdown-pages/#frontmatter-for-metadata-in-markdown-files).

#### Create our Blog page

When we set up `gatsby-plugin-react-i18next` we had defined that our blog was going to be at `/:lang/blog/:slug*`, which means that the URL is going to be `example.com/lang/blog`, and our articles will be at `example.com/lang/blog/my-first-article`.

Let's start by creating our `blog.tsx` file in the `pages` folder inside `src`.  
In this file we have to include the GraphQL query where we collect all the articles of our website.  
It will look something like this:

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

You can play around with the query builder that is in http://localhost:8000/__graphql.

Now if we go to http://localhost:8000/blog we should see a list of **all the items we have**, regardless of their language.  
Let's try to add the language to the URL.

## Manage the languages of our web site

If we go to any page of our web and we see the console in the browser we will find that we are throwing the following error:

![Console error](/images/Console.webp)

This is because `i18next` has nowhere to get our translations from, because we have not written the query that picks them up from our `locals` folder.

To fix that we simply **add this query on all pages of our website**, including the 404 error page.

```GraphQL
# The Query name must be different for each page.
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

**It is also important that you write at least one object in the `common.json` files of each language** for it to be generated.  
For example, in `en/common.json`:

```json
{
  "go_to_my_blog": "Go to my blog",
  "go_to_home": "Go to home",
  "my_articles": "My articles",
  "en": "English",
  "es": "Español"
}
```

And in `es/common.json`:

```json
{
  "go_to_my_blog": "Ir a mi blog",
  "go_to_home": "Ir a inicio",
  "my_articles": "Mis artículos",
  "en": "English",
  "es": "Español"
}
```

And to get it working **we are going to create a layout for our site that allows us to change the language of our web** on any page we are on.

If we are using TypeScript and we change the `baseUrl` configuration to import files we have to add this code block to our `gatsby-node.js`.

```JavaScript
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
    },
  });
};
```

Now we can create a folder called `components` inside `src` and inside I create a `Layout.tsx` file with the following code.

```TypeScript
import React from "react";
import { Helmet, useI18next, useTranslation } from "gatsby-plugin-react-i18next";
// Layout.module.css is a very basic style file that I made
import * as styles from "./Layout.module.css";

const Layout: React.FC = ({ children }) => {
  // language is the active language on the page
  // languages is an array with all available languages
  // changeLanguage is the function that allows us to change languages
  const { language, languages, changeLanguage } = useI18next();
  // useTranslation() allows us to access our translations
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

Let's apply that layout to our home page.  
We delete everything that came in `pages/index.tsx` and create our own.

```TypeScript
import React from "react";
import { graphql, PageProps } from "gatsby";
// Use the Link from gatsby-plugin-react-i18next
// allows us to set the urls to the language chosen by the user
// without the need to specify it on de url
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

##### The result

![Change language in the home page](/images/Switch_home.gif)

You can also do the same with the rest of the pages. I'll show the case of `blog.tsx` later in this post.

## Configure `gatsby-node.js`.

This part is the most important.  
You need to understand and configure correctly the nodes of our articles that we are going to create.  

##### Add new nodes to our articles

While when we retrieved our articles with graphql through the `blog.tsx` page we were able to access their content, we have no way of programmatically knowing what language it is written in and we have not defined a slug, so let's do that now.

To do this **we are going to add new nodes with this information to the markdown files as they are created**.  
Gatsby provides us with the `onCreateNode` function to accomplish this.  
I will write the code for this function explaining it, but all the information can be found in [the Gatsby documentation](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/#onCreateNode).

```JavaScript
// createFilePath will help us to create the url of our article.
const { createFilePath } = require("gatsby-source-filesystem");

exports.onCreateNode = ({ node, actions, getNode }) => {
  // createNodeField is the function that will create the new nodes.
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    // createFilePath will return a string like this:
    // /article-name/index.lang/
    // I use the split(".") to separate the language from the rest.
    const [slug, language] = createFilePath({ node, getNode }).split(".");
    // Now we have:
    // slug = /article-name/index
    // language = lang/

    // Now we create the node for the language.
    createNodeField({
      node,
      // language will be the name of the field that we are going to pick up when querying
      name: "language",
      // language has the value of "lang/"
      // this split function splits the string at the "/" at the end, returning only "lang".
      value: language.split("/")[0],
    });

    // We create the node for the slug.
    createNodeField({
      node,
      // Slug will be the name of the field that we are going to pick up when querying
      name: "slug",
      // Slug tiene el valor de "/article-name/index"
      // This split function splits the string into each "/".
      // We pick up only the second value of the returned array, wich is "article-name"
      value: slug.split("/")[1],
    });
  }
};
```

This will create a new field called `fields` that will group the new information that we have created.  
More information about `createNodeField` in [the Gatsby documentation](https://www.gatsbyjs.com/docs/reference/config-files/actions/#createNodeField)

##### Update the interface of our article

Now that we added the slug and the language to the nodes we are going to update that field field in the article interface.  
It will look something like this:

```TypeScript{8-11}
export interface IArticle {
  id: string; // The id created by Gatsby
  html: string; // Article content created by gatsby-source-filesystem
  frontmatter: {
    title: string;     //
    date: string;      // Our variables
    content: string;   //
  };
  fields: {
    slug: string;
    language: string;
  };
}
```

##### Create the URLs for our articles

Now that we have created the slugs for each article we are going to use them to create the dynamic URL for your pages with the `createPages` function.  
In the code I will discuss each thing, but to understand more about this function read [the Gatsby documentation](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/#createPages).

```JavaScript
// Path is used to work with the paths of our files.
const path = require("path");

exports.createPages = async ({ graphql, actions, reporter }) => {
  // With createPage we can create each page individually
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

  // If an error occurs, we report it and stop the execution.
  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading the page content`,
      result.errors
    );
    return;
  }

  // articles will be an array of articles
  const articles = result.data.articles.nodes;
  // The template of our articles
  // We have not created it yet, we are going to do it in the following step
  const articleTemplate = path.resolve(`./src/templates/article.tsx`);

  // We go through the articles array
  articles.forEach((article) => {
    // From the article, we only need the id, the slug and the language
    const { id } = article;
    const { slug, language } = article.fields;
    // We create the page for each of them
    createPage({
      // path will be the URL of the article
      path: `/${language}/blog/${slug}`,
      // component is the template we are going to use
      component: articleTemplate,
      // In context there are the parameters that we can pass to our template
      // They will be used to make the queries for each article.
      context: {
        id,
        slug,
        language,
      },
    });
  });
};
```

## Create and configure a template for our articles

If we start the site we will have a problem, because we still need to create the `article.tsx` file in the `templates` folder, so let's create a very simple one for this case making use of the layout already created.

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
  // Change the way the date is displayed according to the chosen language
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

This is reflected in the DOM:

![Change language in article](/images/Switch_article.gif).

## Update `blog.tsx`.

**Finally we have to update the `blog.tsx` file, in charge of rendering all the articles**.  
Unlike when we created it, we can now link each article to its page, as well as filter them according to the language we want.

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

I also sorted the files so that the most recent articles appear first.  

![Change language in article](/images/Switch_blog.gif)

**And with all this we would have finished setting up a very simple site in multiple languages, easy to scale and maintain.

## Considerations

There are things still to do that we may need to do, for example **if we want to paginate** our articles and show only a limited amount per page **we are going to have to create dynamic urls**s** (`/blog/`, `/blog/2`, etc) **for each of the languages we handle**.  
It is something that I am not going to do in this article because it is already too long, but maybe in the future I will share my way of doing it.

> I can not leave without leaving the repository in which I worked making this article.  
> You can access it [clicking here](https://github.com/cabellonic/multilingual-blog/tree/multilingual-blog-eng)