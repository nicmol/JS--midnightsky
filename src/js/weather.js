import './general';

//http://api.openweathermap.org/data/2.5/forecast/daily?zip=97405&units=imperial&appid=c59493e7a8643f49446baf0d5ed9d646

/*
Create a class called Weather
- Part 1 - Retrieve the weather information when the user clicks the buttobn
  - Create the constructor
    - initialize instance variables for the "state" of the app and the ajax call
        this.state = {
          zipcode: "",
          city: {},
          dates: [],
          selectedDate: null
        };
        this.url = "http://api.openweathermap.org/data/2.5/forecast/daily?zip=";
        this.apikey = "&units=imperial&appid=c59493e7a8643f49446baf0d5ed9d646";
    - initialize instance variables for UI elements
        the form
        the zipcode input element
        the weather list div
        the current day div
    - write the stub of a method onFormSubmit
    - bind the class to onFormSubmit
    - add a submit handler to the form that calls onFormSubmit
  - Write the method onFormSubmit.  It should
    - prevent the form from being sumbitted to the server
    - get the zip code from the UI and put it in a variable
    - call fetch with the url zipcdoe and apikey
      - when the response comes back THEN parse the json
      - when that finishes THEN 
        - set the city in the state object
        - set the dates in the state object
        - set the selectedDate to null
        - clear the zipcode from the UI
        - call the method renderWeatherList and pass this.state.dates as the arg
  - Write a first version of renderWeatherList.  It has weatherDays (which is an array) as a parameter.
    - console.log the value of weatherDays.
  - Edit the constructor to bind the class to the method renderWeatherList
END OF PART 1 - TEST AND DEBUG YOUR APP
- Part 2 - Format ONE weather list item and the weather list as a whole
  - Write the method renderWeatherListItem
    - This method returns a template literal containing the html for the weather for ONE day.
      It gets called in renderWeatherList.  It has 2 parameters a weatherDay and an index.
      The weatherDay is a js object from the list part of the return from the weather api.
    - Format the weather information for one day on the html page.  At a minimum it should include
      - the month and day as well as the weekday
      - the high and low temperatures for that day
      - the element should be styled with weather-list-item as well
    - CUT the html for ONE day from your html page into the body of your method.
      - Enclose the html in ``.
      - Replace the hardcoded month and day, weekday, high and low temperatures 
        with template strings that use the properties of the weatherDay object
      - Return the template literal 
  - Edit the body of the method renderWeather list.  It should
    - Create the html for each of the weather list items.  Use the array method map to do this.
      const itemsHTML = weatherDays.map((weatherDay, index) => this.renderWeatherListItem(weatherDay, index)).join('');
    - Set the inner html of the weatherList element on the page to 
      - a div element styled with weather-list flex-parent
      - that contains the itemsHTML from above
END OF PART 2 - TEST AND DEBUG YOUR APP
- Part 3 - Display weather details when the user clicks one weather list item

  add event handler that makes the api call - just log the results to the console
  write renderWeatherList
  write renderWeatherListItem
*/

class Weather {
  constructor() {
    this.state = {
      zipcode: "",
      city: {},
      dates: [],
      selectedDate: null
    };
    this.url = "http://api.openweathermap.org/data/2.5/forecast/daily?zip=";
    this.apikey = "&units=imperial&appid=c59493e7a8643f49446baf0d5ed9d646";

    this.$form = document.querySelector('#zipForm');
    this.$zipcode = document.querySelector('#zipcode');
    this.$weatherList = document.querySelector('#weatherList');

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.renderWeatherList = this.renderWeatherList.bind(this);
    this.renderWeatherlistItem = this.renderWeatherListItem.bind(this);
    this.$form.addEventListener('submit', this.onFormSubmit);

    this.$currentDay = document.querySelector('#currentDay');
    this.addItemClickHandlers = this.addItemClickHandlers.bind(this);
    this.clearCurrentDay = this.clearCurrentDay.bind(this);
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.state.zipcode = this.$zipcode.value;
    fetch(`${this.url}${this.state.zipcode}${this.apikey}`)
    .then(response => response.json())
    .then(data => { 
      //const {city, list: dates } = data;
      this.state.city = data.city;
      this.state.dates = data.list;
      this.state.selectedDate = null;
      this.$zipcode.value = "";
      this.renderWeatherList(this.state.dates);
      this.clearCurrentDay();
      this.addItemClickHandlers();
    })
    .catch(error => {
        alert('There was a problem getting info!'); 
    }); 
  }

  renderWeatherList(days) {
    const itemsHTML = days.map((day, index) => this.renderWeatherListItem(day, index)).join('');
    this.$weatherList.innerHTML = 
      `<div class="weather-list flex-parent">
          ${itemsHTML}
      </div>`;
  }

  addItemClickHandlers() {
    const items = document.querySelectorAll('.weather-list-item');
    for (let i = 0; i < items.length; i++)
      items[i].onclick = this.renderCurrentDay.bind(this, [i]);
  }

  getWeekday(date) {
    const dayNames = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = date.getDay();
    return dayNames[weekday];
  }

  renderWeatherListItem(day, index) {
    const date = new Date(day.dt * 1000);
    const weekday = this.getWeekday(date);
    const city = this.state.city;
    return `
        <div class="weather-list-item" data-index="${index}">
            <h2>${date.getMonth() + 1} / ${date.getDate()}</h2>
            <h3>${weekday}</h3>
            <h3>${day.temp.min.toFixed(1)}&deg;F &#124; ${day.temp.max.toFixed(1)}&deg;F</h3>
        </div>
    `;
  }

  renderCurrentDay(params) {
    const index = params[0];
    const city = this.state.city;
    const day = this.state.dates[index];
    const w = day.weather[0];
    const date = new Date(day.dt * 1000);
    const weekday = this.getWeekday(date);
    const dayHTML = `
      <div class="current-day">
        <h1 class="day-header">${weekday} in ${city.name}</h1>
        <div class="weather">
        <p>
            <img src='http://openweathermap.org/img/w/${w.icon}.png' alt='${w.description}'/>
            ${w.description}
        </p>
      </div>
      <div class="details flex-parent">
        <div class="temperature-breakdown">
          <p>Morning Temperature: ${day.temp.morn}&deg;F</p>
          <p>Day Temperature: ${day.temp.day}&deg;F</p>
          <p>Evening Temperature: ${day.temp.eve}&deg;F</p>
          <p>Night Temperature: ${day.temp.night}&deg;F</p>
        </div>
        <div class="misc-details">
          <p>Atmospheric Pressure: ${day.pressure} hPa</p>
          <p>Humidity: ${day.humidity}%</p>
          <p>Wind Speed: ${day.speed} mph</p>
        </div>
      </div>
    </div>
    `;
    this.$currentDay.innerHTML = dayHTML;
  }

  clearCurrentDay() {
    this.$currentDay.innerHTML = "";
  }
}

new Weather();
