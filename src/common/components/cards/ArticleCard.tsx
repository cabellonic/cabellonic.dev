import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
// Models
import { IArticle } from '@models/Article'
// Styles
import * as styles from './ArticleCard.module.scss'

type ArticleCardProps = {
	article: IArticle
}

const __DAYS_UNTIL_GET_OLD__ = 7

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
	const { t } = useTranslation()
	const { title, date, excerpt, thumbnail, tags } = article.frontmatter
	const { slug, language } = article.fields
	const image = thumbnail?.childImageSharp?.gatsbyImageData!
	const publishedDate = new Date(date)
	const formattedDate = publishedDate.toLocaleDateString(
		t(`date_${language}`),
		{
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}
	)

	// get today date
	const todayDate = new Date()

	const isNew =
		Math.abs(
			~~((publishedDate.getTime() - todayDate.getTime()) / (1000 * 3600 * 24))
		) < __DAYS_UNTIL_GET_OLD__

	return (
		<section className={styles.article_card}>
			<Link className={styles.article_thumbnail_wrapper} to={`/blog${slug}`}>
				<GatsbyImage
					image={image}
					alt={title}
					className={styles.article_thumbnail}
				/>{' '}
				{isNew && <span className={styles.recent}>{t('new_post')}</span>}
			</Link>
			<div className={styles.article_details}>
				<Link className={styles.article_title} to={`/blog${slug}`}>
					{title}
				</Link>
				{tags && (
					<div className={styles.article_tags}>
						{tags.map((tag) => (
							<Link key={tag} to={`/tag/${tag}`} className={styles.article_tag}>
								{t(tag)}
							</Link>
						))}
					</div>
				)}

				<small className={styles.article_date}>{formattedDate}</small>
				<p className={styles.article_excerpt}>{excerpt}</p>
			</div>
		</section>
	)
}

export default ArticleCard
