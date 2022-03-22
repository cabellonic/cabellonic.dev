import { IImage } from './Image'

export interface IProject {
	id: string
	body: string
	html: string
	timeToRead: number
	frontmatter: {
		title: string
		date: string
		duration: string
		description: string
		thumbnail: IImage
		gallery: IImage[]
		techs: string[]
		link: string
		repository: string
	}
	fields: {
		slug: string
		collection: string
		language: string
	}
}
