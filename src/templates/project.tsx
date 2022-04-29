import React from 'react'
import { graphql, PageProps } from 'gatsby'
// Components
import Layout from '@layout/Layout'
import ProjectName from '@sections/project/ProjectName'
import ProjectThumbnail from '@sections/project/ProjectThumbnail'
import ProjectDetails from '@sections/project/ProjectDetails'
import ProjectContent from '@sections/project/ProjectContent'
import ProjectGallery from '@sections/project/ProjectGallery'
// Models
import { IProject } from '@models/Project'
import { IPageContext } from '@models/Context'
import { ISeo } from '@models/Seo'

type ProjectProps = {
	project: IProject
}

const Project: React.FC<PageProps<ProjectProps, IPageContext>> = ({
	data,
	pageContext,
}) => {
	const project = data.project
	const { title, description, thumbnail, date } = project.frontmatter

	const seo: ISeo = {
		title,
		description,
		image: thumbnail?.url,
		language: pageContext.language,
		type: 'article',
		date,
	}

	return (
		<Layout seo={seo}>
			<ProjectName project={project} />
			<ProjectThumbnail project={project} />
			<ProjectDetails project={project} />
			<ProjectContent project={project} />
			<ProjectGallery project={project} />
		</Layout>
	)
}

export default Project

export const ProjectQuery = graphql`
	query Project($language: String!, $slug: String!) {
		locales: allLocale(
			filter: { ns: { in: ["common", "project"] }, language: { eq: $language } }
		) {
			edges {
				node {
					ns
					data
					language
				}
			}
		}

		project: markdownRemark(
			fields: {
				slug: { eq: $slug }
				language: { eq: $language }
				collection: { eq: "projects" }
			}
		) {
			id
			html
			frontmatter {
				title
				date
				description
				duration
				techs
				link
				repository
				thumbnail {
					childImageSharp {
						gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
					}
				}
				gallery {
					childImageSharp {
						thumb: gatsbyImageData(
							width: 270
							height: 270
							placeholder: BLURRED
						)
						full: gatsbyImageData(layout: FULL_WIDTH)
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
