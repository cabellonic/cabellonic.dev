import React from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import Fade from 'react-reveal/Fade'
// Components
import Title from '@components/titles/Title'
import HomeArticleCard from '@components/cards/HomeArticleCard'
import Button from '@components/buttons/Button'
// Models
import { IArticle } from '@models/Article'
// Styles
import * as styles from './Articles.module.scss'

type ArticlesProps = {
	articles: IArticle[]
}

const Articles: React.FC<ArticlesProps> = ({ articles }) => {
	const [selectedArticle, setSelectedArticle] = React.useState<string>('')
	const { t } = useTranslation()

	return (
		<section className={styles.articles}>
			<Title>{t('articles')}</Title>
			<Fade delay={200}>
				<p className={styles.articles_info}>{t('articles_info')}</p>
			</Fade>
			<Fade up>
				<div className={styles.articles_container}>
					{articles.map((article) => (
						<HomeArticleCard
							key={article.id}
							article={article}
							setSelectedArticle={setSelectedArticle}
							selectedArticle={selectedArticle}
						/>
					))}
				</div>
			</Fade>
			<Button to="/blog">{t('go_to_blog')}</Button>
		</section>
	)
}

export default Articles
