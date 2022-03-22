import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { Link } from 'gatsby-plugin-react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// Components
import Menu from './Menu'
// Models
import { ISite } from '@models/Site'
// Styles
import * as styles from './Header.module.scss'

type HeaderProps = {}

const Brand: React.FC<{ menuHandler: () => void }> = ({ menuHandler }) => {
	const metaData = useStaticQuery(query) as ISite
	const __SITE_NAME__ = metaData.site.siteMetadata.site_name

	return (
		<>
			<span className={styles.menu_toggler} onClick={menuHandler}>
				<FontAwesomeIcon icon={['fas', 'bars']} />
			</span>
			<Link to="/" className={styles.brand}>
				{__SITE_NAME__}
			</Link>
		</>
	)
}

const Header: React.FC<HeaderProps> = () => {
	const [prevScrollPos, setPrevScrollPos] = React.useState(0)
	const [showHeader, setShowHeader] = React.useState(true)
	const [showMenu, setShowMenu] = React.useState(false)

	const menuHandler = () => {
		setShowMenu((prevState) => !prevState)
	}

	const brand = <Brand menuHandler={menuHandler} />

	const scrollHandler = () => {
		const currentScrollPos = window.pageYOffset
		setShowHeader(prevScrollPos > currentScrollPos)
		setPrevScrollPos(currentScrollPos)
	}

	React.useEffect(() => {
		window.addEventListener('scroll', scrollHandler)
		return () => window.removeEventListener('scroll', scrollHandler)
	}, [prevScrollPos, showHeader, scrollHandler])

	return (
		<header
			className={`${styles.main_header} ${showHeader ? styles.show : ''}`}
		>
			<div className={styles.main_header__wrapper}>
				<Brand menuHandler={menuHandler} />
				<Menu brand={brand} show={showMenu} menuHandler={menuHandler} />
			</div>
		</header>
	)
}

export default Header

const query = graphql`
	query {
		site {
			siteMetadata {
				site_name
			}
		}
	}
`
