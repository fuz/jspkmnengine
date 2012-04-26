package jspkmne.server;
/**
 * Enumeration class GameSyntax - write a description of the enum class here
 * 
 * @author (your name here)
 * @version (version number or date here)
 */
public enum GameSyntax
{
    AwaitingLogon,
    Login,
    Authenticated,
    PlayerUpdate,
    Logout,
    LoginFailure,
    RemoteMove,
    RemoteRemove,
    PlayerSync,
    AddPlayer,
    PlayerMove,
    Error;
    
    GameSyntax()
    {
        
    }
}
