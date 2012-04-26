/**
 * Derived from Sun's chat and socket tutorial.
 */ 
package jspkmne.server;
import java.net.*;
import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Collection;
import java.util.HashSet;


public class JSPKEServer {
    private LoginSystem userDatabase;
    private HashSet<PlayerThread> connections;
    
    public static void main(String[] args) throws IOException {
        new JSPKEServer();
    }

    
    /**
     * Sends to all players that the supplied has moved and needs to be updated
     */
    public synchronized void broadcastMove(Player mover)
    {
        Iterator<PlayerThread> list = connections.iterator();
        
        while( list.hasNext() ) {
            PlayerThread connection = list.next();
            if (connection.getPlayer() != mover) {
                // do not resend broadcast to the moving player!
                connection.sendMove(mover);
            }
        }
    }
    /**
     * Sends to all players that the supplied player has logged out
     */
    public synchronized void broadcastLogout(Player logout)
    {
        Iterator<PlayerThread> list = connections.iterator();
        while( list.hasNext() ) {
            PlayerThread connection = list.next();
            if (connection.getPlayer() != logout) {
                System.out.println("Informing others of logout");
                // do not resend broadcast to the logging out player
                connection.removePlayer(logout);
            }
        }
    }
    
    /**
     * Sends to the specified player that a player has been added.
     */
    
    public synchronized void playerSync(PlayerThread player)
    {
        Collection<Player> players = userDatabase.getLoggedPlayers();
        
        Iterator<Player> playing = players.iterator();
            
        while (playing.hasNext()) {
                Player peer = playing.next();
                if (peer != player.getPlayer() ) {
                    player.addPlayer(peer);
                }
        }
        
        // make sure the data gets sent
        player.send();
    }
    
    /**
     * Tell every player about the joined player.
     */
    
    public synchronized void playerJoined(Player newPlayer)
    {
        Iterator<PlayerThread> users = connections.iterator();
        
        while( users.hasNext() ) {
            PlayerThread user = users.next();
            // only tell players besides the player that joine there is a new player
            if (user.getPlayer() != newPlayer) { 
                user.addPlayer(newPlayer);
                user.send();
            }
        }
        
    }
    
    public JSPKEServer() throws IOException
    {
        userDatabase = new LoginSystem();
        connections = new HashSet<PlayerThread>();

        startServer();
    }
    
    public synchronized void byeConnection(PlayerThread connection)
    {
           System.out.println("Does the list contain it?" + connections.contains(connection));
           System.out.println("Was the thread removed? " + connections.remove(connection));
    }
    
    public synchronized void addConnection(PlayerThread connection) {
        connections.add(connection);   
    }
    
    public void startServer() throws IOException
    {
        ServerSocket serverSocket = null;
        boolean listening = true;
        
        try {
            serverSocket = new ServerSocket(8071);
            System.err.println("Listening on port");
        } catch (IOException e) {
            System.err.println("Could not listen on port: 8071.");
            System.exit(-1);
        }
        
        while (listening) {
            PlayerThread newPlayer = new PlayerThread(userDatabase, this, serverSocket.accept() );
            System.out.println("New connection!");
            playerSync(newPlayer);
            // newPlayer.start();
        }
        
        serverSocket.close();
        }
}
