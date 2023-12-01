const card = document.querySelectorAll(".card");
var myModal = document.getElementById('abc');
const character_api = 'https://swapi.dev/api/people';
const character_image_api = 'https://starwars-visualguide.com/assets/img/characters'
const previousbtn = document.getElementById('previousbtn')
const nextbtn = document.getElementById('netxtbtn')
let nextpage, previouspage,pagedata;

const cd = document.querySelector('#cardname');
const cy = document.querySelector('#cardbyear');
const cg = document.querySelector('#cardgender');
const cs = document.querySelector('#cardspecies');
const chw = document.querySelector('#cardhomeworld');
const cf = document.querySelector('#cardfilms');
const ci = document.querySelector('#cardimg');
const c_s = document.getElementById("modal-close");
const abc = document.getElementById("abc");

async function load_data(url) {
    $("#loader").show();
    $(".ele-container").hide();
    const response = await fetch(url);
    const data = await response.json();
    nextpage = data.next;
    previouspage = data.previous;
    pagedata = data.results;
    show_data();
    document.querySelector(".element").addEventListener('click', open_modal);
    document.getElementById("nextbtn").addEventListener('click', nextPage);
    document.getElementById("previousbtn").addEventListener('click', previousPage);
}


function load_app() {
    load_data(character_api);   
}

let imgid;
function show_data() {
    $("#loader").hide();
    $(".ele-container").show();
    document.querySelector(".element").innerHTML = '';
    pagedata.forEach((element,i) => {
        
        imgid = element.url.split('/').slice(-2)[0];
        let htm = `<div data-toggle="modal" data-target="#abc" class="outer">
                <div id="${i+1}" class="card border" style="width: 18rem; ">
                    <img id="${imgid}" src="https://starwars-visualguide.com/assets/img/characters/${imgid}.jpg" style="width: 100%; height=auto" class="card-img-top ">
                    <div class="card-body">
                        <h2 class="card-text text-center">${element.name}</h2>
                    </div>
                </div>
            </div>
            `;
        document.querySelector(".element").insertAdjacentHTML("beforeend", htm);
    });

    
}

async function open_modal(e) {
    $("#modalloader").show();
    $(".card-out").hide();
    let id = e.target.closest('.border').id;
    let imgid = e.target.closest('.card-img-top').id;
    let name = pagedata[id-1].name;
    let birthyear = pagedata[id-1].birth_year;
    let gender = pagedata[id-1].gender;
    
    let species = await getspecies(pagedata[id-1].species);
    let homeworlds = await gethomeworld(pagedata[id-1].homeworld);
    let films = await getfilms(pagedata[id-1].films);
    cd.innerText = name.toString();
    cy.innerText = birthyear.toString();
    cg.innerText = gender.toString();
    ci.src = `https://starwars-visualguide.com/assets/img/characters/${imgid}.jpg`;
    cs.innerText = species.toString();
    chw.innerText = homeworlds.toString();
    cf.innerText = films.toString();
    c_s.addEventListener('click', clear_modal);
    $("#modalloader").hide();
    $(".card-out").show();
}


function clear_modal(){
    cd.innerText = "";
    cy.innerText = "";
    cg.innerText = "";
    cs.innerText = "";
   chw.innerText = "";
    cf.innerText = "";
}

async function gethomeworld(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data.name
}

async function getspecies(arr) {
    const ans = await Promise.all(arr.map(async url => {
        const response = await fetch(url);
        const data = await response.json();
        return data.name;
    }))
    return ans;

}

async function getfilms(arr) {
    const ans = await Promise.all(arr.map(async url => {
        const response = await fetch(url);
        const data = await response.json();
        return data.title;
    }))
    return ans;
}

async function nextPage() {
    if(nextpage !== null){
        $("#loader").show();
        $(".ele-container").hide();
        load_data(nextpage);
    }else{
        alert("No Data found..");
    }
}

async function previousPage() {
    if(previouspage !== null){
        $("#loader").show();
        $(".ele-container").hide();
        load_data(previouspage);
    }else{
        alert("No Data found..");
    }
}

load_app();