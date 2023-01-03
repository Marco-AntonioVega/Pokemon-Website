const express = require('express');
const app = express();
const fetch = require('node-fetch');
const port = 3000;
var nationalDexCap = 0;

app.set("view engine", "ejs");
app.use(express.static("public"));

var bgs = ["/img/charizards.jpg", "/img/horizon.jpg", "/img/ocean.jpg", "/img/psday.jpg", "/img/shaymin.jpg", "/img/waterfall.jpg"];

var soundSprites = [];
var soundNames = [];
var cryURL = "";
var soundBg = "";
var cryIndex = 0;

var typeID = 0;
var typeBg = "";

//gets pokedex number of last current Pokemon
const getNationalDexCap = async() => {
  let url = `https://pokeapi.co/api/v2/pokemon-species`;
  let response = await fetch(url);
  let info = await response.json();
  nationalDexCap = info.count;
};

getNationalDexCap();

app.get('/', async (req, res) => {
  bgs.sort(() => Math.random() - 0.5);
  
  let id = Math.floor(Math.random() * (nationalDexCap - 1) + 1);
  let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  let response = await fetch(url);
  let mainInfo = await response.json();

  url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
  response = await fetch(url);
  let specInfo = await response.json();

  let name = mainInfo.name;
  let sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  let cry = `https://pokemoncries.com/cries/${id}.mp3`;
  
  res.render('home', {"pokemon": mainInfo, "details": specInfo, "sprite": sprite, "cry": cry, "bg": bgs[0]});
});

app.get('/choose', async (req, res) => {
  bgs.sort(() => Math.random() - 0.5);
  
  let id = req.query.chooseNum;
  let mainInfo = "";
  let specInfo = "";
  let cry = "";
  let sprite = "";

  id = parseInt(id);

  if(id && id >= 1 && id <= nationalDexCap) {
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let response = await fetch(url);
    mainInfo = await response.json();
    
    url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
    response = await fetch(url);
    specInfo = await response.json();

    sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    cry = `https://pokemoncries.com/cries/${id}.mp3`;
  }
  
  res.render('choose', {"pokemon": mainInfo, "details": specInfo, "sprite": sprite, "bg": bgs[0], "cry": cry, "nationalDexCap": nationalDexCap});
});

app.get('/sound', async (req, res) => {
  bgs.sort(() => Math.random() - 0.5);
  
  soundSprites = [];
  soundNames = [];
  
  let pokemon = [];
  let sprites = [];
  
  for(let i = 0; i < 4; i++) {
    let id = Math.floor(Math.random() * (899 - 1) + 1);
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let response = await fetch(url);
    let data = await response.json();
    pokemon.push(data);
    soundNames.push(data.name);
    url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    sprites.push(url);
  }
  
  let index = Math.floor(Math.random() * 4);
  id = pokemon[index].id;
  
  let cry = `https://pokemoncries.com/cries/${id}.mp3`;

  soundSprites = [...sprites];
  cryURL = cry;
  cryIndex = index;
  soundBg = bgs[0];
  
  res.render('sound', {"pokemon": pokemon, "sprites": sprites, "bg": bgs[0], "cry": cry, "cryIndex": cryIndex});
});

app.get('/soundWrongResults', async (req, res) => {
  res.render('soundWrongResults', {"names": soundNames, "sprites": soundSprites, "cry": cryURL, "cryIndex": cryIndex, "bg": soundBg, "message": "Try again"});
});

app.get('/soundCorrectResults', async (req, res) => {
  res.render('soundCorrectResults', {"names": soundNames, "sprites": soundSprites, "cry": cryURL, "cryIndex": cryIndex, "bg": soundBg, "message": "Correct!"});
});

app.get('/type', async (req, res) => {
  bgs.sort(() => Math.random() - 0.5);
  
  let id = Math.floor(Math.random() * (899 - 1) + 1);
  typeID = id;
  typeBg = bgs[0];
  
  let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  let response = await fetch(url);
  let mainInfo = await response.json();
  
  url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
  response = await fetch(url);
  let specInfo = await response.json();

  let sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  let cry = `https://pokemoncries.com/cries/${id}.mp3`;

  res.render('type', {"pokemon": mainInfo, "details": specInfo, "sprite": sprite, "bg": bgs[0], "cry": cry});
});

app.get('/typeCheck', async (req, res) => {
  let name = req.query.spellingName.toLowerCase();
  let specInfo = "";
  
  let correctURL = `https://pokeapi.co/api/v2/pokemon/${typeID}`;
  let correctResponse = await fetch(correctURL);
  let correctMainInfo = await correctResponse.json();
  
  if(name == correctMainInfo.name) {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${typeID}/`;
    let response = await fetch(url);
    specInfo = await response.json();
  }
  
  let sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${typeID}.png`;
  let cry = `https://pokemoncries.com/cries/${typeID}.mp3`;
  
  res.render('typeCheck', {"pokemon": correctMainInfo, "details": specInfo, "sprite": sprite, "bg": typeBg, "cry": cry, "message": "Try again"});
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`); 
});