/**
 * The PlayerThread is per-user and receives and issues commands from players. This does waste resources unfortunately. 
 * This code has been derived from Sun example code.
 * With changes by Fuz, JSPKE
 * Copyright (c) 1995 - 2008 Sun Microsystems, Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 *   - Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *
 *   - Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 *   - Neither the name of Sun Microsystems nor the names of its
 *     contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */ 

package jspkmne.server;
import java.net.*;
import java.io.*;

public class PlayerThread extends Thread {
    private Socket socket = null;
    private DataOutputStream out;
    private DataInputStream in;
    private LoginSystem game;
    private Player player;
    private JSPKEServer server;
    private boolean active;
    
    public PlayerThread(LoginSystem game, JSPKEServer server, Socket socket) {
        
        this.active = true;
        this.socket = socket;
        this.server = server;
        this.game = game;
        server.addConnection(this);
        try {
            
            out = new DataOutputStream( new BufferedOutputStream(socket.getOutputStream ()) );
            in = new DataInputStream( new BufferedInputStream(socket.getInputStream ()) );
            // socket.setSoTimeout (10000);

            tryLogin();
        }
        catch (InterruptedIOException iioe) {
            endConnection();
        } 
        catch (IOException e) {
            System.out.println("Could not create streams: " + e.getMessage());
        }
        
    }
   
    private void endConnection()
    {
        try {
            game.logout(player);
            server.byeConnection(this);
            out.close();
            in.close();
            socket.close();
        }
        catch (IOException e) {
            System.out.print("Could not end because " + e.getMessage());
        }
    }
    
    private void tryLogin()
    {
        try {
            int mode = in.readInt();
            // incorrect mode
            if (mode != GameSyntax.Login.ordinal()) {
		System.out.println("Out of sync: Didn't send login.");
                loginFailure();
                return;
            }
            String username = in.readUTF();
            String password = in.readUTF();
            System.out.println("Login attempt: " + username);
            
            Player newLogin = game.login(username, password);
            
            // it's a successful login
            if (newLogin != null) {
                // must come before upatePlayer etc (messy temporal coupling)
                player = newLogin;
                
                out.writeInt(GameSyntax.Authenticated.ordinal() );
                send();
                
                System.out.println(username + " authenticated!");
                updatePlayer();
                server.playerJoined(newLogin);
                start();
            } else {
                loginFailure();
            }
        
        }
        
        catch (InterruptedIOException iioe) {
            server.byeConnection(this);
        } 
        
        catch (IOException e) {
            System.out.println("Client goof on login: " + e.getMessage());
            server.byeConnection(this);
        }
    
    }
    
    public void updatePlayer() throws IOException
    {
        System.out.println(String.format("Updating position for [%s].", player.getName()));
        out.writeInt( GameSyntax.PlayerUpdate.ordinal() );
        out.writeInt( player.getMap() );
        out.writeInt( player.getX());
        out.writeInt( player.getY() );
        out.flush();
    }
    
    public void loginFailure() throws IOException {
        System.out.println("Bad login. Cleaning up");
        out.close();
        in.close();
        socket.close();
        server.byeConnection(this);
    }  
    
    public void playerMove() throws IOException {
        int x = in.readInt();
        int y = in.readInt();
        player.updateXY(x,y);
        System.out.println(String.format(
	"Player move to %d:%d [%s]", x, y, player.getName()
		       ));
        game.saveCharacter(player);
    }
    
    public void sendMove(Player mover)
    {
        try {
            
            out.writeInt(GameSyntax.RemoteMove.ordinal());
            out.writeUTF( mover.getName() );
            out.writeInt( mover.getX() );
            out.writeInt( mover.getY() );
            out.flush();
        } catch (IOException e) {
            System.out.println("Error sending move of a logged player:" + e.getMessage() );
        }
    }
    
    public void send()
    {
        try {
            out.flush();
        } catch( IOException e) {
            System.out.println("Connection disappeared between writing data and flushing it: " + e.getMessage() );   
        }
        
    }
    
    public Player getPlayer()
    {
        return player;   
    }
    
    public void addPlayer(Player newPlayer)
    {
        try {
            out.writeInt(GameSyntax.PlayerSync.ordinal());
            out.writeUTF(newPlayer.getName() );
            out.writeInt( newPlayer.getMap() );
            out.writeInt( newPlayer.getX() );
            out.writeInt( newPlayer.getY() );
        // needs to be flushed outside of this method!
        } catch(IOException e) {
            System.out.println("Error adding player to user's game: " + e.getMessage() );   
        }
    }
    
    public void removePlayer(Player newPlayer)
    {
        try {
            out.writeInt( GameSyntax.RemoteRemove.ordinal() );
            out.writeUTF(newPlayer.getName() );
            out.flush();
        // needs to be flushed outside of this method!
        } catch(IOException e) {
            System.out.println("Error removing player: " + newPlayer.getName() + " from " + player.getName() );
            System.out.println(e.getMessage());
        }
    }
    
    public void logout() {
	try {
		System.out.println("Logout echo.");
		// echo back logout 
		out.writeInt( GameSyntax.Logout.ordinal() );
		out.flush();
	} catch(IOException e) {
		System.out.println("Logout echo " + player.getName() + " failed.");
		System.out.println(e.getMessage());
        }
    }
    
    public void run() {
        
        try {
            while(active) {
                int mode = in.readInt();
                
                if (mode == GameSyntax.PlayerMove.ordinal() ) {
                    // update the player's own data
                    playerMove();
                    // tell everyone else we've moved
                    server.broadcastMove(player);
                }
                
                if (mode == GameSyntax.Logout.ordinal() ) {
                    System.out.println("Player " + player.getName() + " logging out.");
		    logout();
                    server.broadcastLogout(player);
                    endConnection();
		    active = false;
                    return;
                }
                
            }
        }
        catch (InterruptedIOException iioe) {
            System.out.println("Timeout man!");
            endConnection();
        } 
        
        catch (IOException e) {
            endConnection();
            System.out.println("Error in thread loop: " + e.getMessage() );
            /*out.close();
            in.close();
            socket.close();
            e.printStackTrace(); */
        }
    }
}
