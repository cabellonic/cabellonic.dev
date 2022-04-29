import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { Helmet } from 'react-helmet'
// Models
import { ISite } from '@models/Site'
import { ISeo } from '@models/Seo'

type SeoProps = {
	seo: ISeo
}

const Seo: React.FC<SeoProps> = ({ seo }) => {
	const site = (useStaticQuery(query) as ISite).site.siteMetadata
	const siteUrl = site.siteUrl
	const path =
		typeof window !== 'undefined' ? siteUrl + window.location.pathname : ''
	const imagePath = seo.image ? siteUrl + seo.image : siteUrl + site.image

	const metaTags = [
		{
			name: `og:title`,
			content: `${seo.title} | ${site.site_name}`,
		},
		{
			name: `og:site_name`,
			content: site.site_name,
		},
		{
			name: `og:url`,
			content: path,
		},
		{
			name: `description`,
			content: seo.description || '',
		},
		{
			name: `og:description`,
			content: seo.description || '',
		},
		{
			name: `og:image`,
			content: imagePath,
		},
		{
			name: `image`,
			property: `og:image`,
			content: imagePath,
		},
		{
			name: 'author',
			content: site.author.name,
		},
		{
			name: 'og:type',
			content: seo.type || 'website',
		},
		{
			name: 'og:published_date',
			content: seo.date || new Date().toISOString(),
		},
		/*
		 * TWITTER META
		 */
		{
			name: `twitter:card`,
			content: `summary`,
		},
		{
			name: `twitter:site`,
			content: `@${site.social.twitter}`,
		},
		{
			name: `twitter:title`,
			content: `${seo.title} | ${site.site_name}`,
		},
		{
			name: `twitter:description`,
			content: seo.description || '',
		},
		{
			name: `twitter:creator`,
			content: `@${seo.author?.twitter || site.social.twitter}`,
		},
		{
			name: `twitter:image`,
			content: imagePath,
		},
	]

	return (
		<Helmet
			htmlAttributes={{
				lang: seo.language,
			}}
			title={seo.title}
			titleTemplate={`%s | ${site.site_name}`}
			meta={metaTags}
		/>
	)
}

export default Seo

const query = graphql`
	query {
		site {
			siteMetadata {
				site_name
				siteUrl
				image
				author {
					name
				}
				social {
					twitter
				}
			}
		}
	}
`
