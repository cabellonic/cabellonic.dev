import React from 'react'
import { graphql, PageProps } from 'gatsby'
import { useTranslation } from 'gatsby-plugin-react-i18next'
// Components
import Layout from '@layout/Layout'
import BlogMenu from '@sections/blog/BlogMenu'
import FeaturedArticles from '@sections/blog/FeaturedArticles'
import ArticlesList from '@sections/blog/ArticlesList'
// Models
import { IArticle } from '@models/Article'
import { IPageNavContext } from '@models/Context'
import { ISeo } from '@models/Seo'

type TagProps = {
	tagGroup: {
		tags: [
			{
				totalCount: number
				name: string
			}
		]
	}

	featuredArticles: {
		nodes: IArticle[]
	}
	articles: {
		nodes: IArticle[]
	}
}

const Tag: React.FC<PageProps<TagProps, IPageNavContext>> = ({
	data,
	pageContext,
}) => {
	const { t } = useTranslation()
	const tags = data.tagGroup.tags
	const articles = data.articles.nodes
	const featuredArticles = data.featuredArticles.nodes
	const { tag } = pageContext

	const seo: ISeo = {
		title: `${t('tag_page')} ${t(tag)}`,
		description: t('portfolio_description'),
		language: pageContext.language,
	}

	return (
		<Layout seo={seo}>
			<BlogMenu tags={tags} />
			<FeaturedArticles featuredArticles={featuredArticles} />
			<ArticlesList
				title={`${t('tag_page')} ${t(tag)}`}
				articles={articles}
				context={pageContext}
			/>
		</Layout>
	)
}

export default Tag

export const TagQuery = graphql`
	query Tag($language: String!, $limit: Int!, $skip: Int!, $tag: [String]) {
		locales: allLocale(
			filter: { ns: { in: ["common", "tags"] }, language: { eq: $language } }
		) {
			edges {
				node {
					ns
					data
					language
				}
			}
		}

		tagGroup: allMarkdownRemark(
			filter: { fields: { language: { eq: $language } } }
		) {
			tags: group(field: frontmatter___tags) {
				totalCount
				name: fieldValue
			}
		}

		featuredArticles: allMarkdownRemark(
			filter: {
				fields: { collection: { eq: "articles" }, language: { eq: $language } }
				frontmatter: { tags: { in: $tag } }
			}
			sort: { fields: frontmatter___date, order: DESC }
			limit: 4
		) {
			nodes {
				id
				frontmatter {
					title
					excerpt
					date
					tags
					thumbnail {
						childImageSharp {
							gatsbyImageData(
								width: 575
								placeholder: BLURRED
								formats: [AUTO, WEBP, AVIF]
							)
						}
					}
				}
				fields {
					slug
					language
				}
			}
		}

		articles: allMarkdownRemark(
			filter: {
				fields: { collection: { eq: "articles" }, language: { eq: $language } }
				frontmatter: { tags: { in: $tag } }
			}
			sort: { fields: frontmatter___date, order: DESC }
			limit: $limit
			skip: $skip
		) {
			nodes {
				id
				frontmatter {
					title
					excerpt
					date
					tags
					thumbnail {
						childImageSharp {
							gatsbyImageData(
								width: 575
								placeholder: BLURRED
								formats: [AUTO, WEBP, AVIF]
							)
						}
					}
				}
				fields {
					slug
					language
				}
			}
		}
	}
`
