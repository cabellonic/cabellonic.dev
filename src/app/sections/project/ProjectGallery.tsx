import React from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import Gallery from '@browniebroke/gatsby-image-gallery'
// Models
import { IProject } from '@models/Project'
// Styles
import * as styles from './ProjectGallery.module.scss'

type ProjectGalleryProps = {
	project: IProject
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ project }) => {
	const { t } = useTranslation()
	const gallery = project.frontmatter.gallery
	if (!gallery) return <></>
	const images = gallery.map((img) => img.childImageSharp) as any

	return (
		<section className={styles.project_gallery}>
			<h2 className={styles.project_gallery_title}>{t('project_gallery')}</h2>
			<Gallery imgClass={styles.project_gallery_image} images={images} />
		</section>
	)
}

export default ProjectGallery
