import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require('express');
const app = express();
const fetch = require('node-fetch');
const port = 3000;
var nationalDexCap = 0;

import {capitalize, getTypes, getAbilities, getGenus, getHeight, getWeight, getFlavorText} from "./public/js/script.js";
  
app.set("view engine", "ejs");
app.use(express.static("public"));

//background images
var bgs = ["/img/charizards.jpg", "/img/horizon.jpg", "/img/ocean.jpg", "/img/psday.jpg", "/img/shaymin.jpg", "/img/waterfall.jpg"];

//gets pokedex number of last current Pokemon
const getNationalDexCap = async() => {
  let url = `https://pokeapi.co/api/v2/pokemon-species`;
  let response = await fetch(url);
  let info = await response.json();
  nationalDexCap = info.count;
};

getNationalDexCap();

//gets type, species, height, weight, abilities, and flavor text for variants/forms
const getSpecDetails = async(id) => {
  let url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
  let response = await fetch(url);
  let specInfo = await response.json();
  let variants = [];
  
  //gets info for each variant
  for(const entry of specInfo.varieties) {
    url = entry.pokemon.url;
    response = await fetch(url);
    let info = await response.json();
    
    if(variants.length == 0) {
      variants.push({
      "name": capitalize(info.name),
      "types": getTypes(info.types),
      "genera": getGenus(specInfo.genera),
      "height": getHeight(info.height / 10),
      "weight": getWeight(info.weight / 10),
      "abilities": getAbilities(info.abilities),
      "flavorText": getFlavorText(specInfo.flavor_text_entries),
      "sprite": `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${info.id}.png`
      });
    }

    else {
      variants.push({
      "name": capitalize(info.name),
      "types": info.types,
      "height": info.height / 10,
      "weight": info.weight / 10,
      "abilities": info.abilities,
      "sprite": `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${info.id}.png`
      });
    }
  }  
  return variants;
};

app.get('/', async (req, res) => {
  let bg = bgs[Math.floor(Math.random() * bgs.length)];

  //gets nat dex id, base name
  let id = Math.floor(Math.random() * nationalDexCap) + 1;
  let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  let response = await fetch(url);
  let mainInfo = await response.json();

  let info = {
    "id": id,
    "name": capitalize(mainInfo.species.name)
  }

  let variants = await getSpecDetails(id);

  let cry = `https://pokemoncries.com/cries/${id}.mp3`;
  
  res.render('home', {"pokemon": info, "variants": variants, "cry": cry, "bg": bg});
});

app.get('/choose', async (req, res) => {
  let bg = bgs[Math.floor(Math.random() * bgs.length)];
  
  let id = req.query.chooseNum;
  
  id = parseInt(id);

  if(id && id >= 1 && id <= nationalDexCap) {
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let response = await fetch(url);
    let mainInfo = await response.json();
  
    let info = {
      "id": id,
      "name": capitalize(mainInfo.species.name)
    }
  
    let variants = await getSpecDetails(id);
  
    let cry = `https://pokemoncries.com/cries/${id}.mp3`;
    res.render('choose', {"pokemon": info, "variants": variants, "cry": cry, "bg": bg, "nationalDexCap": nationalDexCap});
  } else {
    res.render('choose', {"pokemon": "", "variants": "", "cry": "", "bg": bg, "nationalDexCap": nationalDexCap});
  }
});

app.get('/sound', async (req, res) => {
  let bg = bgs[Math.floor(Math.random() * bgs.length)];
  
  let pokemon = [];
  let id = 0;
  
  for(let i = 0; i < 4; i++) {
    id = Math.floor(Math.random() * nationalDexCap) + 1;
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let response = await fetch(url);
    let data = await response.json();
    pokemon.push({
      "id": id,
      "name": capitalize(data.species.name),
      "sprite": `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
    });
  }
  
  let index = Math.floor(Math.random() * 4);
  id = pokemon[index].id;
  
  let cry = `https://pokemoncries.com/cries/${id}.mp3`;

  res.render('sound', {"pokemon": pokemon, "cry": cry, "bg": bg, "cryIndex": index});
});

app.get('/spelling', async (req, res) => {
  let bg = bgs[Math.floor(Math.random() * bgs.length)];
  
  let id = Math.floor(Math.random() * nationalDexCap) + 1;
  let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  let response = await fetch(url);
  let mainInfo = await response.json();

  let info = {
    "id": id,
    "name": capitalize(mainInfo.species.name)
  }

  let variants = await getSpecDetails(id);

  let cry = `https://pokemoncries.com/cries/${id}.mp3`;

  res.render('spelling', {"pokemon": info, "variants": variants, "cry": cry, "bg": bg});
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`); 
});