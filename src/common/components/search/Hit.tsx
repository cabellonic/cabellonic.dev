import React from 'react'
import { Link, useI18next } from 'gatsby-plugin-react-i18next'
// Models
import { IArticleHit } from '@models/Article'
// Styles
import * as styles from './Hit.module.scss'

type HitProps = {
	hit: IArticleHit
}

const Hit: React.FC<HitProps> = ({ hit }) => {
	const { language } = useI18next()
	if (hit.language !== language) return <></>
	return (
		<Link className={styles.hit} to={`/blog${hit.slug}`}>
			{hit.title}
		</Link>
	)
}

export default Hit
