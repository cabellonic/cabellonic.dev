import React from 'react'
// Components
import FeaturedArticleCard from '@components/cards/FeaturedArticleCard'
// Models
import { IArticle } from '@models/Article'
// Styles
import * as styles from './FeaturedArticles.module.scss'

type FeaturedArticlesProps = {
	featuredArticles: IArticle[]
}

const FeaturedArticles: React.FC<FeaturedArticlesProps> = ({
	featuredArticles,
}) => {
	return (
		<section className={styles.featured_articles}>
			<div className={styles.featured_articles__wrapper}>
				{featuredArticles.map((article) => (
					<FeaturedArticleCard key={article.id} article={article} />
				))}
			</div>
		</section>
	)
}

export default FeaturedArticles
