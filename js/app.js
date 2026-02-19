import { initFortune } from "./fortune.js"
import { createEffects } from "./effects.js"
import { createCam } from "./cam.js"
import { createGallery } from "./gallery.js"
import { initLockdown, initAutoScroll, setToday, initIdleUX } from "./ux.js"

const effects = createEffects()
effects.init()

const cam = createCam({ effects })
cam.init()

const gallery = createGallery({ effects, cam })
gallery.init()

const fortune = initFortune()

const initFocusZ = () => {
	const targets = Array.from(document.querySelectorAll(".browser, .camera, .preview-panel"))
	if (!targets.length) return

	let zTop = targets.reduce((max, el) => {
		const z = Number(window.getComputedStyle(el).zIndex)
		if (!Number.isFinite(z)) return max
		return Math.max(max, z)
	}, 10)

	const setTop = (el) => {
		if (!el) return
		zTop = zTop + 1
		el.style.zIndex = String(zTop)
	}

	const findTarget = (t) => {
		const el = t.closest(".preview")
		if (el) return null
		return t.closest(".browser, .camera, .preview-panel")
	}

	;["pointerdown", "touchstart", "mousedown"].forEach((evt) => {
		document.addEventListener(evt, (e) => {
			const t = e.target
			if (!(t instanceof Element)) return

			const hit = findTarget(t)
			if (!hit) return

			setTop(hit)
		}, { passive: true })
	})
}


initLockdown()
initAutoScroll()
setToday()

initIdleUX({
	onSoftReset: () => {
		fortune?.showStart?.()
		cam.stop()
		effects.stop()
	}
})

initFocusZ()