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
