import { Customer, Customers } from '@models/sales';

const customer: Customer = {
    email: 'jean@gmailcom',
    firstName: 'Jean',
    lastName: 'Souza',
    id: '1234'
};

const customers: Customers [customer]

const funcao = (variavel: string) => console.log(variavel);
funcao('123');

export  (service) => {
    service.on('CREATE','SalesOrderHeaders', () =>); //sobresescrever o comportamento de criação
    service.before(['CREATE', 'UPDATE'], 'SalesOrderHeaders', () =>); //sobresescrever o comportamento de criação
    service.after('DELETE',['SalesOrderHeaders', 'Customers'] ,); //sobresescrever o comportamento de criação
    //codigo vai aqui
    //sobresescrever o comportamento de criação
}