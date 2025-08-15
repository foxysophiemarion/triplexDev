// Настройки шаблона
import templateConfig from '../template.config.js'
// Логгер
import logger from './logger.js'
// Навигационная панель
import { navPanel } from './navpanel.js'

import { globSync } from 'glob'
import fs from 'fs'

// Обработка HTML
import posthtml from 'posthtml'
import prerenderHTML from './posthtml/prerender.js'
import posthtmBeautify from 'posthtml-beautify'

import pugAliases from "pug-alias"
import pugPlugin from "./pug.js"

const isProduction = process.env.NODE_ENV === 'production'
const isWp = process.argv.includes('--wp')

export const htmlPlugins = [
	// Предобработка Include, Extend, Expressions
	prerenderHTML({}),
	// Навигационная панель
	...((!isWp && (templateConfig.navpanel.dev || templateConfig.navpanel.build)) ? [{
		name: 'nav-panel',
		order: 'pre',
		transformIndexHtml(html) {
			html = html.replace("</body>", `${navPanel()}</body>`)
			return html
		},
	}] : []),
	// Препроцессор PUG
	...((templateConfig.pug.enable) ?
		[pugPlugin({
			plugins: [
				pugAliases({ '@pug': 'src/pug' })
			]
		})] : []),
	// Постобработка HTML-файлов
	{
		name: 'add-posthtml',
		apply: 'build',
		enforce: 'post',
		writeBundle: async ({ dir }) => {
			const htmlFiles = globSync(`${dir}/*.html`)
			htmlFiles.forEach(async htmlFile => {
				let content = fs.readFileSync(htmlFile, 'utf-8')
				// Пути SVG-спрайта
				if (templateConfig.images.svgsprite && content.includes('__spritemap')) {
					content = content.replace(new RegExp('__spritemap', 'gi'), `${templateConfig.server.path}assets/img/spritemap.svg`)
				}
				// Форматирование
				if (templateConfig.html.beautify.enable) {
					const render = await new Promise((resolve) => {
						const output = {}
						const plugins = [
							posthtmBeautify({
								rules: {
									indent: templateConfig.html.beautify.indent,
									blankLines: '',
									sortAttrs: true
								},
							})
						]
						posthtml(plugins).process(content).catch(error => {
							output.error = error
							console.log(error);
							resolve(output)
						}).then(result => {
							output.content = result?.html
							resolve(output)
						})
					})
					content = render.content
				}
				fs.writeFileSync(htmlFile, content, 'utf-8');
			})
		}
	}
]
if (templateConfig.navpanel.dev && !isProduction) {
	logger('_NAVPAN_DONE')
} else if (templateConfig.navpanel.build && isProduction) {
	logger('_NAVPAN_WARN')
}