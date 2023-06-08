//formats names
const capitalize = (text) => {

  let testSpecial = specialCapitalize(text);
  if(testSpecial) {
    return testSpecial;
  }
  
  let specialPokemon = ["ho-oh", "jangmo-o", "hakamo-o", "kommo-o"];
  
  if(text.indexOf('-') == -1 || specialPokemon.includes(text.toLowerCase())) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  if(text.toLowerCase() == "porygon-z") {
    return text.charAt(0).toUpperCase() + text.slice(1, text.length - 1) + text.slice(-1).toUpperCase();
  }
  
  let arr = text.split('-');
  for(let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join(" ");
}

//special cases that need to be dealt with specifically
const specialCapitalize = (text) => {
  if (text == "farfetchd") {
    return "Farfetch'd";
  }

  if(text == "farfetchd-galar") {
    return "Farfetch'd Galar";
  }

  if(text == "oricorio-pau") {
    return "Oricorio Pa'u";
  }

  if(text == "oricorio-pom-pom") {
    return "Oricorio Pom-Pom";
  }

  if (text.includes("basculin") && text.indexOf('-') != -1) {
    let arr = text.split('-');
    return "Basculin " + capitalize(arr[1]) + "-" + capitalize(arr[2]);
  }

  if(text == "type-null") {
    return "Type: Null";
  }

  if(text == "zygarde-50") {
    return "Zygarde 50%";
  }

  if(text == "zygarde-10-power-construct") {
    return "Zygarde 10% Power Construct";
   }

  if(text == "zygarde-50-power-construct") {
    return "Zygarde 50% Power Construct";
  }

  if(text == "zygarde-10") {
    return "Zygarde 10%";
  }

  if(text == "mr-mime") {
    return "Mr. Mime";
  }

  if(text == "mr-mime-galar") {
    return "Mr. Mime Galar";
  }

  return "";
}

//gets types of input pokemon
const getTypes = (types) => {
  let name = types[0].type.name;
  let res = `<img src="img/types/${name}.png" class="typeIcon">` + capitalize(name);
  if(types.length > 1) {
    name = types[1].type.name;
    res += " / " + `<img src="img/types/${name}.png" class="typeIcon">` + capitalize(name);
  }
  return res;
}

//gets abilities of input pokemon
const getAbilities = (abilities) => {
  let res = capitalize(abilities[0].ability.name);
  if(abilities.length > 1) {
    for(let i = 1; i < abilities.length; i++) {
      res += ", " + capitalize(abilities[i].ability.name);
    }
  }
  return res;
}

//get genus of input pokemon
const getGenus = (genera) => {
  for(let i = 0; i < genera.length; i++) {
    if(genera[i].language.name == "en") {
      return genera[i].genus;
    }
  }
}

//get height of input pokemon
const getHeight = (height) => {
  return height.toFixed(1) + " m";
}

//gets weight of input pokemon
const getWeight = (weight) => {
  return weight.toFixed(1) + " kg";
}

//gets first English flavor text
const getFlavorText = (entries) => {
  let size = entries.length;
  while(true) {
    let num = Math.floor(Math.random() * size);
    if(entries[num].language.name == "en")
      return filterFlavorText(entries[num].flavor_text);
  }
}

//get rid of special characters in flavor text
const filterFlavorText = (text) => {
  text = text.replace(/[^a-zA-Z0-9'’".,:;é—-]/g, " ");
  let arr = text.split(" ");
  let res = "";
  arr.forEach((x) => {
    if(x.length > 1 && x[0] == x[0].toUpperCase() && x[1] == x[1].toUpperCase()) {
      res = res.concat(res.length == 0 ? "":" ", x[0].concat(x.slice(1).toLowerCase()));
    }
    else {
      res = res.concat(res.length == 0 ? "":" ", x);
    }
  });
  return res;
}

//pads dex num with 0s
const pad = (id) => {
  if(Math.floor(id/10) == 0)
    return "000" + id;
  else if(Math.floor(id/10) < 10)
    return "00" + id;
  else if(Math.floor(id/10) < 100)
    return "0" + id;
  return id;
}

//changes to variant tab
const changeToVariant = (variant, id, hasVariants) => {

  //returns if current tab is selected
  if (hasVariants && id == document.getElementById("tabRow").getAttribute("data-value")) {
    return;
  }

  if (id == 0) {
    document.getElementById("genus").innerText = "Species: " + variant.genera;
    document.getElementById("flavorText").innerText = variant.flavorText;
  }

  changeShinySprite(variant);
  document.getElementById("type").innerHTML = "Type: " + getTypes(variant.types);
  document.getElementById("height").innerText = "Height: " + getHeight(variant.height);
  document.getElementById("weight").innerText = "Weight: " + getWeight(variant.weight);
  document.getElementById("abilities").innerText = "Abilities: " + getAbilities(variant.abilities);
  if (hasVariants) {
    document.getElementById("tabRow").setAttribute("data-value", id);
  }
}

//sets sprite to current shiny status
const changeShinySprite = (variant) => {
    if (document.getElementById("shinyBtn").getAttribute("data-value") == "nonShiny") {
      document.getElementById("sprite").src = variant.sprite;
    } else {
      fetch(variant.shinySprite)
        .then(function (response) {
          if (response.ok) {
            document.getElementById("sprite").src = variant.shinySprite
          } else {
              document.getElementById("sprite").src = variant.sprite
          }
        })
        .catch(function (error) {
          console.log("Error occurred while fetching the image URL:", error);
        });
    }
}

//changes sprite to opposite of current shiny status
const onShinyBtnClick = (variant) => {
    let shinyBtn = document.getElementById("shinyBtn");
    if (shinyBtn.getAttribute("data-value") == "nonShiny") {
      shinyBtn.setAttribute("src", "/img/shinyIconBlue.png");
      shinyBtn.setAttribute("data-value", "shiny");

      fetch(variant.shinySprite)
        .then(function (response) {
          if (response.ok) {
            document.getElementById("sprite").src = variant.shinySprite
          } else {
              document.getElementById("sprite").src = variant.sprite
          }
        })
        .catch(function (error) {
          console.log("Error occurred while fetching the image URL:", error);
        });
    } else {
      shinyBtn.setAttribute("src", "/img/shinyIcon.png");
      shinyBtn.setAttribute("data-value", "nonShiny");
      console.log(document.getElementById("sprite").src = variant.sprite);
    }
}

export {capitalize, getGenus, getFlavorText, pad, changeToVariant, onShinyBtnClick}