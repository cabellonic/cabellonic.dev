import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// Models
import { ISocial } from '@models/Social'

type SocialProps = {
	social: ISocial
	className: string
}

const Social: React.FC<SocialProps> = ({ social, className }) => {
	const {
		facebook,
		twitter,
		instagram,
		linkedin,
		github,
		email,
		telegram,
		youtube,
	} = social

	return (
		<nav className={className}>
			{linkedin && (
				<a
					href={`https://www.linkedin.com/in/${linkedin}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<FontAwesomeIcon icon={['fab', 'linkedin']} />
				</a>
			)}
			{github && (
				<a
					href={`https://github.com/${github}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<FontAwesomeIcon icon={['fab', 'github']} />
				</a>
			)}
			{facebook && (
				<a
					href={`https://www.facebook.com/${facebook}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<FontAwesomeIcon icon={['fab', 'facebook']} />
				</a>
			)}
			{twitter && (
				<a
					href={`https://www.twitter.com/${twitter}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<FontAwesomeIcon icon={['fab', 'twitter']} />
				</a>
			)}
			{instagram && (
				<a
					href={`https://www.instagram.com/${instagram}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<FontAwesomeIcon icon={['fab', 'instagram']} />
				</a>
			)}
			{telegram && (
				<a
					href={`https://www.telegram.me/${telegram}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<FontAwesomeIcon icon={['fab', 'telegram']} />
				</a>
			)}
			{youtube && (
				<a href={youtube} target="_blank" rel="noopener noreferrer">
					<FontAwesomeIcon icon={['fab', 'youtube']} />
				</a>
			)}
			{email && (
				<a href={`mailto:${email}`} target="_blank" rel="noopener noreferrer">
					<FontAwesomeIcon icon={['fas', 'envelope']} />
				</a>
			)}
		</nav>
	)
}

export default Social
