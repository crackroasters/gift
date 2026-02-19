import { $, $$, on, clamp, rectIntersects, rafWait, nowMs, uid } from "./utils.js"

export const createGallery = ({ effects, cam }) => {
	let video = null
	let wrap = null
	let btn = null
	let gallery = null

	let preview = null
	let previewImg = null
	let previewDeleteBtn = null
	let previewCloseBtn = null

	const ttlMs = 300000
	const maxItems = 12
	const shots = []
	let activeId = ""

	const sizePx = 86
	const padPx = 18

	const getAvoidRects = () => {
		const list = []

		const camBox = $(".camera")
		camBox && list.push(camBox.getBoundingClientRect())

		const fortuneBox = $(".fortune-browser")
		fortuneBox && list.push(fortuneBox.getBoundingClientRect())

		const descBox = $(".desc-browser")
		descBox && list.push(descBox.getBoundingClientRect())

		const dayBox = $(".browser-day")
		dayBox && list.push(dayBox.getBoundingClientRect())

		const logoBox = $(".browser-logo")
		logoBox && list.push(logoBox.getBoundingClientRect())

		return list
	}

	const openPreview = (id) => {
		const shot = shots.find((e) => e.id === id)
		if (!shot) return

		activeId = id
		previewImg.src = shot.url
		preview.setAttribute("aria-hidden", "false")
	}

	const closePreview = () => {
		activeId = ""
		previewImg.removeAttribute("src")
		preview.setAttribute("aria-hidden", "true")
	}

	const removeShot = (id) => {
		const idx = shots.findIndex((e) => e.id === id)
		if (idx < 0) return

		const shot = shots[idx]
		clearTimeout(shot.timer)
		shot.url && URL.revokeObjectURL(shot.url)

		shot.el && shot.el.remove()
		shots.splice(idx, 1)

		if (activeId === id) closePreview()
	}

	const trimOverflow = () => {
		while (shots.length > maxItems)
			removeShot(shots[0].id)
	}

	const clampShotToViewport = (x, y) => {
		const maxX = Math.max(padPx, window.innerWidth - sizePx - padPx)
		const maxY = Math.max(padPx, window.innerHeight - sizePx - padPx)

		return {
			x: clamp(x, padPx, maxX),
			y: clamp(y, padPx, maxY)
		}
	}

	const makeShotStyle = () => {
		const triesMax = 140
		const avoidRects = getAvoidRects()

		let x = 0
		let y = 0
		let placed = false

		for (let i = 0; i < triesMax; i += 1) {
			const rawX = Math.random() * window.innerWidth
			const rawY = Math.random() * window.innerHeight
			const clamped = clampShotToViewport(rawX, rawY)

			x = clamped.x
			y = clamped.y

			const shotRect = { left: x, top: y, right: x + sizePx, bottom: y + sizePx }
			const hit = avoidRects.some((r) => rectIntersects(shotRect, r))

			if (!hit) { placed = true; break }
		}

		if (!placed) {
			const clamped = clampShotToViewport(Math.random() * window.innerWidth, Math.random() * window.innerHeight)
			x = clamped.x
			y = clamped.y
		}

		const rot = (Math.random() * 18) - 9
		const z = Math.floor(10 + Math.random() * 90)

		return { x, y, rot, z }
	}

	const applyShotStyle = (item, style) => {
		item.style.left = `${style.x}px`
		item.style.top = `${style.y}px`
		item.style.zIndex = String(style.z)
		item.style.setProperty("--rot", `${style.rot}deg`)
	}

	const clampAllShots = () => {
		const maxX = Math.max(padPx, window.innerWidth - sizePx - padPx)
		const maxY = Math.max(padPx, window.innerHeight - sizePx - padPx)

		$$(".gallery-item", gallery).forEach((e) => {
			const left = parseFloat(e.style.left || "0")
			const top = parseFloat(e.style.top || "0")

			e.style.left = `${clamp(left, padPx, maxX)}px`
			e.style.top = `${clamp(top, padPx, maxY)}px`
		})
	}

	const makeItem = (url, expireAt, id) => {
		const item = document.createElement("div")
		item.className = "gallery-item"
		item.dataset.id = id

		const img = document.createElement("img")
		img.src = url
		img.alt = "shot"

		const ttl = document.createElement("div")
		ttl.className = "ttl"
		ttl.textContent = "5:00"

		item.appendChild(img)
		item.appendChild(ttl)

		applyShotStyle(item, makeShotStyle())

		on(item, "click", () => openPreview(id))

		const updateTtl = () => {
			const left = expireAt - nowMs()
			if (left <= 0) return

			const sec = Math.ceil(left / 1000)
			const mm = String(Math.floor(sec / 60)).padStart(1, "0")
			const ss = String(sec % 60).padStart(2, "0")
			ttl.textContent = `${mm}:${ss}`
		}

		const interval = setInterval(() => {
			if (!document.body.contains(item)) return clearInterval(interval)
			updateTtl()
		}, 1000)

		updateTtl()
		return item
	}

	const captureComposite = async () => {
		if (video.readyState < 2) return null

		const rect = wrap.getBoundingClientRect()
		const dpr = window.devicePixelRatio || 1

		const outW = Math.max(1, Math.floor(rect.width * dpr))
		const outH = Math.max(1, Math.floor(rect.height * dpr))

		const capture = document.createElement("canvas")
		capture.width = outW
		capture.height = outH

		const ctx = capture.getContext("2d")
		if (!ctx) return null

		ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

		await rafWait(2)

		const vw = video.videoWidth
		const vh = video.videoHeight
		if (!vw || !vh) return null

		const scale = Math.max(rect.width / vw, rect.height / vh)
		const dw = vw * scale
		const dh = vh * scale
		const dx = (rect.width - dw) / 2
		const dy = (rect.height - dh) / 2

		ctx.save()
		ctx.translate(rect.width, 0)
		ctx.scale(-1, 1)

		ctx.drawImage(video, rect.width - dx - dw, dy, dw, dh)
		ctx.restore()

		const fxCanvas = effects?.getCanvas?.()
		if (fxCanvas)
			ctx.drawImage(fxCanvas, 0, 0, fxCanvas.width, fxCanvas.height, 0, 0, rect.width, rect.height)

		const blob = await new Promise((resolve) => {
			capture.toBlob((b) => resolve(b), "image/jpeg", 0.9)
		})

		return blob || null
	}

	const init = () => {
		video = $("#cam")
		wrap = $("#camWrap")
		btn = $(".film-btn")
		gallery = $("#gallery")

		preview = $("#preview")
		previewImg = $("#previewImg")
		previewDeleteBtn = $("#previewDeleteBtn")
		previewCloseBtn = $("#previewCloseBtn")

		if (!video || !wrap || !btn || !gallery) return
		if (!preview || !previewImg || !previewDeleteBtn || !previewCloseBtn) return

		on(btn, "click", async () => {
			btn.disabled = true

			const blob = await captureComposite()
			if (!blob) { btn.disabled = false; return }

			const url = URL.createObjectURL(blob)
			const id = uid()
			const expireAt = nowMs() + ttlMs

			const el = makeItem(url, expireAt, id)
			gallery.prepend(el)

			const timer = setTimeout(() => removeShot(id), ttlMs)

			shots.push({ id, url, el, timer })
			trimOverflow()

			btn.disabled = false
		})

		on(preview, "click", (e) => {
			const target = e.target
			if (!(target instanceof Element)) return

			const key = target.closest("[data-preview]")?.getAttribute("data-preview")
			if (key === "close") closePreview()
		})

		on(previewCloseBtn, "click", () => closePreview())
		on(previewDeleteBtn, "click", () => activeId && removeShot(activeId))

		on(window, "resize", clampAllShots)
	}

	return { init }
}
