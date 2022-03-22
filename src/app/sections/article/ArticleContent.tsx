import React from 'react'
// Models
import { IArticle } from '@models/Article'
// Styles
import * as styles from './ArticleContent.module.scss'

type ArticleContentProps = {
	article: IArticle
}

const ArticleContent: React.FC<ArticleContentProps> = ({ article }) => {
	const { html } = article
	return (
		<main
			className={styles.article_content}
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	)
}

export default ArticleContent
