//User-Defined Type Guard example
function isString(value: any): value is string {
    return typeof value === 'string';
}
// Usage
const input: any = "Hello, World!";
if (isString(input)) {
    console.log(input.toUpperCase()); // Safe to use string methods
} else {
    console.log("Input is not a string.");
}



//Function Overloading example
function combine(a: string, b: string): string;
function combine(a: number, b: number): number; 
function combine(a: any, b: any): any {
    return a + b;
}   
// Usage
const combinedString = combine("Hello, ", "World!");
console.log(combinedString); // Output: Hello, World!   
const combinedNumber = combine(10, 20);
console.log(combinedNumber); // Output: 30  



//Nullable Types example
function greet(name: string | null): string {
    if (name === null) {    
        return "Hello, Guest!";
    } else {
        return `Hello, ${name}!`;
    }
}
// Usage
console.log(greet("Alice")); // Output: Hello, Alice!
console.log(greet(null));    // Output: Hello, Guest!



//type assertion example explicitly tell the compiler to treat a value as a specific type when you know more about it than TypeScript can infer
let someValue: any = "This is a string";
let strLength: number = (someValue as string).length;
console.log(`String length: ${strLength}`); // Output: String length: 16    



//Non-null assertion operator example
function printLength(str?: string) {
    console.log(`Length: ${str!.length}`); // Assert that str is not null or undefined
}   
printLength("Hello"); // Output: Length: 5
//printLength(); // Runtime error if uncommented



//Index Types example  indexers allow you to access properties of a type dynamically using bracket notation. 
type Person1 = {
 age: number;
 name: string;
 alive: boolean;
};
// Access a single property type
type Age = Person1["age"]; // number
// Access multiple property types
type NameOrAge = Person1["name" | "age"]; // string | number
// Access all property types
type AllProps = Person1[keyof Person1]; // string | number | boolean    

interface Person {
    name: string;
    age: number;
}
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}
const person: Person = { name: "John", age: 30 };
const personName = getProperty(person, "name");
console.log(`Name: ${personName}`); // Output: Name: John



//Mapped Types example
type ReadonlyPerson = {
    readonly [K in keyof Person]: Person[K];
};      
const readonlyPerson: ReadonlyPerson = { name: "Jane", age: 25 };
//readonlyPerson.age = 26; // Error: Cannot assign to 'age' because it is a read-only property
console.log(`Readonly Person: ${readonlyPerson.name}, ${readonlyPerson.age}`); // Output: Readonly Person: Jane, 25


//Partial Type example
type PartialPerson = {
    [K in keyof Person]?: Person[K];
};      
const partialPerson: PartialPerson = { name: "Mike" };