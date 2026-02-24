import { $, on, pickRandom } from "./utils.js"

export const createEffects = () => {
	let bar = null
	let host = null
	let canvas = null
	let ctx = null

	let active = { name: "", emojis: [] }
	let timer = null
	let raf = 0
	let particles = []
	let lastTs = 0

	const effects = {
		"1": { name: "water", emojis: ["💧", "💦", "🌧️"] },
		"2": { name: "balloon", emojis: ["🎈", "🎉", "🎊"] },
		"3": { name: "sparkle", emojis: ["✨", "⭐️", "💫"] },
		"4": { name: "bubble", emojis: ["🫧", "🤍", "🩵"] },
		"5": { name: "heart", emojis: ["💖", "💗", "💘", "🌸"] }
	}

	const isCamOn = () => document.documentElement.dataset.camera === "on"

	const fit = () => {
		const rect = host.getBoundingClientRect()
		const dpr = window.devicePixelRatio || 1

		canvas.width = Math.max(1, Math.floor(rect.width * dpr))
		canvas.height = Math.max(1, Math.floor(rect.height * dpr))

		canvas.style.width = `${rect.width}px`
		canvas.style.height = `${rect.height}px`

		ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
	}

	const clear = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
	}

	const stop = () => {
		if (timer) clearInterval(timer)
		timer = null

		if (raf) cancelAnimationFrame(raf)
		raf = 0

		particles = []
		active = { name: "", emojis: [] }
		lastTs = 0

		document.documentElement.removeAttribute("data-effect")
		clear()
	}

	const spawn = () => {
		if (!isCamOn()) return stop()
		if (!active.emojis.length) return

		const rect = host.getBoundingClientRect()
		const w = rect.width
		const emoji = pickRandom(active.emojis)

		const size = 7 + Math.random() * 22
		const x = Math.random() * w
		const y = -30
		const drift = (Math.random() * 60) - 30
		const speed = 50 + Math.random() * 80
		const life = 7 + Math.random() * 3
		const rot = (Math.random() * 1.2) - 0.6

		particles.push({ emoji, x, y, size, drift, speed, life, age: 0, rot })

		if (particles.length > 30)
			particles.splice(0, particles.length - 30)
	}

	const tick = (ts) => {
		if (!isCamOn()) return stop()

		if (!lastTs) lastTs = ts
		const dt = Math.min(0.05, (ts - lastTs) / 1000)
		lastTs = ts

		const rect = host.getBoundingClientRect()
		const w = rect.width
		const h = rect.height

		clear()

		ctx.textAlign = "center"
		ctx.textBaseline = "middle"

		particles = particles.filter((p) => {
			p.age += dt
			if (p.age >= p.life) return false

			const t = p.age / p.life
			const sway = Math.sin(t * Math.PI * 2) * (p.drift * 0.2)

			p.y += p.speed * dt
			p.x += (p.drift * dt) + sway * dt

			const alpha = t < 0.08 ? t / 0.08 : 1
			const fade = t > 0.92 ? (1 - t) / 0.08 : 1
			const a = Math.max(0, Math.min(1, alpha * fade))

			ctx.save()
			ctx.globalAlpha = a
			ctx.font = `${p.size}px Poppins, system-ui, sans-serif`
			ctx.translate(p.x, p.y)
			ctx.rotate(p.rot * t)
			ctx.fillText(p.emoji, 0, 0)
			ctx.restore()

			return p.y < h + 80 && p.x > -80 && p.x < w + 80
		})

		raf = requestAnimationFrame(tick)
	}

	const start = (key) => {
		if (!isCamOn()) return stop()

		const eff = effects[key]
		if (!eff) return

		stop()
		fit()

		active = { name: eff.name, emojis: eff.emojis }
		document.documentElement.setAttribute("data-effect", eff.name)

		timer = setInterval(() => {
			if (!isCamOn()) return stop()
			spawn()
		}, 700)

		raf = requestAnimationFrame(tick)
	}

	const init = () => {
		bar = $(".effect-bar")
		host = $("#camWrap")
		canvas = $("#fxCanvas")

		if (!bar || !host || !canvas) return

		ctx = canvas.getContext("2d")
		if (!ctx) return

		on(bar, "click", (e) => {
			const btn = e.target.closest(".effect-btn")
			if (!btn) return

			const key = btn.dataset.effect
			if (key === "off") return stop()
			if (!isCamOn()) return stop()

			start(key)
		})

		on(window, "resize", () => active.emojis.length && fit())
		on(window, "pagehide", stop)
		on(document, "visibilitychange", () => document.hidden && stop())
	}

	return {
		init,
		stop,
		getCanvas: () => canvas
	}
}
