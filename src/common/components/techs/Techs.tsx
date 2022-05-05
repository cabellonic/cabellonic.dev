import React from 'react'
// SVG
import TypeScriptSVG from '@svg/TypeScriptSVG'
import ReactSVG from '@svg/ReactSVG'
import GatsbySVG from '@svg/GatsbySVG'
import NetlifySVG from '@svg/NetlifySVG'
import ContentfulSVG from '@svg/ContentfulSVG'
import AlgoliaSVG from '@svg/AlgoliaSVG'
import NodeSVG from '@svg/NodeSVG'
import PostgresqlSVG from '@svg/PostgresqlSVG'
// Styles
import * as styles from './Techs.module.scss'
import JavaScriptSVG from '@svg/JavaScriptSVG'

type TechsProps = {
	techs: string[]
}

const Techs: React.FC<TechsProps> = ({ techs }) => {
	return (
		<>
			{techs.map((tech) => (
				<React.Fragment key={tech}>
					{tech === 'typescript' && (
						<div className={styles.tech}>
							<span className={styles.tech_svg}>
								<TypeScriptSVG />
							</span>
							<span>TypeScript</span>
						</div>
					)}
					{tech === 'javascript' && (
						<div className={styles.tech}>
							<span className={styles.tech_svg}>
								<JavaScriptSVG />
							</span>
							<span>JavaScript</span>
						</div>
					)}
					{tech === 'react' && (
						<div className={styles.tech}>
							<span className={styles.tech_svg}>
								<ReactSVG />
							</span>
							<span>React.js</span>
						</div>
					)}
					{tech === 'node' && (
						<div className={styles.tech}>
							<span className={styles.tech_svg}>
								<NodeSVG />
							</span>
							<span>Node.js</span>
						</div>
					)}
					{tech === 'gatsby' && (
						<div className={styles.tech}>
							<span className={styles.tech_svg}>
								<GatsbySVG />
							</span>
							<span>Gatsby.js</span>
						</div>
					)}
					{tech === 'netlify' && (
						<div className={styles.tech}>
							<span className={styles.tech_svg}>
								<NetlifySVG />
							</span>
							<span>Netlify</span>
						</div>
					)}
					{tech === 'contentful' && (
						<div className={styles.tech}>
							<span className={styles.tech_svg}>
								<ContentfulSVG />
							</span>
							<span>Contentful</span>
						</div>
					)}
					{tech === 'algolia' && (
						<div className={styles.tech}>
							<span className={styles.tech_svg}>
								<AlgoliaSVG />
							</span>
							<span>Algolia</span>
						</div>
					)}
					{tech === 'postgresql' && (
						<div className={styles.tech}>
							<span className={styles.tech_svg}>
								<PostgresqlSVG />
							</span>
							<span>PostgreSQL</span>
						</div>
					)}
				</React.Fragment>
			))}
		</>
	)
}

export default Techs
