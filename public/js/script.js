const globalConfirmed = document.querySelector("#globalConfirmed");
const globalRecovered = document.querySelector("#globalRecovered");
const globalDeath = document.querySelector("#globalDeath");
const newGlobalConfirmed = document.querySelector("#newGlobalConfirmed");
const newGlobalRecovered = document.querySelector("#newGlobalRecovered");
const newGlobalDeath = document.querySelector("#newGlobalDeath");
const date = document.querySelector("#date");
const countries = document.querySelector("#countries");
const loader = document.getElementById("loader");
const body = document.querySelector("body");
const fetch_button = document.getElementById("fetch_button");

function fetchData() {
  fetch_button.disabled = true;
  // disabling app interaction during fetch event
  body.classList.add("stop-scrolling");
  loader.setAttribute("style", "display: block");

  let apiUrl = "https://api.covid19api.com/summary";
  fetch(apiUrl)
    .then((response) => {
      let data = response.json();
      return data;
    })
    .then((data) => {
      storeNewInfo(data);
      afterEffect();
    })
    .catch((error) => {
      console.log("Error: " + error);
      afterEffect();
    });
}

function afterEffect() {
  loader.setAttribute("style", "display: none");
  // enabling app interaction after fetch event
  body.classList.remove("stop-scrolling");
  fetch_button.disabled = false;
}

function storeNewInfo(newUpdate) {
  localStorage.clear();
  localStorage.setItem("info", JSON.stringify(newUpdate));
  latestUpdate = JSON.parse(localStorage.getItem("info"));
  updateUI(latestUpdate);
}

function updateUI(newInfoFromStorage) {
  globalConfirmed.innerHTML = newInfoFromStorage.Global.TotalConfirmed;
  globalRecovered.innerHTML = newInfoFromStorage.Global.TotalRecovered;
  globalDeath.innerHTML = newInfoFromStorage.Global.TotalDeaths;
  newGlobalConfirmed.innerHTML = newInfoFromStorage.Global.NewConfirmed;
  newGlobalRecovered.innerHTML = newInfoFromStorage.Global.NewRecovered;
  newGlobalDeath.innerHTML = newInfoFromStorage.Global.NewDeaths;
  date.innerHTML = "Global Case Count At " + new Date(newInfoFromStorage.Date);

  newInfoFromStorage.Countries.map((country) => {
    countries.innerHTML += `<div class="country">
        <h4>${country.Country}</h4>
        <table>
            <thead>
                <tr>
                    <td>Cases</td>
                    <td>New</td>
                    <td>Total</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Confirmed</td>
                    <td>${country.NewConfirmed}</td>
                    <td>${country.TotalConfirmed}</td>
                </tr>
                <tr>
                    <td>Recovered</td>
                    <td>${country.NewRecovered}</td>
                    <td>${country.TotalRecovered}</td>
                </tr>
                <tr>
                    <td>Death</td>
                    <td>${country.NewDeaths}</td>
                    <td>${country.TotalDeaths}</td>
                </tr>
            </tbody>
        </table>
    </div>`;
  });
}

let defaultInfo = {
  Global: {
    TotalConfirmed: "-",
    TotalRecovered: "-",
    TotalDeaths: "-",
    NewConfirmed: "-",
    NewRecovered: "-",
    NewDeaths: "-",
  },
  Date: new Date(),
  Message: "",
  Countries: [],
};

let latestUpdate = null;
latestUpdate = JSON.parse(localStorage.getItem("info"));
!latestUpdate ? storeNewInfo(defaultInfo) : updateUI(latestUpdate);
