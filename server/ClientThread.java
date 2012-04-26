package jspkmne.server;
import java.net.*;
import java.io.*;
import netscape.javascript.* ;

public class ClientThread extends Thread
{
    
    protected DataOutputStream out ;
    protected DataInputStream in ;
    protected JSObject game;
    protected boolean shouldListen;
    protected JSPKEClient manager;
    protected String player;
    
    public ClientThread(DataInputStream in,
		   	DataOutputStream out, JSObject game,
		       	String player, JSPKEClient manager)
    {
	this.manager = manager;
        this.player = player;
        this.game = game;
        this.in = in;
        this.out = out;
        this.shouldListen = true;
    }

    /**
     * The player wants to move.
     */
    
    public void move(int x, int y)
    {
        try {
            out.writeInt( GameSyntax.PlayerMove.ordinal() );
            out.writeInt(x);
            out.writeInt(y);
            out.flush();
        } catch (IOException e) {
            System.out.println("Attempt movement: " + e.getMessage());   
        }
    }
    
    public void remoteMove()
    {
        try {
            String username = in.readUTF();
            int x = in.readInt();
            int map = 0;
            int y = in.readInt();
            // this will queue from within the javascript hopefully
            game.call("moveNetPlayer",  new Object[] {username, map, x, y } );
            
        } catch(IOException e) {
            System.out.println("Error receiving remote movement data. Server crashed?");   
	    shouldListen = false;
        }
    }
    
    public void addPlayer() throws IOException
    {
        String username = in.readUTF();
        int map = in.readInt();
        int x = in.readInt();
        int y = in.readInt();
        System.out.println("Added player on server " + username + " on t" + map + " at " + x + "," + y);
        
        game.call("addNetPlayer",  new Object[] {username, map, x, y } );
    }

    public void removePlayer() throws IOException
    {
        String username = in.readUTF();
        System.out.println("Removing player from server ");
        
        game.call("removeNetPlayer",  new Object[] { username } );
    }
    
    public void run()
    {
        try {
             while(shouldListen) {
            
                synchronized (this) {
                int mode = in.readInt() ;
                
		// we've received our logout packet
		if (mode == GameSyntax.Logout.ordinal() ) {
			
			game.call("disconnect", new Object[] {});
			shouldListen = false;
			manager.disconnect();		
		}

                if (mode == GameSyntax.PlayerSync.ordinal() ) {
                    addPlayer();
                }
                
                if (mode == GameSyntax.RemoteMove.ordinal() ) {
                    remoteMove();
                }
                
                if (mode == GameSyntax.PlayerUpdate.ordinal() ) {
                    int map = in.readInt();
                    int x = in.readInt();
                    int y = in.readInt();
                    System.out.println("Updating player position");
                    game.call("initLoggedPlayer",  new Object[] {player, map, x, y } );
                }
                
                if (mode == GameSyntax.RemoteRemove.ordinal() ) {
                    removePlayer();
                }
            
            
            } // synchronization for threading
            }
	
        } catch (InterruptedIOException iioe) {
		System.err.println ("Remote host not sending any more or timeout.");
		shouldListen = false;
	    
        }
        catch (IOException e) {
		System.out.println(e.getMessage() );
		shouldListen = false;	
        }
	System.out.println("Player session completed.");
	game.call("disconnect", new Object[] {});
    }

}
