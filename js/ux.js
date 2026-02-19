import { $ } from "./utils.js"

export const initLockdown = () => {
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

export const initAutoScroll = () => {
	const scrollDown = () => {
		window.scrollTo({ top: 100, left: 0, behavior: "auto" })
	}

	requestAnimationFrame(() => {
		scrollDown()
		setTimeout(scrollDown, 60)
		setTimeout(scrollDown, 900)
	})
}

export const setToday = () => {
	const el = $(".today")
	if (!el) return

	const now = new Date()
	const y = now.getFullYear()
	const m = String(now.getMonth() + 1).padStart(2, "0")
	const d = String(now.getDate()).padStart(2, "0")

	el.textContent = `${y}.${m}.${d}`
}

export const initIdleUX = ({ onSoftReset }) => {
	const root = document.documentElement
	const countdownEl = $(".idle-countdown")

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
		countdownEl && (countdownEl.textContent = "")
	}

	const softReset = () => {
		clearIdleState()
		onSoftReset && onSoftReset()
	}

	const startCountdown = () => {
		let remaining = 10
		root.dataset.idle = "countdown"
		countdownEl && (countdownEl.textContent = remaining)

		countdownInterval = setInterval(() => {
			remaining -= 1
			countdownEl && (countdownEl.textContent = remaining)
			if (remaining <= 0) clearInterval(countdownInterval)
		}, 1000)
	}

	const startTimers = () => {
		clearTimers()

		idleTimer = setTimeout(() => root.dataset.idle = "dim", idleDimTime)
		countdownTimer = setTimeout(() => startCountdown(), fullResetTime - countdownTime)
		finalTimer = setTimeout(() => softReset(), fullResetTime)
	}

	const userActivity = () => {
		clearIdleState()
		startTimers()
	}

	;["click", "touchstart", "mousemove", "keydown"].forEach((e) => {
		document.addEventListener(e, userActivity, { passive: true })
	})

	startTimers()
}
