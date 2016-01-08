Dim alCount
Dim oneLine()
Set objFSO = CreateObject("Scripting.FileSystemObject")

Set itemFile = objFSO.OpenTextFile("items.txt", 1)
Set jslistFile = objFSO.OpenTextFile("itemsjs.txt", 2, true)
jslistFile.Write ""
Set jslistFile = Nothing


Set jslistFile = objFSO.OpenTextFile("itemsjs.txt", 8)
alCount = 001

jslistFile.WriteLine("poke_item=new Array([""Item Name""],")
Do Until itemFile.AtEndOfStream
curLine = itemFile.ReadLine
jslistFile.WriteLine("[""" & curLine & """],")

'alCount = alCount + 1
Loop





itemFile.Close
jslistFile.Close