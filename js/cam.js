import { $, on } from "./utils.js"

export const createCam = ({ effects }) => {
	let video = null
	let toggleBtn = null
	let camText = null
	let status = null
	let stream = null

	const setStatus = (msg) => status.textContent = msg

	const isOn = () => document.documentElement.dataset.camera === "on"

	const stop = () => {
		if (!stream) return

		stream.getTracks().forEach((t) => t.stop())
		stream = null
		video.srcObject = null

		camText.textContent = "카메라 켜기"
		setStatus("카메라 꺼짐")
		document.documentElement.dataset.camera = ""

		effects?.stop?.()
	}

	const start = async () => {
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
			stop()
			setStatus("권한이 필요함")
		}
	}
	const init = () => {
		video = $("#cam")
		toggleBtn = $("#camToggleBtn")
		camText = $(".cam-text")
		status = $("#camStatus")

		if (!video || !toggleBtn || !status || !camText) return

		on(toggleBtn, "click", () => isOn() ? stop() : start())

		on(document, "visibilitychange", () => {
			if (document.hidden) return stop()
			start()
		})

		on(window, "pagehide", stop)

		setStatus("카메라 켜는 중...")
		start()
	}
	return {
		init,
		stop,
		isOn,
		getVideo: () => video
	}
}
