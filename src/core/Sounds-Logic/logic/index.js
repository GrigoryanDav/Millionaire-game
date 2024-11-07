import mainGameSound from "../sounds/main-game-sound.mp3"

const audio = new Audio (mainGameSound)

export const playSoundOnDemand = (soundFile) => {
    const audio = new Audio(soundFile)
    audio.play().catch((error) => console.error('Error during playing soundOnDemand:', error))
}

export const startBackgroundMusic = () => {
        audio.loop = true
        audio.play().catch((error) => console.error('Error during background music play:', error))
}

export const stopBackgroundMusic = () => {
        audio.pause()
}
