export interface ISeo {
	title: string
	language: string
	description?: string
	image?: string
	type?: string
	date?: string
	author?: {
		name?: string
		twitter?: string
	}
}
