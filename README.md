# Simplified Distributed Exchange

## Getting started

### Clone the repository
```
git clone ...
```

### Install dependencies
```
npm install
```

### Run grape
```
 DEBUG=grenache:grape npx grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'

 DEBUG=grenache:grape npx grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
```

### Run the server
```
npm run server
```

### Run the clients (as much as you want)
```
npm run client BUY|SELL
```
The argument BUY or SELL will be used to create a first order at the start of the client with the provided action.

## Usage

You can run 2 clients one in BUY and the other one in SELL

```
npm run client BUY
npm run client SELL
```

This will allow you to see 2 orders being opened and closed by the matching engine.
As the 2 orders have the same price

If you want to see more orders distributed between each clients, you can uncomment the code at:
```
src/client/client.js -- line 55 -> 72
```
It generates ramdom order each 10 seconds from each client.

## Notes
### Implementation remarks

- It is really a simple interpretation of an exchange with the knowledge I have. I didn't add the possibilty to trade with multiple symbols.
- The quantity should be used to match the orders, but I didn't have enough time to implement it fully.
- It took a bit of time to get familiar with grape libs, still not sure if my implementation is the correct one.

### Improvements
- Here a client is identified by a uuid, it should be more secure.
- Should add a wallet management by applying the quantities
- The updates should be streamed and not polled, I saw the libs could do streaming but I didn't have time to dig deeper.