const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 normal
    "https://media1.tenor.com/m/YRpwBGkLvX8AAAAd/pingu-scared.gif",  // 1 confused
    "https://media1.tenor.com/m/PIMmqS0N9DoAAAAC/jigglypuff-pokemon.gif",   // 2 pleading
    "https://media1.tenor.com/m/IOSVUx97AW4AAAAd/snoopy-sad.gif",             // 3 sad
    "https://media1.tenor.com/m/RdonyQfMqFUAAAAC/pingu-nom-nom.gif",       // 4 sadder
    "https://media1.tenor.com/m/JBIdvqlgvn0AAAAC/sad.gif",             // 5 devastated
    "https://media1.tenor.com/m/IOSVUx97AW4AAAAd/snoopy-sad.gif",               // 6 very devastated
    "https://media1.tenor.com/m/n-tJcLnbUt8AAAAd/chiikawa-run.gif"  // 7 crying runaway
]

const noMessages = [
    "Yes",
    "Are you sure? 🤔",
    "Bubby bati na tayo 🥺",
    "Sungit mo naman 🥰",
    "Sorry babyy 😢",
    "NOOO BABYYY",
    "Last chance! 😚",
    "You can't catch me anyway 😜"
]

const yesTeasePokes = [
    "try saying no first... I bet you want to know what happens 😏",
    "go on, hit no... just once 👀",
    "you're missing out 😈",
    "click no, I dare you 😏"
]

let yesTeasedCount = 0

let noClickCount = 0
let runawayEnabled = false
let musicPlaying = true

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// Autoplay: audio starts muted (bypasses browser policy), unmute immediately
music.muted = true
music.volume = 0.3
music.play().then(() => {
    music.muted = false
}).catch(() => {
    // Fallback: unmute on first interaction
    document.addEventListener('click', () => {
        music.muted = false
        music.play().catch(() => {})
    }, { once: true })
})

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

function handleYesClick() {
    if (!runawayEnabled) {
        // Tease her to try No first
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }
    window.location.href = 'yes.html'
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handleNoClick() {
    noClickCount++

    // Cycle through guilt-trip messages
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    // Grow the No button bigger each time
    const currentSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
    noBtn.style.fontSize = `${currentSize * 1.35}px`
    const padY = Math.min(18 + yesClickCount * 5, 60)
    const padX = Math.min(45 + yesClickCount * 10, 120)
    noBtn.style.padding = `${padY}px ${padX}px`

    // Shrink Yes button to contrast
    if (yesClickCount >= 2) {
        const yesSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
        yesBtn.style.fontSize = `${Math.max(yesSize * 0.85, 10)}px`
    }

    // Swap cat GIF through stages
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // Runaway starts at click 4
    if (yesClickCount >= 4 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    yesBtn.addEventListener('mouseover', runAway)
    yesBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    const margin = 20
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    const randomX = Math.random() * maxX + margin / 2
    const randomY = Math.random() * maxY + margin / 2

    yesBtn.style.position = 'fixed'
    yesBtn.style.left = `${randomX}px`
    yesBtn.style.top = `${randomY}px`
    yesBtn.style.zIndex = '50'
}
