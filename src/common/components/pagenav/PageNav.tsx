import React from 'react'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
// Models
import { IPageNavContext } from '@models/Context'
// Styles
import * as styles from './PageNav.module.scss'

type PageNavProps = {
	context: IPageNavContext
}

const PageNav: React.FC<PageNavProps> = ({ context }) => {
	const { totalPages, currentPage, baseUrl } = context
	const { t } = useTranslation()

	const showRecent = currentPage - 1 > 0
	const showNext = currentPage + 1 <= totalPages

	return (
		<nav className={styles.page_nav}>
			{showRecent ? (
				<Link
					to={`${baseUrl}/${currentPage - 1 === 1 ? `` : currentPage - 1}`}
					className={styles.page_nav__button}
				>
					{t('recent')}
				</Link>
			) : (
				<span className={styles.page_nav__button}>{t('recent')}</span>
			)}
			{showNext ? (
				<Link
					to={`${baseUrl}/${currentPage + 1}`}
					className={styles.page_nav__button}
				>
					{t('previous')}
				</Link>
			) : (
				<span className={styles.page_nav__button}>{t('previous')}</span>
			)}
		</nav>
	)
}

export default PageNav
