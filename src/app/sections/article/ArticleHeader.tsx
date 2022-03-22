import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'gatsby-plugin-react-i18next'
// Models
import { IArticle } from '@models/Article'
// Styles
import * as styles from './ArticleHeader.module.scss'

type ArticleHeaderProps = {
	article: IArticle
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({ article }) => {
	const { t } = useTranslation()
	const { title, excerpt, date } = article.frontmatter
	const { language } = article.fields
	const { timeToRead } = article
	const formattedDate = new Date(date).toLocaleDateString(
		t(`date_${language}`),
		{
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}
	)

	return (
		<header className={styles.article_header}>
			<div className={styles.article_date}>
				<span>
					<FontAwesomeIcon icon={['far', 'calendar-alt']} /> {formattedDate}
				</span>
				<span>
					<FontAwesomeIcon icon={['far', 'clock']} /> {t('read_time')}{' '}
					{timeToRead} {timeToRead > 1 ? t('minutes') : t('minute')}
				</span>
			</div>
			<h1 className={styles.article_title}>{title}</h1>
			<p className={styles.article_excerpt}>{excerpt}</p>
		</header>
	)
}

export default ArticleHeader
