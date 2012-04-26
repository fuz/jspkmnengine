## JS PKMN Engine

This is a Javascript Pokemon Game Engine. You can see a video of its capabilities in videos/

## Progress
 * old but modular code
 * load and savegames
 * tile system with solid and interactable objects
 * path finding - click where you want to walk
 * the battle engine is incomplete but some battle formulas are present. Damage attacks seem to work with type effectiveness. There are no non-damage effects yet.

## Tiling

Tiling works a bit differently in JSPKMNe. Rather than the game compose a game map from lots of individual pieces, we overlay information about the game environment on a large picture. This way a tile is just a large picture and the game can just use the exported tiles of the video games.

To add information to the tile you:

 * click 'toggle devmode'
 * click somewhere on the map
 * select the object that is there, such as a tree, a rock
 * click 'load tile'
 * the object is now solid (try walking on it)

## History

This game was started in 2004 and developed until 2007. In 2008 I re-wrote the game server.

 * this game uses Java sockets to communicate. The Javascript communicates with an applet on the page using LiveConnect.
 * The game's data format is pretty much JSON.

## ToDo

 * If I were to seriously work on this again, I would:
  * modernize the code base, a lot has changed in the Javascript world since this was written
 * Use AJAX with Node.js as a server, similar to how Pokemon Showdown approaches it. Back when this game was written, it didn't exist.
 * Perhaps integrate the battle engine of Pokemon Online or Pokemon Showdown. That way we'd have a more complete game engine.
o


