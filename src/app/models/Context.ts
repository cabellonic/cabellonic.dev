export interface IPageContext {
	language: string
}

export interface IPageNavContext extends IPageContext {
	limit: number
	skip: number
	totalPages: number
	currentPage: number
	baseUrl: string
	tag: string
}

export interface IArticleContext extends IPageContext {
	id: string
	slug: string
}
