One way sync from ProdPad ideas to a single Trello Board. Will create a List from each Status defined in ProdPad (configuration allows for exclusions). Each execution will remove additional lists within Trello, but extra cards that are created will remain untouched.

# Start
Within handler.js at the top is a Config declaration. You will need to set your ProdPad API KEY along with your Trello token, key and board ID.

## Manually deploy
Zip up the entire contents, and deploy to AWS Lambda as a Node 4.3 module. Set the execution handler as 'handler.ideaToCards'. Memory size of about 1024 is appropriate.

## If using Serverless.com
If deployed to AWS serverless can drastically simplify the deployment and development.
1. ``` npm install -g serverless@1.0.0-rc.1 ```
2. Update serverless.yml to point at the correct region.
3. ``` sls deploy ```
