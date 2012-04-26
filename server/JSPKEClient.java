/**
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
import java.applet.* ;
import java.net.*;
import java.io.*;
import netscape.javascript.* ;
import java.applet.*;
import java.awt.*;

public class JSPKEClient extends Applet {
    private String host;
    private boolean shouldListen = true ;
    protected ClientThread Listener ;
    public JSObject Client ;
    private Socket socket ;
    
    
    protected DataOutputStream out ;
    protected DataInputStream in ;
    
    private String player;
    
    public void init() {
        System.out.println("Loading threaded client \n") ;
        host = getCodeBase().getHost();
        Client = JSObject.getWindow(this) ;
        
    }
    
    public boolean connect()
    {
        try {
            socket = new Socket(host, 8071);
            out = new DataOutputStream (new BufferedOutputStream (socket.getOutputStream ()));
            in = new DataInputStream (new BufferedInputStream (socket.getInputStream ()));
            // socket.setSoTimeout(500);
            System.out.println("Connected to server.") ;
        } catch (IOException e) {
            System.out.println("Could not connect to server.");
            return false ;
        }
            return true ;
    }
    
    public boolean move_player(int x, int y )
    {
        System.out.println("Sending move");
        Listener.move(x,y);
        return true;
    }
    
     public void destroy() {
        shouldListen = false ;
        Listener = null ;
     }
    

    
    public void listen()
    { 
        System.out.println("Listening for game activity!") ;
        // listen for game activity
        shouldListen = true ;
        Listener = new ClientThread(in, out, Client, player, this);
        // main game loop
        Listener.start();
        
    }
    
    public void logout()
    {
        try {
            out.writeInt( GameSyntax.Logout.ordinal() );
            out.flush();
	    System.err.println("Disconnected.");
        } catch (IOException e) {
            System.out.println("Could not logout?" + e.getMessage());
        }
    }

    public void disconnect() {
	try {
	    System.err.println("Disconnected.");
            out.close();
            in.close();
            socket.close();
            destroy();
            player = null;
        } catch (IOException e) {
            System.out.println("Could not logout?" + e.getMessage());
        }

    }
    
    public boolean login(String username, String password)
    {
        if ( !connect() ) {
            return false;
        }
        try {
            out.writeInt( GameSyntax.Login.ordinal() );
            out.writeUTF(username);
            out.writeUTF(password);
            out.flush();
            int mode = in.readInt();
            
            if (mode == GameSyntax.Authenticated.ordinal() ) {
                    System.out.println("Authenticated") ;
                    player = username;
                    listen() ;
                    return true ;
            }
            return false;
        }
        catch (IOException e) {
            badLogin();
            return false;
        }
    }
    public void badLogin()
    {
        try {
            System.out.println("Login failure.");
            socket.close();
            in.close();
            out.close();
        } catch (IOException e) {
            System.out.println("Could not even close formally");
        }
    }
    
}
