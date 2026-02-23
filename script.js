const items  = ["Chair", "Recliner", "Table", "Umbrella"];
const prices = [25.50,   37.75,      49.95,   24.89];

const stateAbbreviations = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
  "DC"
];

const stateZones = {
  "CT":1,"MA":1,"ME":1,"NH":1,"NJ":1,"NY":1,"PA":1,"RI":1,"VT":1,
  "DE":2,"DC":2,"IL":2,"IN":2,"KY":2,"MD":2,"MI":2,"NC":2,"OH":2,
  "SC":2,"TN":2,"VA":2,"WV":2,"WI":2,
  "AL":3,"AR":3,"FL":3,"GA":3,"IA":3,"KS":3,"LA":3,"MN":3,"MS":3,
  "MO":3,"NE":3,"ND":3,"OK":3,"SD":3,"TX":3,
  "AZ":4,"CO":4,"ID":4,"MT":4,"NM":4,"UT":4,"WY":4,
  "CA":5,"NV":5,"OR":5,"WA":5,
  "AK":6,"HI":6
};

const TAX_RATE = 0.15;

let purchasedItems      = [];
let purchasedQuantities = [];

function startPurchase() {
  purchasedItems      = [];
  purchasedQuantities = [];
  shopping();
}

function shopping() {
  let itemInput = prompt("What item would you like to buy today: Chair, Recliner, Table or Umbrella?");

  if (itemInput === null) {
    alert("Transaction cancelled. We hope to see you again soon!");
    return;
  }

  itemInput = itemInput.trim();

  let itemInputNorm = itemInput.charAt(0).toUpperCase() + itemInput.slice(1).toLowerCase();
  let itemIndex = items.indexOf(itemInputNorm);

  if (itemIndex === -1) {
    alert("\"" + itemInput + "\" is not a valid item. Please choose: Chair, Recliner, Table, or Umbrella.");
    shopping();
    return;
  }

  let selectedItem = items[itemIndex];

  let qtyInput = prompt("How many " + selectedItem + " would you like to buy?");

  if (qtyInput === null) {
    alert("Transaction cancelled. We hope to see you again soon!");
    return;
  }

  let qty = parseInt(qtyInput);

  if (isNaN(qty) || qty <= 0) {
    alert("Please enter a valid quantity (a positive whole number).");
    shopping();
    return;
  }

  let existingIndex = purchasedItems.indexOf(selectedItem);
  if (existingIndex !== -1) {
    purchasedQuantities[existingIndex] += qty;
  } else {
    purchasedItems.push(selectedItem);
    purchasedQuantities.push(qty);
  }

  askContinue();
}

function askContinue() {
  let continueInput = prompt("Continue shopping? y/n");

  if (continueInput === null) {
    if (purchasedItems.length === 0) {
      alert("No items in your cart. Thank you for visiting!");
      return;
    }
    askForState();
    return;
  }

  let answer = continueInput.trim().toLowerCase();

  if (answer === "y") {
    shopping();
  } else if (answer === "n") {
    if (purchasedItems.length === 0) {
      alert("No items in your cart. Thank you for visiting!");
      return;
    }
    askForState();
  } else {
    alert("Please enter 'y' for yes or 'n' for no.");
    askContinue();
  }
}

function askForState() {
  let stateInput = prompt("Please enter the two letter state abbreviation.");

  if (stateInput === null) {
    alert("Transaction cancelled. We hope to see you again soon!");
    return;
  }

  stateInput = stateInput.trim().toUpperCase();

  if (stateAbbreviations.indexOf(stateInput) === -1) {
    alert("\"" + stateInput + "\" is not a valid U.S. state abbreviation. Please try again.");
    askForState();
    return;
  }

  calculateAndDisplay(stateInput);
}

function calculateAndDisplay(stateCode) {
  let itemTotal = 0;
  for (let i = 0; i < purchasedItems.length; i++) {
    let priceIndex = items.indexOf(purchasedItems[i]);
    itemTotal += prices[priceIndex] * purchasedQuantities[i];
  }

  let zone = stateZones[stateCode] || 1;
  let shippingCost = getShippingCost(zone);

  shippingCost = (itemTotal > 100) ? 0 : shippingCost;

  let subtotal     = itemTotal + shippingCost;
  let tax          = itemTotal * TAX_RATE;
  let invoiceTotal = subtotal + tax;

  itemTotal    = roundMoney(itemTotal);
  shippingCost = roundMoney(shippingCost);
  subtotal     = roundMoney(subtotal);
  tax          = roundMoney(tax);
  invoiceTotal = roundMoney(invoiceTotal);

  displayInvoice(stateCode, itemTotal, shippingCost, subtotal, tax, invoiceTotal);
}

function getShippingCost(zone) {
  let cost;
  switch (zone) {
    case 1:  cost = 0;     break;
    case 2:  cost = 20.00; break;
    case 3:  cost = 30.00; break;
    case 4:  cost = 35.00; break;
    case 5:  cost = 45.00; break;
    case 6:  cost = 50.00; break;
    default: cost = 0;
  }
  return cost;
}

function roundMoney(amount) {
  return Math.round(amount * 100) / 100;
}

function formatMoney(amount) {
  return "$" + amount.toFixed(2);
}

function displayInvoice(stateCode, itemTotal, shippingCost, subtotal, tax, invoiceTotal) {
  let itemRows = "";
  for (let i = 0; i < purchasedItems.length; i++) {
    let priceIndex = items.indexOf(purchasedItems[i]);
    let unitPrice  = prices[priceIndex];
    let lineTotal  = roundMoney(unitPrice * purchasedQuantities[i]);
    itemRows += "<tr>" +
      "<td>" + purchasedItems[i] + " " + purchasedQuantities[i] + "</td>" +
      "<td class='num'>" + unitPrice.toFixed(2) + "</td>" +
      "<td class='num'>" + lineTotal.toFixed(2) + "</td>" +
      "</tr>";
  }

  let invoiceHTML =
    "<table class='items-table'>" +
      "<thead>" +
        "<tr>" +
          "<th>Item</th>" +
          "<th class='num'>Unit Price</th>" +
          "<th class='num'>Price</th>" +
        "</tr>" +
      "</thead>" +
      "<tbody>" +
        itemRows +
      "</tbody>" +
    "</table>" +
    "<hr />" +
    "<table class='totals-table'>" +
      "<tbody>" +
        "<tr><td class='t-label'>Item Total:</td><td class='t-value'>" + itemTotal.toFixed(2) + "</td></tr>" +
        "<tr><td class='t-label'>Shipping to " + stateCode + ":</td><td class='t-value'>" + formatMoney(shippingCost) + "</td></tr>" +
        "<tr><td class='t-label'>Subtotal:</td><td class='t-value'>" + formatMoney(subtotal) + "</td></tr>" +
        "<tr><td class='t-label'>Tax:</td><td class='t-value'>" + formatMoney(tax) + "</td></tr>" +
        "<tr><td class='t-label'>Invoice Total:</td><td class='t-value'>" + formatMoney(invoiceTotal) + "</td></tr>" +
      "</tbody>" +
    "</table>";

  document.getElementById("invoice-content").innerHTML = invoiceHTML;
  document.getElementById("storefront").style.display      = "none";
  document.getElementById("invoice-section").style.display = "block";
}

function shopAgain() {
  purchasedItems      = [];
  purchasedQuantities = [];
  document.getElementById("invoice-section").style.display = "none";
  document.getElementById("storefront").style.display      = "block";
}
