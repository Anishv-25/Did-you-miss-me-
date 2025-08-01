import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

const messages = ["Again, I'll ask, did you miss me? 😢"];

function App() {
  const [clickCount] = useState(0);
  const [message, setMessage] = useState("Did you miss me?");
  const [answeredYes, setAnsweredYes] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showLetterDialog, setShowLetterDialog] = useState(false);
  const [isSecondQuestion, setIsSecondQuestion] = useState(false);
  const noButtonRef = useRef(null);

  // Stars positions fixed after first render
  const [starsPositions] = useState(
    () =>
      Array.from({ length: 80 }).map(() => ({
        top: Math.random() * window.innerHeight,
        left: Math.random() * window.innerWidth,
        duration: 2 + Math.random() * 2,
      }))
  );

  useEffect(() => {
    const audio = new Audio("/love.mp3");
    audio.loop = true;
    audio.play().catch(() => {});
  }, []);

  const handleYes = () => {
    setAnsweredYes(true);
    setTimeout(() => setShowLetter(true), 3500);
  };

  const handleNo = () => {
    const btn = noButtonRef.current;
    if (!isSecondQuestion) {
      if (btn) {
        btn.classList.add("fade-text"); // fade only button on click
        setTimeout(() => {
          btn.classList.remove("fade-text");
          setMessage(messages[0]);
          setIsSecondQuestion(true);
        }, 1500);
      } else {
        setMessage(messages[0]);
        setIsSecondQuestion(true);
      }
    } else if (btn) {
      btn.classList.add("fade-text");
      btn.innerText = "Yes";
      btn.disabled = true;
      btn.style.backgroundColor = "#ffffff88";
      setTimeout(() => {
        handleYes();
        btn.classList.remove("fade-text");
      }, 2200);
    }
  };

  const openLetterDialog = () => {
    setShowLetterDialog(true);
  };

  return (
    <div style={styles.container}>
      <style>{`
        * {
          transition: all 0.6s ease-in-out;
        }
        body {
          margin: 0;
          overflow: hidden;
          background: linear-gradient(to top, #000010, #001122);
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px #fff; }
          50% { box-shadow: 0 0 35px #fff; }
        }
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle 2s infinite;
        }
        .moon {
          position: absolute;
          top: 40px;
          right: 40px;
          width: 80px;
          height: 80px;
          background: #fff;
          border-radius: 50%;
          animation: glow 3s infinite ease-in-out;
          box-shadow: 0 0 20px #fff;
        }
        .fade-in {
          opacity: 0;
          animation: fadein 4s ease-in-out forwards;
        }
        .fade-in.delay {
          animation-delay: 2s;
        }
        @keyframes fadein {
          to { opacity: 1; }
        }
        .letter-popup {
          animation: floatIn 3s ease-in-out forwards;
          animation-fill-mode: forwards;
          animation-iteration-count: infinite;
          animation-name: floating;
          animation-duration: 3s;
          animation-timing-function: ease-in-out;
        }
        @keyframes floatIn {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes floating {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        .dialog-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .letter-dialog {
          background: #ffffffdd;
          border: 2px solid #ccc;
          border-radius: 20px;
          padding: 2rem;
          max-width: 90%;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .fade-text {
          animation: fadeText 2.2s ease-in-out forwards;
        }
        @keyframes fadeText {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          30% {
            opacity: 0.3;
            transform: scale(0.9);
          }
          70% {
            opacity: 0.6;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <div className="moon"></div>
      {starsPositions.map((pos, i) => (
        <div
          key={i}
          className="star"
          style={{
            top: pos.top + "px",
            left: pos.left + "px",
            animationDuration: `${pos.duration}s`
          }}
        ></div>
      ))}

      {!answeredYes ? (
        <div style={styles.centeredText}>
          <h1 id="question-text" style={styles.heading}>{message}</h1>
          <div style={styles.buttons}>
            {!isSecondQuestion && (
              <>
                <button style={styles.yesButton} onClick={handleYes}>Yes</button>
                <button
                  ref={noButtonRef}
                  onClick={handleNo}
                  onMouseEnter={undefined}
                  onTouchStart={undefined}
                  style={{
                    ...styles.noButton,
                    position: clickCount > 0 ? "absolute" : "relative"
                  }}
                >
                  No
                </button>
              </>
            )}
            {isSecondQuestion && (
              <button
                ref={noButtonRef}
                onClick={handleNo}
                style={{
                  ...styles.noButton
                }}
              >
                No
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={styles.centeredText}>
          <h1 className="fade-in" style={styles.heading}>
            You said yes?! I was about to write a sad poem and adopt a cat named after you... 😭<br />
            Just know… I missed you more than the sun misses the moon 🌑 Priya 🤍
          </h1>
        </div>
      )}

      {showLetter && !showLetterDialog && (
        <button
          className="letter-popup"
          style={styles.letterButton}
          onClick={openLetterDialog}
        >
          Anish has a letter for you 🤍
        </button>
      )}

      {showLetterDialog && (
        <div className="dialog-background">
          <div className="letter-dialog">
            <h2 style={styles.letterHeading}>Anish has a letter for you 🤍</h2>
            <p style={styles.letter}>
              Hey Priya 🤍,<br /><br />
              There’s something I’ve been meaning to say, and I don’t want to keep it in anymore.<br /><br />
              I miss you. Not in a dramatic way, but in a quiet, deep way. Like how silence feels after your favorite song ends too soon. I don’t know if you think about me these days, but you never really left my mind.<br /><br />
              Please don’t walk away from me, not with distance, not with your thoughts. I don’t need everything to be perfect. I just want you to stay, even if it’s a little messy. Even if the truth is hard sometimes, I’d rather hear that than be left guessing.<br /><br />
              I don’t think you know how much you mean to me. The little things, like how you smile hard to hide your tears, the way your eyes look when you’re thinking hard and how you speak when you’re tired, I notice them all. Maybe more than I should. And I want to know the side of you that you hide. The soft, quiet, real part. You don’t have to be strong all the time. Not with me.<br /><br />
              You don’t need to keep me safe by pushing me away. I’m not afraid of the real you. I don’t want perfect. I want true. I want to stay, even when it’s heavy.<br /><br />
              And if I ever held your hand again, I think I’d understand why everything I went through led me to you.<br /><br />
              Take all the time you need. Just know that someone out here still cares. Deeply.<br /><br />
              With all my heart,<br />
              ~ Anish
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    textAlign: "center",
    flexDirection: "column"
  },
  centeredText: {
    zIndex: 2,
    padding: "0 1rem"
  },
  heading: {
    fontSize: "1.8rem",
    color: "#fff",
    minHeight: "60px",
    maxWidth: "90vw",
    margin: "0 auto"
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1.5rem",
    gap: "1rem",
    flexWrap: "wrap",
    position: "relative"
  },
  yesButton: {
    backgroundColor: "#ffffff44",
    color: "#fff",
    border: "2px solid #fff",
    padding: "0.7rem 1.8rem",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "1.1rem"
  },
  noButton: {
    backgroundColor: "#ffffff44",
    color: "#fff",
    border: "2px solid #fff",
    padding: "0.7rem 1.8rem",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "1.1rem"
  },
  letterButton: {
    marginTop: "2rem",
    backgroundColor: "#ffffff44",
    color: "#fff",
    border: "2px solid #fff",
    padding: "0.7rem 1.8rem",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "1.1rem",
    zIndex: 2,
    animationName: "floating",
    animationDuration: "3s",
    animationIterationCount: "infinite",
    animationTimingFunction: "ease-in-out",
    animationDirection: "alternate",
  },
  paragraph: {
    color: "#eee",
    fontSize: "1rem",
    marginTop: "1rem"
  },
  letterHeading: {
    color: "#222",
    fontSize: "1.2rem",
    marginBottom: "1rem"
  },
  letter: {
    whiteSpace: "pre-wrap",
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "#333"
  }
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
export default App;
