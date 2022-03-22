// Algolia Articles Query
const articlesQuery = `{
    articles: allMarkdownRemark(
        filter: {
            fields: { collection: { eq: "articles" }}
        }
    ) {
        nodes {
            objectId: id
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
}`

const queries = [
	{
		query: articlesQuery,
		transformer: ({ data }) =>
			data.articles.nodes.map(({ objectId, ...node }) => ({
				...node,
				objectID: objectId,
				title: node.frontmatter.title,
				slug: node.fields.slug,
				language: node.fields.language,
			})),
		matchFields: ['slug', 'title', 'language'],
		indexName: 'Articles',
	},
]
module.exports = queries
