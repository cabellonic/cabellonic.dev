import React from 'react'
import Fade from 'react-reveal/Fade'
// Styles
import * as styles from './Title.module.scss'

const Title: React.FC = ({ children }) => {
	return (
		<Fade>
			<h2 className={styles.title}>{children}</h2>
		</Fade>
	)
}

export default Title
