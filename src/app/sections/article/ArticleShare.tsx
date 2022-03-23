import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'gatsby-plugin-react-i18next'
// Models
import { IArticle } from '@models/Article'
import { ISite } from '@models/Site'
// Styles
import * as styles from './ArticleShare.module.scss'

type ArticleShareProps = {
	article: IArticle
}

const ArticleShare: React.FC<ArticleShareProps> = ({ article }) => {
	const { t } = useTranslation()
	const title = article.frontmatter.title

	const { site }: ISite = useStaticQuery(query)
	const url =
		typeof window === 'undefined'
			? ''
			: site.siteMetadata.siteUrl + location.pathname

	return (
		<section className={styles.share}>
			<span className={styles.share_title}>{t('share_article')}</span>
			<div className={styles.share_buttons}>
				<a
					href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`}
					target="_blank"
					rel="noopener noreferrer"
					data-social="twitter"
					aria-label="Twitter"
				>
					<FontAwesomeIcon className={styles.icon} icon={['fab', 'twitter']} />
					Twitter
				</a>
				<a
					href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
					target="_blank"
					rel="noopener noreferrer"
					data-social="facebook"
					aria-label="Facebook"
				>
					<FontAwesomeIcon className={styles.icon} icon={['fab', 'facebook']} />
					Facebook
				</a>
				<a
					href={`https://t.me/share/url?url=${url}&text=${title}`}
					target="_blank"
					rel="noopener noreferrer"
					data-social="telegram"
					aria-label="Telegram"
				>
					<FontAwesomeIcon className={styles.icon} icon={['fab', 'telegram']} />
					Telegram
				</a>
				<a
					href={`https://web.whatsapp.com/send?phone&text=${title}%20${url}`}
					target="_blank"
					rel="noopener noreferrer"
					data-social="whatsapp"
					aria-label="WhatsApp"
				>
					<FontAwesomeIcon className={styles.icon} icon={['fab', 'whatsapp']} />
					WhatsApp
				</a>
				<a
					href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}`}
					target="_blank"
					rel="noopener noreferrer"
					data-social="linkedin"
					aria-label="Linkedin"
				>
					<FontAwesomeIcon className={styles.icon} icon={['fab', 'linkedin']} />
					Linkedin
				</a>
			</div>
		</section>
	)
}

export default ArticleShare

const query = graphql`
	{
		site {
			siteMetadata {
				siteUrl
				site_name
			}
		}
	}
`
