import { IAuthor } from './Author'
import { ISocial } from './Social'

export interface ISite {
	site: {
		siteMetadata: {
			site_name: string
			siteUrl: string
			image: string
			author: IAuthor
			social: ISocial
		}
	}
}

export interface ISiteMetadata {
	siteMetadata: {
		site_name: string
		siteUrl: string
		image: string
		author: IAuthor
		social: ISocial
	}
}
