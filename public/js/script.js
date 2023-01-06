//formats names
const capitalize = (text) => {
  if(text.indexOf('-') == -1) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  
  let arr = text.split('-');
  for(let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join(" ");
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
    if(genera[i].language.name == "en")
      return genera[i].genus;
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
const changeToVariantMiddle = (variant, isOriginal) => {
  if(isOriginal) {
    document.getElementById("sprite").src = variant.sprite;
    document.getElementById("genus").innerText = "Species: " + variant.genera;
    document.getElementById("flavorText").innerText = variant.flavorText;
  }

  else {
    $.get(variant.sprite).done(function () {
      document.getElementById("sprite").src = variant.sprite;
    });
  }
  
  document.getElementById("type").innerHTML = "Type: " + getTypes(variant.types);
  document.getElementById("height").innerText = "Height: " + getHeight(variant.height);
  document.getElementById("weight").innerText = "Weight: " + getWeight(variant.weight);
  document.getElementById("abilities").innerText = "Abilities: " + getAbilities(variant.abilities);
}

export {capitalize, getGenus, getFlavorText, pad, changeToVariantMiddle}