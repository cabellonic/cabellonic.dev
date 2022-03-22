import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { useTranslation } from 'gatsby-plugin-react-i18next'
// Components
import Social from '@components/social/Social'
// Models
import { ISite } from '@models/Site'
// Styles
import * as styles from './BlogSidebar.module.scss'

type BlogSidebarProps = {}

const BlogSidebar: React.FC<BlogSidebarProps> = ({}) => {
	const { t } = useTranslation()
	const site = (useStaticQuery(query) as ISite).site.siteMetadata
	const { author, social } = site

	return (
		<aside className={styles.blog_sidebar}>
			<section className={styles.blog_sidebar_section}>
				<h2 className={styles.title}>{t('about_me')}</h2>
				<img
					className={styles.author_photo}
					src={author.photo}
					alt={author.name}
				/>
				<span className={styles.author_name}>{author.name}</span>
				<p className={styles.author_info}>{t('about_me_text')}</p>
				<Social className={styles.social_links} social={social} />
			</section>
		</aside>
	)
}

export default BlogSidebar

const query = graphql`
	query {
		site {
			siteMetadata {
				author {
					name
					photo
				}
				social {
					twitter
					telegram
					github
					linkedin
				}
			}
		}
	}
`
