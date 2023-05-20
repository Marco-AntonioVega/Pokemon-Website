import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require('express');
const app = express();
const fetch = require('node-fetch');
const port = 3000;
var nationalDexCap = 905;

import {capitalize, getGenus, getFlavorText} from "./public/js/script.js";
  
app.set("view engine", "ejs");
app.use(express.static("public"));

//background images
var bgs = ["/img/charizards.jpg", "/img/horizon.jpg", "/img/ocean.jpg", "/img/psday.jpg", "/img/shaymin.jpg", "/img/waterfall.jpg"];
var missingCryIDs = [741, 745, 803, 804, 805, 806, 807, 808, 809, 890, 891, 892, 893, 894, 895, 896, 897, 898, 899, 900, 901, 902, 903, 904, 905];

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

    variants.push({
      "name": capitalize(info.name),
      "types": info.types,
      "height": info.height / 10,
      "weight": info.weight / 10,
      "abilities": info.abilities,
      "sprite": `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${info.id}.png`
    });
    if(variants.length == 1) {
      variants[0].genera = getGenus(specInfo.genera);
      variants[0].flavorText = getFlavorText(specInfo.flavor_text_entries);
    }
  }  
  return variants;
};

//gets main and specific pokemon info
const getAllDetails = async(id) => {
  let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  let response = await fetch(url);
  let mainInfo = await response.json();

  let info = {
    "id": id,
    "name": capitalize(mainInfo.species.name)
  }

  let variants = await getSpecDetails(id);

  let cry = `https://pokemoncries.com/cries/${id}.mp3`;

  return {
    "info": info,
    "variants": variants,
    "cry": cry
  };
};

app.get('/', async (req, res) => {
  let bg = bgs[Math.floor(Math.random() * bgs.length)];

  //gets nat dex id, base name
  let id = Math.floor(Math.random() * nationalDexCap) + 1;
  let result = await getAllDetails(id);

  res.render('home', {"pokemon": result.info, "variants": result.variants, "cry": result.cry, "bg": bg});
});

app.get('/choose', async (req, res) => {
  let bg = bgs[Math.floor(Math.random() * bgs.length)];
  
  let id = req.query.chooseNum;
  
  id = parseInt(id);

  if(id && id >= 1 && id <= nationalDexCap) {
    let result = await getAllDetails(id);
    res.render('choose', {"pokemon": result.info, "variants": result.variants, "cry": result.cry, "bg": bg, "nationalDexCap": nationalDexCap});
  } else {
    res.render('choose', {"pokemon": "", "variants": "", "cry": "", "bg": bg, "nationalDexCap": nationalDexCap});
  }
});

app.get('/sound', async (req, res) => {
  let bg = bgs[Math.floor(Math.random() * bgs.length)];
  
  let pokemon = [];
  let ids = [];
  let id = 0;
  
  for(let i = 0; i < 4; i++) {
    do {
      id = Math.floor(Math.random() * nationalDexCap) + 1;
    } while (ids.includes(id) || missingCryIDs.includes(id));

    ids.push(id)
    
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
  let result = await getAllDetails(id);

  res.render('spelling', {"pokemon": result.info, "variants": result.variants, "cry": result.cry, "bg": bg});
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`); 
});