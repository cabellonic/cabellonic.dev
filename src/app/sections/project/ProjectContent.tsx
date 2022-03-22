import React from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'
// Models
import { IProject } from '@models/Project'
// Styles
import * as styles from './ProjectContent.module.scss'

type ProjectContentProps = {
	project: IProject
}

const ProjectContent: React.FC<ProjectContentProps> = ({ project }) => {
	const { t } = useTranslation()
	const html = project.html

	return (
		<section className={styles.project_content}>
			<h2 className={styles.project_content_title}>{t('project_info')}</h2>
			<main dangerouslySetInnerHTML={{ __html: html }} />
		</section>
	)
}

export default ProjectContent
