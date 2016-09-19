'use strict';

const HTMLToMarkdownConverter = require('html-to-markdown');

module.exports = (Config) => {

  const ProdPad = require('../api/ProdPad')(Config);
  const Trello  = require('../api/Trello')(Config);
  
  /*
   * Sync Lists.
   */
  const instance = {
    sync: (lists,cards,ideas) => {

      const promises = ideas
        .map( idea => {
          /*
           * Check if there is already a card attached to the idea.
           */
          idea.card = cards.find( card => card.desc.trim().endsWith(idea.web_url));
          /*
           * Attach the corresponding list to the idea.
           */
          idea.list = lists.find( list => list.name === idea.status.status);

          return idea;
        })
        .map( idea => {
          /*
           * Create cards where they are missing.
           */
          if(!idea.card && idea.list) {
            const card = {
              name: idea.title,
              desc: 
`Impact: ${idea.impact}
Effort: ${idea.effort}
Description: 
${HTMLToMarkdownConverter.convert(idea.description).replace(/<[^>]*>/,'')}

---- Do Not Modify Anything Below This Line --
${idea.web_url}
`,
              idList: idea.list.id 
            }

            return Trello.Cards.create(card);
          }
          return idea;
      })
      .map( idea => {
        /*
         * Check for updates. If the idea attribute does not have an id then
         *  it is a promise and should be ignored. If there is no card or list
         *  attached to the idea, then there is nothing to be done at this
         *  stage.
         */
        if(idea.id && idea.card && idea.list) {
          const card            = idea.card;
          const cardDescription = card.desc.substring(card.desc.indexOf('Description:')+13,card.desc.lastIndexOf('---- Do Not')).trim();
          const ideaDescription = HTMLToMarkdownConverter.convert(idea.description).replace(/<[^>]*>/,'').trim();

          if(card.name !== idea.title || cardDescription !== ideaDescription || card.idList !== idea.list.id){
            return Trello.Cards.update({
              id: card.id,
              idList :idea.list.id,
              name: idea.title,
              desc:
`Impact: ${idea.impact}
Effort: ${idea.effort}
Description: 
${HTMLToMarkdownConverter.convert(idea.description).replace(/<[^>]*>/,'')}

---- Do Not Modify Anything Below This Line --
${idea.web_url}
`
            })
            .then(results => console.log("--- results",results));
          }
        }
      })
      .filter( maybeIdea => maybeIdea && !maybeIdea.id )
    }
  };
  
  return instance;
};