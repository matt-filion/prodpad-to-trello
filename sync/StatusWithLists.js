'use strict';

module.exports = (Config) => {

  const ProdPad = require('../api/ProdPad')(Config);
  const Trello  = require('../api/Trello')(Config);
  
  /*
   * Sync Lists.
   */
  const instance = {
      sync: ()=> 
        Promise.all([ProdPad.Statuses.get(), Trello.Boards.get(), Trello.Lists.get()])
          /*
           * For each status that does not have a list, create it.
           */
          .then( tuple => {

            /*
             * "New Idea" is a default status that does not return.
             */
            tuple[0].unshift({ id: null, status: 'New Idea' });
            
            const statuses = tuple[0].filter( status => Config.ProdPad.Filter.Status.indexOf(status.status)===-1  );
            const board    = tuple[1];
            const lists    = tuple[2];
            const promises = statuses.map( (status,index) => {
              const list = lists.find( list => list.name === status.status);
              if(!list) {
                /*
                 * Each status should have a corresponding list so that
                 *  ideas status can be represented within Trello.
                 */
                return Trello.Lists.create({
                  name: status.status,
                  pos: index+1,
                  idBoard: board.id
                });
              } else {
                /*
                 * Reposition the lists to match the status order
                 *  within ProdPad.
                 */
                if(list.pos !== index+1){
                  list.pos = index+1;
                  return Trello.Lists.update(list);
                }
              }
            });
      
            lists.forEach( list => {
              /*
               * Remove any list that does not correspond to a status.
               */
              if(!statuses.find( status => list.name === status.status)){
                list.closed = true;
                promises.push(Trello.Lists.update(list));
              }
            });

            return Promise.all(promises.filter( promise => promise));
          })
  };
  
  return instance;
};