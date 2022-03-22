import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import { Link } from 'gatsby-plugin-react-i18next'
import Fade from 'react-reveal/Fade'
// Models
import { IProject } from '@models/Project'
// Styles
import * as styles from './ProjectCard.module.scss'

type ProjectCardProps = {
	project: IProject
	pair: boolean
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, pair }) => {
	const { title, description, thumbnail } = project.frontmatter
	const slug = project.fields.slug
	const image = thumbnail.childImageSharp?.gatsbyImageData

	return (
		<Fade left={!pair} right={pair}>
			<article className={styles.project_card_wrapper}>
				<Link to={`/portfolio${slug}`} className={styles.project_card}>
					{image && (
						<GatsbyImage
							className={styles.project_thumbnail}
							image={image}
							alt={title}
						/>
					)}
					<div className={styles.project_details}>
						<h2 className={styles.project_title}>{title}</h2>
						<p className={styles.project_description}>{description}</p>
					</div>
				</Link>
			</article>
		</Fade>
	)
}

export default ProjectCard
