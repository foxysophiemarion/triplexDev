// Настройки шаблона
import templateConfig from '../template.config.js'
// Генерация настроек для редактора
import vscodeSettings from './vscode-settings.js'
// Генерация сниппетов для редактора
import addSnippets from './snippets-generate.js'
// Генерация страницы проекта
import projectPage from './projectpage.js'
// Время для кофе
import coffeeTime from './coffeetime.js'
// Генерация QR-кода
import { qrcode } from 'vite-plugin-qrcode';
// React
import react from '@vitejs/plugin-react'
// Vue
import vue from '@vitejs/plugin-vue'
// Работа со скриптами
import { scriptsPlugins } from './scripts.js'
// Работа со шрифтами
import { fontPlugins } from "./fonts.js"
// Работа с изображениями
import { imagePlugins } from "./images.js"
// Работа с HTML
import { htmlPlugins } from "./html.js"
// Работа со стилями
import { stylesPlugins } from "./styles.js"
// Работа с PHP
import { phpPlugins } from "./php.js"
// Работа с архивом
import { zipPlugin } from "./zip.js"
// Работа с FTP
import { ftpPlugin } from "./ftp.js"
// Плагины Rollup
import { rollupPlugins } from './rollup-plugins.js'
// Работа с Git
import { gitPlugins } from './git.js'
// Добавление версии файлов
import addVersion from 'vite-plugin-add-version';
// Копирование файлов
import { viteStaticCopy } from 'vite-plugin-static-copy'
// Работа со статистикой
import { statPlugins } from './statistics.js'

export default {
	statPlugins,
	gitPlugins,
	viteStaticCopy,
	addVersion,
	projectPage,
	rollupPlugins,
	coffeeTime,
	scriptsPlugins,
	qrcode,
	ftpPlugin,
	zipPlugin,
	addSnippets,
	vscodeSettings,
	fontPlugins,
	imagePlugins,
	htmlPlugins,
	stylesPlugins,
	phpPlugins,
	react,
	vue
}