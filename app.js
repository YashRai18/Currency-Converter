const BASE_URL = "https://api.currencyapi.com/v3/latest";
const API_KEY = "cur_live_ZaFCgx8pgPGw0TlP3ZUzo9VdQXLqn009fYyhHwEg";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency codes
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update country flag based on selected currency
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Fetch exchange rate and update UI
const updateExchangeRate = async () => {
  let amountInput = document.querySelector(".amount input");
  let amtVal = amountInput.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const url = `${BASE_URL}?apikey=${API_KEY}&base_currency=${fromCurr.value}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.data || !data.data[toCurr.value]) {
      msg.innerText = "Exchange rate not available.";
      return;
    }

    const rate = data.data[toCurr.value].value;
    const finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Error fetching data.";
    console.error(error);
  }
};

// Event listeners
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
