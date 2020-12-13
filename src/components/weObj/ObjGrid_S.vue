<template>


	<div>		

	    <q-list separator class="q-ma-sm"
	    	v-if="myGrid.Grid === undefined ? false : 
	    		  myGrid.Grid.Columns === undefined ? false : true">

	    		<div class="full-width bg-secondary row justify-center" >
					<q-btn-group class="q-pa-sm" outline >
						<q-btn 
							:color="FrameMenu == '1' ? 'info' : 'primary'" push
							icon="grid_on" label="Grid" 
							@click="FrameMenu = '1'"/>
						<q-btn 
							:color="FrameMenu == '2' ? 'info' : 'primary'" push
							icon="sort" label="Sort"  
							@click="FrameMenu = '2'; showSortFrame('open', '');"/>
						<q-btn 
							:color="FrameMenu == '3' ? 'info' : 'primary'" push
							icon="notes" label="Filter" 
							@click="FrameMenu = '3'; showFilterFrame('open', '');" />
					</q-btn-group>
	    		</div>

	    		<div v-show="FrameMenu == '1' ? true : false">

		    		<div class="full-width q-pa-sm row bg-neutral justify-center" >

						<q-field orientation="horizontal"  class="col-4 q-mr-lg" color="secondary" >		
						  	Row Per Page
						    <q-select
						      color="secondary"      
						      hide-underline      
						      v-model="rowPerPage"
						      :options="nomor"
						    />
						</q-field>		

						<q-field orientation="horizontal" class="col-5 q-mr-sm">
							Page
							<q-input
								type="number" align="right"
								v-model="myGrid.Grid.Rows.current_page" 
								style="padding-bottom:8px;"
								:suffix="'/ ' + myGrid.Grid.Rows.last_page"
								@keyup.enter="GoPage()"

							/>						
						</q-field>

						<div class="col-1">
					        <q-btn outline
					          round dense size="sm" icon="arrow_upward" color="primary" class="q-mb-xs"
		          			  :disable="myGrid.Grid.Rows.current_page === myGrid.Grid.Rows.last_page ? 
		          			  				true : false"
							  @click="NextPage()"
					        />
					        <q-btn outline
					          round dense size="sm" icon="arrow_downward" color="primary" 
		          			  :disable="myGrid.Grid.Rows.current_page == 1 ? true : false"
							  @click="PreviousPage()"
					        />
						</div>


		    		</div>

					<q-field class="q-pa-sm" orientation="vertical" >	
						<q-input 
							v-model="myGrid.Grid.SearchAllColumns" 
							:float-label="searchAllColumns" 
							placeholder="Enter to search"
							@keyup.enter="myGrid.Grid.LoadDataGrid()"
						/>
					</q-field>

		    		<q-collapsible indent icon="view_column" 
		    			label="Visible Column" opened
		    			class="full-width" >
						<q-field  
							orientation="vertical" 
							helper="Pick a column to show/hide ">	

							<q-option-group 
								type="toggle"
								v-model="VisibleColumns" 
								:options="myGrid.Grid.Columns.filter(r => r.required === false)" 
							/>

						</q-field>
					</q-collapsible>

		    		<q-collapsible indent icon="table_chart" 
		    				label="Layout Grid" 
		    				class="full-width" >			    	
						<q-field
							orientation="vertical" 
							helper="Pick one of them to layout the grid">			  
							<q-option-group 
								type="radio"
								v-model="Seperator" 
								:options="myGrid.Grid.Seperator.Data" 
							/>

						</q-field>
					</q-collapsible>
	    			
	    		</div>

	    		<!-- Begin Frame Sorting -->
	    		<div v-show="FrameMenu == '2' ? true : false"> 
		        	<div class="q-ma-md">
						<div class="row">
							<q-field dense
							  icon="sort" 
							  color="secondary"
							  orientation="horizontal" >		

							    <q-select class="q-ma-xs"
							      color="secondary"
								  multiple				      
							      v-model="sortResult"
								  placeholder="'Multiple Sort'"
							      :options="myGrid.Grid.SortList"
							      :display-value="`${sortResult.length} columns sorted`"
							      hide-underline
							    />
							</q-field>		
	          
						</div>
						<q-list dense highlight>
						  <q-item v-for="(c, index) in sortResult" :key="index">
						    <q-item-side icon="delete" @click.native="sortRemove(index)" />	
						    <q-item-main>
						      <q-item-tile label>{{ sortItems(c).label }}</q-item-tile>
						    </q-item-main>
						    <q-item-side
						    		:icon="sortItems(c).asc === true ? 'arrow_downward' : 'arrow_upward' " 
						    		@click.native = "sortItems(c).asc = !sortItems(c).asc"
						    	/>	
						  </q-item>		 			   			
						</q-list> 
		        	</div>

		    		<div class="full-width bg-secondary row justify-center" 
		    			 v-show="FrameMenu == '2' ? true : false">
						<q-btn-group class="full-width" outline>
							<q-btn color="primary" label="Apply Sort" class="col-6"  
								@click="showSortFrame('apply', '')" />
							<q-btn color="primary" label="Clear All" class="col-6"
								@click="showSortFrame('clear', '')"/>
						</q-btn-group>
		    		</div>
	    		</div>
	        	<!-- End Frame Sorting -->

	        	<!-- Begin Frame Filter -->
	    		<div v-show="FrameMenu == '3' ? true : false">

				    <q-list separator >
				      <q-collapsible group="somegroup"
				      		v-for="(c, index) in (myGrid.Grid.FilterList)" 
				      		:key="index" 
				      		:opened="filterColumn === c.field ? true : false"
				      		:label="c.label" 
							:header-class="c.filterValue != '' ? 'text-secondary' : ''"
				      		dense highlight>
				        <div class="row dense">
							<q-select class="q-ma-xs"
						      color="secondary"     
						      v-model="c.filterOperator"
							  placeholder="Operator"
						      :options="myGrid.Grid.Operator"
						      hide-underline
						    />
							<q-input v-if="c.tipe=='num'"
								type="number" align="right" 
								v-model="c.filterValue" 
								@keyup.enter="showFilterFrame('apply', '')"
							/>	
							<q-input v-else
								v-model="c.filterValue" 
								@keyup.enter="showFilterFrame('apply', '')"
							/>			        	
				        </div>
				  	  </q-collapsible >
					</q-list>

		    		<div class="full-width bg-secondary row justify-center" 
		    			 v-show="FrameMenu == '3' ? true : false" >
						<q-btn-group class="full-width" outline>
							<q-btn color="primary" label="Apply Filter" class="col-6"  
								@click="showFilterFrame('apply', '')" />
							<q-btn color="primary" label="Clear All" class="col-6"
								@click="showFilterFrame('clear', '')"/>
						</q-btn-group>
		    		</div>
	    		</div>
	        	<!-- End Frame Filter -->


		</q-list>

	</div>

</template>

<script>
	import { mapGetters, mapMutations } from 'vuex';
	export default { 
  		name: 'ObjGrid_S', //Grid Settings
  		props: {
            frmID: { type : String },
            subFrmID: { type : String },
            frmType: { type : String },
            myGrid: { type : Object },
            dataSetting: {}
        },
		computed: {
	      	...mapGetters('App',['getAppForms']),
			searchAllColumns() {
				if (this.myGrid.Grid.SearchAllColumns === '' ) {
					return "Search All columns " 	
				}
				return "Search All columns : \"" + 
							this.myGrid.Grid.SearchAllColumns + "\""

			},
			Seperator: {
				get: function () {
					return this.myGrid.Grid === undefined ? '' : 
							this.myGrid.Grid.Seperator.Value;
				},
				set: function (NewValue) {					
					this.setAppForms_Data({
						id: this.frmID, path:this.subFrmID+'Grid.Seperator.Value', data: NewValue });
				}
			},
			VisibleColumns: {
				get: function () {
					// console.log('masuk aaa', this.myGrid.Grid.VisibleColumns)
					return this.myGrid.Grid.VisibleColumns === undefined ? [] : 
							this.myGrid.Grid.VisibleColumns;
				},
				set: function (NewValue) {					
					// console.log('masuk bbb', NewValue)
					this.setAppForms_Data({
						id: this.frmID, path:this.subFrmID+'Grid.VisibleColumns', data: NewValue });
				}
			},
			rowPerPage: {
				get: function () {
					return this.myGrid.Grid.Pagination === undefined ? 10 : 
							this.myGrid.Grid.Pagination.rowsPerPage;
				},
				set: function (NewValue) {		
					this.setAppForms_Data({
						id: this.frmID, path:this.subFrmID+'Grid.Pagination.rowsPerPage', data: NewValue });
					this.myGrid.Grid.LoadDataGrid()			
				}
			},
		},
		methods: {
			...mapMutations('App',['setAppForms_Data']),
			GoPage() {
				var lastPage = this.myGrid.Grid.Rows.last_page; 
				var currentPage = this.myGrid.Grid.Rows.current_page; 
					currentPage = currentPage > lastPage ? lastPage :
								  currentPage < 1 ? 1 : currentPage;

				this.setAppForms_Data({
					id: this.frmID,
					path: this.subFrmID+'Grid.Pagination.page',
					data: currentPage });
				this.myGrid.Grid.LoadDataGrid();

			},
			NextPage() {
				var lastPage = this.myGrid.Grid.Rows.last_page; 
				var currentPage = this.myGrid.Grid.Rows.current_page;
				this.setAppForms_Data({
					id: this.frmID,
					path: this.subFrmID+'Grid.Pagination.page',
					data: (currentPage) >= lastPage ? lastPage : (currentPage+1) });
				this.myGrid.Grid.LoadDataGrid();
			},
			PreviousPage() {
				var currentPage = this.myGrid.Grid.Rows.current_page;
				this.setAppForms_Data({
					id: this.frmID,
					path: this.subFrmID+'Grid.Pagination.page',
					data: (currentPage) <= 1 ? 1 : (currentPage-1) });
				this.myGrid.Grid.LoadDataGrid();
			},
			sortItems(nilai) {
				return this.myGrid.Grid.SortList.find(a => a.value == nilai);
			},
			sortRemove(index) {
				this.$delete(this.sortResult, index)
			},
			showSortFrame(tipe) {
				// console.log(this.softForm);

	
				if(tipe.toLowerCase() =="open" ) {

					var sR = this.myGrid.Grid.Sort;
					this.sortResult = [];
					for (var i in sR ) {
						this.sortResult.push( sR[i].name );
					}

				} else if(tipe.toLowerCase() =="apply" ) {

					var urut = [];
					for (var i in this.sortResult ) {
						var asc = this.myGrid.Grid.SortList.find(
										r => r.value === this.sortResult[i]
									).asc;
						urut.push({ 
							name : this.sortResult[i],
							direction : asc ? 'asc' : 'desc' 
						});
					}

					this.setAppForms_Data({ 
						id: this.frmID, 
						path: this.subFrmID+'Grid.Sort', 
						data: urut });
					this.myGrid.Grid.LoadDataGrid();
				} else if(tipe.toLowerCase() =="clear" ) {
					this.setAppForms_Data({ 
						id: this.frmID, 
						path: this.subFrmID+'Grid.Sort', 
						data: [] });
					this.myGrid.Grid.LoadDataGrid();
				}
				this.softForm = !this.softForm;
			},
			showFilterFrame(tipe, Col) {
				// console.log(Col);
				this.filterColumn = Col;
				if(tipe.toLowerCase() =="apply" ) {
					var fL = this.myGrid.Grid.FilterList.filter(r => r.filterValue != '');
					var Msg = '';
					for (var i in fL ) {
						if (fL[i].filterOperator == '') {
							Msg = fL[i].label + ' operator cannot be empty! ';
							break;
						}
						// console.log('ObjGrid_S', fL[i].filterValue);
					}
					if (Msg != '' ) {
						this.$q.notify({position:'top', message:Msg});
						return;
					}					
					console.log('ObjGrid_S', fL[0].filterValue);
					this.setAppForms_Data({ 
						id: this.frmID, 
						path: this.subFrmID+'Grid.Filter', 
						data: fL });
					this.myGrid.Grid.LoadDataGrid();
					console.log('ObjGrid_S 333', this.myGrid.Grid.FilterList);
					console.log('ObjGrid_S 222', fL[0].filterValue);

				} else if(tipe.toLowerCase() =="clear" ) {
					this.setAppForms_Data({ 
						id: this.frmID, 
						path: this.subFrmID+'Grid.Filter', 
						data: [] });
					this.myGrid.Grid.LoadDataGrid();
				} 				
				this.filterForm = !this.filterForm;
			},
		},		
		created () {			
			// console.log('masuk Object Grid HEADER ', this.frmID+' ('+this.subFrmID+')');
			// console.log('masuk', this.myGrid.Grid);
		},		
		data () {
			return {	
		        FrameMenu: '1',
		        nomor: [
				        { label: 'All', value: 0 },
				        { label: '5 Rows', value: 5 },
				        { label: '10 Rows', value: 10 },
				        { label: '25 Rows', value: 25 },
				        { label: '50 Rows', value: 50 },
				        { label: '100 Rows', value: 100 },
			    	],

		        softForm: false,		        
		        sortResult: [],

		        filterForm: false,
		        filterColumn: '',
	      	}
	    }
	    
	}
</script>
