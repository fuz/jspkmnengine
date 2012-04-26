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
 * the sourcecode of the map will then be put in the box below.
 * you can put this into tiles.js to add it to the game

I don't currently have the time to document all this but feel free to contact me for any help!

## History

This game was started when I was a kid in 2004/2005 and developed until 2007. In 2008 I re-wrote the game server.

 * This was my first ever real programming project.
 * The coding style is outdated because it was started before the JavaScript craze. (No jQuery for example)
 * this game uses Java sockets to communicate. The Javascript communicates with an applet on the page using LiveConnect.
  * this was back when nobody supported XHR
 * The game's data format is pretty much JSON although some areas do not seem to use Javascript Object Notation.

## ToDo

 * If I were to seriously work on this again, I would:
  * modernize the code base, a lot has changed in the Javascript world since this was written
 * Use AJAX with Node.js as a server, similar to how Pokemon Showdown approaches it. Back when this game was written, it didn't exist.
 * Perhaps integrate the battle engine of Pokemon Online or Pokemon Showdown. That way we'd have a more complete game engine.


