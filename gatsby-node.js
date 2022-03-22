const path = require('path')
const { createFilePath } = require(`gatsby-source-filesystem`)

const __ARTICLES_PER_PAGE__ = 6
const __PROJECTS_PER_PAGE__ = 6

exports.createPages = async ({ graphql, actions, reporter }) => {
	const { createPage } = actions

	const result = await graphql(`
		{
			projects: allMarkdownRemark(
				filter: { fields: { collection: { eq: "projects" } } }
				limit: 1000
			) {
				languages: group(field: fields___language) {
					totalCount
					language: fieldValue
				}
				nodes {
					id
					fields {
						slug
						language
					}
				}
			}

			articles: allMarkdownRemark(
				filter: { fields: { collection: { eq: "articles" } } }
				limit: 1000
			) {
				languages: group(field: fields___language) {
					totalCount
					language: fieldValue
					tags: group(field: frontmatter___tags) {
						totalCount
						tag: fieldValue
					}
				}
				nodes {
					id
					fields {
						slug
						language
					}
				}
			}
		}
	`)

	if (result.errors) {
		reporter.panicOnBuild(
			`There was an error loading the page content`,
			result.errors
		)
		return
	}

	// Blog pages

	const articlesLanguagesGroups = result.data.articles.languages
	const blogTemplate = path.resolve(`./src/templates/blog.tsx`)
	const tagTemplate = path.resolve(`./src/templates/tag.tsx`)

	console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
	console.log(':: CREATING BLOG AND TAG PAGES IN ALL THE LANGUAGES ::')
	console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - -')

	articlesLanguagesGroups.map(({ language, totalCount, tags }) => {
		console.log(`- Blog page for: /${language}/blog`)
		const totalArticlesPages = Math.ceil(totalCount / __ARTICLES_PER_PAGE__)
		Array.from({ length: totalArticlesPages }).forEach((_, blogPage) => {
			createPage({
				path:
					blogPage === 0
						? `/${language}/blog`
						: `/${language}/blog/${blogPage + 1}/`,
				component: blogTemplate,
				context: {
					limit: __ARTICLES_PER_PAGE__,
					skip: blogPage * __ARTICLES_PER_PAGE__,
					totalPages: totalArticlesPages,
					currentPage: blogPage + 1,
					baseUrl: `/blog`,
					language: language,
				},
			})
		})

		tags.map(({ tag, totalCount }) => {
			console.log(`- - Tag page for: /${language}/tag/${tag}`)
			const totalTagsPages = Math.ceil(totalCount / __ARTICLES_PER_PAGE__)
			Array.from({ length: totalTagsPages }).forEach((_, tagPage) => {
				createPage({
					path:
						tagPage === 0
							? `/${language}/tag/${tag}`
							: `/${language}/tag/${tag}/${tagPage + 1}/`,
					component: tagTemplate,
					context: {
						limit: __ARTICLES_PER_PAGE__,
						skip: tagPage * __ARTICLES_PER_PAGE__,
						totalPages: totalTagsPages,
						currentPage: tagPage + 1,
						baseUrl: `/tag/${tag}`,
						language: language,
						tag: tag,
					},
				})
			})
		})
	})

	// Articles

	const articles = result.data.articles.nodes
	const articleTemplate = path.resolve(`./src/templates/article.tsx`)

	console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
	console.log(':: CREATING EACH ARTICLE PAGE IN ALL THE LANGUAGES ::')
	console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - -')

	if (articles.length > 0) {
		articles.forEach((article) => {
			console.log(
				`- Article page for: /${article.fields.language}/blog${article.fields.slug}`
			)
			createPage({
				path: `/${article.fields.language}/blog${article.fields.slug}`,
				component: articleTemplate,
				context: {
					id: article.id,
					slug: `${article.fields.slug}`,
					language: article.fields.language,
				},
			})
		})
	}

	console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
	console.log(':: CREATING PORTFOLIO PAGES IN ALL THE LANGUAGES ::')
	console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - -')

	const projectsLanguagesGroups = result.data.projects.languages
	const portfolioTemplate = path.resolve(`./src/templates/portfolio.tsx`)

	projectsLanguagesGroups.map(({ language, totalCount }) => {
		console.log(`- Portfolio page for: /${language}/portfolio`)
		const totalPortfolioPages = Math.ceil(totalCount / __PROJECTS_PER_PAGE__)
		Array.from({ length: totalPortfolioPages }).forEach((_, portfolioPage) => {
			createPage({
				path:
					portfolioPage === 0
						? `/${language}/portfolio`
						: `/${language}/portfolio/${portfolioPage + 1}/`,
				component: portfolioTemplate,
				context: {
					limit: __PROJECTS_PER_PAGE__,
					skip: portfolioPage * __PROJECTS_PER_PAGE__,
					totalPages: totalPortfolioPages,
					currentPage: portfolioPage + 1,
					baseUrl: `/portfolio`,
					language: language,
				},
			})
		})
	})

	// Projects

	const projects = result.data.projects.nodes
	const projectTemplate = path.resolve(`./src/templates/project.tsx`)

	console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
	console.log(':: CREATING EACH PROJECT PAGE IN ALL THE LANGUAGES ::')
	console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - -')

	if (projects.length > 0) {
		projects.forEach((project) => {
			console.log(
				`- Project page for: /${project.fields.language}/portfolio${project.fields.slug}`
			)
			createPage({
				path: `/${project.fields.language}/portfolio${project.fields.slug}`,
				component: projectTemplate,
				context: {
					id: project.id,
					slug: `${project.fields.slug}`,
					language: project.fields.language,
				},
			})
		})
	}
}

exports.onCreateNode = ({ node, actions, getNode }) => {
	const { createNodeField } = actions

	if (node.internal.type === `MarkdownRemark`) {
		const [slug, language] = createFilePath({ node, getNode }).split('.')
		const collection = getNode(node.parent).sourceInstanceName

		if (collection === 'projects') {
			createNodeField({
				node,
				name: `slug`,
				value: `/${slug.split('/')[1]}`,
			})
		} else {
			createNodeField({
				node,
				name: `slug`,
				value: slug,
			})
		}

		createNodeField({
			node,
			name: 'collection',
			value: collection,
		})

		createNodeField({
			node,
			name: 'language',
			value: language.split('/')[0],
		})
	}
}

exports.createSchemaCustomization = ({ actions }) => {
	const { createTypes } = actions

	createTypes(`
    type SiteSiteMetadata {
      site_name: String
      author: Author
      siteUrl: String
      description: String
      social: Social
    }

    type Author {
      name: String
    }

    type Social {
      facebook: String
      instagram: String
      twitter: String
      telegram: String
      github: String
      linkedin: String
      email: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      excerpt: String
      date: Date @dateformat
      tags: [String]
      techs: [String]
	  duration: String
    }

    type Fields {
      slug: String
      collection: String
      language: String
    }
  `)
}

exports.onCreateWebpackConfig = ({ actions }) => {
	actions.setWebpackConfig({
		resolve: {
			alias: {
				'@layout': path.resolve(__dirname, 'src/layout'),
				'@components': path.resolve(__dirname, 'src/common/components'),
				'@svg': path.resolve(__dirname, 'src/common/svg'),
				'@sections': path.resolve(__dirname, 'src/app/sections'),
				'@models': path.resolve(__dirname, 'src/app/models'),
				'@hooks': path.resolve(__dirname, 'src/common/hooks'),
				'@modules': path.resolve(__dirname, 'src/modules'),
				'@styles': path.resolve(__dirname, 'src/app/styles'),
			},
		},
	})
}
