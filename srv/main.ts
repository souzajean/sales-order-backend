import cds, { Request, Service } from '@sap/cds';
import {
    Customers,
    Products,
    Product,
    SalesOrderHeader,
    SalesOrderHeaders,
    SalesOrderItem,
    SalesOrderItems
} from '@models/sales';

export default (service: Service) => {

    service.after('READ', 'Customers', (results: Customers[]) => {
        results.forEach(customer => {
            if (!customer.email?.includes('@')) {
                customer.email = `${customer.email}@gmail.com`;
            }
        });
    });

    service.before('CREATE', 'SalesOrderHeaders', async (request: Request) => {
        const params = request.data;
        const items: SalesOrderItems = params.items;

        if (!params.customer_id) {
            return request.reject(400, 'Customer inválido');
        }

        const customer = await cds.run(
            cds.ql.SELECT.one
                .from('sales.Customers')
                .where({ id: params.customer_id })
        );

        if (!customer) {
            return request.reject(404, 'Customer não encontrado');
        }

        const productsIds: string[] = items.map(
            (item: SalesOrderItem) => item.product_id
        );

        const productsQuery = cds.ql.SELECT
            .from('sales.Products')
            .where({ id: { in: productsIds } });

        const products: Products[] = await cds.run(productsQuery);

        for (const item of items) {
            const dbProduct = products.find(
                product => product.id === item.product_id
            );

            if (!dbProduct) {
                return request.reject(404, `Produto ${item.product_id} não encontrado`);
            }

            if (dbProduct.stock === 0) {
                return request.reject(
                    400,
                    `Produto ${dbProduct.name} (${dbProduct.id}) sem estoque disponível`
                );
            }
        }
    });

    service.after('CREATE', 'SalesOrderHeaders', async (results: SalesOrderHeaders) => {

        const headersAsArray: SalesOrderHeader[] = Array.isArray(results)
            ? results
            : [results];

        for (const header of headersAsArray) {

            const items = header.items as SalesOrderItems;

            const productsData = items.map(item => ({
                id: item.product_id as string,
                quantity: item.quantity as number
            }));

            const productsIds: string[] = productsData.map(p => p.id);

            const productsQuery = cds.ql.SELECT
                .from('sales.Products')
                .where({ id: { in: productsIds } });

            const products: Products[] = await cds.run(productsQuery);

            for (const productData of productsData) {

                const foundProduct = products.find(
                    product => product.id === productData.id
                ) as Product;

                if (!foundProduct) {
                    continue;
                }

                foundProduct.stock =
                    (foundProduct.stock as number) - productData.quantity;

                await cds
                    .update('sales.Products')
                    .where({ id: foundProduct.id })
                    .with({ stock: foundProduct.stock });
            }
        }
    });
};
