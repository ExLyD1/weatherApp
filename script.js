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
let er = false;






let latFromData = null;
let lonFromData = null;

butt.addEventListener('click', () => {
  getWeather(inputField.value)
})


async function getWeather(city) {
  await getLocation(city)
  if (latFromData === null && lonFromData === null) {
    return
  } else {
    await getDataCity(latFromData, lonFromData)
    addDisplay()
  }


}






async function getLocation(city) {
  try {
    await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        let {lat,lon} = data[0]
        latFromData = lat
        lonFromData = lon
      })
      .catch(error => {
        if ( er === false ) {
          errorField.insertAdjacentHTML('beforeend', '<p style="color:red; font-size:22px; padding-top:15px;"> Write the correct city name! </p>');
          er = true
        }
        
        return
        
      })
    console.log(`lat : ${latFromData}, lon : ${lonFromData}`);
  } catch (error) {
    console.log(123);
  }
  
}



function getDataCity(lat, lon) {
  if (lat === null && lon === null) {
    return
  }
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error))
}



function addDisplay() {
  container.style.marginTop = '50px'
  resultBlock.style.display = 'flex' 
}