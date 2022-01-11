import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import startgame from "../util/functionality";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BlackjackTable = () => {
  const [deck, setdeck] = useState([]);
  const [change, setchange] = useState(true);
  const [split, setsplit] = useState([]);
  const [playershands, sethands] = useState([]);
  const [house, sethouse] = useState([]);
  const [option, setoption] = useState({
    stand: false,
    hit: false,
    newgame: false,
    comp: true,
    play: true,
  });
  const tempdatabase = []
  useEffect(() => {
    Start();
    //setoption( option => option.newgame = true)
  }, []);

  console.log("deck", deck);

  function Start() {
    const game = startgame();
    sethands((playershands) => [...playershands, game.playerhand]);
    sethouse((house) => [...house, game.house].flat());
    setdeck((deck) => [...deck, game.deck].flat());
    bjstart(Calculatehand(game.house), Calculatehand(game.playerhand));
  }

  
  function bjstart(dealer, myhand) {
    console.log(dealer, myhand);
    if (dealer === 21 && dealer === myhand) {
      toast(" Both 21 Push ");
    } else {
      if (dealer === 21) {
        toast(`House Blackjack you:${myhand}, dealer:${dealer}`);
        setTimeout(() => reset(), 500);
      }
      if (myhand === 21) {
        toast(`House Blackjack you:${myhand}, dealer:${dealer}`);
        setTimeout(() => reset(), 500);
      }
    }
  }

  function reset() {
    sethouse((house) => []);
    sethands((playershands) => []);
    if (deck.length <= 14 && deck !== []) {
      setdeck((deck) => []);
      Start();
    } else {
      const temphouse = [];
      const temphand = [];
      for (let hands = 0; hands <= 1; hands++) {
        temphouse.push(deck.pop());
        temphand.push(deck.pop());
      }
      sethands((playershands) => [...playershands, temphand]);
      sethouse((house) => [...house, temphouse].flat());

      bjstart(Calculatehand(temphouse), Calculatehand(temphand));
    }
  }

  function compare() {
    if(Calculatehand(house) === Calculatehand(playershands[0])){
        return '='
    }else{
      return Calculatehand(house) > Calculatehand(playershands[0]);
    }
    
  }
  
  function Hit() {
    //automate the hands go from one to the next
    playershands[0].push(deck.pop());
    sethands((playershands) => [...playershands]);
    //ace function will become its own function
    if (
      playershands[0].find(
        (card) =>
          card["Ace♥"] || card["Ace♦"] || card["Ace♠"] || card["Ace♣"]
      ) && Calculatehand(playershands[0]) > 21
    ) {
      for( let i=0 ; i <= playershands[0].length-1 ; i++ ){
        //and value = 11
        if(Object.keys(playershands[0][i])[0].substr(0,3)==="Ace" && Object.values(playershands[0][i])[0]===11){
          let name = Object.keys(playershands[0][i])[0]
          playershands[0][i][name] = 1
          break
        }
      }
      sethands((playershands) => [...playershands])
    }
    console.log(Calculatehand(playershands[0]));
    setTimeout(() => {
      if (Calculatehand(playershands[0]) > 21) {
        bust("you", Calculatehand(playershands[0]));
        setTimeout(() => reset(), 500);
      }
    }, 1000);
  }

  function Stand() {
    while (Calculatehand(house) < 17) {
      house.push(deck.pop());

      //sethouse((house) => [...house].flat());
      if (Calculatehand(house) >= 17) {
        break;
      }
    }
    sethouse((house) => [...house].flat());
    setTimeout(() => {
      if (Calculatehand(house) > 21) {
        bust("house", Calculatehand(house));
        reset();
      } else {
        let ans = compare();
        if (ans === '=') {
          toast(`push ${Calculatehand(playershands[0])} vs Dealer: ${Calculatehand(house)}`);
          setTimeout(() => reset(), 500);
        } else if (!ans){
          toast(`you Won ${Calculatehand(playershands[0])} vs Dealer: ${Calculatehand(house)} `);
          setTimeout(() => reset(), 500);
        } else {
          toast(`you lose ${Calculatehand(playershands[0])} vs Dealer: ${Calculatehand(house)} `);
          setTimeout(() => reset(), 500);
          
        }
      }
    }, 1000);
  }
  function Hand_history(){
    // line 119,125,131 and in the Hit function
    
  }
  function Split() {
    setsplit((split) => [...split, playershands.pop()]);
    //Hit()
    console.log(split);
  }
  function DoubleDown(){
    Hit()
    Stand()
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
  console.log(playershands);
  return (
    <div className="BigContainer">

      <ToastContainer />

      <div className="tablecontainer">

        <div className="dealer">
        <div className="handtot">{Calculatehand(house)}</div>
          {house.map((cards) => (
            <div key={Object.keys(cards).pop()}>
              <img id="cards" src={`/cards/${Object.keys(cards).pop()}.png`} />
            </div>
          ))}
        </div>
        <div className="Deck"></div>
        <div className="Playerhands">
          {playershands.map((hands) => (
            <div key={1} className="targethand">
              {hands.map((cards) => (
                <div key={Object.keys(cards).pop()}>
                  <img
                    id="cards"
                    src={`/cards/${Object.keys(cards).pop()}.png`}
                  />
                </div>
              ))}
              <div className="handtot">{Calculatehand(hands)}</div>
            </div>
          ))}
        </div>
      </div>

      {Calculatehand(house) === 21 || Calculatehand(playershands) >= 21 ? (
        <div className="ButtonContainer" />
      ) : (
        <div className="ButtonContainer">
          <button onClick={() => Stand()}>STAND</button>
          <button onClick={() => Hit()}>HIT</button>
          <button onClick={() => Split()}>SPLIT</button>
          <button onClick={() => DoubleDown()}>DOUBLE</button>
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
