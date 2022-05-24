## How To Run Functional Tests

Prepare: 
1. `sudo npm install -g mocha`
2. `npm install zombie`

(maybe we need old zombie: `npm install zombie@5.0.8 `)

Run Test:

    for i in test/*; do mocha -t 10000 $i; done

Sorry, that won't work: `mocha --recursive`

The _config test_ must be done separately:

    cd config-test
    mocha -t 10000 config.js 

## Write Tests

Docu: http://zombie.js.org/
