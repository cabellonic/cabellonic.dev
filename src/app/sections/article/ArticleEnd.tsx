import React from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'
// Styles
import * as styles from './ArticleEnd.module.scss'

type ArticleEndProps = {}

const ArticleEnd: React.FC<ArticleEndProps> = ({}) => {
	const { t } = useTranslation()
	return (
		<footer className={styles.article_end}>{t('thanks_for_reading')}</footer>
	)
}

export default ArticleEnd
