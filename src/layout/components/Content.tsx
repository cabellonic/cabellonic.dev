import React from 'react'
// Styles
import * as styles from './Content.module.scss'

type ContentProps = {
	wrapper?: boolean
}

const Content: React.FC<ContentProps> = ({ children, wrapper }) => {
	return (
		<main className={`${styles.main_content} ${wrapper ? styles.wrapper : ''}`}>
			{children}
		</main>
	)
}

export default Content
