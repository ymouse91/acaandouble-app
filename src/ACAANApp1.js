import { useState, useEffect, useRef } from "react";

// Mnemonica stack (commented out)
// const stack1 = [ ... ];

const stack1 = [
  "6H", "8S", "KC", "5D", "3H", "3C", "7H", "QS", "QH", "2C",
  "4D", "JH", "4C", "4S", "2D", "9D", "AD", "8C", "AC", "QD",
  "7C", "9C", "8D", "8H", "6S", "10S", "4H", "KD", "6D", "2H",
  "2S", "7S", "9H", "AH", "JD", "9S", "AS", "6C", "10C", "KS",
  "KH", "5C", "3D", "10D", "10H", "5H", "QC", "5S", "JC", "7D",
  "3S", "JS"
];

const stack2 = [...stack1].reverse();

export default function ACAANApp() {
  const [card, setCard] = useState("");
  const [position, setPosition] = useState("");
  const [instructions, setInstructions] = useState(null);
  const [rangeHint, setRangeHint] = useState(null);
  const [revealInstructions, setRevealInstructions] = useState(false);
  const cardInputRef = useRef(null);
  const positionInputRef = useRef(null);

  const now = new Date().toLocaleString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  useEffect(() => {
    if (cardInputRef.current) {
      cardInputRef.current.focus();
    }
  }, []);

  const getCardPositions = (cardValue) => {
    const pos1 = stack1.indexOf(cardValue);
    const pos2 = stack2.indexOf(cardValue);
    return { pos1, pos2 };
  };

  const getValidRange = (cardValue) => {
    const { pos1, pos2 } = getCardPositions(cardValue);
    if (pos1 === -1 || pos2 === -1) return null;
    const minPos = Math.min(pos1 + 1, pos2 + 1);
    const maxPos = 52;
    return [minPos, maxPos];
  };

  const getPreferredDealingInstructions = (cardValue, targetPos) => {
    const { pos1, pos2 } = getCardPositions(cardValue);
    if (pos1 === -1 || pos2 === -1) return null;

    const options = [];

    for (let dealFirst = 0; dealFirst <= targetPos; dealFirst++) {
      const dealAfterFlip = targetPos - dealFirst;
      if (dealFirst > 52 || dealAfterFlip > 52) continue;

      const side1_first = stack1[dealFirst - 1];
      const side1_after = stack2[dealAfterFlip - 1];
      if (dealAfterFlip === 0 && side1_first === cardValue) {
        return { start: "Side 1", dealFirst, flip: false, dealAfterFlip: 0 };
      }
      if (side1_after === cardValue) {
        options.push({ start: "Side 1", dealFirst, flip: true, dealAfterFlip });
      }

      const side2_first = stack2[dealFirst - 1];
      const side2_after = stack1[dealAfterFlip - 1];
      if (dealAfterFlip === 0 && side2_first === cardValue) {
        return { start: "Side 2", dealFirst, flip: false, dealAfterFlip: 0 };
      }
      if (side2_after === cardValue) {
        options.push({ start: "Side 2", dealFirst, flip: true, dealAfterFlip });
      }
    }

    if (options.length > 0) {
      const best = options.reduce((a, b) => a.dealFirst + a.dealAfterFlip < b.dealFirst + b.dealAfterFlip ? a : b);
      return best;
    }

    return null;
  };

  const handleCardInput = (e) => {
    let value = e.target.value.toUpperCase().trim();
    const emojiToSuit = { "♠️": "S", "♥️": "H", "♦️": "D", "♣️": "C" };
    Object.entries(emojiToSuit).forEach(([emoji, letter]) => {
      if (value.startsWith(emoji)) {
        value = value.replace(emoji, '') + letter;
      } else if (value.endsWith(emoji)) {
        value = value.replace(emoji, letter);
      }
    });
    setCard(value);
    setInstructions(null);
    setRevealInstructions(false);
    setPosition("");

    const range = getValidRange(value);
    if (range) setRangeHint(range);
    else setRangeHint(null);
  };

  const handlePositionInput = (e) => {
    const value = e.target.value.trim();
    setPosition(value);
    setInstructions(null);
  };

  const handleSubmit = () => {
    if (!card || !position) return;
    const target = parseInt(position);
    if (isNaN(target) || target < 1 || target > 52) {
      alert("Please enter a position between 1 and 52.");
      if (positionInputRef.current) positionInputRef.current.focus();
      return;
    }
    const instr = getPreferredDealingInstructions(card, target);
    if (!instr) {
      alert("Card not found or invalid instructions.");
      return;
    }
    setRangeHint(null);
    setInstructions(instr);
  };

  return (
    <>
      {typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent) && instructions && (
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
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${process.env.PUBLIC_URL}/img/IMG_3130.PNG)`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: -1
      }}></div>
      <div style={{
        position: "relative",
        minHeight: "100vh",
        width: "100vw",
       // padding: '30px 20px 20px 20px',
        padding: '50px 40px 20px 40px',
        boxSizing: "border-box"
      }}>
 
        <div style={{ color: "gray", fontSize: "0.9rem", textAlign: "center", marginBottom: 10 }}>{now}</div>
        <div style={{ textAlign: "left", marginLeft: '10%' }}>
          <input
            ref={cardInputRef}
            value={card}
            onChange={handleCardInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (positionInputRef.current) positionInputRef.current.focus();
              }
            }}
            style={{
              width: "80%",
              padding: 4,
              marginBottom: 4,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "1.5rem"
            }}
          />
          <br />
<input
  id="position-input"
  ref={positionInputRef}
  value={position}
  onChange={handlePositionInput}
  onKeyDown={(e) => {
    if (e.key === 'Enter') handleSubmit();
  }}
  disabled={!card}
  style={{
    width: "80%",
    padding: 4,
    marginBottom: 8,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "1.5rem",
    color: "inherit",
    opacity: 1,
    pointerEvents: card ? "auto" : "none",
    userSelect: card ? "auto" : "none"
  }}
/>
          {rangeHint && !instructions && (
            <div style={{ fontSize: '1rem', color: 'gray' }}>
              {rangeHint[0]}–{rangeHint[1]}
            </div>
          )}
          {instructions && (!/Mobi|Android/i.test(navigator.userAgent) || revealInstructions) && (
            <div style={{ marginTop: 16, fontSize: "1.2rem" }}>
              <strong>{instructions.start === 'Side 1' ? '🔴' : '⚫️'}</strong>
              <span style={{ marginLeft: 8 }}>{instructions.dealFirst} - {instructions.flip ? instructions.dealAfterFlip : 0}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
