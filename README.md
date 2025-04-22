# ACAAN Double Stack App

This is a React application that performs the classic mentalism effect **Any Card at Any Number (ACAAN)** using a special double-deck method. It utilizes Atomic deck stacked in special way.
## 🔮 Features

- Input any playing card (e.g., `K♥️`, `7S`, `10♦️`)
- Displays the valid position range for the selected card
- Input any number between x-52 (I recommend numbers below 40 for obvious reasons)
- The app calculates and displays dealing instructions:
  - From which side to start
  - Whether to flip the deck
  - How many cards to deal before and after the flip
- Fully mobile-friendly — "Done" key on mobile keyboard works like Enter
- Emojis and card symbols display clearly and naturally

## 🧠 Behind the Scenes

The app uses two 52-card decks:

- `stack1` (odd cards from Atomic Deck):
J♠️  5♠️  10♦️  K♠️  9♠️  7♠️  K♦️  8♥️  Q♦️  9♦️  J♥️  Q♠️  5♦️  
3♠️  Q♣️  3♦️  10♣️  J♦️  2♠️  4♥️  8♦️  A♣️  2♦️  4♦️  7♥️  K♣️  
7♦️  5♥️  5♣️  6♣️  A♥️  2♥️  10♠️  9♣️  8♣️  4♠️  2♣️  3♣️  8♠️  
J♣️  10♥️  K♥️  A♠️  9♥️  6♦️  6♠️  7♣️  A♦️  4♣️  Q♥️  3♥️  6♥️  
- `stack2`: reverse of `stack1` 

The trick works by dealing a specific number of cards from one side of the deck, optionally flipping it in the middle, so that the named card lands on the named position.
