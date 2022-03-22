import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
// Components
import Social from '@components/social/Social'
// Models
import { ISite } from '@models/Site'
// Styles
import * as styles from './Footer.module.scss'

type FooterProps = {}

const Footer: React.FC<FooterProps> = ({}) => {
	const site = (useStaticQuery(query) as ISite).site.siteMetadata
	const { language, languages, changeLanguage } = useI18next()
	const { t } = useTranslation()
	const { social } = site

	const changeLanguageHandler = (
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		lang: string
	) => {
		event.preventDefault()
		changeLanguage(lang)
	}

	return (
		<footer className={styles.main_footer}>
			<div className={styles.main_footer__wrapper}>
				<nav className={styles.languages}>
					{languages.map((lang) => (
						<a
							href="#"
							key={lang}
							className={`${styles.language_link} ${
								language === lang ? styles.active : ''
							}`}
							onClick={(event) => changeLanguageHandler(event, lang)}
						>
							{t(lang)}
						</a>
					))}
				</nav>
				<span className={styles.footer_credits}>
					Cabellonic.dev &copy; {new Date().getFullYear()}
				</span>
				<Social className={styles.footer_social} social={social} />
			</div>
		</footer>
	)
}

export default Footer

const query = graphql`
	query {
		site {
			siteMetadata {
				social {
					twitter
					telegram
					github
					linkedin
				}
			}
		}
	}
`
