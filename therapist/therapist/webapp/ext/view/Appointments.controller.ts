import Controller from "sap/fe/core/PageController";

/**
 * @namespace com.logaligroup.therapist.ext.view
 */
export default class Appointments extends Controller {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf com.logaligroup.therapist.ext.view.Appointments
     */
    // public onInit(): void {
    //     super.onInit(); // needs to be called to properly initialize the page controller
    //}

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf com.logaligroup.therapist.ext.view.Appointments
     */
    // public  onBeforeRendering(): void {
    //
    //  }

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf com.logaligroup.therapist.ext.view.Appointments
     */
    // public  onAfterRendering(): void {
    //
    //  }

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf com.logaligroup.therapist.ext.view.Appointments
     */
    // public onExit(): void {
    //
    //  }
}