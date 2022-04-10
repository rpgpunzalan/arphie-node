module.exports = (myArray, key, searchVal) => {
    return myArray.map((item) => {
        if(item[key] == searchVal) {
            return item;
        }
        return null;
    })
}