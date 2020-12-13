
<template>
	<!-- class="docs-table myGrid" -->

	<div>  
		<q-window-resize-observable @resize="onResize"/>
	<!-- 	
		<q-window-resize-observable @resize="onResizeWin"/>	
		<q-resize-observable @resize="onResizeEle" />
 -->
    	<GridOthers 
    		:frmID="frmID" 
    		:subFrmID="subForm"
	    	:frmType="formType"
	    	:myGrid="myGrid" />
<!--  

	      :data="getAppForms[frmID].Grid.Rows === undefined ? [] : getAppForms[frmID].Grid.Rows.data"
	      :columns="getAppForms[frmID].Grid.Columns === undefined ? [] : getAppForms[frmID].Grid.Columns"
	      :row-key="getAppForms[frmID].Grid.Keys === undefined ? '' : getAppForms[frmID].Grid.Keys"
	      :pagination.sync="getAppForms[frmID].Grid.Pagination === undefined ? '' : getAppForms[frmID].Grid.Pagination"
	      :separator="getAppForms[frmID].Grid.Seperator === undefined ? '' : getAppForms[frmID].Grid.Seperator.Value"
	      :visible-columns="getAppForms[frmID].Grid.VisibleColumns === undefined ? [] : getAppForms[frmID].Grid.VisibleColumns"
	      :hide-bottom="formType==='grd' ? true : false"			
-->
	    <q-table 
	      class="sticky-table"
      	  :table-style="tblheight"
	      :title="formType==='grd' ? myGrid.Description === undefined ? '' : myGrid.Description : ''"
	      :data="myGrid.Grid.Rows === undefined ? [] : myGrid.Grid.Rows.data"
	      :columns="myGrid.Grid.Columns === undefined ? [] : myGrid.Grid.Columns"
	      :row-key="myGrid.Grid.Keys === undefined ? '' : myGrid.Grid.Keys"
	      :pagination.sync="myGrid.Grid.Pagination === undefined ? '' : myGrid.Grid.Pagination"
	      :separator="myGrid.Grid.Seperator === undefined ? '' : myGrid.Grid.Seperator.Value"
	      :visible-columns="myGrid.Grid.VisibleColumns === undefined ? [] : myGrid.Grid.VisibleColumns"
		  :loading="loading"
	      @request="LoadDataGrid"
	      dense
	      color="primary"
	      hide-bottom
	      grid> 



			<template 
				:slot="formType==='grd' ? 'top-right' : ''" 
				slot-scope="props" >
				<q-btn icon="add"
					   v-if="myGrid.Action.toUpperCase().indexOf('A') == -1 ? false : true" 
					   flat round dense
					   @click="myGrid.grdAction({mode:'1', data:''})" />
			</template>

	    	<GridHeader slot="header" slot-scope="props"
	    		:frmID="frmID" 
	    		:subFrmID="subForm"
	    		:frmType="formType"
	    		:myGrid="myGrid"
	    		:dataHead="props"
	    	/>

	    	<GridDetail slot="body" slot-scope="props"
	    		:frmID="frmID" 
	    		:subFrmID="subForm"
	    		:frmType="formType"
	    		:myGrid="myGrid"
	    		:dataDetail="props"
	    	/>


		</q-table>	

<!-- 

    	<GridFooter slot="bottom" slot-scope="props"
    		:frmID="frmID" 
    		:subFrmID="subForm"
    		:frmType="formType"
    		:myGrid="myGrid"
    		:dataFooter="props"
    	/>

		<q-page-sticky 
			v-if="frmType === 'grd' ? false : true"
			position="bottom-left" 
			class="size-XS row" 
			v-show="myGrid.Grid.Pagination.rowsNumber === 0 ? true : false"
			:offset="[6, 10]">
			<q-btn 	round 
					color="secondary" 
					icon="refresh" 
					size="sm"
					label="refresh...."
					class="q-mr-xs"
					@click="myGrid.Grid.LoadDataGrid()" />
			<q-btn 	color="secondary" 
					icon="settings" 
					size="sm"
					@click="frmSetting=!frmSetting"
					label="settings">	
			</q-btn>

	    		<q-modal v-model="frmSetting" position="top">
	              <GridSetting 
	    	    		:frmID="frmID" 
	    	    		:subFrmID="subFrmID"
	    	    		:frmType="frmType"
	    	    		:myGrid="myGrid"
	              />
	    		</q-modal>				

		</q-page-sticky>

		<q-page-sticky 
			v-if="frmType === 'grd' ? false : true"
			position="bottom-left" 
			class="size-XS row" 
			:offset="[6, 0]">
		</q-page-sticky>

 -->
		<div v-if="frmType === 'grd' ? false : true" >
	    	<GridFooter 
	    		:frmID="frmID" 
	    		:subFrmID="subForm"
	    		:frmType="formType"
	    		:myGrid="myGrid"
	    	/>
		</div>


	</div>
</template>

<script>

	import weAuth from 'src/auth';
	import { mapGetters, mapMutations, mapActions } from 'vuex';
	import store from 'src/store'
	import GridHeader from './ObjGrid_H.vue';
	import GridDetail from './ObjGrid_D.vue';
	import GridOthers from './ObjGrid_O.vue';
	import GridFooter from './ObjGrid_F.vue';
	import GridSetting from './ObjGrid_S.vue';
	export default { 
  		name: 'ObjGrid',		
  		components : { GridHeader, GridDetail, GridOthers, GridFooter, GridSetting },	
  		props: {
            frmID: { type : String },
            subFrmID: { type : String },
            frmType: { type : String },
        },
	    created () { 	    	
	      	
	      	var sF = this.subForm === undefined ? "" : this.subForm;
	      		sF = sF.trim();
	      	// if (this.subForm != "" ) {
	      	// 	console.log('created - ObjGrid ', sF);
	      	// }
			this.setAppForms_Data({ id: this.frmID, path:sF+'Grid', data: {} });
			// console.log('created - ObjGrid ' + sF+'Grid : ', this.frmID);
			this.setAppForms_Data({ 
				id: this.frmID, 
				path: sF+'Grid.Pagination', 
				data: {
					multiSortBy: [], 
					rowsPerPage: 10, 
					page: 1, 
					rowsNumber:0, 
					descending: false, 
					sortBy:'' 
				} 
			});

			this.setAppForms_Data({ 
				id: this.frmID, 
				path: sF+'Grid.Seperator', 
				data: {
					Data: [ { label: 'Horizontal', value: 'horizontal' },
					        { label: 'Vertical', value: 'vertical' },
					        { label: 'Cell', value: 'cell' },
					        { label: 'None', value: 'none' }], 
					Value: 'cell'
				}
			});
			
			this.setAppForms_Data({ 
				id: this.frmID, 
				path: sF+'Grid.Operator', 
				data: [ { label:'equal', value:'='},
						{ label:'not_equal', value:'<>'},
						{ label:'greater_than', value:'>'},
						{ label:'less_than', value:'<'},
						{ label:'greater_than_or_equal_to', value:'>='},
						{ label:'less_than_or_equal_to', value:'<='},
						{ label:'like', value:'like'},
						{ label:'in', value:'in'} ] 
			});

			this.setAppForms_Data({ 
				id: this.frmID, 
				path: sF+'Grid.SearchAllColumns', 
				data: ''
			});

			this.setAppForms_Data({
				id: this.frmID,
				path:sF+'Grid.LoadDataGrid',
				data: this.LoadDataGrid});

			if (this.frmType != "popup") {
				this.LoadDataGrid();
			}

			// this.LoadDataGrid();
	      	// if (this.subForm != "" ) {
	      	// 	console.log('created - ObjGrid xxxxxxxxxxxxxxx');
	      	// }
	    },
		// mounted() { console.log('ObjGrid mounted', 'Test 1222222') },	
		// beforeMount () { console.log('ObjGrid beforeMount', 'Test 22222') },		
		// updated() { console.log('ObjGrid updated', 'Test 123') },	
		// beforeUpdate () { console.log('ObjGrid beforeUpdate', 'Test 456') },			
		// activated () { },		
		// deactivated () { },		
		// watch: { },
		computed: {
	      	...mapGetters('App',['getAppForms']),
	      	subForm: {
	      		get: function() {
		      		return (this.subFrmID === undefined ? "" : this.subFrmID).trim();
	      		}
	      	},
	      	formType: {
	      		get: function() {
		      		return (this.frmType === undefined ? "" : this.frmType).trim().toLowerCase();
	      		}
	      	},
	      	myGrid() {

				// console.log('Masuk myGrid', this.frmID + ' (' + this.subForm + ') ');
				// console.log('myGrid : ', this.getAppForms[this.frmID])
	      		if (this.subForm==="") {
	      			// console.log('Grid Utama', this.getAppForms[this.frmID]);
		      		return this.getAppForms[this.frmID];
	      		} else {
	      			var f = this.getAppForms[this.frmID];
				    var i;
				    var vPath = this.subForm
				    	vPath = vPath.split('.');    
				    var vKey = "";

					for (i = 0; i < vPath.length - 1; i++) {
						f = f[vPath[i]];
				    }
	      			// console.log('Grid Utama - Bukan ', f);
		      		return f;
		      		// return this.getAppForms[this.frmID][vPath];
	      		}
	      	}
			// Pagination: {
			// 	get: function () {
			// 		console.log('Computed - Pagination GET')		
			// 		return this.getAppForms[this.frmID].Grid.Pagination === undefined ? 
			// 					'' : this.getAppForms[this.frmID].Grid.Pagination;
			// 	},
			// 	set: function (NewValue) {		
			// 		console.log('Computed - Pagination SET', NewValue)			
			// 		this.setAppForms_Data({
			// 			id: this.frmID, path:'Grid.Pagination', data: NewValue });
			// 	}
			// },	      	
		},	
		methods: {	
			...mapMutations('App',['setAppForms_Data']),
			...mapActions('App',['doAppLoadGrid']),
			onResize(size){
				// console.log('onResize', this);
				// console.log('"Grid" onResizeWindow - size', size);
			    // this.tblheight = "height: "+(size.height - 145).toString()+"px"
				if (this.frmType === "popup") {
				    this.tblheight = "height: "+(size.height - 300).toString()+"px"
				} else if (this.frmType === "grd") {
					this.tblheight = "";
				} else {
				    this.tblheight = "height: "+(size.height - 145).toString()+"px"
				    // this.tblheight = "height: "+(size.height - 295).toString()+"px"
				    // this.tblheight = "height: 500px"
				    // this.tblheight = "height: "+(size.height - 150).toString()+"px; max-height: 600px;"
				}
			},	
			onResizeWin(size){
				// console.log('onResize', this);
				// console.log('"Grid" onResizeWindow - size', size);
			    // this.tblheight = "height: "+(size.height - 145).toString()+"px"
				if (this.frmType === "popup") {
				    this.tblheight = "height: "+(size.height - 300).toString()+"px"
				} else if (this.frmType === "grd") {
					this.tblheight = "";
				} else {
				    this.tblheight = "height: "+(size.height - 145).toString()+"px"
				    // this.tblheight = "height: "+(size.height - 295).toString()+"px"
				    // this.tblheight = "height: 500px"
				    // this.tblheight = "height: "+(size.height - 150).toString()+"px; max-height: 600px;"
				}
			},	
			onResizeEle(size){
				// console.log('"Grid" onResizeElement - size', size);
			},					
		    async LoadDataGrid(event) {
		    	var Saya = this;

		    	var LoadingTitle = "";
				if (this.frmType === "popup") {
				    LoadingTitle = "Loading Pop Up Grid";
				} else if (this.frmType === "grd") {
				    LoadingTitle = "Loading Data Grid Detail";
				} else {
				    // LoadingTitle = "Refreshing Your Data, Please Wait...";
				    LoadingTitle = "Refreshing Data Grid, Please Wait...";
				}

				await weAuth.loading.loadData( this , LoadingTitle, '', '', 
					async () => {
						var params = new Object;

	      					if (this.subForm==="") {
								params['Controller'] = 'c' + this.frmID;
								params['Method'] = 'LoadGrid';
							} else {
								params['Controller'] = 'c' + this.myGrid.Controller;
								params['Method'] = this.myGrid.Method;
							}
							// console.log('ObjGrid - LoadDataGrid ', this.myGrid)
							// if (event) {
							// 	params['page'] = event.pagination.page;
							// 	params['perPage'] = event.pagination.rowsPerPage;
							// } else {
							// 	params['page'] = this.getAppForms[this.frmID].Grid.Pagination.page;
							// 	params['perPage'] = this.getAppForms[this.frmID].Grid.Pagination.rowsPerPage;
							// }

							if (this.frmType === "grd") {
								// console.log('abcde', this.myGrid)									
							} else {
								params['page'] = event ? event.pagination.page : 
													Saya.myGrid.Grid.Pagination.page;
								params['perPage'] = event ? event.pagination.rowsPerPage : 
													this.myGrid.Grid.Pagination.rowsPerPage;
								params['cari'] = this.myGrid.Grid.Filter === undefined ? [] : 
												 this.myGrid.Grid.Filter.filter(r => r.filterValue != '');
								params['urut'] = this.myGrid.Grid.Sort;
								params['AllColumns'] = this.myGrid.Grid.SearchAllColumns;
							}

						this.loading = true;
						await this.doAppLoadGrid({ 
									params: params, 
									frmID: Saya.frmID, 
									id: Saya.subForm+'Grid'
								}).then( function(response) {
										Saya.loading = false;
										if (response) {
											if (!response.succes) {
												Saya.$q.notify('Loading grid is fail, becouse ' + response.message);
											}
										}
								}).catch( function(response) {
										Saya.$q.notify('Fail loading grid...' + response);
								});

					}
				);

		    },	    
		},			
		data () {
			return {	
		        loading: false,
		        // firstTime: true,
      			tblheight: "height: 400px",
      			frmSetting: false,
	      	}
	    }
	}
</script>


<!-- 
	<style scoped >


	table thead tr:nth-child(1) th{
	    background: lightgrey;
	  }

	.sticky-table thead tr:nth-child(1) th {
    	background: lightgrey;
	    position: sticky;
	    top: 0;
	    z-index: 10;
	}

	.q-table td, .q-table th {
	    /* don't shorten cell contents */
	    white-space: normal !important;
	}

-->
<style>
	.sticky-table thead tr:nth-child(1) th {
    	background: lightgrey;
	    position: sticky;
	    top: 0;
	    z-index: 10;
	}

	.q-table td, .q-table th {
	    /* don't shorten cell contents */
	    white-space: normal !important;
	}
</style>
