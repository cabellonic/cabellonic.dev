const { __DEFAULT_LANGUAGE__, __LANGUAGES__ } = require('./languages')

const queries = require('./src/modules/algolia/queries')

require('dotenv').config({
	path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
	siteMetadata: {
		site_name: `Cabellonic.dev`,
		siteUrl: `https://cabellonic.dev`,
		image: '/images/placeholder.png',
		author: {
			name: `Nicolás Cabello`,
			photo: `/images/photo.webp`,
			photo_alt: `/images/photo_alt.webp`,
		},
		social: {
			twitter: `cabellonic`,
			facebook: `cabellonic`,
			instagram: `cabellonic`,
			telegram: `cabellonic`,
			github: `cabellonic`,
			linkedin: `cabellonic`,
			email: `cabellonic@gmail.com`,
		},
	},

	plugins: [
		`gatsby-plugin-fontawesome-css`,
		`gatsby-plugin-robots-txt`,
		`gatsby-transformer-json`,
		'gatsby-transformer-sharp',
		{
			resolve: 'gatsby-plugin-sass',
			options: {
				additionalData: `@use 'main' as *;`,
				sassOptions: {
					includePaths: [`${__dirname}/src/app/styles`],
				},
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/src/app/data`,
				name: `data`,
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/locales`,
				name: `locale`,
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/content/articles`,
				name: `articles`,
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/content/projects`,
				name: `projects`,
			},
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'images',
				path: './src/images/',
			},
			__key: 'images',
		},
		{
			resolve: 'gatsby-plugin-manifest',
			options: {
				icon: 'src/images/icon.png',
			},
		},
		{
			resolve: `gatsby-transformer-remark`,
			options: {
				plugins: [
					{
						resolve: `gatsby-remark-images`,
						options: {
							maxWidth: 1200,
						},
					},
					{
						resolve: 'gatsby-remark-embed-youtube',
						options: {
							width: 800,
							height: 400,
						},
					},
					{
						resolve: `gatsby-remark-responsive-iframe`,
						options: {
							wrapperStyle: `margin: 1.0725rem 0`,
						},
					},
					{
						resolve: `gatsby-remark-prismjs`,
						options: {
							classPrefix: 'language-',
							inlineCodeMarker: null,
							aliases: {},
							showLineNumbers: false,
							noInlineHighlight: false,
							languageExtensions: [
								{
									language: 'superscript',
									extend: 'javascript',
									definition: {
										superscript_types: /(SuperType)/,
									},
									insertBefore: {
										function: {
											superscript_keywords: /(superif|superelse)/,
										},
									},
								},
							],
							prompt: {
								user: 'root',
								host: 'localhost',
								global: false,
							},
							escapeEntities: {},
						},
					},
					`gatsby-remark-copy-linked-files`,
					`gatsby-remark-smartypants`,
				],
			},
		},
		{
			resolve: `gatsby-plugin-react-i18next`,
			options: {
				localeJsonSourceName: `locale`,
				languages: __LANGUAGES__,
				defaultLanguage: __DEFAULT_LANGUAGE__,
				redirect: true,
				generateDefaultLanguagePage: true,
				siteUrl: `https://cabellonic.dev/`,
				i18nextOptions: {
					interpolation: {
						escapeValue: false,
					},
					keySeparator: false,
					nsSeparator: false,
				},
				pages: [
					{
						matchPath: '/:lang?/portfolio/:slug*',
						getLanguageFromPath: true,
					},
					{
						matchPath: '/:lang?/blog/:slug*',
						getLanguageFromPath: true,
					},
					{
						matchPath: '/:lang?/tag/:slug*',
						getLanguageFromPath: true,
					},
				],
			},
		},
		{
			resolve: `gatsby-plugin-algolia`,
			options: {
				appId: process.env.GATSBY_ALGOLIA_APP_ID,
				apiKey: process.env.ALGOLIA_ADMIN_KEY,
				queries,
				enablePartialUpdates: true,
				settings: {
					replicaUpdateMode: 'replace',
				},
			},
		},
		// 'gatsby-plugin-mdx',
		'gatsby-plugin-sharp',
		'gatsby-plugin-image',
		'gatsby-plugin-react-helmet',
		'gatsby-plugin-sitemap',
	],
}
