import React from 'react'
// Components
import ProjectCard from '@components/cards/ProjectCard'
import PageNav from '@components/pagenav/PageNav'
// Models
import { IProject } from '@models/Project'
import { IPageNavContext } from '@models/Context'
// Styles
import * as styles from './ProjectsList.module.scss'

type ProjectsListProps = {
	projects: IProject[]
	context: IPageNavContext
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects, context }) => {
	return (
		<main className={styles.projects_list}>
			{projects.map((project, index) => (
				<ProjectCard
					key={project.id}
					project={project}
					pair={index % 2 === 0}
				/>
			))}
			<PageNav context={context} />
		</main>
	)
}

export default ProjectsList
