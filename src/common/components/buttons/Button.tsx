import React from 'react'
import { Link } from 'gatsby-plugin-react-i18next'
import Fade from 'react-reveal/Fade'
// Styles
import * as styles from './Button.module.scss'

type ButtonProps = {
	to: string
}

const Button: React.FC<ButtonProps> = ({ children, to }) => {
	if (to) {
		return (
			<Fade up>
				<button className={styles.button}>
					<Link to={to}>{children}</Link>
				</button>
			</Fade>
		)
	}
	return (
		<Fade up>
			<button className={styles.button}>{children}</button>
		</Fade>
	)
}

export default Button
