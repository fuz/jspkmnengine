package jspkmne.server;
/**
 * Represents a player in the JSPKME game world
 * 
 */
public class Player
{
    
    private String username;
    private int x;
    private int y;
    private int map;

    /**
     * Constructor for objects of class Player
     */
    public Player(String username, int map, int x, int y)
    {
        this.username = username;
        this.x = x;
        this.y = y;
        this.map = map;
    }
    
    public String getName() 
    {
        return username;   
    }
    
    public int getMap()
    {
        return map;   
    }
    
    public int getX()
    {
        return x;
    }
    
    public int getY()
    {
        return y;   
    }
    
    public void updateXY(int x, int y)
    {
        this.x = x;
        this.y = y;
    }
}
