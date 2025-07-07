import { useState, useEffect, useRef } from "react";

const stack1 = [
  "JS", "3S", "7D", "JC", "5S", "QC", "5H", "10H", "10D", "3D",
  "5C", "KH", "KS", "10C", "6C", "AS", "9S", "JD", "AH", "9H",
  "7S", "2S", "2H", "6D", "KD", "4H", "10S", "6S", "8H", "8D",
  "9C", "7C", "QD", "AC", "8C", "AD", "9D", "2D", "4S", "4C",
  "JH", "4D", "2C", "QH", "QS", "7H", "3C", "3H", "5D", "KC",
  "8S", "6H"
];

const stack2 = [...stack1].reverse();

export default function ACAANApp() {
  const [displayCard, setDisplayCard] = useState("");
  const [card, setCard] = useState("");
  const [position, setPosition] = useState("");
  const [instructions, setInstructions] = useState(null);
  const [rangeHint, setRangeHint] = useState(null);
  const [revealInstructions, setRevealInstructions] = useState(false);
  const cardInputRef = useRef(null);
  const positionInputRef = useRef(null);

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
  const validPositions = [];

  for (let pos = 1; pos <= 42; pos++) {
    const instr = getPreferredDealingInstructions(cardValue, pos);
    if (instr) {
      validPositions.push(pos);
    }
  }

  if (validPositions.length === 0) return null;

  return [Math.min(...validPositions), Math.max(...validPositions)];
};



 const getPreferredDealingInstructions = (cardValue, targetPos) => {
  const { pos1, pos2 } = getCardPositions(cardValue);
  if (pos1 === -1 || pos2 === -1) return null;
  if (targetPos < 1 || targetPos > 42) return null; // uusi jakojen max-raja

  const options = [];

  for (let dealFirst = 0; dealFirst <= targetPos; dealFirst++) {
    const dealAfterFlip = targetPos - dealFirst;
    if (dealFirst > 52 || dealAfterFlip > 52) continue;

    // stack1 → [flip] → stack2 (stack2: max 39)
    if (dealFirst > 0 && stack1[dealFirst - 1] === cardValue && dealAfterFlip === 0) {
      return { start: "Side 1", dealFirst, flip: false, dealAfterFlip: 0 };
    }
    if (
      dealAfterFlip > 0 &&
      dealAfterFlip <= 39 &&
      stack2[dealAfterFlip - 1] === cardValue
    ) {
      options.push({ start: "Side 1", dealFirst, flip: true, dealAfterFlip });
    }

    // stack2 → [flip] → stack1 (stack2: max 39 ennen flippiä)
    if (
      dealFirst > 0 &&
      dealFirst <= 39 &&
      stack2[dealFirst - 1] === cardValue &&
      dealAfterFlip === 0
    ) {
      return { start: "Side 2", dealFirst, flip: false, dealAfterFlip: 0 };
    }
    if (
      dealFirst > 0 &&
      dealFirst <= 39 &&
      dealAfterFlip > 0 &&
      dealAfterFlip <= 52 &&
      stack1[dealAfterFlip - 1] === cardValue
    ) {
      options.push({ start: "Side 2", dealFirst, flip: true, dealAfterFlip });
    }
  }

  if (options.length > 0) {
    const best = options.reduce((a, b) =>
      a.dealFirst + a.dealAfterFlip < b.dealFirst + b.dealAfterFlip ? a : b
    );
    return best;
  }

  return null;
};


  const handleCardInput = (e) => {
    const input = e.target.value;
    setDisplayCard(input);

    let value = input.toUpperCase().trim();
    const emojiToSuit = { "♠️": "S", "♥️": "H", "♦️": "D", "♣️": "C" };
    Object.entries(emojiToSuit).forEach(([emoji, letter]) => {
      if (value.includes(emoji)) {
        value = value.replace(emoji, letter);
      }
    });

    setCard(value);
    setInstructions(null);
    setRevealInstructions(false);
    setPosition("");

    const range = getValidRange(value);
    setRangeHint(range || null);
  };

  const handlePositionInput = (e) => {
    const value = e.target.value.trim();
    setPosition(value);
    setInstructions(null);

    const range = getValidRange(card);
    setRangeHint(range || null);
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
        padding: '50px 40px 20px 40px',
        boxSizing: "border-box"
      }}>
        <div style={{ fontSize: '0.9rem', color: 'gray', textAlign: 'center' }}>
          {new Date().toLocaleString(undefined, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
        <div style={{ textAlign: "left", marginLeft: '10%' }}>
          <input
            ref={cardInputRef}
            value={displayCard}
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
			  onBlur={() => {
				if (card && position) handleSubmit();
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
