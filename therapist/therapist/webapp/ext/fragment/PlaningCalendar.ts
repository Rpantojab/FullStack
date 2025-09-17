import ExtensionAPI from 'sap/fe/core/ExtensionAPI';
import UI5Event from 'sap/ui/base/Event';
import MessageToast from 'sap/m/MessageToast';

/**
 * Generated event handler.
 *
 * @param this reference to the 'this' that the event handler is bound to.
 * @param event the event object provided by the event provider
 */

/**
 * Type01 : Naranja
 * Type02 : Rojo
 * Type08 : Verde
 * @param sStatus 
 * @returns 
 */
export function status(this: ExtensionAPI, sStatus: string) {
    switch (sStatus) {
        case 'Pending': return 'Type02';
        case 'OnHold': return 'Type01';
        case 'Confirmed': return 'Type08';
    }
}