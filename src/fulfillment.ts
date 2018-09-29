const {WebhookClient} = require('dialogflow-fulfillment');
import SocketServer from './socketServer';
import {DB} from './db'

process.env.DEBUG = 'dialogflow:debug';

let data = {};
let socket: SocketServer = new SocketServer(9001, '/order');

const db: DB = new DB();

db.init().then(() => {
  db.writeItem("123");
}).catch((e)=>{
  console.log(e);
});

function orderToString (order) {
  let resp = '';
  console.log(order);
  for (let i = 0; i < order.length; i++) {
    let toppings = '';
    for (let j = 0; j < order[i].toppings.length; j++) {
      toppings += `${order[i].toppings[j]} `
    }
    resp += `${order[i].amount} ${order[i].size} with ${toppings}, `
  }
  return resp;
}

export function handleRequest(request, response) {
  const client = new WebhookClient({
    request,
    response
  });
  let session_id = request.body.session;
  if (!(session_id in data)) {
    data[session_id] = {};
    data[session_id].order = [];
    console.log('NEW SESSION: ' + session_id);
  }

  function order_add(agent) {
    let params = request.body.queryResult.outputContexts[0].parameters;
    let item = {
      amount: params.amount,
      size: params.size,
      toppings: params.topping
    }
    data[session_id].order.push(item);
    agent.add('Okay, I added it to your order. Anything else?');
  }

  function order_finalize(agent) {
    let order = data[session_id].order;
    let resp = orderToString(order);
    const message = `You ordered ${resp}. Do you want to finalize your order?`;
    agent.add(message);
  }

  function order_check(agent) {
    let order = data[session_id].order;
    let resp = orderToString(order);
    const message = `Your order is currently ${resp}.`;
    agent.add(message);
  }

  function make_order(agent) {
    let order = data[session_id].order;
    let payload = {
      items: order,
      total: 25.00,
      contact: '<phone number>'
    };
    socket.broadcast(payload);
    agent.add('Thank you! Your order will be ready in 15 minutes. Goodbye.');
  }
  let intentMap = new Map();
  intentMap.set('order.add - yes', order_add);
  intentMap.set('finalize.all', make_order);
  intentMap.set('order.display', order_check);
  intentMap.set('order.finish', order_finalize);

  client.handleRequest(intentMap);
};