import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as customerAcions from './customer.action';
import { CustomerService } from '../customer.service';
import * as model from "../customer.model";

@Injectable()
export class CustomerEffect {

    constructor(
        private actions$: Actions,
        private customerService: CustomerService
    ) { }

    //customers
    @Effect()
    loadCustomers$: Observable<Action> = this.actions$.pipe(
        ofType<customerAcions.LoadCustomers>(
            customerAcions.CustomerActionTypes.LOAD_CUSTOMERS
        ),
        mergeMap((actions: customerAcions.LoadCustomers) =>
            this.customerService.getCustomers().pipe(
                map((customers: model.Customer[]) =>
                    new customerAcions.LoadCustomersSuccess(customers)
                ),
                catchError(err => of(new customerAcions.LoadCustomersFail(err)))
            )
        )
    )

    // customer
    @Effect()
    loadCustomer$: Observable<Action> = this.actions$.pipe(
        ofType<customerAcions.LoadCustomer>(
            customerAcions.CustomerActionTypes.LOAD_CUSTOMER
        ),
        mergeMap((action: customerAcions.LoadCustomer) =>
            this.customerService.getCustomerById(action.payload).pipe(
                map((customers: model.Customer) =>
                    new customerAcions.LoadCustomerSuccess(customers)
                ),
                catchError(err => of(new customerAcions.LoadCustomerFail(err)))
            )
        )
    )

    // create
    @Effect()
    createCustomer$: Observable<Action> = this.actions$.pipe(
        ofType<customerAcions.CreateCustomer>(
            customerAcions.CustomerActionTypes.CREATE_CUSTOMER
        ),
        map((action: customerAcions.CreateCustomer) => action.payload),
        mergeMap((customer: model.Customer) =>
            this.customerService.createCustomer(customer).pipe(
                map(
                    (newCustomer: model.Customer) =>
                        new customerAcions.CreateCustomerSuccess(newCustomer)
                ),
                catchError(err => of(new customerAcions.CreateCustomerFail(err)))
            )
        )
    )

    //update
    updateCustomer$: Observable<Action> = this.actions$.pipe(
        ofType<customerAcions.UpdateCustomer>(
            customerAcions.CustomerActionTypes.UPDATE_CUSTOMER
        ),
        map((action: customerAcions.UpdateCustomer) => action.payload),
        mergeMap((customer: model.Customer) =>
            this.customerService.updateCustomer(customer).pipe(
                map(
                    (newCustomer: model.Customer) =>
                        new customerAcions.UpdateCustomerSuccess({
                            id: newCustomer.id,
                            changes: newCustomer
                        })
                ),
                catchError(err => of(new customerAcions.UpdateCustomerFail(err)))
            )
        )
    )

    //delete
    @Effect()
    deleteCustomer$: Observable<Action> = this.actions$.pipe(
        ofType<customerAcions.DeleteCustomer>(
            customerAcions.CustomerActionTypes.DELETE_CUSTOMER
        ),
        map((action: customerAcions.DeleteCustomer) => action.payload),
        mergeMap((id: number) =>
            this.customerService.deleteCustomer(id).pipe(
                map(() => new customerAcions.DeleteCustomerSuccess(id)),
                catchError(err => of(new customerAcions.DeleteCustomerFail(err)))
            )
        )
    )

}