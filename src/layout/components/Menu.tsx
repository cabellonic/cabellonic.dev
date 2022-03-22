import React from 'react'
import { createPortal } from 'react-dom'
import { useStaticQuery, graphql } from 'gatsby'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconName } from '@fortawesome/fontawesome-svg-core'
// Components
import Backdrop from '@components/backdrop/Backdrop'
import Social from '@components/social/Social'
// Models
import { IMenuItem } from '@models/Menu'
import { ISite } from '@models/Site'
// Styles
import * as styles from './Menu.module.scss'

type MenuProps = {
	show: boolean
	brand: JSX.Element
	menuHandler: () => void
}

const Menu: React.FC<MenuProps> = ({ show, menuHandler, brand }) => {
	const { t } = useTranslation()
	const queryResult = useStaticQuery(query)
	const social = (queryResult as ISite).site.siteMetadata.social
	const menu = queryResult.menu.items as IMenuItem[]

	const portalTo =
		typeof document !== 'undefined'
			? document.getElementById('menu-hook')
			: null

	const menuAside = (
		<aside className={`${styles.mobile_menu} ${show ? styles.show : ''}`}>
			<header className={styles.mobile_menu__header}>{brand}</header>
			{menu.map(({ url, title, icon, partiallyActive }) => (
				<Link
					to={url}
					key={url}
					className={styles.mobile_menu_item}
					activeClassName={styles.active}
					partiallyActive={partiallyActive}
				>
					<FontAwesomeIcon
						className={styles.icon}
						icon={['fas', icon as IconName]}
					/>
					<span>{t(title)}</span>
				</Link>
			))}
			<footer className={styles.mobile_menu_footer}>
				<span>Cabellonic.dev &copy; {new Date().getFullYear()}</span>
				<Social className={styles.social} social={social} />
			</footer>
		</aside>
	)

	return (
		<>
			<nav className={styles.menu}>
				{menu.map(({ url, title, partiallyActive }) => (
					<Link
						to={url}
						key={url}
						className={styles.menu_item}
						activeClassName={styles.active}
						partiallyActive={partiallyActive}
					>
						{t(title)}
					</Link>
				))}
			</nav>
			{portalTo && createPortal(menuAside, portalTo)}
			<Backdrop show={show} onClick={menuHandler} />
		</>
	)
}

export default Menu

const query = graphql`
	query {
		site {
			siteMetadata {
				author {
					name
					photo
				}
				social {
					twitter
					telegram
					github
					linkedin
				}
			}
		}

		menu: allMenuJson {
			items: nodes {
				title
				url
				icon
				partiallyActive
			}
		}
	}
`
