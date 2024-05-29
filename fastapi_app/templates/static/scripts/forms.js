export const formContainer = document.querySelector('.content-container')
const createAffnetBtn = document.getElementById('createAffnet')
const createOfferBtn = document.getElementById('createOffer')
const errorDiv = document.querySelector('.error_handler')

const postAffnet = (affnet) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8000/api/aff_network/', true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            console.log(response)
            
            let id = response['id'];
            let name = response['ANet_name'];
            console.log(name)
            formContainer.innerHTML = `
            <div>ID: ${id}</div>
            <div>NAME : ${name}</div>
            `
            errorDiv.innerHTML = ''
        } else {
            errorDiv.innerHTML = '<span class="error-text">Такая сеть уже существует</span>'}
    };
    xhr.send(JSON.stringify({'Network_name':affnet}))
}

async function getInsertReponse(affnet){
    const response = postAffnet(affnet)
    
}

createAffnetBtn.onclick = () =>{
    formContainer.innerHTML = `
             <form action="" method="post" id="affnet_form" >
                
                Название сети <input type="text" name="aff_net" id="aff-net_name" required>
                <input type="submit" value="Send">
            </form>
    `

    const form = document.getElementById('affnet_form');
    form.addEventListener('submit', (e) =>{
        e.preventDefault();
        const formData = new FormData(form);
        const affNet = formData.get('aff_net');

        
        getInsertReponse(affNet)
    })
    
}

const postOffer = (offerInfo) =>{
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8000/api/offer/', true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            let id = response['id'];
            let name = response['name'];
            formContainer.innerHTML = `
            <span>Оффер успешно создан</span>
            <div>ID: ${id}</div>
            <div>NAME : ${name}</div>
            `
        }
    };
    xhr.send(JSON.stringify(offerInfo))


};

createOfferBtn.onclick = () => {
    errorDiv.innerHTML = ''
    formContainer.innerHTML = `
    <form method="post" id="offer_form">
                
    <label for="offer_name">Название оффера </label>
    <input type="text" name="offer_name" required>

    <label for="offer_affnet_id">ID сети</label>
    <input type="number" name="offer_affnet_id"  required>

    <label for="offer_currency">Валюта</label> 
    <select name="offer_currency" required>
        <option disabled selected value> -- Выберите валюту -- </option>
        <option value="RUB">RUB</option>
        <option value="EUR">EUR</option>
        <option value="USD">USD</option>
    </select>

    <label for="offer_value">Вознаграждение</label>
    <input type="number" name="offer_value"  required>

    <label for="offer_country">Страна</label>
    <select name="offer_country" required>
        <option disabled selected value> -- Выберите страну -- </option>
        <option value="RU">Russia</option>
        <option value="EU">Europe</option>
        <option value="US">USA</option>
    </select>

    <label for="offer_state">Статус</label>
    <select name="offer_state" required>
        <option disabled selected value> -- Выберите статус -- </option>
        <option value="On">Active</option>
        <option value="off">Disabled</option>
    </select>

    <label for="offer_dailycap">Ежедневное ограничение</label>
    <input type="number" name="offer_dailycap" required>

    <input type="submit" value="Отправить">
    </form>
    
    `
    const form = document.getElementById('offer_form');
    form.addEventListener('submit', (e) =>{
        let dict = {};
        e.preventDefault();
        const formData = new FormData(form);
        const offerName = formData.get('offer_name');
        const offerAffnetId = formData.get('offer_affnet_id');
        const offerCurrency = formData.get('offer_currency');
        const offerValue = formData.get('offer_value');
        const offerCountry = formData.get('offer_country');
        const offerState = formData.get('offer_state');
        const offerDailyCap = formData.get('offer_dailycap');

        dict['name'] = offerName
        dict['ANet_id'] = parseInt(offerAffnetId)
        dict['payout_currency'] = offerCurrency
        dict['payout_value'] = parseInt(offerValue)
        dict['country'] = offerCountry
        dict['state'] = offerState
        dict['daily_cap'] = parseInt(offerDailyCap)

        postOffer(dict)
    })
    console.log(form)
}

