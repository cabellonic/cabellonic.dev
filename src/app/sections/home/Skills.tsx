import React from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import Pulse from 'react-reveal/Pulse'
import Fade from 'react-reveal/Fade'
// Componetns
import Title from '@components/titles/Title'
// Models
import { ISkillWall } from '@models/Skill'
// Styles
import * as styles from './Skills.module.scss'

type SkillsProps = {
	skills: ISkillWall[]
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
	const { t } = useTranslation()
	return (
		<section className={styles.skills}>
			<Title>{t('skills')}</Title>
			<Fade delay={200}>
				<p className={styles.skills_info}>{t('skills_info')}</p>
			</Fade>
			<div className={styles.skill_wall}>
				{skills.map(({ bricks }, brick_number) => (
					<div key={brick_number} className={styles.skill_row}>
						{bricks.map((skill) => (
							<Pulse key={skill.tech}>
								<div
									className={styles.skill_brick}
									style={{ width: `${100 / bricks.length}%` }}
								>
									<div
										className={styles.skill_brick__progress}
										style={{ width: `${skill.level}%` }}
									>
										<span className={styles.skill_name}>{skill.tech}</span>
										<span className={styles.skill_level}>{skill.level}%</span>
									</div>
								</div>
							</Pulse>
						))}
					</div>
				))}
			</div>
		</section>
	)
}

export default Skills
