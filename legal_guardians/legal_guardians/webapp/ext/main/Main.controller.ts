import Controller from "sap/fe/core/PageController";
import Table from "sap/fe/macros/table/Table";
import EventBus from "sap/ui/core/EventBus";
import JSONModel from "sap/ui/model/json/JSONModel";
import Context from "sap/ui/model/odata/v4/Context";
import ResponsiveTable from "sap/m/Table";
import Button from "sap/m/Button";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import MessageBox from "sap/m/MessageBox";
import MessageToast from "sap/m/MessageToast";

/**
 * @namespace com.logaligroup.legalguardians.ext.main
 */
export default class Main extends Controller {

     eventBust : EventBus;

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf com.logaligroup.legalguardians.ext.main.Main
     */
    public onInit(): void {
        super.onInit(); // needs to be called to properly initialize the page controller
        this.eventBust = this.getAppComponent().getEventBus();
        this.eventBust.subscribe("eventRefreshTable","refreshTable",this.refreshTable.bind(this))

        const router = this.getAppComponent().getRouter();
        router.getRoute("LegalGuardiansSetMain")?.attachPatternMatched(this.onPatternMatched.bind(this))
    }

    private async onPatternMatched():Promise<void> {
        const modelUi = this.getView()?.getModel("ui") as JSONModel;
        modelUi.setProperty("/isEditable",false);
        this.setMode();

    }

    private setMode():void {
        const table = this.byId("com.logaligroup.legalguardians::LegalGuardiansSetMain--Table-content-innerTable") as ResponsiveTable;
        table.setMode("MultiSelect");
    }

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf com.logaligroup.legalguardians.ext.main.Main
     */
    // public  onBeforeRendering(): void {
    //
    //  }

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf com.logaligroup.legalguardians.ext.main.Main
     */
    public  onAfterRendering(): void {
       this.setMode();
     }

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf com.logaligroup.legalguardians.ext.main.Main
     */
    // public onExit(): void {
    //
    //  }

    public refreshTable(): void {
        const table = this.byId("Table") as Table;
        table.refresh();
    }

    public async OnCreate(): Promise<void> {
        const context = this.getView()?.getBindingContext() as Context;
        await this.getExtensionAPI().getEditFlow().createDocument("/LegalGuardiansSet",
            {
                creationMode: "NewPage",
                data:{
                    ID:""
                }
            }
        );
        this.refreshTable();
    }

    public onSelectionChange():void{
        const table = this.byId("Table") as Table;
        const aContexts = table.getSelectedContexts() as Context[];
        const buttonDelete = this.byId("com.logaligroup.legalguardians::LegalGuardiansSetMain--Table-content::CustomAction::ActionDelete") as Button;
    
        if (aContexts.length >= 1) {
            buttonDelete.setEnabled(true);
        }else{
            buttonDelete.setEnabled(false);
        }
    }

    public async onDelete():Promise<void> {
       const table = this.byId("Table") as Table;
       const aContexts = table.getSelectedContexts() as Context[];
       const resourceBundle =  (this.getView()?.getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;
       const question = (aContexts.length>1? resourceBundle.getText("questionBatchDelete"): resourceBundle.getText("questionDelete")) as string;
       const message = (aContexts.length>1? resourceBundle.getText("messageBatchDelete"): resourceBundle.getText("messageDelete")) as string;  
       const mdelete = resourceBundle.getText("delete");
       const $this = this; 

       MessageBox.warning(question,{
        title : mdelete,
        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
        emphasizedAction: MessageBox.Action.OK,
        onClose: async function (sActions:string) {
            if (sActions == MessageBox.Action.OK){
                await $this.batchDelete(aContexts);
                $this.refreshTable();
                MessageToast.show(message);
            }
        }
       })
    }
     
  public async batchDelete(aContexts:Context[]):Promise<void> {
    for (let index in aContexts){
        let context = aContexts[index] as Context;
        await context.delete();
    }  
  }
}