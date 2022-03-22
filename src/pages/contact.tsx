import * as React from 'react'
import { graphql, PageProps } from 'gatsby'
import { useTranslation } from 'gatsby-plugin-react-i18next'
// Components
import Layout from '@layout/Layout'
import Contact from '@sections/home/Contact'
// Models
import { IPageContext } from '@models/Context'
import { ISeo } from '@models/Seo'

const ContactPage: React.FC<PageProps<{}, IPageContext>> = ({
	pageContext,
}) => {
	const { t } = useTranslation()

	const seo: ISeo = {
		title: t('contact'),
		description: t('contact_description'),
		language: pageContext.language,
	}

	return (
		<Layout seo={seo}>
			<Contact />
		</Layout>
	)
}

export default ContactPage

export const ContactPageQuery = graphql`
	query ContactPage($language: String!) {
		locales: allLocale(
			filter: { ns: { in: ["common", "contact"] }, language: { eq: $language } }
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
