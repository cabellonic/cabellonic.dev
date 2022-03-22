import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
// Models
import { IArticle } from '@models/Article'
// Styles
import * as styles from './ArticleThumbnail.module.scss'

type ArticleThumbnailProps = {
	article: IArticle
}

const ArticleThumbnail: React.FC<ArticleThumbnailProps> = ({ article }) => {
	const { title, thumbnail } = article.frontmatter
	const image = thumbnail?.childImageSharp?.gatsbyImageData!
	return (
		<figure className={styles.article_thumbnail_wrapper}>
			<GatsbyImage
				className={styles.article_thumbnail}
				image={image}
				alt={title}
			/>
		</figure>
	)
}

export default ArticleThumbnail
