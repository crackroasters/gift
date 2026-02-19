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

const initBrowserZ = () => {
	const browsers = [...document.querySelectorAll(".browser")]
	if (!browsers.length) return

	const getZ = (el) => {
		const z = Number.parseInt(getComputedStyle(el).zIndex, 10)
		return Number.isFinite(z) ? z : 0
	}

	let topZ = Math.max(10, ...browsers.map((e) => getZ(e)))

	const bringFront = (el) => {
		topZ += 1
		el.style.zIndex = String(topZ)
		el.dataset.z = String(topZ)
	}

	document.addEventListener("pointerdown", (e) => {
		const target = e.target
		if (!(target instanceof Element)) return

		const card = target.closest(".browser")
		if (!card) return

		bringFront(card)
	}, { passive: true })
}

initBrowserZ()
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