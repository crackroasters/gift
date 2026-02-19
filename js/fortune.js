import { $, on, pickRandom } from "./utils.js"

const resetAnim = (btn, result) => {
	btn.classList.remove("animate")
	result.classList.remove("show")
}

const playAnim = (btn, result) => {
	requestAnimationFrame(() => {
		btn.classList.add("animate")
		result.classList.add("show")
	})
}

const launchCelebration = (type = "heart") => {
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
		particle.addEventListener("animationend", () => particle.remove())
	}
}

const getRandomFortune = (fortunes) => {
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

export const initFortune = () => {
	const btn = $("#fortuneBtn")
	const retryBtn = $("#fortuneRetryBtn")
	const result = $("#result")

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
		document.querySelectorAll(".celebration").forEach((e) => e.remove())
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

		if (fortune.isGood) {
			launchCelebration("heart")
			launchCelebration("flower")
		}

		if (!fortune.isGood)
			launchCelebration("clover")

		playAnim(btn, result)

		btn.disabled = true
		retryBtn.disabled = false

		btn.style.display = "none"
		retryBtn.style.display = "inline-flex"
	}

	on(btn, "click", showResult)
	on(retryBtn, "click", showStart)

	showStart()

	return { showStart }
}
