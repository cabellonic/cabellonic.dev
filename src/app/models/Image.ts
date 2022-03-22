import { IGatsbyImageData } from 'gatsby-plugin-image'

export interface IImage {
	url?: string
	childImageSharp?: {
		gatsbyImageData: IGatsbyImageData
	}
}
