
import cds, { Request, Service } from '@sap/cds';
import { Customers } from '@models/sales';

export default (service: Service) => {

    service.after('READ', 'Customers', (results: Customers[]) => {
        //console.log('ARRAY COMPLETO:', results);
        //console.log('ÚLTIMO REGISTRO:', results.at(-1));
        results.forEach(customer => {
            if (!customer.email?.includes('@')) {
                customer.email = `${customer.email}@gmail.com`;
            }
        });
    });

    service.before('CREATE', 'SalesOrderHeaders', async (request: Request) => {
        const params = request.data;

        // 1️⃣ valida customer_id
        if (!params.customer_id) {
            return request.reject(400, 'Customer inválido');
        }

        // 3️⃣ busca customer no banco
        const customer = await cds.run(
            cds.ql.SELECT.one
                .from('sales.Customers')
                .where({ id: params.customer_id })
        );

        // 4️⃣ valida existência do customer
        if (!customer) {
            return request.reject(404, 'Customer não encontrado');
        }

        // opcional: log
        console.log('Customer encontrado:', customer);
    });

};
