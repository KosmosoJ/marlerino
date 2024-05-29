import { formContainer } from './forms.js';

const adminAffnetsBtn = document.getElementById('admin_get_affnets')
const adminAffnetBtn = document.getElementById('admin_get_affnet')
const adminOffersBtn = document.getElementById('admin_get_offers')
const adminOfferBtn = document.getElementById('admin_get_offer')
const keitaroSendOffer = document.getElementById('admin_send_offer')
const keitaroSendAffnet = document.getElementById('admin_send_affnet')
const keitaroGetOffers = document.getElementById('admin_get_keitaro_offers')
const keitaroGetOffer = document.getElementById('admin_get_keitaro_offer')
const keitaroGetAffnets = document.getElementById('admin_get_keitaro_affnets')
const keitaroGetAffnet = document.getElementById('admin_get_keitaro_affnet')

let homeUrl = 'http://localhost:8000'

const makeRequest = (url, method, data=null) => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open(method, url, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                let response = JSON.parse(request.responseText);
                resolve(response);
            } else {return null}
        }
        if (data){
            request.send(JSON.stringify(data));
        } else { request.send()}
    });
}


adminAffnetsBtn.onclick = () => {
    // Get aff-nets
    makeRequest(`${homeUrl}/api/aff_networks/`, 'GET')
        .then(response => {
            // formContainer.innerHTML = JSON.stringify(response)
            formContainer.innerHTML = ''
            
            for (let item in response){
                formContainer.innerHTML += `ID: ${response[item]['id']} <br>Имя: <span>${response[item]['name']}</span> <hr>`
            }
        })
        .catch(error => {
            console.log(error);
        });
}

adminAffnetBtn.onclick = () =>{
    // Get Aff-net
    formContainer.innerHTML = `
    <form method="get" id="affnet_form" >
                
    ID сети <input type="text" name="aff_net_id" id="aff-net_id" required>
    <input type="submit" value="Send">
</form>
    `

    const form = document.getElementById('affnet_form');
    form.addEventListener('submit', (e) =>{
        e.preventDefault();
        const formData = new FormData(form);
        const affNet = formData.get('aff_net_id');

        
        makeRequest(`${homeUrl}/api/aff_network/${affNet}`, "GET")
        .then(response => {
            let childs = []
            if (response['aff_network']['children']){
                for (let child in response['aff_network']['children']){
                    childs.push(response['aff_network']['children'][parseInt(child)]['name'])
                }
            }
            const generateAffnet = `
            <span>Aff_network_id: ${response['aff_network']['id']}</span>
            <br>
            <span>Aff_network name: ${response['aff_network']['ANet_name']}</span>
            <br>
            <span>Aff_network_keitaro_id: ${response['aff_network']['keitaro_id']}</span>
            <br>
            <span>Aff_network_offers : ${childs}</span>
            `
            
            formContainer.innerHTML=  generateAffnet
            console.log(response['aff_network'])

        })
})}



adminOffersBtn.onclick = () =>{
// Get offers
    makeRequest(`${homeUrl}/api/offers/`, 'GET')
    .then(response => 
        {
            console.log(response)
            formContainer.innerHTML = ''
            for (let offer in response ){
                formContainer.innerHTML += `
                <span>Offer_name: ${response[offer]['name']}</span>
                <br>
                <span>Aff_network_id: ${response[offer]['ANet_id']}</span>
                <br>
                <span>Payout_currency: ${response[offer]['payout_currency']}</span>
                <br>
                <span>Keitaro_id: ${response[offer]['keitaro_id']}</span>
                <br>
                <span>Payout_value: ${response[offer]['payout_value']}</span>
                <br>
                <span>Country: ${response[offer]['country']}</span>
                <br>
                <span>State ${response[offer]['state']}</span>
                <br>
                <span>Daily_cap ${response[offer]['daily_cap']}</span>
                <hr>
                `
            }
        }
    )
}

adminOfferBtn.onclick = () =>{
    //  Get offer
    formContainer.innerHTML = `
    <form method="get" id="affnet_form" >
                
    ID offer'a <input type="text" name="offer_id" id="aff-net_id" required>
    <input type="submit" value="Send">
</form>
    `

    const form = document.getElementById('affnet_form');
    form.addEventListener('submit', (e) =>{
        e.preventDefault();
        const formData = new FormData(form);
        const offer_id = formData.get('offer_id');
        formContainer.innerHTML = ''
        
        makeRequest(`${homeUrl}/api/offer/${offer_id}`, "GET")
        .then(response => 
            {
                console.log(response)
                for (let offer in response ){
                    formContainer.innerHTML += `
                    <span>Offer_name: ${response[offer]['name']}</span>
                    <br>
                    <span>Aff_network_id: ${response[offer]['ANet_id']}</span>
                    <br>
                    <span>Payout_currency: ${response[offer]['payout_currency']}</span>
                    <br>
                    <span>Payout_value: ${response[offer]['payout_value']}</span>
                    <br>
                    <span>Keitaro_id: ${response[offer]['keitaro_id']}</span>
                    <br>
                    <span>Country: ${response[offer]['country']}</span>
                    <br>
                    <span>State ${response[offer]['state']}</span>
                    <br>
                    <span>Daily_cap ${response[offer]['daily_cap']}</span>
                    <hr>
                    `
                }
            }
        )
})}


keitaroSendOffer.onclick = () =>{
    // Send keitaro offer
    formContainer.innerHTML = `
    <form method="get" id="affnet_form" >
                
    ID оффера <input type="text" name="offer_id" id="aff-net_id" required>
    <input type="submit" value="Send">
</form>
    `

    const form = document.getElementById('affnet_form');
    form.addEventListener('submit', (e) =>{
        e.preventDefault();
        const formData = new FormData(form);
        const offerID = formData.get('offer_id');

        
        makeRequest(`${homeUrl}/api/keitaro_offer/${offerID}`, "GET")
        .then(response => {
            console.log(response)
            formContainer.innerHTML += `
            <span>Offer_id ${response['id']}</span>
            <br>
            <span>Offer_name ${response['name']}</span>
            <br>
            <span>Offer_affnet_id ${response['affiliate_network_id']}</span>
            <hr>
            `

        })
})}

keitaroSendAffnet.onclick = () =>{
    // Send keitaro aff_net

    formContainer.innerHTML = `
    <form method="get" id="affnet_form" >
                
    ID сети <input type="text" name="affnet_id" id="aff-net_id" required>
    <input type="submit" value="Send">
    </form>
    `

    const form = document.getElementById('affnet_form');
    form.addEventListener('submit', (e) =>{
        e.preventDefault();
        const formData = new FormData(form);
        const affnetId = formData.get('affnet_id');

        
        makeRequest(`${homeUrl}/api/keitaro_affnet/${affnetId}`, "POST")
        .then(response => {
            console.log(response)
            
            
            formContainer.innerHTML += `
            <span>Affnet_id ${response['id']}</span>
            <br>
            <span>Affnet_name ${response['name']}</span>
            <br>
            <span>Affnet offers ${response['offers']}</span>
            <hr>
            `

        })
})

}

keitaroGetOffers.onclick = () =>{
    makeRequest(`${homeUrl}/api/keitaro_offers/`, "GET")
    .then(response =>{
        formContainer.innerHTML = ''
        for (let key in response){
            formContainer.innerHTML += `
            <span>Offer_id ${response[key]['id']}</span>
            <br>
            <span>Offer_name ${response[key]['name']}</span>
            <br>
            <span>Offer_affnet_id ${response[key]['affiliate_network_id']}</span>
            <hr>
            `
        }
    }).catch(error =>{
        console.log(error)
    })

}


keitaroGetOffer.onclick = () =>{
    // Get keitaro offer
    formContainer.innerHTML = `
    <form method="get" id="affnet_form" >
                
    ID offer'a <input type="text" name="offer_id" id="aff-net_id" required>
    <input type="submit" value="Send">
</form>
    `

    const form = document.getElementById('affnet_form');
    form.addEventListener('submit', (e) =>{
        e.preventDefault();
        const formData = new FormData(form);
        const offer_id = formData.get('offer_id');
        formContainer.innerHTML = ''
        
        makeRequest(`${homeUrl}/api/keitaro_offers/${offer_id}`, "GET")
        .then(response => 
            {
                console.log(response)
                if (response){
                formContainer.innerHTML += `
                <span>Offer_name: ${response['name']}</span>
                <br>
                <span>Aff_network_id: ${response['id']}</span>
                <br>
                <span>Payout_currency: ${response['payout_currency']}</span>
                <br>
                <span>Payout_value: ${response['payout_value']}</span>
                <br>
                <span>Country: ${response['country']}</span>
                <br>
                <span>State: ${response['state']}</span>
                <br>
                <span>Daily_cap: ${response['daily_cap']}</span>
                <hr>
                `} else {formContainer.innerHTML = `<span class="error-text">Не найден оффер с таким ID</span>`}
                
            }
        )
})
}

keitaroGetAffnets.onclick = () =>{
    // Get keitaro affnets
    makeRequest(`${homeUrl}/api/keitaro_affnets/`, "GET")
    .then(response =>{
        formContainer.innerHTML = ''
        for (let key in response){
            formContainer.innerHTML += `
            <span>Affnet_id ${response[key]['id']}</span>
            <br>
            <span>Affnet_name ${response[key]['name']}</span>
            <br>
            <span>offers ${response[key]['offers']}</span>
            <hr>
            `
        }
    }).catch(error =>{
        console.log(error)
    })
}

keitaroGetAffnet.onclick = () =>{
    // Get keiatro affnet
    formContainer.innerHTML = `
    <form method="get" id="affnet_form" >
                
    ID сети <input type="text" name="affnet_id" id="aff-net_id" required>
    <input type="submit" value="Send">
</form>
    `

    const form = document.getElementById('affnet_form');
    form.addEventListener('submit', (e) =>{
        e.preventDefault();
        const formData = new FormData(form);
        const affnet_id = formData.get('affnet_id');
        formContainer.innerHTML = ''
        try{
            makeRequest(`${homeUrl}/api/keitaro_affnets/${affnet_id}`, "GET")
            .then(response => 
                {
                    console.log(response)
                    
                    formContainer.innerHTML = `
                    <span>Affnet_id: ${response['id']}</span>
                    <br>
                    <span>Affnet_name: ${response['name']}</span>
                    <br>
                    <span>offers: ${response['offers']}</span>
                    <hr>
                    `
                    
                }
            )
            } catch(error){
                formContainer.innerHTML = `<span>Не найдена сеть с таким ID</span>`
            }} 
    )
}

