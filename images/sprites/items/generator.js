function itemList() {

curLine = new Array() ;


var itemList = fso.openTextFile("items.txt",1) ;
datafile.write("\r\n") ;
datafile.writeline("var poke_items = new Array([\"Item Name\"],") ;
while (!itemList.AtEndOfStream)
	{
 curLine[curLine.length] = "[\"" + itemList.readline() + "\"]," ;
	}


w= curLine.length - 1
curLine[w] = curLine[w].substring(0,curLine[w].length-1)


for (n in curLine) {
	datafile.writeline(curLine[n]) ;
	}
datafile.writeline(") ;") ;
}