
const current = document.querySelector('.current')
const input = document.querySelector('#address');
const button = document.querySelector('#submit');
const errorMsg = document.querySelector('.error');
const timeZone = document.querySelector('.address');


const key = 'f6d4aeb12c254fdab49acdfffc239c40';



async function fetchByLatLong() {
    try {
        const position = await getPosition();
        const responce = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude
            }&format=json&apiKey=${key}`);
        const data = await responce.json();
        return data;
    }
    catch (error) {
        console.log("Geolocation is not supported by this browser.", error);
    }
}


function getPosition() {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
}


async function fetchByAddress(searchText){
    try{
        const responce = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${searchText}&apiKey=${key}`);
        const data = await responce.json();
        errorMsg.innerHTML = "";
        return data;
    }
    catch(error){
        errorMsg.innerHTML = error
    }
}
function showCurrentZone(obj, box) {
    box.style.display = 'flex'
    box.innerHTML = `<p>Name Of Time Zone : ${obj.timezone.name}</p>
    <div class="lat-long">
        <p>Lat : ${obj.lat}</p>
        <p>Long : ${obj.lon}</p>
    </div>
    <p>Offset STD : ${obj.timezone.offset_STD}</p>
    <p> Offset STD Seconds : ${obj.timezone.offset_STD_seconds}</p>
    <p>Offset DST : ${obj.timezone.offset_DST}</p>
    <p>Offset DST Seconds : ${obj.timezone.offset_DST_seconds}</p>
    <p>Country : ${obj.country}</p>
    <p>Postcode : ${obj.postcode}</p>
    <p>City : ${obj.city}</p>`
}
document.body.onload = async() => {
    errorMsg.innerHTML = "";

    let obj = await fetchByLatLong();
    if(obj.results.length==0){
        alert('something went wrong, Could not fetch your current Time-zone!!')
    }
    else{
        console.log(obj);
        showCurrentZone(obj.results[0], current)
    }
    button.addEventListener('click',async()=>{
        errorMsg.innerHTML = "";
        if(input.value==''){
            errorMsg.innerHTML = "Please enter valid address!"
            return
        }
        else{
            let data = await fetchByAddress(input.value);
            if(data.features.length==0){
                errorMsg.innerHTML = 'Time-Zone could not be found!!'
                return
            }else{
                console.log(data.features[0].properties);
                showCurrentZone(data.features[0].properties, timeZone)
            }
        }

    })
}