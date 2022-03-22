import React from 'react'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
// Styles
import * as styles from './ArticleTags.module.scss'

type ArticleTagsProps = {
	tags: string[]
}

const ArticleTags: React.FC<ArticleTagsProps> = ({ tags }) => {
	const { t } = useTranslation()
	return (
		<section className={styles.tags}>
			{tags.map((tag) => (
				<Link to={`/tag/${tag}`} key={tag} className={styles.tag}>
					{t(tag)}
				</Link>
			))}
		</section>
	)
}

export default ArticleTags
