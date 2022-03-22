import React from 'react'
// Components
import Title from '@components/titles/Title'
// Styles
import * as styles from './PortfolioHeader.module.scss'

type PortfolioHeaderProps = {}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({}) => {
	return (
		<header className={styles.portfolio_header}>
			<Title>Portfolio</Title>
		</header>
	)
}

export default PortfolioHeader
