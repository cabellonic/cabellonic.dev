import React from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import Fade from 'react-reveal/Fade'
// Components
import Title from '@components/titles/Title'
import ProjectCard from '@components/cards/ProjectCard'
import Button from '@components/buttons/Button'
// Models
import { IProject } from '@models/Project'
// Styles
import * as styles from './Projects.module.scss'

type ProjectsProps = {
	projects: IProject[]
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
	const { t } = useTranslation()
	return (
		<section className={styles.projects}>
			<Title>{t('projects')}</Title>
			<Fade delay={200}>
				<p className={styles.projects_info}>{t('projects_info')}</p>
			</Fade>
			<Fade delay={2000} left cascade>
				<div className={styles.projects_container}>
					{projects.map((project, index) => (
						<ProjectCard
							key={project.id}
							project={project}
							pair={index % 2 === 0}
						/>
					))}
				</div>
			</Fade>
			<Button to="/portfolio">{t('see_portfolio')}</Button>
		</section>
	)
}

export default Projects
