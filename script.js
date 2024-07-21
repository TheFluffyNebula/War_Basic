// http://127.0.0.1:5500/index.html
import Deck from './deck.js'

const deck = new Deck()
deck.shuffle()
console.log(deck.cards)
