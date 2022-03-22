import React from 'react'
import { createPortal } from 'react-dom'
// Styles
import * as styles from './Backdrop.module.scss'

type BackdropProps = {
	show: boolean
	onClick: () => void
}

const Backdrop: React.FC<BackdropProps> = ({ show, onClick }) => {
	const portalTo =
		typeof document !== 'undefined' && document.getElementById('backdrop-hook')

	if (portalTo && show) {
		return createPortal(
			<div className={styles.backdrop} onClick={onClick} />,
			portalTo
		)
	}

	return <></>
}

export default Backdrop
