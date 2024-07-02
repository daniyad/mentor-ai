import { DialogueNode } from "../../types/dialogue-tree";

// Define a map where the keys are problem IDs and the values are the corresponding nodes
export const problemNodesMap: { [key: string]: DialogueNode[] } = {
    1: [
        {
            id: "root",
            userQuestionText: 'You can ask me any questions you like!',
            parentIds: []
        },
        {
            id: "test-llm",
            content: {
                type: "LARGE_LANGUAGE_MODEL",
                prompt:
                    `
                        Provide a concise explanation and only Python code snippet for a 'Hello World' program. 
                        Structure your response with a brief explanation followed by the Python code in a Markdown code block on the next line.
                    `
            },
            userQuestionText: "Ask the LLM how to write Hello World",
            parentIds: ["root", "ask-how", "explain-print"]
        },
        {
            id: "ask-how",
            content: {
                type: "TEXT",
                text: 'To write "Hello World" in Python, you can use the print function.',
            },
            userQuestionText: 'Can you show me exactly what I need to do?',
            parentIds: ["root", "explain-print"]
        },
        {
            id: "explain-print",
            content: {
                type: "TEXT",
                text: "The print function in Python outputs text to the console.",
            },
            userQuestionText: "Can you explain what does the print function do?",
            parentIds: ["root", "ask-how"]
        },
    ],
    2: [
        {
            id: "root",
            userQuestionText: "You can ask me any questions you like!",
            parentIds: []
        },
        {
            id: "explain-variable",
            content: {
                type: "TEXT",
                text: "A variable is like a container where you can store a value. You give it a name, and then you can use this name to access the value stored in it.",
            },
            userQuestionText: "Can you explain what a variable is?",
            parentIds: ["root", "ask-why"]
        },
        {
            id: "explain-assign",
            content: {
                type: "TEXT",
                text: "To assign a value to a variable, you use the assignment operator `=`. For example, `magic_number = 3` assigns the value 3 to the variable named `magic_number`.",
            },
            userQuestionText: "How do I assign a value to a variable?",
            parentIds: ["root", "explain-variable", "ask-why"]
        },
        {
            id: "explain-print",
            content: {
                type: "TEXT",
                text: "The `print` function in Python outputs the value of a variable or a message to the console. For example, `print(magic_number)` will display the value of `magic_number`.",
            },
            userQuestionText: "Can you explain what does the print function do?",
            parentIds: ["root", "explain-variable", "explain-assign", "ask-why"]
        },
        {
            id: "ask-why",
            content: {
                type: "TEXT",
                text: "Variables are essential because they allow you to store and reuse information in your program. They make your code more flexible and easier to understand.",
            },
            userQuestionText: "Why do we use variables?",
            parentIds: ["root", "explain-variable", "explain-assign", "explain-print"]
        },
        {
            id: "hint",
            content: {
                type: "LARGE_LANGUAGE_MODEL",
                prompt: "Provide a hint for creating a variable named `magic_number` and assigning it the value 3, followed by printing this variable, without giving away the complete solution. Guide the user on the steps they need to take.",
            },
            userQuestionText: "I'm stuck. Can you give me a hint?",
            parentIds: ["root", "explain-variable", "explain-assign", "explain-print", "ask-why"]
        }
    ],
    3: [
        {
            id: "root",
            userQuestionText: "You can ask me any questions you like!",
            parentIds: []
        },
        {
            id: "explain-data-types",
            content: {
                type: "TEXT",
                text: "In Python, data types are categories for data that determine the operations you can perform on them and the storage method. Common data types include int for integers, float for floating-point numbers, and str for textual data.",
            },
            userQuestionText: "What are data types?",
            parentIds: ["root"]
        },
        {
            id: "explain-int",
            content: {
                type: "TEXT",
                text: "An int is a data type used to represent whole numbers. For example, 5 and -3 are integers.",
            },
            userQuestionText: "What is an int?",
            parentIds: ["root", "explain-data-types"]
        },
        {
            id: "explain-float",
            content: {
                type: "TEXT",
                text: "A float is a data type used to represent numbers with decimal points. For example, 5.0 and -3.14 are floats.",
            },
            userQuestionText: "What is a float?",
            parentIds: ["root", "explain-data-types"]
        },
        {
            id: "explain-str",
            content: {
                type: "TEXT",
                text: "A str is a data type used to represent sequences of characters, such as words or sentences. For example, 'hello' and 'Python' are strings.",
            },
            userQuestionText: "What is a str?",
            parentIds: ["root", "explain-data-types"]
        },
        {
            id: "explain-boolean",
            content: {
                type: "TEXT",
                text: "A boolean is a data type that can only have two values: True or False. Booleans are used to evaluate logical conditions.",
            },
            userQuestionText: "What is a boolean?",
            parentIds: ["root", "explain-data-types"]
        },
        {
            id: "hint",
            content: {
                type: "LARGE_LANGUAGE_MODEL",
                prompt: "Provide a hint for creating and printing variables of different data types (string, float, int) without giving away the complete solution. Guide the user on the steps they need to take.",
            },
            userQuestionText: "I'm stuck. Can you give me a hint?",
            parentIds: ["root", "explain-data-types", "explain-int", "explain-float", "explain-str", "explain-boolean"]
        }
    ],    
    4 : [
        {
            id: "root",
            userQuestionText: "You can ask me any questions you like!",
            parentIds: [],
        },
        {
            id: "explain-list",
            content: {
                type: "TEXT",
                text: "A list is a collection of items in a particular order. You can store multiple items in a single variable using a list.",
            },
            userQuestionText: "What is a list?",
            parentIds: ["root"],
        },
        {
            id: "explain-append",
            content: {
                type: "TEXT",
                text: "The `append` method adds an item to the end of a list. For example, `my_list.append(3)` adds the number 3 to the end of `my_list`.",
            },
            userQuestionText: "How do I add items to a list?",
            parentIds: ["root", "explain-list"],
        },
        {
            id: "explain-access",
            content: {
                type: "TEXT",
                text: "You can access items in a list using their index, which starts at 0. For example, `my_list[1]` accesses the second item in `my_list`.",
            },
            userQuestionText: "How do I access items in a list?",
            parentIds: ["root", "explain-list"],
        },
        {
            id: "explain-zero-index",
            content: {
                type: "TEXT",
                text: "In Python, list indexing starts at 0, meaning the first item is at index 0, the second at index 1, and so on.",
            },
            userQuestionText: "What is zero-indexing?",
            parentIds: ["root", "explain-list"],
        },
        {
            id: "hint",
            content: {
                type: "LARGE_LANGUAGE_MODEL",
                prompt: "Provide a hint for adding numbers and strings to lists using the `append` method and accessing elements using zero-based indexing, without giving away the complete solution. Guide the user on the steps they need to take.",
            },
            userQuestionText: "I'm stuck. Can you give me a hint?",
            parentIds: ["root", "explain-list", "explain-append", "explain-access", "explain-zero-index"],
        }
    ],
    5: [
        {
            id: "root",
            userQuestionText: "You can ask me any questions you like!",
            parentIds: [],
        },
        {
            id: "explain-arithmetic",
            content: {
                type: "TEXT",
                text: "Arithmetic operators in Python include `+` for addition, `-` for subtraction, `*` for multiplication, and `/` for division.",
            },
            userQuestionText: "What are arithmetic operators?",
            parentIds: ["root"],
        },
        {
            id: "explain-string-concat",
            content: {
                type: "TEXT",
                text: "In Python, you can concatenate (join) strings using the `+` operator. For example, `'Hello, ' + 'world!'` results in `'Hello, world!'`.",
            },
            userQuestionText: "How do I concatenate strings?",
            parentIds: ["root", "explain-arithmetic"],
        },
        {
            id: "explain-list-concat",
            content: {
                type: "TEXT",
                text: "You can join two lists together using the `+` operator. For example, `[1, 2] + [3, 4]` results in `[1, 2, 3, 4]`.",
            },
            userQuestionText: "How do I concatenate lists?",
            parentIds: ["root", "explain-arithmetic"],
        },
        {
            id: "hint",
            content: {
                type: "LARGE_LANGUAGE_MODEL",
                prompt: "Provide a hint for using arithmetic operators on numbers, concatenating strings with `+`, and joining lists with `+`, without giving away the complete solution. Guide the user on the steps they need to take.",
            },
            userQuestionText: "I'm stuck. Can you give me a hint?",
            parentIds: ["root", "explain-arithmetic", "explain-string-concat", "explain-list-concat"],
        }
    ],
    6: [
        {
            id: "root",
            userQuestionText: "You can ask me any questions you like!",
            parentIds: [],
        },
        {
            id: "explain-for-loop",
            content: {
                type: "TEXT",
                text: "A `for` loop in Python is used to iterate over a sequence (like a list) and execute a block of code for each item in the sequence.",
            },
            userQuestionText: "What is a for loop?",
            parentIds: ["root"],
        },
        {
            id: "explain-while-loop",
            content: {
                type: "TEXT",
                text: "A `while` loop in Python repeatedly executes a block of code as long as a specified condition is true.",
            },
            userQuestionText: "What is a while loop?",
            parentIds: ["root"],
        },
        {
            id: "explain-break",
            content: {
                type: "TEXT",
                text: "The `break` statement in Python is used to exit a loop immediately. When `break` is encountered, the loop terminates and the program continues with the next statement after the loop.",
            },
            userQuestionText: "What does the break statement do?",
            parentIds: ["root", "explain-for-loop", "explain-while-loop"],
        },
        {
            id: "explain-continue",
            content: {
                type: "TEXT",
                text: "The `continue` statement in Python is used to skip the rest of the code inside a loop for the current iteration only. The loop does not terminate but continues with the next iteration.",
            },
            userQuestionText: "What does the continue statement do?",
            parentIds: ["root", "explain-for-loop", "explain-while-loop"],
        },
        {
            id: "hint",
            content: {
                type: "LARGE_LANGUAGE_MODEL",
                prompt: "Provide a hint for using `for` and `while` loops, and the `break` and `continue` statements, without giving away the complete solution. Guide the user on the steps they need to take to filter and break from a list based on conditions.",
            },
            userQuestionText: "I'm stuck. Can you give me a hint?",
            parentIds: ["root", "explain-for-loop", "explain-while-loop", "explain-break", "explain-continue"],
        }
    ],
    7: [
        {
            id: "root",
            userQuestionText: "You can ask me any questions you like!",
            parentIds: [],
        },
        {
            id: "explain-len",
            content: {
                type: "TEXT",
                text: "The `len` function in Python returns the length of a string. For example, `len('hello')` returns 5.",
            },
            userQuestionText: "How do I find the length of a string?",
        },
        {
            id: "explain-indexof",
            content: {
                type: "TEXT",
                text: "The `index` method in Python returns the position of a substring in a string. For example, `'hello'.index('e')` returns 1.",
            },
            userQuestionText: "How do I find the position of a substring in a string?",
            parentIds: ["root"],
        },
        {
            id: "explain-count",
            content: {
                type: "TEXT",
                text: "The `count` method in Python returns the number of times a substring appears in a string. For example, `'hello'.count('l')` returns 2.",
            },
            userQuestionText: "How do I count the number of times a substring appears in a string?",
            parentIds: ["root"],
        },
        {
            id: "explain-upper-lower",
            content: {
                type: "TEXT",
                text: "The `upper` method converts a string to uppercase, and the `lower` method converts a string to lowercase. For example, `'hello'.upper()` returns `'HELLO'`, and `'HELLO'.lower()` returns `'hello'`.",
            },
            userQuestionText: "How do I convert a string to uppercase or lowercase?",
            parentIds: ["root", "explain-len", "explain-indexof"],
        },
        {
            id: "explain-slice",
            content: {
                type: "TEXT",
                text: "You can access a substring in Python using slicing. For example, `'hello'[1:4]` returns `'ell'`. The slicing syntax is `[start:end]`, where `start` is the index to begin slicing and `end` is the index to stop slicing (not included).",
            },
            userQuestionText: "How do I get a part of a string?",
            parentIds: ["root", "explain-len", "explain-indexof"],
        },
        {
            id: "hint",
            content: {
                type: "LARGE_LANGUAGE_MODEL",
                prompt: "Provide a hint for using string methods like `len`, `index`, `count`, `upper`, `lower`, and slicing, without giving away the complete solution. Guide the user on the steps they need to take to debug a given string operation.",
            },
            userQuestionText: "I'm stuck. Can you give me a hint?",
            parentIds: ["root", "explain-len", "explain-indexof", "explain-count", "explain-upper-lower"],
        }
    ],
    8: [
        {
            id: "root",
            userQuestionText: "You can ask me any questions you like!",
            parentIds: [],
        },
        {
            id: "explain-if",
            content: {
                type: "TEXT",
                text: "The `if` statement in Python allows you to execute a block of code only if a specified condition is true. For example, `if x > 0: print('Positive')` will print 'Positive' if `x` is greater than 0.",
            },
            userQuestionText: "What is an if statement?",
            parentIds: ["root"],
        },
        {
            id: "explain-else",
            content: {
                type: "TEXT",
                text: "The `else` statement in Python allows you to execute a block of code if the condition in the `if` statement is false. For example, `if x > 0: print('Positive') else: print('Not positive')` will print 'Not positive' if `x` is not greater than 0.",
            },
            userQuestionText: "What is an else statement?",
            parentIds: ["root"],
        },
        {
            id: "explain-equal",
            content: {
                type: "TEXT",
                text: "The `==` operator in Python checks if two values are equal. For example, `x == y` returns `True` if `x` is equal to `y`.",
            },
            userQuestionText: "What does the `==` operator do?",
            parentIds: ["root", "explain-if", "explain-else"],
        },
        {
            id: "explain-not",
            content: {
                type: "TEXT",
                text: "The `not` operator in Python is used to invert a boolean value. For example, `not True` returns `False`, and `not False` returns `True`.",
            },
            userQuestionText: "What does the `not` operator do?",
            parentIds: ["root", "explain-if", "explain-else"],
        },
        {
            id: "explain-indentation",
            content: {
                type: "TEXT",
                text: "Indentation in Python is used to define the scope of loops, functions, and conditionals. Consistent indentation is important for the correct execution of your code.",
            },
            userQuestionText: "Why is indentation important in Python?",
            parentIds: ["root", "explain-if", "explain-else"],
        },
        {
            id: "hint",
            content: {
                type: "LARGE_LANGUAGE_MODEL",
                prompt: "Provide a hint for using `if`, `else`, `==`, and `not` operators, and the importance of correct indentation, without giving away the complete solution. Guide the user on the steps they need to take to debug a given condition.",
            },
            userQuestionText: "I'm stuck. Can you give me a hint?",
            parentIds: ["root", "explain-if", "explain-else", "explain-equal", "explain-not"]
        }
    ],
    9: [
        {
            id: "root",
            userQuestionText: "You can ask me any questions you like!",
            parentIds: [],
        },
        {
            id: "explain-function",
            content: {
                type: "TEXT",
                text: "A function is a reusable block of code that performs a specific task. You define a function using the `def` keyword followed by the function name and parentheses.",
            },
            userQuestionText: "What is a function?",
            parentIds: ["root"],
        },
        {
            id: "explain-function-arguments",
            content: {
                type: "TEXT",
                text: "Function arguments are values you pass to a function when you call it. These arguments are used within the function to perform tasks. For example, `def greet(name):` defines a function with an argument `name`.",
            },
            userQuestionText: "What are function arguments?",
            parentIds: ["root"],
        },
        {
            id: "explain-call-function",
            content: {
                type: "TEXT",
                text: "To call a function, you use its name followed by parentheses. If the function requires arguments, you pass them inside the parentheses. For example, `greet('Alice')` calls the `greet` function with the argument `'Alice'`.",
            },
            userQuestionText: "How do I call a function?",
            parentIds: ["root", "explain-function"],
        },
        {
            id: "hint",
            content: {
                type: "LARGE_LANGUAGE_MODEL",
                prompt: "Provide a hint for defining a function, using function arguments, and calling a function, without giving away the complete solution. Guide the user on the steps they need to take to complete a function definition and call it.",
            },
            userQuestionText: "I'm stuck. Can you give me a hint?",
            parentIds: ["root", "explain-function", "explain-function-arguments"]
        }
    ],
    10: [
        {
            id: "root",
            userQuestionText: "You can ask me any questions you like!",
            parentIds: [],
        },
        {
            id: "explain-class",
            content: {
                type: "TEXT",
                text: "A class is a blueprint for creating objects. It defines a set of attributes and methods that the objects created from the class will have.",
            },
            userQuestionText: "What is a class?",
            parentIds: ["root"],
        },
        {
            id: "explain-object",
            content: {
                type: "TEXT",
                text: "An object is an instance of a class. When you create an object from a class, it has the attributes and methods defined by the class.",
            },
            userQuestionText: "What is an object?",
            parentIds: ["root"],
        },
        {
            id: "explain-method",
            content: {
                type: "TEXT",
                text: "A method is a function defined inside a class that describes the behaviors of the objects created from the class.",
            },
            userQuestionText: "What is a method?",
            parentIds: ["root", "explain-class"],
        },
        {
            id: "explain-init",
            content: {
                type: "TEXT",
                text: "The `__init__` method is a special method called a constructor. It is used to initialize the attributes of an object when it is created. The `self` keyword is used to refer to the instance of the class itself.",
            },
            userQuestionText: "What is the `__init__` method?",
            parentIds: ["root", "explain-class"],
        },
        {
            id: "hint",
            content: {
                type: "LARGE_LANGUAGE_MODEL",
                prompt: "Provide a hint for defining a class, creating objects, using methods, and the `__init__` method, without giving away the complete solution. Guide the user on the steps they need to take to complete a class definition and create objects.",
            },
            userQuestionText: "I'm stuck. Can you give me a hint?",
            parentIds: ["root", "explain-class", "explain-object", "explain-method"],
        }
    ],                        
    // add more problems as needed
};