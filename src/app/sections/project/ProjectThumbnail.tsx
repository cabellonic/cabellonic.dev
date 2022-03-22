import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
// Models
import { IProject } from '@models/Project'
// Styles
import * as styles from './ProjectThumbnail.module.scss'

type ProjectThumbnailProps = {
	project: IProject
}

const ProjectThumbnail: React.FC<ProjectThumbnailProps> = ({ project }) => {
	const { title, thumbnail } = project.frontmatter
	const image = thumbnail?.childImageSharp?.gatsbyImageData!

	return (
		<figure className={styles.project_thumbnail_wrapper}>
			<GatsbyImage
				className={styles.project_thumbnail}
				image={image}
				alt={title}
			/>
		</figure>
	)
}

export default ProjectThumbnail
