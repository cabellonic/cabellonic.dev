import React from 'react'
// Components
import ArticleCard from '@components/cards/ArticleCard'
import PageNav from '@components/pagenav/PageNav'
import BlogSidebar from './BlogSidebar'
// Models
import { IArticle } from '@models/Article'
import { IPageNavContext } from '@models/Context'
// Styles
import * as styles from './ArticlesList.module.scss'

type ArticlesListProps = {
	articles: IArticle[]
	context: IPageNavContext
	title: string
}

const ArticlesList: React.FC<ArticlesListProps> = ({
	articles,
	context,
	title,
}) => {
	return (
		<main className={styles.articles_list_wrapper}>
			<section className={styles.articles_list}>
				<h2 className={styles.title}>{title}</h2>
				{articles.map((article) => (
					<ArticleCard key={article.id} article={article} />
				))}

				<PageNav context={context} />
			</section>
			<BlogSidebar />
		</main>
	)
}

export default ArticlesList
