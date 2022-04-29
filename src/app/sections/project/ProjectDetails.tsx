import React from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// Components
import Techs from '@components/techs/Techs'
// Models
import { IProject } from '@models/Project'
// Styles
import * as styles from './ProjectDetails.module.scss'

type ProjectDetailsProps = {
	project: IProject
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
	const { t } = useTranslation()
	const { date, duration, techs, link, repository } = project.frontmatter
	const { language } = project.fields
	const formattedDate = new Date(date).toLocaleDateString(
		t(`date_${language}`),
		{
			year: 'numeric',
			month: 'long',
		}
	)

	return (
		<section className={styles.project_details_wrapper}>
			<h2 className={styles.project_details_title}>{t('project_details')}</h2>
			<time dateTime={date} className={styles.project_date}>
				{t('date')}: {formattedDate}
			</time>
			<div className={styles.project_duration}>
				{t('duration')}: {duration}
			</div>
			<div className={styles.project_techs}>
				{t('techs')}:
				<Techs techs={techs} />
			</div>
			{link && (
				<div className={styles.project_link}>
					<a
						href={link}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={t('go_to_website')}
					>
						<FontAwesomeIcon icon={['fas', 'link']} />
						{t('go_to_website')}
					</a>
				</div>
			)}
			{repository && (
				<div className={styles.project_repository}>
					<a
						href={repository}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={t('go_to_website')}
					>
						<FontAwesomeIcon icon={['fab', 'github']} />
						{t('view_code')}
					</a>
				</div>
			)}
		</section>
	)
}

export default ProjectDetails
