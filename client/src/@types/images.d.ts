// If you try to load in an image of type "png" you will get an error. This is because
// by default TypeScript does not know what a image of type png is. Its unknown to it.
// So to make sure TypeScript doesn't complain we add the following code. Notice how
// we also named the file "images.d.ts" instead of "images.ts" this is because we want
// TypeScript to recognize this file as type information. By setting it so "images.ts"
// TypeScript just thinks this is a regular module.

declare module '*.png' { // Here I am saying I would like to edit the type data regarding images of type "png"
    const value: string; // makes it so that when you import a .png file, it will be treated as a string. The string represents the path to the image file.
    export default value; // allows you to use the image path as a default export when you import the .png file in your code.
}

declare module '*jpeg' {
    const value: string;
    export default value;
}

declare module '*jpg' {
    const value: string;
    export default value;
}