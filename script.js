const swiper = new Swiper('.swiper', {
  loop: true,
  slidesPerView: 4,
  grabCursor:true,
  spaceBetween:40,
});


const butt = document.querySelector('.butt')
const inputField = document.querySelector('.inputField')
const resultBlock = document.querySelector('.searchResult')
const container = document.querySelector('.container')
const apiKey = 'd12dd80265d01138ffe9ef55a4439fa3'
const errorField = document.querySelector('.errorField')
let success = null;

const temperature = document.querySelector('.temperature')
const city = document.querySelector('.city')
const weather = document.querySelector('.weather')
const weatherStatusImg = document.querySelector('.weatherStatusImg')



let temperatureFromData = null;
let cityNameFromData = null;
let weatherFromData = null;
let iconCodeFromData = null;

const wrapper = document.querySelector('.wrapper')


butt.addEventListener('click', () => {
  getWeather(inputField.value)
})


async function getWeather(city) {
  await getLocation(city)
  await getDataCity(latFromData, lonFromData)

  await success === false ? errorField.insertAdjacentHTML('beforeend', '<p style="color:red; font-size:22px; padding-top:15px;"> 404 Not found. </p>') : addDisplay()

  addInfo(temperatureFromData, cityNameFromData, weatherFromData)
  getWeatherForecast(city)

  

}




let latFromData = null;
let lonFromData = null;





async function getLocation(city) {
  await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      errorField.textContent = ''
      let {lat,lon} = data[0]
      latFromData = lat
      lonFromData = lon
    })
    .catch(error => {
      latFromData = null;
      lonFromData = null;
      return 
    })
  
}





async function getDataCity(lat, lon) {
  if (lat === null || lon === null) {
    success = false
    return
  }
  await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      let {main:{temp}, name, weather: [{main, icon}],} = data
      temperatureFromData = temp
      cityNameFromData = name
      weatherFromData = main
      iconCodeFromData = icon
    })
    .catch(error => console.error(error))
  success = true;
}



function addInfo(tempData, cityNameData, weatherData) {
  if (cityNameData === 'Pushcha-Vodytsya' || cityNameData === 'Podil') {
    cityNameData = 'Kyiv'
  }
  temperature.innerHTML = `${parseInt(tempData-273.15)}°C`
  city.innerHTML = `${cityNameData}`
  weather.innerHTML = `${weatherData}`
  const iconUrl = `https://openweathermap.org/img/wn/${iconCodeFromData}@4x.png`;
  weatherStatusImg.src = iconUrl;
}

function addDisplay() {
  container.style.marginTop = '50px'
  resultBlock.style.display = 'flex' 
}




let forecastFromData = null

async function getWeatherForecast(cityZXC) {
  
  await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityZXC}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      let {list} = data
      forecastFromData = list.slice(0,8)
      wrapper.innerHTML = '';
      forecastFromData.forEach(el => {
        const dateTime = new Date(el.dt * 1000);
        const time = dateTime.getHours();
        const forecastTemp = el.main.temp
        const forecastIcon = el.weather[0].icon
        const iconUrl = `https://openweathermap.org/img/wn/${forecastIcon}@4x.png`;
        const forecastHtml = `
          <div class="swiper-slide">
            <div class="infoHolder">
              <p class="time"> ${time}:00</p>
              <div class="imgHolder"><img src="${iconUrl}" alt=""></div>
              <p class="temperatureInput">${parseInt(forecastTemp-273.15)}°C</p>
            </div>
           </div>`;
        wrapper.innerHTML += forecastHtml
      })
    })
    
    .catch(error => console.error(error))
    swiper.update()
  
}

