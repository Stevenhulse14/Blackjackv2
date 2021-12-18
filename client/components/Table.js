import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import startgame, { Blackjack } from "../util/functionality";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BlackjackTable = () => {
  const [deck, setdeck] = useState([]);
  const [change, setchange] = useState(true);
  const [playershands, sethands] = useState([]);
  const [house, sethouse] = useState([]);
  const [option, setoption] = useState({
    stand: false,
    hit: false,
    newgame: false,
    comp: true,
    play: true,
  });

  useEffect(() => {
    Start();
    //setoption( option => option.newgame = true)
  }, []);

  console.log("deck", deck);

  function Start() {
    const game = startgame();
    sethands((playershands) => [...playershands, game.playerhand].flat());
    sethouse((house) => [...house, game.house].flat());
    setdeck((deck) => [...deck, game.deck].flat());
    bjstart(Calculatehand(game.house), Calculatehand(game.playerhand));
  }

  function Stand() {
    while (Calculatehand(house) < 17) {
      house.push(deck.pop());

      sethouse((house) => [...house].flat());
      if (Calculatehand(house) >= 17) {
        break;
      }
    }
    sethouse((house) => [...house].flat());
    setTimeout(() => {
      if (Calculatehand(house) > 21) {
        bust("house");
        reset();
      } else {
        let ans = compare();
        if (ans) {
          toast(`you lose ${Calculatehand(house)} `);
          setTimeout(()=>reset(),500)
        } else if (!ans) {
          toast(`you Won ${Calculatehand(house)} `);
          setTimeout(()=>reset(),500)
        } else {
          toast("push");
          setTimeout(()=>reset(),500)
        }
      }
    }, 1000);
  }

  function bjstart(dealer, myhand) {
    console.log(dealer, myhand);
    if (dealer === 21 && dealer === myhand) {
      toast(" Both 21 Push ");
    } else {
      if (dealer === 21) {
        toast(`House Blackjack you:${myhand}, dealer:${dealer}`);
        setTimeout(()=>reset(),500)
      }
      if (myhand === 21) {
        toast(`House Blackjack you:${myhand}, dealer:${dealer}`);
        setTimeout(()=>reset(),500)
      }
    }
  }

  function reset() {
    sethouse((house) => []);
    sethands((playershands) => []);
    if (deck.length <= 14 && deck !== []) {
      setdeck(deck=> [])
      Start();
    } else {
      const temphouse = [];
      const temphand = [];
      for (let hands = 0; hands <= 1; hands++) {
        temphouse.push(deck.pop());
        temphand.push(deck.pop());
      }
      sethands((playershands) => [...playershands, temphand].flat());
      sethouse((house) => [...house, temphouse].flat());

      bjstart(Calculatehand(temphouse), Calculatehand(temphand));
    }
  }

  function compare() {
    return Calculatehand(house) > Calculatehand(playershands);
  }

  function Hit() {
    playershands.push(deck.pop());
    sethands((playershands) => [...playershands].flat());
    console.log(Calculatehand(playershands));
    setTimeout(() => {
      if (Calculatehand(playershands) > 21) {
        bust("you", Calculatehand(playershands));
        setTimeout(()=>reset(),500)
      }
    }, 1000);
  }

  function Calculatehand(hand) {
    return hand
      .map((num) => Object.values(num)[0])
      .reduce((acc, val) => acc + val, 0);
  }

  function bust(x, hand) {
    toast(`${x} Bust handtotal:${hand}`);
  }
  //../../public/cards
  return (
    <div className="BigContainer">
      <ToastContainer />
      <div className="tablecontainer">
        <div className="dealer">
          {house.map((cards) => (
            <div key={Object.keys(cards).pop()}>
              <img id="cards" src={`/cards/${Object.keys(cards).pop()}.png`} />
            </div>
          ))}
        </div>
        <div className="Deck"></div>
        <div className="Playerhand">
          {playershands.map((cards) => (
            <div key={Object.keys(cards).pop()}>
              <img id="cards" src={`/cards/${Object.keys(cards).pop()}.png`} />
            </div>
          ))}
        </div>
      </div>

      {Calculatehand(house) === 21 ||
      Calculatehand(playershands) === 21 ? <div className="ButtonContainer"/>: (
        <div className="ButtonContainer">
          <button onClick={() => Stand()}>STAND</button>
          <button onClick={() => Hit()}>HIT</button>
          <button>SPLIT</button>
          <button>DOUBLE</button>
        </div>
      )}

      <div className="Score">
        <div>House: {Calculatehand(house)}</div>
        <div>You : {Calculatehand(playershands)}</div>
        <div>
          {option.comp && option.play ? (
            <div>
              {Calculatehand(house) > Calculatehand(playershands) &&
              Calculatehand(house) <= 21 ? (
                <div>Loser</div>
              ) : Calculatehand(playershands) > Calculatehand(house) &&
                Calculatehand(playershands) <= 21 ? (
                <div>Winner</div>
              ) : (
                <div>Tie</div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default connect()(BlackjackTable);
// {Calculatehand(house) === 21 ? alert("dealerwon"): null}
// {Calculatehand(playershands)===21? alert("youwon"):null}
