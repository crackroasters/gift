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

	const dbName = "crack-photo-booth"
	const storeName = "shots"

	const ttlMs = 8 * 60 * 60 * 1000
	const maxItems = 12
	const shots = []
	let activeId = ""

	const sizePx = 86
	const padPx = 18

	let db = null

	const openDb = () => new Promise((resolve, reject) => {
		const req = indexedDB.open(dbName, 1)

		req.onupgradeneeded = () => {
			const nextDb = req.result

			if (!nextDb.objectStoreNames.contains(storeName)) {
				const store = nextDb.createObjectStore(storeName, { keyPath: "id" })
				store.createIndex("expireAt", "expireAt", { unique: false })
				store.createIndex("createdAt", "createdAt", { unique: false })
			}
		}

		req.onsuccess = () => resolve(req.result)
		req.onerror = () => reject(req.error)
	})

	const getDb = async () => {
		if (db) return db
		db = await openDb()
		return db
	}

	const runTx = async (mode, work) => {
		const currentDb = await getDb()

		return new Promise((resolve, reject) => {
			const tx = currentDb.transaction(storeName, mode)
			const store = tx.objectStore(storeName)
			const result = work(store)

			tx.oncomplete = () => resolve(result)
			tx.onerror = () => reject(tx.error)
			tx.onabort = () => reject(tx.error)
		})
	}

	const putShotDb = async (record) => {
		await runTx("readwrite", (store) => {
			store.put(record)
		})
	}

	const deleteShotDb = async (id) => {
		await runTx("readwrite", (store) => {
			store.delete(id)
		})
	}

	const getAllShotsDb = async () => {
		const currentDb = await getDb()

		return new Promise((resolve, reject) => {
			const tx = currentDb.transaction(storeName, "readonly")
			const store = tx.objectStore(storeName)
			const req = store.getAll()

			req.onsuccess = () => resolve(req.result || [])
			req.onerror = () => reject(req.error)
		})
	}

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

	const clearShotTimer = (shot) => {
		if (!shot?.timer) return
		clearTimeout(shot.timer)
		shot.timer = null
	}

	const revokeShotUrl = (shot) => {
		if (!shot?.url) return
		URL.revokeObjectURL(shot.url)
		shot.url = ""
	}

	const removeShot = async (id, byDb = true) => {
		const idx = shots.findIndex((e) => e.id === id)
		if (idx < 0) {
			if (byDb) await deleteShotDb(id)
			return
		}

		const shot = shots[idx]

		clearShotTimer(shot)
		revokeShotUrl(shot)

		shot.el && shot.el.remove()
		shots.splice(idx, 1)

		if (activeId === id) closePreview()
		if (byDb) await deleteShotDb(id)
	}

	const sortShotsByCreated = (list) => [...list].sort((a, b) => a.createdAt - b.createdAt)

	const trimOverflow = async () => {
		while (shots.length > maxItems)
			await removeShot(shots[0].id)
	}

	const scheduleExpire = (shot) => {
		clearShotTimer(shot)

		const delay = Math.max(0, shot.expireAt - nowMs())

		shot.timer = setTimeout(() => {
			removeShot(shot.id)
		}, delay)
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

			const shotRect = {
				left: x,
				top: y,
				right: x + sizePx,
				bottom: y + sizePx
			}

			const hit = avoidRects.some((r) => rectIntersects(shotRect, r))
			if (!hit) {
				placed = true
				break
			}
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

	const makeItem = (shot) => {
		const item = document.createElement("div")
		item.className = "gallery-item"
		item.dataset.id = shot.id

		const img = document.createElement("img")
		img.src = shot.url
		img.alt = "shot"

		const ttl = document.createElement("div")
		ttl.className = "ttl"
		ttl.textContent = "00:00:00"

		item.appendChild(img)
		item.appendChild(ttl)

		const style = shot.style || makeShotStyle()
		applyShotStyle(item, style)

		on(item, "click", () => openPreview(shot.id))

		const updateTtl = () => {
			const left = shot.expireAt - nowMs()

			if (left <= 0) {
				ttl.textContent = "00:00:00"
				return
			}

			const sec = Math.ceil(left / 1000)
			const hh = String(Math.floor(sec / 3600)).padStart(2, "0")
			const mm = String(Math.floor((sec % 3600) / 60)).padStart(2, "0")
			const ss = String(sec % 60).padStart(2, "0")

			ttl.textContent = `${hh}:${mm}:${ss}`
		}

		const interval = setInterval(() => {
			if (!document.body.contains(item)) return clearInterval(interval)
			updateTtl()
		}, 1000)

		updateTtl()
		return item
	}

	const addShotRuntime = (record) => {
		const url = URL.createObjectURL(record.blob)

		const shot = {
			id: record.id,
			blob: record.blob,
			url,
			expireAt: record.expireAt,
			createdAt: record.createdAt,
			style: record.style,
			el: null,
			timer: null
		}

		shot.el = makeItem(shot)
		gallery.prepend(shot.el)
		scheduleExpire(shot)
		shots.push(shot)

		return shot
	}

	const restoreShots = async () => {
		const records = await getAllShotsDb()
		const now = nowMs()

		const valid = []
		const expired = []

		records.forEach((e) => {
			if (e.expireAt <= now) expired.push(e.id)
			else valid.push(e)
		})

		expired.forEach((id) => {
			deleteShotDb(id)
		})

		const sorted = sortShotsByCreated(valid)
		const keep = sorted.slice(-maxItems)
		const overflow = sorted.slice(0, Math.max(0, sorted.length - maxItems))

		overflow.forEach((e) => {
			deleteShotDb(e.id)
		})

		keep.forEach((record) => {
			addShotRuntime(record)
		})
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

	const saveNewShot = async (blob) => {
		const createdAt = nowMs()
		const expireAt = createdAt + ttlMs
		const id = uid()
		const style = makeShotStyle()

		const record = {
			id,
			blob,
			expireAt,
			createdAt,
			style
		}

		await putShotDb(record)
		const shot = addShotRuntime(record)
		await trimOverflow()

		return shot
	}

	const init = async () => {
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

		await restoreShots()

		on(btn, "click", async () => {
			btn.disabled = true

			try {
				const blob = await captureComposite()
				if (!blob) return

				await saveNewShot(blob)
			} finally {
				btn.disabled = false
			}
		})

		on(preview, "click", (e) => {
			const target = e.target
			if (!(target instanceof Element)) return

			const key = target.closest("[data-preview]")?.getAttribute("data-preview")
			if (key === "close") closePreview()
		})

		on(previewCloseBtn, "click", () => closePreview())
		on(previewDeleteBtn, "click", async () => {
			if (!activeId) return
			await removeShot(activeId)
		})

		on(window, "resize", clampAllShots)
	}

	return { init }
}