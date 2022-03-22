import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import Fade from 'react-reveal/Fade'
// Components
import Social from '@components/social/Social'
// Models
import { ISite } from '@models/Site'
// Styles
import * as styles from './Profile.module.scss'

type ProfileProps = {}

const Profile: React.FC<ProfileProps> = ({}) => {
	const { t } = useTranslation()
	const site = (useStaticQuery(query) as ISite).site.siteMetadata
	const { author, social } = site
	return (
		<Fade>
			<section className={styles.profile}>
				<h2 className={styles.profile_title}>{t(`profile_title`)}</h2>
				<p className={styles.profile_info}>{t(`profile_description`)}</p>
				<figure className={styles.avatar}>
					<img src={author.photo_alt} alt={author.name} />
				</figure>
				<Social className={styles.profile_social} social={social} />
			</section>
		</Fade>
	)
}

export default Profile

const query = graphql`
	query {
		site {
			siteMetadata {
				author {
					name
					photo
					photo_alt
				}
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
