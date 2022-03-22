import React from 'react'
// Components
import Header from '@layout/components/Header'
import Content from '@layout/components/Content'
import Footer from '@layout/components/Footer'
import Seo from './Seo'
// Models
import { ISeo } from '@models/Seo'
// Modules
import '@modules/fontAwesome/fontAwesome'
import '@modules/prismjs/prismjs'
// Styles
import './Layout.module.scss'

type LayoutProps = {
	wrapper?: boolean
	seo: ISeo
}

const Layout: React.FC<LayoutProps> = ({ children, wrapper, seo }) => {
	return (
		<>
			<Seo seo={seo} />
			<Header />
			<Content wrapper={wrapper}>{children}</Content>
			<Footer />
		</>
	)
}

export default Layout
