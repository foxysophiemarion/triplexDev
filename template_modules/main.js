import open from 'open'
import fs from 'fs'

export function getDev() {
	return {
		name: 'get-developer-country',
		async config() {
			// Пустая функция config для сохранения совместимости с Vite
			return;
		},
	}
}