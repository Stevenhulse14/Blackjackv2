import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import startgame, { Blackjack } from "../util/functionality";

const BlackjackTable = () => {
  const [deck, setdeck] = useState([]);
  const [change, setchange]= useState(true);
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
    
    //return ()=>{ clearTimeout(timer)}
  }

  function Stand() { 
    while (Calculatehand(house) < 17) {
      house.push(deck.pop());
      
      sethouse((house) => [...house].flat());
      if(Calculatehand(house) >=17){
          break
      }
    }
    sethouse((house) => [...house].flat());
    if (Calculatehand(house) > 21) {
        bust("house")
        reset()
    } else {
        let ans = compare()
        if(ans){
            alert(`you lose ${Calculatehand(house)} `)
            reset()
        }
        else if (!ans){
            alert(`you Won ${Calculatehand(house)} `)
            reset()
        }else{
            alert("push")
            reset()
        }
    }
    
  }

  function bjstart(dealer, myhand){
      console.log(dealer,myhand)
      if(dealer===21){
          alert("House Blackjack")
          reset()
          
          
      }
      if(myhand===21){
          alert("Congratz Blackjack")
          reset()
      }
  }

  function reset(){
      house.length = 0
      playershands.length = 0
      sethouse(house => [...house])
      sethands(playershands=> [...playershands])
      if(deck.length<=14){
          Start()
      }else{
        const temphouse = []
        const temphand = []
        for(let hands = 0 ; hands<=1; hands++ ){

            temphouse.push(deck.pop())
            temphand.push(deck.pop())
        }
        sethands((playershands) => [...playershands,temphand].flat());
        sethouse((house) => [...house,temphouse].flat());
        
        
        setTimeout(()=>{
            bjstart(Calculatehand(temphouse),Calculatehand(temphand))
        },2000)
      }
      
  }

  function compare() {
    return Calculatehand(house) > Calculatehand(playershands)
     
  }

  function Hit() {
    playershands.push(deck.pop());
    sethands((playershands) => [...playershands].flat());
    console.log(Calculatehand(playershands));
    if(Calculatehand(playershands) > 21){
        bust("you")
        reset()
    }
  }

  function Calculatehand(hand) {
    return hand
      .map((num) => Object.values(num)[0])
      .reduce((acc, val) => acc + val,0);
  }

  function bust(x) {
      alert(`${x} Bust`)
  }
//../../public/cards
  return (
    <div className="BigContainer">
      <div className="tablecontainer">
        <div className="dealer">
          {house.map((cards) => (
            <div key={Object.keys(cards).pop()}>
                <img id="cards" src={`/cards/${Object.keys(cards).pop()}.png`}/>
            </div>
          ))}
        </div>
        <div className="Deck"></div>
        <div className="Playerhand">
          {playershands.map((cards) => (
            <div key={Object.keys(cards).pop()}>
                <img id="cards" src={`/cards/${Object.keys(cards).pop()}.png`}/>
            </div>
          ))}
        </div>
      </div>
      <div className="ButtonContainer">
        <button onClick={() => Stand()}>STAND</button>
        <button onClick={() => Hit()}>HIT</button>
        <button>SPLIT</button>
        <button>DOUBLE</button>
      </div>
      <div className="Score">
        <div>
            House: {house.map((card) => Object.values(card)[0]).reduce((a,b)=> a+b,0)}
        </div>
        <div>
            You : {playershands.map((card) => Object.values(card)[0]).reduce((a,b)=> a+b,0)}
        </div>
        <div>
            {option.comp && option.play ? 
            <div>
              {
                Calculatehand(house) > Calculatehand(playershands) && Calculatehand(house) <= 21?
                <div>Loser</div>:
                Calculatehand(playershands) > Calculatehand(house) && Calculatehand(playershands)<=21?
                <div>Winner</div>:
                <div>Tie</div>
              }
            </div>:
             null }
        </div>
       
      </div>
    </div>
  );
};

export default connect()(BlackjackTable);
// {Calculatehand(house) === 21 ? alert("dealerwon"): null}
// {Calculatehand(playershands)===21? alert("youwon"):null}