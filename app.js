function pickRandom(arr) {
	const idx = Math.floor(Math.random() * arr.length)
	return arr[idx]
}

function resetAnim(btn, result) {
	btn.classList.remove("animate")
	result.classList.remove("show")
}

function playAnim(btn, result) {
	requestAnimationFrame(() => {
		btn.classList.add("animate")
		result.classList.add("show")
	})
}

function removeEffects(host) {
	if (!host) return

	host.querySelectorAll(".fx").forEach((e) => {
		e.remove()
	})

	document.documentElement.removeAttribute("data-effect")
}

function spawnFloatEmoji(host, emoji) {
	if (!host) return

	const el = document.createElement("span")
	el.className = "fx"
	el.textContent = emoji

	const rect = host.getBoundingClientRect()

	const x = Math.random() * 100
	const size = 16 + Math.random() * 14
	const duration = 2 + Math.random() * 4
	const drift = (Math.random() * 40) + 30
	const delay = Math.random() * 0.4

	const fallPx = rect.height + 120

	el.style.left = `${x}%`
	el.style.fontSize = `${size}px`
	el.style.animationDelay = `${delay}s`
	el.style.setProperty("--fx-duration", `${duration}s`)
	el.style.setProperty("--fx-drift", `${drift}%`)
	el.style.setProperty("--fx-fall", `${fallPx}px`)

	host.appendChild(el)

	el.addEventListener("animationend", () => {
		el.remove()
	})
}

function initEffects() {
	const bar = document.querySelector(".effect-bar")
	const host = document.getElementById("camWrap") || document.querySelector(".cam-wrap") || document.querySelector(".camera")

	if (!bar || !host) return

	const root = document.documentElement
	const isCamOn = () => root.dataset.camera === "on"

	const effects = {
		"1": { name: "water", emojis: ["💧", "💦", "🌧️"] },
		"2": { name: "balloon", emojis: ["🎈", "🎉", "🎊"] },
		"3": { name: "sparkle", emojis: ["✨", "⭐️", "💫"] },
		"4": { name: "bubble", emojis: ["🫧", "🤍", "🩵"] },
		"5": { name: "heart", emojis: ["🩷", "🌸", "🎀"] }
	}

	let timer = null
	let activeEmojis = []

	const stop = () => {
		if (timer) clearInterval(timer)
		timer = null
		activeEmojis = []
		removeEffects(host)
	}

	const start = (key) => {
		if (!isCamOn()) return stop()

		const effect = effects[key]
		if (!effect) return

		stop()

		root.setAttribute("data-effect", effect.name)
		activeEmojis = effect.emojis

		timer = setInterval(() => {
			if (!isCamOn()) return stop()
			if (!activeEmojis.length) return
			spawnFloatEmoji(host, pickRandom(activeEmojis))
		}, 1050)
	}

	bar.addEventListener("click", (e) => {
		const btn = e.target.closest(".effect-btn")
		if (!btn) return

		const key = btn.dataset.effect
		if (key === "off") return stop()
		if (!isCamOn()) return stop()

		start(key)
	})

	window.addEventListener("pagehide", stop)

	document.addEventListener("visibilitychange", () => {
		if (document.hidden) stop()
	})

	window.stopSpanEffects = stop
}

function launchCelebration(type = "heart") {
	const count = 24

	for (let i = 0; i < count; i += 1) {
		const particle = document.createElement("span")
		particle.className = `celebration celebration--${type}`

		const x = Math.random() * 100
		const y = Math.random() * 100
		const delay = Math.random() * 0.3
		const size = 12 + Math.random() * 12
		const duration = type === "heart"
			? 10 + Math.random() * 2
			: 13 + Math.random()

		particle.style.left = `${x}vw`
		particle.style.top = `${y}vh`
		particle.style.animationDelay = `${delay}s`
		particle.style.fontSize = `${size}px`
		particle.style.animationDuration = `${duration}s`

		document.body.appendChild(particle)

		particle.addEventListener("animationend", () => {
			particle.remove()
		})
	}
}

function getRandomFortune(fortunes) {
	const isGood = Math.random() < 0.01

	if (isGood)
		return {
			text: "축하해요! 오늘 상위 1% 안에 드는 행운 가득 크래커예요. 1% 확률을 뚫고 이 운세를 얻었어요. 오늘 당신의 하루가 무탈하고 행운 가득하길!",
			isGood: true
		}

	return {
		text: pickRandom(fortunes),
		isGood: false
	}
}

function initFortune() {
	const btn = document.getElementById("fortuneBtn")
	const retryBtn = document.getElementById("fortuneRetryBtn")
	const result = document.getElementById("result")

	if (!btn || !retryBtn || !result) return

	const root = document.documentElement

	const fortunes = [
		"이번주 복권 당첨은 바로 나?!",
		"포기는 배추셀 때나 하는 말이다!!",
		"안되면 되는 거 해라 오늘은 된다!!",
		"오늘은 귀여운 나를 위한 하루!",
		"축하해요! 당신의 귀여움이 더 올라가는 날이에요!",
		"행운 가득한 크래커의 하루!",
		"나는 생각보다 꽤 잘함!",
		"출근했다면 이미 절반은 성공함!",
		"오늘은 이유 없이 운이 좋다!",
		"누가 봐도 되는 날이다!",
		"오늘은 커피가 더 맛있게 느껴질 예정!",
		"아무 이유 없지만 잘 풀린다!",
		"오늘은 내가 주인공인 날!",
		"작은 일도 술술 풀린다...!",
		"괜히 웃음이 나는 하루!",
		"오늘의 선택은 전부 정답!",
		"온 지구에서 나만 빛난다!",
		"오늘은 칭찬 받을 확률 높음!",
		"괜히 잘되는 날이다!",
		"오늘은 그냥 믿고 가도 된다!",
		"내가 해내는 날!",
		"오늘은 나 자신에게 박수! 짝짝짝! 👏",
		"운빨 상승 중!",
		"오늘은 무조건 플러스다!",
		"귀여움이 성과로 이어지는 날!",
		"오늘의 나는 약간 사기 캐릭터! 귀엽잖아~",
		"힘 안 써도 잘 된다!",
		"그러려니 하고 살자.",
		"오늘은 무슨 일이든 잘 끝난다!",
		"나 오늘 좀 잘 풀린다!",
		"오늘은 그냥 되는 날이다!",
		"괜히 자신감 생기는 하루!",
		"오늘은 나를 믿어도 된다!",
		"오늘의 나는 의외로 강하다!",
		"오늘은 좋은 소식 예감!",
		"기대할 소식이 있을 것 같은 하루!",
		"오늘은 웃고 끝나는 하루!",
		"오늘은 당신에게 가장 멋진 하루가 될 거예요!",
		"오늘은 일이 나를 도와준다!",
		"오늘의 나 컨디션 최상!",
		"오늘은 운이 내 편!",
		"뭔가 잘 풀리는 하루",
		"오늘은 내가 이긴다!",
		"오늘은 조금 더 당당해도 된다!",
		"조금 바보같지만 귀여운 나...?",
		"오늘의 나는 그냥 합격!",
		"사랑이 가득한 하루",
		"과정이 진짜! 결과는 보너스!",
		"일이 술술 풀리는 날!",
		"오늘은 잘해도 어색하지 않다!",
		"오늘은 평소보다 한 수 위!",
		"오늘은 내 판단이 맞는다!",
		"오늘은 선택하면 정답이다!",
		"오늘은 집중력이 나를 찾아온다!",
		"오늘은 나답게 잘 한다!",
		"오늘은 작은 성공이 쌓인다!",
		"오늘은 한 번 더 웃는다!",
		"오늘은 마음이 먼저 여유롭다!",
		"오늘은 나를 의심하지 말자",
		"오늘은 이미 충분히 잘했다!",
		"그냥 웃자!",
		"어제보다 나은 나!",
		"행복은 멀리 있지 않다.... 바로 앞에 있다...",
		"스스로를 믿는 사람은 이미 반쯤 이기고 있다",
		"지금 걷는 속도가 느려도 방향이 맞다",
		"잘 살아가는 것 자체가 성과다",
		"오늘의 나도 충분히 존중받아야 한다",
		"완벽하지 않아도 앞으로 가고 있다",
		"기다림도 하나의 전진이다",
		"불안해도 계속 가는 사람이 강하다",
		"나아가고 있다는 사실이 중요하다",
		"오늘의 선택이 내일을 만든다",
		"지금의 노력이 나를 배신하지 않는다",
		"스스로를 포기하지 않는 한 실패는 없다",
		"지금 이 순간도 과정이다",
		"천천히 가도 멈추지만 않으면 된다",
		"오늘을 버텼다면 이미 잘한 것이다"
	]

	const clearRootFortune = () => root.removeAttribute("data-fortune")

	const applyRootFortune = (isGood) => {
		if (isGood) root.setAttribute("data-fortune", "good")
		if (!isGood) clearRootFortune()
	}

	const clearCelebration = () => {
		document.querySelectorAll(".celebration").forEach((e) => {
			e.remove()
		})
	}

	const showStart = () => {
		resetAnim(btn, result)
		result.textContent = ""
		clearRootFortune()
		clearCelebration()

		btn.disabled = false
		retryBtn.disabled = true

		btn.style.display = "inline-flex"
		retryBtn.style.display = "none"
	}

	const showResult = () => {
		resetAnim(btn, result)
		clearCelebration()

		const fortune = getRandomFortune(fortunes)
		result.textContent = fortune.text

		applyRootFortune(fortune.isGood)
		if (fortune.isGood) launchCelebration("heart")
		if (fortune.isGood) launchCelebration("flower")

		playAnim(btn, result)

		btn.disabled = true
		retryBtn.disabled = false

		btn.style.display = "none"
		retryBtn.style.display = "inline-flex"
	}

	btn.addEventListener("click", showResult)
	retryBtn.addEventListener("click", showStart)

	showStart()

	window.showStart = showStart
}

function initCam() {
	const video = document.getElementById("cam")
	const toggleBtn = document.getElementById("camToggleBtn")
	const camText = document.querySelector(".cam-text")
	const status = document.getElementById("camStatus")

	if (!video || !toggleBtn || !status || !camText) return

	let stream = null

	const setStatus = (msg) => status.textContent = msg

	const stopStream = () => {
		if (!stream) return

		stream.getTracks().forEach((t) => t.stop())
		stream = null
		video.srcObject = null

		camText.textContent = "카메라 켜기"
		setStatus("카메라 꺼짐")
		document.documentElement.dataset.camera = ""

		if (typeof window.stopEffects === "function") window.stopEffects()
		if (typeof window.stopSpanEffects === "function") window.stopSpanEffects()
	}

	const startStream = async () => {
		if (!navigator.mediaDevices?.getUserMedia) return setStatus("이 브라우저는 카메라를 지원하지 않음")

		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: "user" },
				audio: false
			})

			video.srcObject = stream
			await video.play()

			camText.textContent = "카메라 끄기"
			setStatus("카메라 켜짐")
			document.documentElement.dataset.camera = "on"
		} catch {
			stopStream()
			setStatus("권한이 필요함")
		}
	}

	toggleBtn.addEventListener("click", () => stream ? stopStream() : startStream())

	document.addEventListener("visibilitychange", () => {
		if (document.hidden) stopStream()
	})

	window.addEventListener("pagehide", stopStream)

	setStatus("카메라 꺼짐")

	window.stopStream = stopStream
}

function initLockdown() {
	document.body.classList.add("lockdown")

	const block = (e) => e.preventDefault()

	document.addEventListener("contextmenu", block, { passive: false })
	document.addEventListener("selectstart", block, { passive: false })
	document.addEventListener("dragstart", block, { passive: false })
	document.addEventListener("touchmove", block, { passive: false })
	document.addEventListener("gesturestart", block, { passive: false })
	document.addEventListener("gesturechange", block, { passive: false })
	document.addEventListener("gestureend", block, { passive: false })
}

function initAutoScroll() {
	const scrollDown = () => {
		window.scrollTo({ top: 100, left: 0, behavior: "auto" })
	}

	requestAnimationFrame(() => {
		scrollDown()
		setTimeout(scrollDown, 60)
		setTimeout(scrollDown, 900)
	})
}

function setToday() {
	const el = document.querySelector(".today")
	if (!el) return

	const now = new Date()

	const y = now.getFullYear()
	const m = String(now.getMonth() + 1).padStart(2, "0")
	const d = String(now.getDate()).padStart(2, "0")

	el.textContent = `${y}.${m}.${d}`
}

function initIdleUX() {
	const root = document.documentElement
	const countdownEl = document.querySelector(".idle-countdown")

	const idleDimTime = 120000
	const countdownTime = 10000
	const fullResetTime = 180000

	let idleTimer = null
	let countdownTimer = null
	let finalTimer = null
	let countdownInterval = null

	const clearTimers = () => {
		clearTimeout(idleTimer)
		clearTimeout(countdownTimer)
		clearTimeout(finalTimer)
		clearInterval(countdownInterval)
	}

	const clearIdleState = () => {
		root.removeAttribute("data-idle")
		if (countdownEl) countdownEl.textContent = ""
	}

	const softReset = () => {
		clearIdleState()
		if (typeof showStart === "function") showStart()
		if (typeof stopStream === "function") stopStream()
	}

	const startCountdown = () => {
		let remaining = 10
		root.dataset.idle = "countdown"
		if (countdownEl) countdownEl.textContent = remaining

		countdownInterval = setInterval(() => {
			remaining -= 1
			if (countdownEl) countdownEl.textContent = remaining
			if (remaining <= 0) clearInterval(countdownInterval)
		}, 1000)
	}

	const startTimers = () => {
		clearTimers()

		idleTimer = setTimeout(() => {
			root.dataset.idle = "dim"
		}, idleDimTime)

		countdownTimer = setTimeout(() => {
			startCountdown()
		}, fullResetTime - countdownTime)

		finalTimer = setTimeout(() => {
			softReset()
		}, fullResetTime)
	}

	const userActivity = () => {
		clearIdleState()
		startTimers()
	}

	["click", "touchstart", "mousemove", "keydown"].forEach((e) => {
		document.addEventListener(e, userActivity, { passive: true })
	})

	startTimers()
}

function initEffectsCanvas() {
	const bar = document.querySelector(".effect-bar")
	const host = document.getElementById("camWrap")
	const canvas = document.getElementById("fxCanvas")

	if (!bar || !host || !canvas) return

	const root = document.documentElement
	const isCamOn = () => root.dataset.camera === "on"

	const ctx = canvas.getContext("2d")
	if (!ctx) return

	const effects = {
		"1": { name: "water", emojis: ["💧", "💦", "🌧️"] },
		"2": { name: "balloon", emojis: ["🎈", "🎉", "🎊"] },
		"3": { name: "sparkle", emojis: ["✨", "⭐️", "💫"] },
		"4": { name: "bubble", emojis: ["🫧", "🔵", "💧"] },
		"5": { name: "heart", emojis: ["💖", "💗", "💘"] }
	}

	let active = { name: "", emojis: [] }
	let timer = null
	let raf = 0
	let particles = []

	const fitCanvas = () => {
		const rect = host.getBoundingClientRect()
		const dpr = window.devicePixelRatio || 1

		canvas.width = Math.max(1, Math.floor(rect.width * dpr))
		canvas.height = Math.max(1, Math.floor(rect.height * dpr))

		canvas.style.width = `${rect.width}px`
		canvas.style.height = `${rect.height}px`

		ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
	}

	const clearCanvas = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
	}

	const stop = () => {
		if (timer) clearInterval(timer)
		timer = null

		if (raf) cancelAnimationFrame(raf)
		raf = 0

		particles = []
		active = { name: "", emojis: [] }

		root.removeAttribute("data-effect")
		clearCanvas()
	}

	const spawn = () => {
		if (!isCamOn()) return stop()
		if (!active.emojis.length) return

		const rect = host.getBoundingClientRect()
		const w = rect.width
		const h = rect.height

		const emoji = pickRandom(active.emojis)
		const size = 7 + Math.random() * 22
		const x = Math.random() * w
		const y = -30
		const drift = (Math.random() * 60) - 30
		const speed = 50 + Math.random() * 80
		const life = 7 + Math.random() * 3
		const rot = (Math.random() * 1.2) - 0.6

		particles.push({
			emoji,
			x,
			y,
			size,
			drift,
			speed,
			life,
			age: 0,
			rot
		})

		if (particles.length > 30)
			particles.splice(0, particles.length - 30)
	}

	let lastTs = 0

	const tick = (ts) => {
		if (!isCamOn()) return stop()

		if (!lastTs) lastTs = ts
		const dt = Math.min(0.05, (ts - lastTs) / 1000)
		lastTs = ts

		const rect = host.getBoundingClientRect()
		const w = rect.width
		const h = rect.height

		clearCanvas()

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
		fitCanvas()

		active = { name: eff.name, emojis: eff.emojis }
		root.setAttribute("data-effect", eff.name)

		timer = setInterval(() => {
			if (!isCamOn()) return stop()
			for (let i = 0; i < 1; i += 1)
				spawn()
		}, 700)

		raf = requestAnimationFrame(tick)
	}

	bar.addEventListener("click", (e) => {
		const btn = e.target.closest(".effect-btn")
		if (!btn) return

		const key = btn.dataset.effect
		if (key === "off") return stop()
		if (!isCamOn()) return stop()

		start(key)
	})

	window.addEventListener("resize", () => {
		if (!active.emojis.length) return
		fitCanvas()
	})

	window.addEventListener("pagehide", stop)

	document.addEventListener("visibilitychange", () => {
		if (document.hidden) stop()
	})

	window.getFxCanvas = () => canvas
	window.stopEffects = stop
}

function initShotGallery() {
	const video = document.getElementById("cam")
	const wrap = document.getElementById("camWrap")
	const btn = document.querySelector(".film-btn")
	const gallery = document.getElementById("gallery")

	const preview = document.getElementById("preview")
	const previewImg = document.getElementById("previewImg")
	const previewDeleteBtn = document.getElementById("previewDeleteBtn")
	const previewCloseBtn = document.getElementById("previewCloseBtn")

	if (!video || !wrap || !btn || !gallery) return
	if (!preview || !previewImg || !previewDeleteBtn || !previewCloseBtn) return

	const ttlMs = 300000
	const maxItems = 12
	const shots = []

	let activeId = ""

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

		const avoidEl = document.querySelector(".camera")
		const style = makeShotStyle(86, avoidEl)
		applyShotStyle(item, style)


		item.addEventListener("click", () => {
			openPreview(id)
		})

		const updateTtl = () => {
			const left = expireAt - Date.now()
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

		const w = video.videoWidth
		const h = video.videoHeight
		if (!w || !h) return null

		const fxCanvas = window.getFxCanvas ? window.getFxCanvas() : null

		const capture = document.createElement("canvas")
		capture.width = w
		capture.height = h

		const ctx = capture.getContext("2d")
		if (!ctx) return null

		await new Promise((resolve) => requestAnimationFrame(() => resolve()))
		await new Promise((resolve) => requestAnimationFrame(() => resolve()))

		ctx.save()
		ctx.translate(w, 0)
		ctx.scale(-1, 1)

		ctx.drawImage(video, 0, 0, w, h)

		if (fxCanvas) {
			const rect = wrap.getBoundingClientRect()

			const sw = fxCanvas.width
			const sh = fxCanvas.height

			const scaleX = w / rect.width
			const scaleY = h / rect.height

			const dw = rect.width * scaleX
			const dh = rect.height * scaleY

			ctx.drawImage(fxCanvas, 0, 0, sw, sh, 0, 0, dw, dh)
		}

		ctx.restore()

		const blob = await new Promise((resolve) => {
			capture.toBlob((b) => resolve(b), "image/jpeg", 0.9)
		})

		return blob || null
	}


	btn.addEventListener("click", async () => {
		btn.disabled = true

		const blob = await captureComposite()
		if (!blob) return btn.disabled = false

		const url = URL.createObjectURL(blob)
		const id = crypto?.randomUUID ? crypto.randomUUID() : String(Date.now())

		const expireAt = Date.now() + ttlMs
		const el = makeItem(url, expireAt, id)

		gallery.prepend(el)

		const timer = setTimeout(() => {
			removeShot(id)
		}, ttlMs)

		shots.push({ id, url, el, timer })
		trimOverflow()

		btn.disabled = false
	})

	preview.addEventListener("click", (e) => {
		const target = e.target
		if (!(target instanceof Element)) return

		const key = target.closest("[data-preview]")?.getAttribute("data-preview")
		if (key === "close") closePreview()
	})

	previewCloseBtn.addEventListener("click", () => closePreview())

	previewDeleteBtn.addEventListener("click", () => {
		if (!activeId) return
		removeShot(activeId)
	})

	const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

	const rectIntersects = (a, b) =>
		a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top

	const makeShotStyle = (size, avoidEl) => {
		const pad = 18
		const w = window.innerWidth
		const h = window.innerHeight

		const maxX = Math.max(pad, w - size - pad)
		const maxY = Math.max(pad, h - size - pad)

		const avoidRect = avoidEl ? avoidEl.getBoundingClientRect() : null
		const triesMax = 80

		let x = 0
		let y = 0
		let placed = false

		for (let i = 0; i < triesMax; i += 1) {
			x = clamp(Math.random() * w, pad, maxX)
			y = clamp(Math.random() * h, pad, maxY)

			if (!avoidRect) { placed = true; break }

			const shotRect = {
				left: x,
				top: y,
				right: x + size,
				bottom: y + size
			}

			if (!rectIntersects(shotRect, avoidRect)) { placed = true; break }
		}

		if (!placed && avoidRect) {
			const leftSpace = avoidRect.left - pad
			const rightSpace = w - avoidRect.right - pad
			const topSpace = avoidRect.top - pad
			const bottomSpace = h - avoidRect.bottom - pad

			const canLeft = leftSpace >= size
			const canRight = rightSpace >= size
			const canTop = topSpace >= size
			const canBottom = bottomSpace >= size

			if (canLeft) x = clamp(Math.random() * leftSpace, pad, avoidRect.left - size - pad)
			if (!canLeft && canRight) x = clamp(avoidRect.right + Math.random() * rightSpace, avoidRect.right + pad, maxX)
			if (!canLeft && !canRight) x = clamp(x, pad, maxX)

			if (canTop) y = clamp(Math.random() * topSpace, pad, avoidRect.top - size - pad)
			if (!canTop && canBottom) y = clamp(avoidRect.bottom + Math.random() * bottomSpace, avoidRect.bottom + pad, maxY)
			if (!canTop && !canBottom) y = clamp(y, pad, maxY)
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
	const size = 86
	const pad = 18
	const w = window.innerWidth
	const h = window.innerHeight

	const maxX = Math.max(pad, w - size - pad)
	const maxY = Math.max(pad, h - size - pad)

	document.querySelectorAll("#gallery .gallery-item").forEach((e) => {
		const left = parseFloat(e.style.left || "0")
		const top = parseFloat(e.style.top || "0")

		e.style.left = `${clamp(left, pad, maxX)}px`
		e.style.top = `${clamp(top, pad, maxY)}px`
	})
}

window.addEventListener("resize", clampAllShots)


}

initFortune()
initCam()
initLockdown()
initAutoScroll()
setToday()
initEffects()
initEffectsCanvas()
initShotGallery()
