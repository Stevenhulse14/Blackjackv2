export class Blackjack{
    constructor(){
        this.deck = []
        this.playerhand = []
        this.house = []
        this.currenthand = 0
        this.stop = false
    }
    create(){
        this.deck = createDeck()
    }
    bust(hand){
        if(hand>21){
            return 'True'
        }
        else return false

    }
    calchand(hand){
        return hand.map((num)=>Object.values(num)[0]).reduce((acc,val) => acc+val,0)
    }
    dealer(){
        
        this.house.push(this.deck.pop)
    }
    blackJack(hand){
        if(hand===21){
            return true
        }
        else return false
    }
    hit(){
        this.playerhand.push(this.deck.pop())
    }

}

export default function startgame(){
    let game = new Blackjack()
    game.create()
  
    for(let hands = 0 ; hands<=1; hands++ ){
            game.playerhand.push(game.deck.pop())
            game.house.push(game.deck.pop())
    }
        game.currenthand = game.calchand(game.house)
        return game
}
const func =(hand)=> hand <= 21


export function createDeck(){
    let suits = ['♥','♠', '♣','♦']
    let values = ['Ace','King','Queen','Jack', 10,
                  9,8,7,6,5,4,3,2]
    let deck = []             
    for(let i = 0 ; i<=suits.length-1 ; i++){
        for(let j = 0; j<=values.length-1 ; j++){
            let key = `${values[j]+suits[i]}`
            switch(values[j]){
                case 'Ace':
                    //current hand needs too be added
                    deck.push({[key]: 11})
                    break;
                case 'King':    
                    deck.push({[key]: 10})
                    break;
                case 'Jack':
                    deck.push({[key]: 10})
                    break;
                case 'Queen':
                    deck.push({[key]: 10})
                    break;
                default:
                    deck.push({[key]: values[j]})    
                    break;
            }
        }
    }  
             
    return shuffle(deck)
}
function shuffle(deck){
    for (let i = deck.length-1; i > 0;i--){
        const j = Math.floor(Math.random()* (i+1))
        const temp = deck[j]
        deck[j]= deck[i]
        deck[i]=temp
    }
    return deck
}