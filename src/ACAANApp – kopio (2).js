import { useState, useEffect, useRef } from "react";

const mnemonica = [
  "4C", "2H", "7D", "3C", "4H", "6D", "AS", "5H", "9S", "2S",
  "QH", "3D", "QC", "8H", "6S", "5S", "9H", "KC", "2D", "JH",
  "3S", "8S", "6H", "10C", "5D", "KD", "2C", "3H", "8D", "5C",
  "KS", "JD", "8C", "10S", "KH", "JC", "7S", "10H", "AD", "4S",
  "7H", "4D", "AC", "9C", "JS", "QD", "7C", "QS", "10D", "6C",
  "AH", "9D"
];

export default function ACAANApp() {
  const [cardPosition, setCardPosition] = useState(null);
  const [numberRange, setNumberRange] = useState(null);
  const [instructions, setInstructions] = useState({});
  const [revealInstructions, setRevealInstructions] = useState(false);

  const cardInputRef = useRef(null);

  useEffect(() => {
    if (cardInputRef.current) {
      cardInputRef.current.focus();
    }
  }, []);

  

  const getCardPosition = (card) => mnemonica.indexOf(card) + 1;

  const getValidRange = (pos) => {
    let lower, upper;
    if (pos <= 26) {
      lower = pos;
    } else {
      lower = pos - 26;
    }
    upper = Math.min(52, lower + 25);
    return [lower, upper];
  };

  const getDealingInstructions = (pos, number) => {
    const n = parseInt(number);
    if (pos <= 26) {
      if (n === pos) {
        return { start: "Side 1", dealFirst: pos, flip: false, dealAfterFlip: 0 };
      }
      const diff = n - pos;
      return { start: "Side 2", dealFirst: diff, flip: true, dealAfterFlip: pos };
    } else {
      const s2_pos = pos - 26;
      if (n === s2_pos) {
        return { start: "Side 2", dealFirst: s2_pos, flip: false, dealAfterFlip: 0 };
      }
      if (n === pos) {
        return { start: "Side 1", dealFirst: pos, flip: false, dealAfterFlip: 0 };
      }
      const diff = n - s2_pos;
      return { start: "Side 1", dealFirst: diff, flip: true, dealAfterFlip: s2_pos };
    }
  };

  const handleCardSelection = (card) => {
    const pos = getCardPosition(card);
    setCardPosition(pos);
    setInstructions({});
    const range = getValidRange(pos);
    setNumberRange(range);
  };

  const handleNumberSubmit = (value) => {
    if (!cardPosition) return;
    const [min, max] = numberRange;
    const inputValue = value.trim();
    const n = parseInt(inputValue);
    if (isNaN(n) || n < min || n > max) {
      alert(`Please enter a number between ${min} and ${max}.`);
      return;
    }
    const instr = getDealingInstructions(cardPosition, inputValue);
    setInstructions(instr);
  };

  
  return (
    <>
      {typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent) && Object.keys(instructions).length > 0 && (
        <div
          onClick={() => setRevealInstructions(prev => !prev)}
          style={{
            position: "fixed",
            bottom: 10,
            left: 10,
            width: 80,
            height: 80,
            backgroundColor: "transparent",
            borderRadius: 4,
            zIndex: 10,
          }}
        ></div>
      )}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: `url(${process.env.PUBLIC_URL}/img/IMG_3130.PNG)`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          
          zIndex: -1,
        }}
      ></div>
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          width: "100vw",
          padding: '40px 40px 20px 40px',
          boxSizing: "border-box",
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              padding: 20,
              borderRadius: 12,
              backgroundColor: "transparent",
            }}
          >
            <div style={{ fontSize: '0.9rem', color: 'gray', textAlign: 'center' }}>{new Date().toLocaleString(undefined, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
            <div style={{ marginTop: 10 }}>
              <input
                ref={cardInputRef}
                id="card-input"
                tabIndex={0}
                onFocus={() => {
                  setCardPosition(null);
                  setRevealInstructions(false);
                  setNumberRange(null);
                  setInstructions({});
                }}
                onKeyDown={(e) => {
                  if (["Enter", "Tab"].includes(e.key)) {
                    let value = e.currentTarget.value.toUpperCase().trim();
// Korvaa saksalaiset nimitykset
value = value.replace(/^B/, 'J').replace(/B$/, 'J');
const emojiToSuit = { "♠️": "S", "♥️": "H", "♦️": "D", "♣️": "C" };
Object.entries(emojiToSuit).forEach(([emoji, letter]) => {
  if (value.startsWith(emoji)) {
    value = value.replace(emoji, '') + letter;
  } else if (value.endsWith(emoji)) {
    value = value.replace(emoji, letter);
  }
});
                    if (mnemonica.includes(value)) {
                      handleCardSelection(value);
                      setTimeout(() => {
                        const numberInput = document.getElementById("number-input");
                        if (numberInput) numberInput.focus();
                      }, 10);
                    } else {
                      alert("Card not found in Mnemonica stack.");
                    }
                  }
                }}
                style={{
                  width: "80%",
                  padding: 2,
                  marginTop: 5,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "1.4rem",
                  appearance: "textfield",
                }}
              />
            </div>

            {numberRange && (
              <>
                <div style={{ marginTop: 20 }}>
                  <input
                    id="number-input"
                    tabIndex={0}
                    type="text"
                    onFocus={() => {
                      setRevealInstructions(false);
                    }}
                    onKeyDown={(e) => {
                      if (["Enter", "Tab"].includes(e.key)) {
                        handleNumberSubmit(e.currentTarget.value);
                      }
                    }}
                    style={{
                      width: "80%",
                      padding: 2,
                      marginTop: 5,
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      fontSize: "1.4rem",
                      appearance: "textfield",
                    }}
                  />
                </div>
                {Object.keys(instructions).length === 0 && (
                  <p style={{ marginTop: 10 }}>
                    {numberRange[0]}–{numberRange[1]}
                  </p>
                )}
              </>
            )}

            {Object.keys(instructions).length > 0 && (!/Mobi|Android/i.test(navigator.userAgent) || revealInstructions) && (
              <div style={{ marginTop: 30 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, backgroundColor: instructions.start === 'Side 1' ? 'red' : 'black' }}></div>
                  <span>- {instructions.dealFirst} - {instructions.flip ? instructions.dealAfterFlip : 0}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </>
  );
}
