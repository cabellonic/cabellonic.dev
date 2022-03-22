import * as React from 'react'
import { graphql, PageProps } from 'gatsby'
import { useTranslation } from 'gatsby-plugin-react-i18next'
// Components
import Layout from '@layout/Layout'
import NotFound from '@sections/not_found/NotFound'
// Models
import { IPageContext } from '@models/Context'
import { ISeo } from '@models/Seo'

// markup
const NotFoundPage: React.FC<PageProps<{}, IPageContext>> = ({
	pageContext,
}) => {
	const { t } = useTranslation()

	const seo: ISeo = {
		title: t('not_found'),
		description: t('home_description'),
		language: pageContext.language,
	}

	return (
		<Layout seo={seo}>
			<NotFound />
		</Layout>
	)
}

export default NotFoundPage

export const NotFoundQuery = graphql`
	query NotFound($language: String!) {
		locales: allLocale(
			filter: {
				ns: { in: ["common", "not_found"] }
				language: { eq: $language }
			}
		) {
			edges {
				node {
					ns
					data
					language
				}
			}
		}
	}
`
