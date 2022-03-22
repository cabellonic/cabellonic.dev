import * as React from 'react'
import { graphql, PageProps } from 'gatsby'
import { useTranslation } from 'gatsby-plugin-react-i18next'
// Components
import Layout from '@layout/Layout'
import Profile from '@sections/home/Profile'
import Skills from '@sections/home/Skills'
import Projects from '@sections/home/Projects'
import Articles from '@sections/home/Articles'
import Contact from '@sections/home/Contact'
// Models
import { IProject } from '@models/Project'
import { IArticle } from '@models/Article'
import { ISkillWall } from '@models/Skill'
import { IPageContext } from '@models/Context'
import { ISeo } from '@models/Seo'

type HomeProps = {
	projects: {
		nodes: IProject[]
	}
	articles: {
		nodes: IArticle[]
	}
	skills: {
		nodes: ISkillWall[]
	}
}

const HomePage: React.FC<PageProps<HomeProps, IPageContext>> = ({
	data,
	pageContext,
}) => {
	const { t } = useTranslation()
	const projects = data.projects.nodes
	const articles = data.articles.nodes
	const skills = data.skills.nodes

	const seo: ISeo = {
		title: t('home'),
		description: t('home_description'),
		language: pageContext.language,
	}

	return (
		<Layout seo={seo}>
			<Profile />
			<Skills skills={skills} />
			<Projects projects={projects} />
			<Articles articles={articles} />
			<Contact />
		</Layout>
	)
}

export default HomePage

export const HomeQuery = graphql`
	query Home($language: String!) {
		locales: allLocale(
			filter: {
				ns: { in: ["common", "home", "contact"] }
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

		projects: allMarkdownRemark(
			filter: {
				fields: { collection: { eq: "projects" }, language: { eq: $language } }
			}
			sort: { fields: frontmatter___date, order: DESC }
			limit: 4
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

		articles: allMarkdownRemark(
			filter: {
				fields: { collection: { eq: "articles" }, language: { eq: $language } }
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
					language
				}
			}
		}

		skills: allSkillsJson {
			nodes {
				bricks {
					tech
					level
				}
			}
		}
	}
`
