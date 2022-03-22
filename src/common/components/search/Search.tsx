import React from 'react'
import algoliasearch from 'algoliasearch/lite'
import { InstantSearch } from 'react-instantsearch-hooks'
// Components
import SearchBox from './SearchBox'
import Hits from './Hits'

const searchClient = algoliasearch(
	process.env.GATSBY_ALGOLIA_APP_ID!,
	process.env.GATSBY_ALGOLIA_SEARCH_KEY!
)

const Search: React.FC = () => {
	return (
		<InstantSearch
			searchClient={searchClient}
			indexName="Articles"
			suppressExperimentalWarning
		>
			<SearchBox />
			<Hits />
		</InstantSearch>
	)
}

export default Search
