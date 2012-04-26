package jspkmne.server;
/**
 * Creates connection to database and logs in a user
 * 
 * @author fuz
 * @version (a version number or a date)
 */
import java.sql.*;
import java.security.* ;
import org.apache.commons.codec.binary.Base64;
import java.util.HashMap;
import java.util.Collection;

public class LoginSystem
{
    private static int startingMap = 0;
    private static int startX = 65;
    private static int startY = 70;
    private Connection connect;
    private Statement statement;
    private ResultSet resultSet;
    
    /**
     * This class should not have a reference to the threads because it should deal exclusively with SQL
     * but I cannot think of a way to quickly make this clean right now.
     */    
    private HashMap<String, Player> players;
   
    public void addPlayer(Player newPlayer)
    {
        players.put( newPlayer.getName(), newPlayer );
    }

    public Collection<Player> getLoggedPlayers()
    {
        return players.values();
    }
    
    public LoginSystem()
    {
        players = new HashMap<String, Player>();
        try {
            String database = System.getProperty("jspkmne.data"); 
            if (database == null) {
                throw new IllegalArgumentException("You have not configured the database for JSPkmne. Use -Djspkmne.data=<JDBC configuration>"); 
	    }
	    Class.forName("com.mysql.jdbc.Driver");
            connect = DriverManager
                    .getConnection(database);
                        
        }
        catch (SQLException e) {
            System.err.println ("Error message: " + e.getMessage ());
               System.err.println ("Error number: " + e.getErrorCode ());
        }
        catch (ClassNotFoundException e) {
            System.out.println("JDBC not installed");
        }
    }
    
    public Player login(String username, String password)
    {
        Player player = null;
        // player already logged in
        if ( players.containsKey(username) ) {
            System.out.println("Player already logged in! " + username);
            return player;   
        }
        try {
            ResultSet userData;
            PreparedStatement sql;
            
            sql = connect.prepareStatement("SELECT * FROM users WHERE username = ? AND password = ?") ;
            sql.setString(1, username) ;
            sql.setString(2, encrypt(password));
            
            userData = sql.executeQuery();
            if (userData.next() ) {
                player = loadPlayer(userData);
                // this player is being logged in
                addPlayer(player);
            }
        }
         catch (SQLException e) {
            System.err.println ("Error message: " + e.getMessage ());
            System.err.println ("Error number: " + e.getErrorCode ());
        }
        return player;
    }
    
    public void logout(Player player)
    {
        System.out.println("Logging out player... " + players.remove( player.getName() ));
    }
    
    public Player loadPlayer(ResultSet userData) throws SQLException
    {
        String username = userData.getString("username");
        int map = userData.getInt("map");
        int x = userData.getInt("x");
        int y = userData.getInt("y");
        System.out.println("Loading " + username + " on tile " + map + " " + x + "," + y);
        return new Player(username, map, x, y);
    }
    
    public void saveCharacter(Player player)
    {
        try {
            PreparedStatement sql;
            sql = connect.prepareStatement("UPDATE users SET map=?, x=?, y=? WHERE username=?") ;
         
            sql.setInt(1, player.getMap() ) ;
            sql.setInt(2, player.getX() ) ;
            sql.setInt(3, player.getY() ) ;
            sql.setString(4, player.getName() );
            
            sql.executeUpdate();
        }
        catch (SQLException o) {
            System.out.println(o.getMessage());   
        }
    }
    
    public Player newCharacter(String username, String password)
    {
        // assume creation failed
        Player player = null;
        try {
            PreparedStatement sql;
            ResultSet existingUsers;
            
            sql = connect.prepareStatement("SELECT users.username FROM users WHERE username = ?") ;
            sql.setString(1, username) ;
            
            existingUsers = sql.executeQuery();
            
            String hashPassword = encrypt(password);
            System.out.println("Generated password: " + hashPassword);
            
            if (! existingUsers.next() ) {
                
                System.out.println("Creating user");
                sql = connect.prepareStatement("INSERT INTO users (username, password, map, x, y) VALUES (?, ?, ?, ?, ?)") ;
                sql.setString(1, username);
                sql.setString(2, hashPassword) ;
                
                sql.setInt(3, startingMap) ;
                sql.setInt(4, startX) ;
                sql.setInt(5, startY) ;
                
                sql.executeUpdate();
                player = new Player(username, startingMap, startX, startY);
            }
            
        } catch (SQLException e) {
            System.err.println ("Error message: " + e.getMessage ());
               System.err.println ("Error number: " + e.getErrorCode ());
        }
        
        return player;
    }
    
    
    public synchronized String encrypt(String plaintext) {
        // from
        // http://www.devarticles.com/c/a/Java/Password-Encryption-Rationale-and-Java-Example/
        MessageDigest md = null;
        try {
          md = MessageDigest.getInstance("SHA-256");
          md.update(plaintext.getBytes("UTF-8"));
    
        byte raw[] = md.digest(); //step 4
        String hash = new String(new Base64().encodeBase64(raw)) ; //step 5
        return hash ; //step 6
        }
        catch(Exception e) {
            
        }
        return "" ;
    }
}
