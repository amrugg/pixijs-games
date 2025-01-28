function loadArray(array, folder, type){
    /// Loop through the array
    for(let i = 0; i < array.length; i++) {
        /// Make a string that we will change and eventually load with the loader
        let newString = "";
        /// If you give it a folder to load stuff from, so that you don't have to type it all yourself
        if(folder) {
        /// Start with that
        newString += folder;
        if(newString[newString.length - 1] != "/") {
            /// Make sure there's a slash at the end
            newString += "/"
        }
        }
        /// Then add that element
        newString += array[i];
        /// If you want to give it a type and not type that as well
        if(type){
        /// Make sure there's a dot at the end
        if(type[0] != ".") {
            newString += ".";
        }
        /// Add the type
        newString += type;
        }
        /// Load it!
        PIXI.loader.add(newString);
    }
}