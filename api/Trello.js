'use strict';

const HTTP        = require('./HTTP');
const querystring = require('querystring');

/*
 * Facade to Trello API.
 */
module.exports = Config => { 
  return {
    Boards: {
      get: () => 
        HTTP.getResponse({
          host: 'api.trello.com',
          path: `/1/boards/${Config.Trello.BOARD}?key=${Config.Trello.KEY}&token=${Config.Trello.TOKEN}&fields=${Config.Trello.BOARD_FIELDS}`,
          method: 'GET'
        })
        .then(body => JSON.parse(body)),
    },
    Lists: {
      get: () => 
        HTTP.getResponse({
          host: 'api.trello.com',
          path: `/1/boards/${Config.Trello.BOARD}/lists?cards=open&$card_fields={Config.Trello.CARD_FIELDS}&fields=${Config.Trello.LIST_FIELDS}&key=${Config.Trello.KEY}&token=${Config.Trello.TOKEN}`,
          method: 'GET'
        })
        .then(body => JSON.parse(body)),
      create: list => 
        HTTP.getResponse({
          host: 'api.trello.com',
          path: `/1/lists?key=${Config.Trello.KEY}&token=${Config.Trello.TOKEN}&${querystring.stringify(list)}`,
          method: 'POST'
        })
        .then(body => body),
      update: list =>
        HTTP.getResponse({
          host: 'api.trello.com',
          path: `/1/lists/${list.id}?key=${Config.Trello.KEY}&token=${Config.Trello.TOKEN}&${querystring.stringify(list)}`,
          method: 'PUT'
        })
        .then(body => body),
    },
    Cards: {
      create: card => 
        HTTP.getResponse({
          host: 'api.trello.com',
          path: `/1/cards?key=${Config.Trello.KEY}&token=${Config.Trello.TOKEN}&${querystring.stringify(card)}`,
          method: 'POST'
        }),
      update: card => 
        HTTP.getResponse({
          host: 'api.trello.com',
          path: `/1/cards/${card.id}?key=${Config.Trello.KEY}&token=${Config.Trello.TOKEN}&${querystring.stringify(card)}`,
          method: 'PUT'
        }),
      move: (card,listId) =>
        HTTP.getResponse({
          host: 'api.trello.com',
          path: `/1/cards/${card.id}/idList?key=${Config.Trello.KEY}&token=${Config.Trello.TOKEN}&value=${listId}`,
          method: 'PUT'
        }),
    }
  }; 
};