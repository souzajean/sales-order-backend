import cds, { Request, Service } from '@sap/cds';
import { Customers, Products, SalesOrderItem, SalesOrderItems } from '@models/sales';
import { log } from 'node:console';

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
        const items : SalesOrderItems = params.items;

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

        //Validando produtos
        //const products = params.items.map((item: SalesOrderItem) => item.product_id);
        // 3️⃣ busca customer no banco
        //const productQuery = SELECT
        //.from('sales.Products')
        //.where({ id: products });
        //console.log(JSON.stringify(productQuery);


        const productsIds: string[] = params.items.map((item: SalesOrderItem) => item.product_id);
        const productsQuery = SELECT.from('sales.Products').where({ id: productsIds });
        //console.log(JSON.stringify(productsQuery))
        const products: Products = await cds.run(productsQuery);
        //console.log(products);
        //const dbProducts = products.map((products) => products.id);
        //console.log(dbProducts);
        //console.log(productsIds.every(productsIds => dbProducts.includes(productsIds)));
        //console.log(params.items);
        for (const item of params.items) {
            //console.log(item);
            const dbProducts = products.find(products => products.id === item.product_id);
            if (!dbProducts) {
                return request.reject(404, `Produto ${item.product_id} não encontrado`);
            }
            if (dbProducts.stock === 0 ) {
                return request.reject(400, `Produto ${dbProducts.name}(${dbProducts.id}) sem estoque disponível`);
           }
        }
        //if (!productsIds.every(productsIds => dbProducts.includes(productsIds))) {
            //return request.reject(404, 'Produto não encontrado');
        //}
        //if (products.some((product) => product.stock === 0 )) {
           // return request.reject(400, 'Produto sem estoque disponível');
        //}



    });

};
