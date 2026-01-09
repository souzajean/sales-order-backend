




import { Service } from '@sap/cds';
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
};



