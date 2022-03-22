import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
// Models
import { IArticle } from '@models/Article'
// Styles
import * as styles from './FeaturedArticleCard.module.scss'

type FeaturedArticleCardProps = {
	article: IArticle
}

const FeaturedArticleCard: React.FC<FeaturedArticleCardProps> = ({
	article,
}) => {
	const { t } = useTranslation()
	const { title, date, thumbnail } = article.frontmatter
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

	return (
		<Link to={`/blog${slug}`} className={styles.article_card}>
			<GatsbyImage
				className={styles.article_thumbnail}
				alt={title}
				image={image}
			/>
			<div className={styles.article_details}>
				<span className={styles.article_title}>{title}</span>
				<small className={styles.article_date}>
					{/* <FontAwesomeIcon icon={['fas', 'circle']} /> */}
					{formattedDate}
				</small>
			</div>
		</Link>
	)
}

export default FeaturedArticleCard
