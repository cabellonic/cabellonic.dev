const React = require('react')

exports.onRenderBody = ({ setPreBodyComponents }) => {
	setPreBodyComponents([
		<div id="backdrop-hook" key="backdrop-hook"></div>,
		<div id="menu-hook" key="menu-hook"></div>,
		<div id="search-hook" key="search-hook"></div>,
	])
}
