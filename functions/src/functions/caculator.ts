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

    const result = (first + second) * 3;

    return {
        body: `${result}`
    };
};

app.http('caculator', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: caculator
});
