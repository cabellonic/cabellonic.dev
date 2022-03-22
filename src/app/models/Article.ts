import { IImage } from './Image'

export interface IArticle {
	id: string
	body: string
	timeToRead: number
	html: string
	excerpt: string
	frontmatter: {
		title: string
		date: string
		excerpt: string
		writer: string
		tags: string[]
		thumbnail?: IImage
	}
	fields: {
		slug: string
		collection: string
		language: string
	}
}

export interface IArticleHit {
	objectID: string
	title: string
	slug: string
	language: string
}
