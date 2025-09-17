import ControllerExtension from 'sap/ui/core/mvc/ControllerExtension';
import ExtensionAPI from 'sap/fe/templates/ObjectPage/ExtensionAPI';
import JSONModel from 'sap/ui/model/json/JSONModel';
import Dialog from 'sap/m/Dialog';
import View from 'sap/ui/core/mvc/View';
import Fragment from 'sap/ui/core/Fragment';
import { DatePicker$ChangeEvent } from 'sap/m/DatePicker';
import { ComboBox$ChangeEvent } from 'sap/m/ComboBox';
import ListItem from 'sap/ui/core/ListItem';
import Context from 'sap/ui/model/odata/v4/Context';
import SinglePlanningCalendar, { SinglePlanningCalendar$AppointmentDropEvent, SinglePlanningCalendar$AppointmentSelectEvent, SinglePlanningCalendar$AppointmentSelectEventParameters } from 'sap/m/SinglePlanningCalendar';
import ODataListBinding from 'sap/ui/model/odata/v4/ODataListBinding';
import Boolean1 from 'sap/ui/model/type/Boolean';
import DateFormat from 'sap/ui/core/format/DateFormat';

/**
 * @namespace com.logaligroup.therapist.ext.controller
 * @controller
 */
export default class ObjectPage extends ControllerExtension<ExtensionAPI> {
	/**define variant global manage dialog */
	dialog: Dialog;

	static overrides = {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.logaligroup.therapist.ext.controller.ObjectPage
		 */
		onInit(this: ObjectPage) {
			// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
			const model = this.base.getExtensionAPI().getModel();
			this.formodel();
		}
	}

	private formodel(): void {
		let data: {
			patient_ID: string,
			typeAppointment_ID: string,
			title: string,
			description: string,
			beginDate: Date | null,
			endDate: Date | null,
			startDate: string,
			endDate2: string,
			block_ID: string,
			beginTime: string,
			endTime: string
		} = {
			patient_ID: "",
			typeAppointment_ID: "",
			title: "",
			description: "",
			beginDate: null,
			endDate: null,
			startDate: "",
			endDate2: "",
			block_ID: "",
			beginTime: "",
			endTime: ""
		};

		const model = new JSONModel(data);
		// @ts-ignore
		this.base.getView().setModel(model, "form");

	}

	/**
	 * onOpenForm
	 */
	public async onOpenForm(): Promise<void> {
		// @ts-ignore
		const view = this.base.getView() as View;
		this.dialog ??= await Fragment.load(
			{
				id: view.getId(),
				name: "com.logaligroup.therapist.ext.fragment.Form",
				controller: this

			}
		) as Dialog;

		view.addDependent(this.dialog);

		this.dialog.bindElement({
			path: '/',
			model: ''
		});

		this.dialog.open();
	}

	public onDialogClose(): void {
		this.dialog.close();
	}

	public onChangeBeginDate(event: DatePicker$ChangeEvent): void {
		let sDate = event.getParameter("value") as string;
		// @ts-ignore
		const model = (this.base.getView() as View).getModel("form") as JSONModel;

		model.setProperty("/endDate", sDate);
		model.setProperty("/startDate", sDate);
		model.setProperty("/endDate2", sDate);

		console.log(model.getData());
	}

	/**
	 * onChangeBlock
	 */
	public async onChangeBlock(event: ComboBox$ChangeEvent): Promise<void> {

		let item = event.getSource().getSelectedItem() as ListItem;
		let bindingContext = item.getBindingContext() as Context;
		let sBeginTime = await bindingContext.requestProperty("beginTime");
		let sEndTime = await bindingContext.requestProperty("endTime");
		//@ts-ignore
		const model = (this.base.getView() as View).getModel("form") as JSONModel;
		model.setProperty("/beginTime", sBeginTime);
		model.setProperty("/endTime", sEndTime);
		model.setProperty("/startDate", model.getProperty("/startDate") + "T" + sBeginTime);
		model.setProperty("/endDate2", model.getProperty("/endDate") + "T" + sEndTime)

		console.log(model.getData());
	}

	/**
	 * onCreateForm
	:void */
	public async onCreateForm(): Promise<void> {
		//@ts-ignore
		let model = (this.base.getView() as View).getModel("form") as JSONModel;
		let body = model.getData();

		let singlePlanningCalendar = this.base.getExtensionAPI().byId("fe::CustomSubSection::PlaningCalendar--PlaningCalendar") as SinglePlanningCalendar;
		let bindList = singlePlanningCalendar.getBinding("appointments") as ODataListBinding;

		await bindList.create(body).created();
		this.reset();
	}

	public reset(): void{
		this.formodel();
		this.onDialogClose();
	}

	/**
	 * onNavToAppointments
event:A	 */
	public async onNavToAppointments(event:SinglePlanningCalendar$AppointmentSelectEvent): Promise<void> {
		//@ts-ignore	
		const modelUI = (this.base.getView() as View).getModel("ui") as JSONModel;
		let IsActiveEntity = modelUI.getProperty("/isEditable") as boolean;
		let appointments =  event.getParameter("appointment");
		
		let contextAppointment = appointments?.getBindingContext() as Context;
        let appointment_ID = await contextAppointment.requestProperty("ID");
		
		let context = this.base.getExtensionAPI().getBindingContext() as Context;
		let therapist_ID = await context.requestProperty("ID");

		this.base.getExtensionAPI().getRouting().navigateToRoute("AppointmentsSetAppointmentsPage",{
			TherapistsSetKey : therapist_ID,
			boolean1 : !IsActiveEntity,
			toAppointmentsKey : appointment_ID,
			boolean2: !IsActiveEntity  
		}


		)

		console.log("AQUI VAMOS");
		console.log(IsActiveEntity);
		console.log(appointment_ID);
		console.log(therapist_ID);
	}

	public async onAppointmentDrop(event: SinglePlanningCalendar$AppointmentDropEvent): Promise<void>  {
		let oStartDate = event.getParameter("startDate") as Date,
		    oEndDate = event.getParameter("endDate") as Date,
			sStarDate = DateFormat.getDateInstance({pattern:"yyyy-MM-dd"}).format(oStartDate),
			sEndDate = DateFormat.getDateInstance({pattern:"yyyy-MM-dd"}).format(oEndDate),
			appointment =  event.getParameter("appointment"),
			contextAppointment = appointment?.getBindingContext() as Context,
			sBeginTime = await contextAppointment.requestProperty("beginTime"),
			sEndTime = await contextAppointment.requestProperty("endTime");

		await contextAppointment.setProperty("beginDate",sStarDate);
		await contextAppointment.setProperty("endDate",sEndDate);
		await contextAppointment.setProperty("starDate",sStarDate.concat("T").concat(sBeginTime));
		await contextAppointment.setProperty("endDate2",sEndDate.concat("T").concat(sEndTime));
	}
}