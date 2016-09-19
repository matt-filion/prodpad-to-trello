'use strict';

/*
 * Sync's Prodpad ideas to a Trello board (but not back). This
 *  creates a status bord in Trello for a much simpler representation
 *  of your Prodpad initiatives.
 */
const Config = {
  ProdPad: {
    API_KEY : '',
    Filter: {
      /*
       * The name of any status (case sensitive) listed here will
       *  be excluded from becoming a Trello list. All items 
       *  within ProdPad that are within this list will not 
       *  show up in Trello at all.
       */
      Status: ['On Hold','Not Doing'] 
    },
  },
  Trello: {
    KEY:          '',
    TOKEN:        '',
    BOARD:        '',
    BOARD_FIELDS: 'name,idBoard',
    LIST_FIELDS:  'name,pos,idBoard',
    CARD_FIELDS:  'name,description,idList,idBoard'
  }
};

const StatusWithLists = require('./sync/StatusWithLists')(Config);
const IdeasToCards    = require('./sync/IdeasToCards')(Config);
const ProdPad         = require('./api/ProdPad')(Config);
const Trello          = require('./api/Trello')(Config);

module.exports.ideaToCards = (event, context, callback) => {
  
  /*
   * The Statuses and Lists will be synchronized
   */
  StatusWithLists.sync()
    /*
     * After the ProdPad statuses and Trello Lists have been synchronized 
     *  get the current version of lists.
     * Get the ideas and products from ProdPad
     */
    .then( () => Promise.all([ ProdPad.Ideas.get(), Trello.Lists.get() ]) )
    /*
     * Transform the responses from the live services.
     */
    .then( tuple => {
      /*
       * Concat all of the cards into a single array.
       */
      const cards = tuple[1].reduce( (accumulator, list) => accumulator.concat(list.cards) , []);
        
      return {
        lists : tuple[1].map( list => {
          /*
           * No longer need the reference of cards on each list.
           */
          delete list.cards;
          return list; 
        }),
        cards: cards,
        /*
         * Doc's are a touch confusing as to what can be returned, but filter out all non active
         *  ideas if any are returned.
         */
        ideas : tuple[0].ideas.filter( idea => idea.state && idea.state==='active')
      };
    })
    /*
     * Action each idea appropriately depending on the associated
     *  card state.
     */
    .then( tuple => IdeasToCards.sync(tuple.lists,tuple.cards,tuple.ideas) )
    .then( results => console.log("results",results))
    .then( () => callback(null,{ok:true}) )
    .catch( error => callback(error) );
};


module.exports.ideaToCards({},{},(err,msg) => err ? console.error(err,msg) : console.log(msg))