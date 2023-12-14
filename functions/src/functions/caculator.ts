import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function caculator(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const firstNumber = request.query.get('firstNumber');
    const secondNumber = request.query.get('secondNumber');

    let result = (Number(firstNumber) + Number(secondNumber)) * 4;

    return {
        body: `${result}`
    };
};

app.http('caculator', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: caculator
});
