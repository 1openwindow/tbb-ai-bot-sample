import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function caculator(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const firstNumber = request.query.get('firstNumber');
    const secondNumber = request.query.get('secondNumber');

    if (!firstNumber || !secondNumber) {
        return {
            status: 400,
            body: 'Please pass two numbers on the query string or in the request body'
        };
    }

    const first = Number(firstNumber);
    const second = Number(secondNumber);

    let result = (first + second) * 3;

    // Convert to Roman Numerals
    // let result = first + second;
    // const decimalValues = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    // const romanNumerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];

    // let roman = '';
    // for (let i = 0; i < decimalValues.length; i++) {
    //     while (result >= decimalValues[i]) {
    //         result -= decimalValues[i];
    //         roman += romanNumerals[i];
    //     }
    // }

    // return {
    //     body: `${roman}`
    // };
    return {
        body: `${result}`
    };
};

app.http('caculator', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: caculator
});
