import React from 'react'
import { createPortal } from 'react-dom'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// Components
import Backdrop from '@components/backdrop/Backdrop'
import Search from '@components/search/Search'
// Styles
import * as styles from './BlogMenu.module.scss'

type BlogMenuProps = {
	tags: [
		{
			totalCount: number
			name: string
		}
	]
}

const BlogMenu: React.FC<BlogMenuProps> = ({ tags }) => {
	const [showBlogMenu, setShowBlogMenu] = React.useState(false)
	const [showSearchBar, setShowSearchBar] = React.useState(false)
	const { t } = useTranslation()

	const showBlogMenuHandler = () => {
		setShowBlogMenu((prevState) => !prevState)
	}
	const showSearchBarHandler = () => {
		setShowSearchBar((prevState) => !prevState)
	}

	const portalTo =
		typeof document !== 'undefined'
			? document.getElementById('menu-hook')
			: null

	const blogMenuAside = (
		<aside
			className={
				showBlogMenu
					? `${styles.blog_menu_aside} ${styles.show}`
					: styles.blog_menu_aside
			}
		>
			<header className={styles.blog_menu_aside__header}>
				<FontAwesomeIcon
					onClick={showBlogMenuHandler}
					className={styles.close_icon}
					icon={['fas', 'xmark']}
				/>
				{t('filter_by_categories')}
			</header>
			<div className={styles.blog_menu_aside__tags}>
				{tags.map((tag) => (
					<Link
						key={tag.name}
						to={`/tag/${tag.name}`}
						className={styles.blog_menu_aside__tag}
						activeClassName={styles.active}
					>
						{t(tag.name)}
					</Link>
				))}
			</div>
		</aside>
	)

	return (
		<>
			<nav className={styles.blog_menu}>
				<div className={styles.blog_menu__wrapper}>
					<div className={styles.tags}>
						<span
							className={styles.blog_menu_toggler}
							onClick={showBlogMenuHandler}
						>
							{t('filter_by_categories')}
						</span>
						{tags.map((tag) => (
							<Link
								key={tag.name}
								to={`/tag/${tag.name}`}
								className={styles.tag}
								activeClassName={styles.active}
							>
								{t(tag.name)}
							</Link>
						))}
					</div>
					<div
						className={
							showSearchBar ? `${styles.search} ${styles.show}` : styles.search
						}
					>
						<div className={styles.search_bar}>
							<Search />
						</div>
						{showSearchBar ? (
							<>
								<FontAwesomeIcon
									onClick={showSearchBarHandler}
									className={styles.search_icon}
									icon={['fas', 'xmark']}
								/>
							</>
						) : (
							<>
								<FontAwesomeIcon
									onClick={showSearchBarHandler}
									className={`${styles.search_icon} ${styles.mobile}`}
									icon={['fas', 'magnifying-glass']}
								/>
								<FontAwesomeIcon
									className={`${styles.search_icon} ${styles.not_mobile}`}
									icon={['fas', 'magnifying-glass']}
								/>
							</>
						)}
					</div>
				</div>
			</nav>

			{portalTo && createPortal(blogMenuAside, portalTo)}
			<Backdrop show={showBlogMenu} onClick={showBlogMenuHandler} />
		</>
	)
}

export default BlogMenu
