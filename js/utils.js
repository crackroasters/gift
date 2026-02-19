export const $ = (sel, root = document) => root.querySelector(sel)

export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel))

export const on = (el, type, handler, opts) => {
	if (!el) return
	el.addEventListener(type, handler, opts)
}

export const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

export const pickRandom = (arr) => {
	const idx = Math.floor(Math.random() * arr.length)
	return arr[idx]
}

export const rafWait = async (n = 1) => {
	for (let i = 0; i < n; i += 1)
		await new Promise((r) => requestAnimationFrame(r))
}

export const rectIntersects = (a, b) =>
	a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top

export const nowMs = () => Date.now()

export const uid = () => (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.floor(Math.random() * 1e6)}`)
