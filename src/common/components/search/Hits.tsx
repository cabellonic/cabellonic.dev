import React from 'react'
import {
	useHits,
	useSearchBox,
	UseSearchBoxProps,
} from 'react-instantsearch-hooks'
// Components
import Hit from './Hit'
// Models
import { IArticleHit } from '@models/Article'
// Styles
import * as styles from './Hits.module.scss'

const Hits = (props: UseSearchBoxProps) => {
	const { hits } = useHits()
	const { query } = useSearchBox(props)

	if (!query) return <></>

	return (
		<div className={styles.hits}>
			{!hits.length && query && (
				<span className={styles.no_results}>No hay resultados</span>
			)}
			{hits.map((hit) => (
				<Hit key={hit.objectID} hit={hit as unknown as IArticleHit} />
			))}
		</div>
	)
}

export default Hits
