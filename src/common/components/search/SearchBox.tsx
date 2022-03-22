import React from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import { useSearchBox, UseSearchBoxProps } from 'react-instantsearch-hooks'

const SearchBox: React.FC<UseSearchBoxProps> = (props) => {
	const { t } = useTranslation()
	const { query, refine } = useSearchBox(props)
	const [inputValue, setInputValue] = React.useState(query)
	const inputRef = React.useRef<HTMLInputElement>(null)

	const submitHandler = (event: React.FormEvent) => {
		event.preventDefault()
		event.stopPropagation()
		if (inputRef.current) inputRef.current.blur()
	}

	const resetHandler = (event: React.FormEvent) => {
		event.preventDefault()
		event.stopPropagation()
		setInputValue('')
		if (inputRef.current) inputRef.current.focus()
	}

	React.useEffect(() => {
		if (query !== inputValue) {
			refine(inputValue)
		}
	}, [inputValue, refine])

	React.useEffect(() => {
		if (document.activeElement !== inputRef.current && query !== inputValue) {
			setInputValue(query)
		}
	}, [query])

	return (
		<form action="" noValidate onSubmit={submitHandler} onReset={resetHandler}>
			<input
				ref={inputRef}
				autoComplete="off"
				autoCorrect="off"
				autoCapitalize="off"
				placeholder={t('search')}
				spellCheck={false}
				maxLength={512}
				type="search"
				value={inputValue}
				onChange={(event) => setInputValue(event.currentTarget.value)}
			/>
		</form>
	)
}

export default SearchBox
