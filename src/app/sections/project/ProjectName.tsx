import React from 'react'
// Models
import { IProject } from '@models/Project'
// Styles
import * as styles from './ProjectName.module.scss'

type ProjectNameProps = {
	project: IProject
}

const ProjectName: React.FC<ProjectNameProps> = ({ project }) => {
	const { title } = project.frontmatter
	return (
		<header className={styles.project_header}>
			<h1 className={styles.project_name}>{title}</h1>
		</header>
	)
}

export default ProjectName
