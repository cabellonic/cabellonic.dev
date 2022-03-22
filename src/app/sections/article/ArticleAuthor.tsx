import React from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import { graphql, useStaticQuery } from 'gatsby'
// Components
import Social from '@components/social/Social'
// Models
import { ISite } from '@models/Site'
// Styles
import * as styles from './ArticleAuthor.module.scss'

type ArticleAuthorProps = {}

const ArticleAuthor: React.FC<ArticleAuthorProps> = ({}) => {
	const { t } = useTranslation()
	const site = (useStaticQuery(query) as ISite).site.siteMetadata
	const { author, social } = site

	return (
		<footer className={styles.author}>
			<img className={styles.author_photo} src={author.photo} alt="profile" />
			<span className={styles.author_name}>{author.name}</span>
			<p className={styles.author_description}>{t('about_me_text')}</p>
			<Social className={styles.social} social={social} />
		</footer>
	)
}

export default ArticleAuthor

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
