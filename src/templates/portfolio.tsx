import React from 'react'
import { graphql, PageProps } from 'gatsby'
import { useTranslation } from 'gatsby-plugin-react-i18next'
// Components
import Layout from '@layout/Layout'
import PortfolioHeader from '@sections/portfolio/PortfolioHeader'
import ProjectsList from '@sections/portfolio/ProjectsList'
// Models
import { IProject } from '@models/Project'
import { IPageNavContext } from '@models/Context'
import { ISeo } from '@models/Seo'

type PortfolioProps = {
	projects: {
		nodes: IProject[]
	}
}

const Portfolio: React.FC<PageProps<PortfolioProps, IPageNavContext>> = ({
	data,
	pageContext,
}) => {
	const { t } = useTranslation()
	const projects = data.projects.nodes

	const seo: ISeo = {
		title: t('portfolio'),
		description: t('portfolio_description'),
		language: pageContext.language,
	}

	return (
		<Layout seo={seo}>
			<PortfolioHeader />
			<ProjectsList projects={projects} context={pageContext} />
		</Layout>
	)
}

export default Portfolio

export const PortfolioQuery = graphql`
	query Portfolio($language: String!, $limit: Int!, $skip: Int!) {
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

		projects: allMarkdownRemark(
			filter: {
				fields: { collection: { eq: "projects" }, language: { eq: $language } }
			}
			sort: { fields: frontmatter___date, order: DESC }
			limit: $limit
			skip: $skip
		) {
			nodes {
				id
				frontmatter {
					title
					description
					date
					thumbnail {
						childImageSharp {
							gatsbyImageData(
								width: 1000
								placeholder: BLURRED
								formats: [AUTO, WEBP, AVIF]
							)
						}
					}
				}
				fields {
					slug
				}
			}
		}
	}
`
