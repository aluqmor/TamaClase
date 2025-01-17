const MapHandler = {
    init : (mapper) => {
        console.log(mapper.map.size);
        const currentMap = [];
        for (let i = 0; i < mapper.map.size; i++) {
            const row = [];
            for (let j = 0; j < mapper.map.size; j++) {
                //create the map
                row.push(0);
            }
            currentMap.push(row);
            console.log(row);
        }
        
        mapper.map.elements.forEach(element => {
            currentMap[element.x][element.y] = 5;
        });
        console.log(currentMap);
    }
}

export default MapHandler;