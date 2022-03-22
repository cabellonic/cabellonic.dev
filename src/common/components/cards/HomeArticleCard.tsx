import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// Models
import { IArticle } from '@models/Article'
// Styles
import * as styles from './HomeArticleCard.module.scss'

type HomeArticleCardProps = {
	article: IArticle
	selectedArticle: string
	setSelectedArticle: (string) => void
}

const getCardClassName = (selectedId: string, articleId: string) => {
	if (!selectedId) return ''
	if (selectedId === articleId) return styles.selected
	return styles.not_selected
}

const HomeArticleCard: React.FC<HomeArticleCardProps> = ({
	article,
	selectedArticle,
	setSelectedArticle,
}) => {
	const { t } = useTranslation()
	const { title, date, excerpt, thumbnail } = article.frontmatter
	const { slug, language } = article.fields
	const image = thumbnail?.childImageSharp?.gatsbyImageData!
	const formattedDate = new Date(date).toLocaleDateString(
		t(`date_${language}`),
		{
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}
	)

	const mouseOverHandler = (id: string) => {
		setSelectedArticle(id)
	}

	const mouseLeaveHandler = () => {
		setSelectedArticle('')
	}

	const card_className = getCardClassName(selectedArticle, article.id)

	return (
		<Link
			className={`${styles.article_card} ${card_className}`}
			to={`/blog${slug}`}
			aria-label={title}
			onMouseOver={() => mouseOverHandler(article.id)}
			onMouseLeave={mouseLeaveHandler}
		>
			<GatsbyImage
				className={styles.article_thumbnail}
				alt={title}
				image={image}
			/>
			<h2 className={styles.article_title}>{title}</h2>
			<small className={styles.article_date}>
				<FontAwesomeIcon icon={['far', 'calendar-alt']} /> {formattedDate}
			</small>
			<p className={styles.article_excerpt}>{excerpt}</p>
			<div className={styles.article_see_more}>{t('keep_reading')}</div>
		</Link>
	)
}

export default HomeArticleCard
