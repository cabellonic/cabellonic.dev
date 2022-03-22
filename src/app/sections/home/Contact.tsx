import React from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import { useForm, SubmitHandler } from 'react-hook-form'
import Fade from 'react-reveal/Fade'
// Components
import Title from '@components/titles/Title'
// Styles
import * as styles from './Contact.module.scss'

type FormInputs = {
	name: string
	email: string
	message: string
}

enum FetchStatus {
	WAITING = 'WAITING',
	SUBMITTING = 'SUBMITTING',
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR',
}

const Contact: React.FC = ({}) => {
	const [fetchStatus, setFetchStatus] = React.useState<FetchStatus>(
		FetchStatus.WAITING
	)
	const { t } = useTranslation()
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormInputs>({ mode: 'onSubmit' })

	const onSubmit: SubmitHandler<FormInputs> = (data) => {
		setFetchStatus(FetchStatus.SUBMITTING)
		const formData = new FormData()
		formData.append('name', data.name)
		formData.append('email', data.email)
		formData.append('message', data.message)

		fetch('https://getform.io/f/6a0e3a68-e0ed-4c31-b56f-45a67ea54a7a', {
			method: 'POST',
			body: formData,
		})
			.then(() => {
				reset()
				setFetchStatus(FetchStatus.SUCCESS)
			})
			.catch(() => {
				setFetchStatus(FetchStatus.ERROR)
			})
	}

	return (
		<section className={styles.contact}>
			<Title>{t('contact')}</Title>
			<Fade delay={200}>
				<p className={styles.contact_info}>{t('contact_info')}</p>
			</Fade>
			<form className={styles.contact_form} onSubmit={handleSubmit(onSubmit)}>
				<Fade left delay={300}>
					<input
						className={errors.name ? styles.error : ''}
						{...register('name', { required: true })}
						type="text"
						placeholder={t('name')}
					/>
				</Fade>
				<Fade right delay={400}>
					<input
						className={errors.email ? styles.error : ''}
						{...register('email', {
							required: true,
							pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
						})}
						type="email"
						placeholder={t('email')}
					/>
				</Fade>
				<Fade left delay={500}>
					<textarea
						className={errors.message ? styles.error : ''}
						{...register('message', { required: true, minLength: 10 })}
						placeholder={t('message')}
						rows={8}
					/>
				</Fade>
				<Fade up delay={600}>
					<button type="submit">{t('send')}</button>
				</Fade>
				{fetchStatus === FetchStatus.SUCCESS && (
					<Fade>
						<p className={styles.ryoukai}>{t('submit_success')}</p>
					</Fade>
				)}
				{fetchStatus === FetchStatus.ERROR && (
					<Fade>
						<p className={styles.shippaishita}>{t('submit_error')}</p>
					</Fade>
				)}
			</form>
		</section>
	)
}

export default Contact
