# Pokémon-Website
This project provides Pokémon quizzes and activities using Node.js.
Resources used are the [RESTful PokéAPI](https://pokeapi.co/) and [PokémonCries](https://pokemoncries.com).

# Follow these steps to run the application:

1) Download [node.js](https://nodejs.org/en/download/) on your system. Downloading with default settings is fine. In your terminal, you can run "node -v" (without the quotes) to verify you installed node successfully and to check the version you have.
2) Download the repository and unzip.
3) Navigate to the project directory in your terminal.
4) Run "npm install", then "node index.js".
5) Navigate to http://localhost:3000/ on your browser.
6) Type ctrl+c in your terminal to stop the server after you are finished.

# Known issues:
1) Fetching unique cries, flavor text, and species for Pokémon that share the same Pokédex number but have different forms is currently impossible with the resources I have. I may have to hard code or make my own API for this to be perfect. 
2) Some Pokemon from Generation 8 and all Pokemon from Generation 9 are missing their cries until/if the owner of [PokémonCries](https://pokemoncries.com) updates their site in the future or if I find another API.
3) Pokémon without cries can show up on the Sound Quiz.
4) Favicon is way too small.
