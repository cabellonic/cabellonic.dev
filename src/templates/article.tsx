import React from 'react'
import { graphql, PageProps } from 'gatsby'
// Components
import Layout from '@layout/Layout'
import ArticleHeader from '@sections/article/ArticleHeader'
import ArticleThumbnail from '@sections/article/ArticleThumbnail'
import ArticleContent from '@sections/article/ArticleContent'
import ArticleTags from '@sections/article/ArticleTags'
import ArticleShare from '@sections/article/ArticleShare'
import ArticleAuthor from '@sections/article/ArticleAuthor'
// Models
import { IArticle } from '@models/Article'
import { IPageContext } from '@models/Context'
import { ISeo } from '@models/Seo'
import ArticleEnd from '@sections/article/ArticleEnd'

type ArticleProps = {
	article: IArticle
}

const Article: React.FC<PageProps<ArticleProps, IPageContext>> = ({
	data,
	pageContext,
}) => {
	const article = data.article
	const tags = data.article.frontmatter.tags
	const { title, excerpt, thumbnail } = article.frontmatter

	const seo: ISeo = {
		title,
		description: excerpt || article.excerpt,
		image: thumbnail?.url,
		language: pageContext.language,
	}

	return (
		<Layout seo={seo}>
			<ArticleHeader article={article} />
			<ArticleThumbnail article={article} />
			<ArticleContent article={article} />
			<ArticleEnd />
			<ArticleTags tags={tags} />
			<ArticleShare article={article} />
			<ArticleAuthor />
		</Layout>
	)
}

export default Article

export const ArticleQuery = graphql`
	query Article($language: String!, $slug: String!) {
		locales: allLocale(
			filter: {
				ns: { in: ["common", "tags", "article"] }
				language: { eq: $language }
			}
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
			fields: {
				slug: { eq: $slug }
				language: { eq: $language }
				collection: { eq: "articles" }
			}
		) {
			excerpt(pruneLength: 160)
			html
			timeToRead
			frontmatter {
				title
				excerpt
				date
				tags
				thumbnail {
					url: publicURL
					childImageSharp {
						gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
					}
				}
			}
			fields {
				slug
				language
			}
		}
	}
`
