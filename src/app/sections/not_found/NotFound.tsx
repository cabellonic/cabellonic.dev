import React from 'react'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
// Styles
import * as styles from './NotFound.module.scss'

type NotFoundProps = {}

const NotFound: React.FC<NotFoundProps> = ({}) => {
	const { t } = useTranslation()
	return (
		<div className={styles.not_found}>
			<h2 className={styles.not_found_title}>{t('not_found')} 😭</h2>
			<p className={styles.not_found_text}>
				{t('not_found_text')}{' '}
				<Link to="/contact">{t('not_found_contact')}</Link>
			</p>
		</div>
	)
}

export default NotFound
