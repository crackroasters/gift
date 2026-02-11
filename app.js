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

function getRandomFortune(fortunes) {
	return pickRandom(fortunes)
}

function initFortune() {
	const btn = document.getElementById("fortuneBtn")
	const retryBtn = document.getElementById("fortuneRetryBtn")
	const result = document.getElementById("result")

	if (!btn || !retryBtn || !result) return

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
		"오늘의 나는 약간 사기 캐릭터! 귀여우니까~",
		"힘 안 써도 잘 된다!",
		"오늘은 실수도 귀엽게 넘어간다!",
		"오늘은 무슨 일이든 잘 끝난다!",
		"나 오늘 좀 잘 풀린다!",
		"오늘은 그냥 되는 날이다!",
		"괜히 자신감 생기는 하루!",
		"오늘은 나를 믿어도 된다!",
		"오늘의 나는 의외로 강하다!",
		"오늘은 좋은 소식 예감!",
		"오늘은 괜히 기대해도 된다!",
		"오늘은 웃고 끝나는 하루!",
		"오늘은 나한테 친절한 날!",
		"오늘은 일이 나를 도와준다!",
		"오늘의 나 컨디션 최상!",
		"오늘은 운이 내 편!",
		"오늘은 괜히 잘 풀린다 진짜로!",
		"오늘은 내가 이긴다!",
		"오늘은 조금 더 당당해도 된다!",
		"오늘은 귀엽고 유능하다!",
		"오늘의 나는 그냥 합격!",
		"상사가 오늘 나를 좋아한다!",
		"오늘은 괜히 칼퇴각이다!",
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
		"오늘은 어제보다 나은 나!",
		"행복은 멀리 있지 않다.... 바로 앞에 있다...",
		"스스로를 믿는 사람은 이미 반쯤 이긴다",
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

	const runFortune = () => {
		resetAnim(btn, result)

		const fortune = getRandomFortune(fortunes)
		result.textContent = fortune

		playAnim(btn, result)
	}

	btn.addEventListener("click", runFortune)
	retryBtn.addEventListener("click", runFortune)
}

function initCam() {
	const video = document.getElementById("cam")
	const toggleBtn = document.getElementById("camToggleBtn")
	const status = document.getElementById("camStatus")

	if (!video || !toggleBtn || !status) return

	let stream = null

	const setStatus = (msg) => status.textContent = msg

	const stopStream = () => {
		if (!stream) return
		stream.getTracks().forEach((t) => t.stop())
		stream = null
		video.srcObject = null
		toggleBtn.textContent = "카메라 켜기"
		setStatus("카메라 꺼짐")
	}

	const startStream = async () => {
		if (!navigator.mediaDevices?.getUserMedia) {
			setStatus("이 브라우저는 카메라를 지원하지 않음")
			return
		}

		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: "user" },
				audio: false
			})

			video.srcObject = stream
			await video.play()

			toggleBtn.textContent = "카메라 끄기"
			setStatus("카메라 켜짐")
		} catch {
			stopStream()
			setStatus("권한이 필요함 (Safari 설정 확인)")
		}
	}

	toggleBtn.addEventListener("click", () => stream ? stopStream() : startStream())

	document.addEventListener("visibilitychange", () => {
		if (document.hidden) stopStream()
	})

	window.addEventListener("pagehide", stopStream)
	setStatus("카메라 꺼짐")
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
		window.scrollTo({ top: 100, left: 0, behavior: "instant" })
	}

	requestAnimationFrame(() => {
		scrollDown()
		setTimeout(scrollDown, 60)
		setTimeout(scrollDown, 1000)
	})
}

initFortune()
initCam()
initLockdown()
initAutoScroll()