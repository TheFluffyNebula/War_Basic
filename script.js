// http://127.0.0.1:5500/index.html
import Deck from './deck.js'

const CARD_VALUE_MAP = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14
}

const computerCardSlot = document.querySelector('.computer-card-slot')
const computerDeckElement = document.querySelector('.computer-deck')
const playerCardSlot = document.querySelector('.player-card-slot')
const playerDeckElement = document.querySelector('.player-deck')
const text = document.querySelector('.text')

let playerDeck, computerDeck, inRound, stop

document.addEventListener('click', () => {
    if (stop) {
        startGame()
        return
    }
    if (inRound) {
        cleanBeforeRound()
    } else {
        flipCards()
    }
})

startGame()
function startGame() {
    const deck = new Deck()
    deck.shuffle()
    // console.log(deck.cards)
    const deckMidpoint = Math.ceil(deck.numberOfCards / 2)
    playerDeck = new Deck(deck.cards.slice(0, deckMidpoint))
    computerDeck = new Deck(deck.cards.slice(deckMidpoint, deck.numberOfCards))
    // console.log(playerDeck, computerDeck)
    inRound = false
    stop = false

    // computerCardSlot.appendChild(deck.cards[0].getHTML())
    cleanBeforeRound()
}

function cleanBeforeRound() {
    inRound = false

    computerCardSlot.innerHTML = ''
    playerCardSlot.innerHTML = ''
    text.innerText = ''

    updateDeckCount()
}

function flipCards() {
    inRound = true

    let playerCard = playerDeck.pop()
    let computerCard = computerDeck.pop()

    playerCardSlot.appendChild(playerCard.getHTML())
    computerCardSlot.appendChild(computerCard.getHTML())

    updateDeckCount()

    if (isRoundWinner(playerCard, computerCard)) {
        text.innerHTML = 'Win'
        playerDeck.push(playerCard)
        playerDeck.push(computerCard)
    } else if (isRoundWinner(computerCard, playerCard)) {
        text.innerHTML = 'Lose'
        computerDeck.push(playerCard)
        computerDeck.push(computerCard)
    } else {
        text.innerHTML = 'Draw, 123 flip'
        // original: both get cards back (neither side can actually win here)
        // playerDeck.push(playerCard)
        // computerDeck.push(computerCard)
        
        // remember, playerCard and computerCard are still here to be added back afterward
        let playerWin = true // indicate which of playerCard & computerCard go back
        if (!isGameOver(playerDeck) && !isGameOver(computerDeck)) {
            war()
            if (playerWin) {
                playerDeck.push(playerCard)
                playerDeck.push(computerCard)
            } else {
                computerDeck.push(playerCard)
                computerDeck.push(computerCard)
            }
        }
        // if no war that meant someone didn't have enough cards and loses
    }
    // note for here: the way this is programmed helps keep track of the game state
    // and hands things off to functions to check, etc. 
    // I think I will try to stick to this design pattern
    if (isGameOver(playerDeck)) {
        text.innerText = 'You Lose!'
        stop = true
    } else if (isGameOver(computerDeck)) {
        text.innerText = 'You win!'
        stop = true
    }
}

function war() {
    let cards = []
    let go = true
    while (go) {
        // await sleep(3000) // going to try setTimeout instead
        // nope, doesn't do what i want it to :/
        // setTimeout(() => {
        //     console.log("War!")
        //   }, 1000);
        // both players have enough cards, 1 2 3 flip
        for (let i = 0; i < 3; i ++) {
            cards.push(playerDeck.pop())
            if (isGameOver(playerDeck)) {
                text.innerText = 'You Lose!'
                playerWin = false
                return
            }
            cards.push(computerDeck.pop())
            if (isGameOver(computerDeck)) {
                text.innerText = 'You win!'
                return
            }
        }
        console.log(cards)
        let pWarCard = playerDeck.pop()
        let cWarCard = computerDeck.pop()
        // reveal the cards
        playerCardSlot.appendChild(pWarCard.getHTML())
        computerCardSlot.appendChild(cWarCard.getHTML())
        updateDeckCount()
        if (!isRoundWinner(pWarCard, cWarCard) && !isRoundWinner(cWarCard, pWarCard)) {
            // war continues
            cards.push(pWarCard, cWarCard)
        } else if (isRoundWinner(pWarCard, cWarCard)) {
            // player wins
            text.innerHTML = 'Win'
            playerDeck.push(pWarCard)
            playerDeck.push(cWarCard)
            for (let i = 0; i < cards.length; i++) {
                playerDeck.push(cards[i])
            }
            return
        } else {
            // computer wins
            text.innerHTML = 'Loss'
            computerDeck.push(pWarCard)
            computerDeck.push(cWarCard)
            for (let i = 0; i < cards.length; i++) {
                computerDeck.push(cards[i])
            }
            return
        }
    }
}

function updateDeckCount() {
    computerDeckElement.innerText = computerDeck.numberOfCards
    playerDeckElement.innerText = playerDeck.numberOfCards
}

function isRoundWinner(cardOne, cardTwo) {
    return CARD_VALUE_MAP[cardOne.value] > CARD_VALUE_MAP[cardTwo.value]
}

function isGameOver(deck) {
    return deck.numberOfCards == 0
}
