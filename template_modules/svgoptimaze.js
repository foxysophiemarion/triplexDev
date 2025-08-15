import path from 'node:path'
import { outlineSvg } from '@davestewart/outliner'
import { optimize } from 'svgo'
import { readFile, writeFile } from 'fs/promises';

// Оптимизация SVG-иконок
export async function svgOptimaze(iconsFiles) {
	// Оптимизация SVG иконок
	// Преобразование SVG-обводок в пути и оптимизация SVG
	const convertAndOptimizeSvg = async (file, srcDir, distDir) => {
		const filePath = path.join(srcDir, file)
		const outputFilePath = path.join(distDir, file)
		try {
			let svgContent = await readFile(filePath, 'utf8')
			const outlinedSvg = outlineSvg(svgContent)
			const optimizedSvg = optimize(outlinedSvg, {
				path: outputFilePath,
				plugins: getSvgOptimizationPlugins(),
			})
			await writeFile(outputFilePath, optimizedSvg.data, 'utf8')
		} catch (error) {
			console.error(`Ошибка обработки файла ${file}:`, error)
		}
	}
	// Плагины оптимизации SVG
	const getSvgOptimizationPlugins = () => [
		{ name: 'removeXMLProcInst', active: true },
		{
			name: 'removeAttrs',
			params: { attrs: '(stroke|style|fill|clip-path|id|data-name)' },
		},
		{ name: 'removeUselessDefs', active: true },
		{ name: 'removeEmptyContainers', active: true },
		/*{
			name: 'addAttributesToSVGElement',
			params: { attributes: [{ fill: 'black' }] },
		},*/
		{ name: 'convertStyleToAttrs', active: true },
		{ name: 'convertPathData', active: true },
	]
	iconsFiles.map((file) => convertAndOptimizeSvg(file, '', ''))
}