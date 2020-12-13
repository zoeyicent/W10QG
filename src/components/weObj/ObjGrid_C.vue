<template>


	<div>		
		<!-- ({{ dataColumn }}) -->

	        

		<q-list>
			<q-list-header inset bg-color="primary">
					{{ dataColumn.label }}
			</q-list-header>


			<q-item separator>
				<q-item-side>
					<q-toggle
				        v-model="sortFlag"
				        checked-icon="visibility"
				        unchecked-icon="visibility_off"
				  	/>
				</q-item-side>    
				<q-item-main>
					<q-option-group 
						type="radio"
						v-model="sortValue" 
						:options="sortType" 
						:readonly="sortFlag_mode"
						:disabled="sortFlag_mode"
					/>
				</q-item-main>
			</q-item>

			<q-item	separator
					v-show=" dataColumn.field === c.field ? true : false"
					v-for="(c, index) in (myGrid.Grid.FilterList)" 
					:key="index" >
				<q-item-side>
					<q-toggle
				        v-model="filterFlag"
				        checked-icon="visibility"
				        unchecked-icon="visibility_off"
				  	/>
				</q-item-side>
				<q-item-main>
					<q-select 
				      color="secondary"     
				      v-model="c.filterOperator"
					  placeholder="Operator"
				      :options="myGrid.Grid.Operator"
					  :readonly="filterFlag_mode"
					  :disabled="filterFlag_mode"
				      hide-underline
				    />       	
					<q-input v-if="c.tipe=='num'"			
						:readonly="filterFlag_mode"
						:disabled="filterFlag_mode"
						type="number" align="right" 
						v-model="c.filterValue" 
					/>	
					<q-input v-else			
						:readonly="filterFlag_mode"
						:disabled="filterFlag_mode"
						v-model="c.filterValue" 
					/>	
				</q-item-main>
			</q-item>


			<q-item />
			<q-item />
			<!-- <q-item /> -->

			<div class="full-width row justify-center">
				<q-btn color="primary" label="Apply" class="col-6" outline
					@click="doApply()" />
			</div>
		<!-- 
			<q-collapsible group="somegroup"
					v-show="false"
					v-for="(c, index) in (myGrid.Grid.FilterList)" 
					:key="index" 
					:opened="dataColumn.field === c.field ? true : false"
					:label="c.label" 
					:header-class="c.filterValue != '' ? 'text-secondary' : ''"
					dense highlight>

					<div class="row dense">
						<q-select 
					      color="secondary"     
					      v-model="c.filterOperator"
						  placeholder="Operator"
					      :options="myGrid.Grid.Operator"
					      hide-underline
					    />       	
						<q-input v-if="c.tipe=='num'"
							type="number" align="right" 
							v-model="c.filterValue" 
						/>	
						<q-input v-else
							v-model="c.filterValue" 
						/>	
					</div>

			  </q-collapsible>
		 -->
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
            dataColumn: {},
            showFrame: { type : Boolean },
        },
		computed: {
	      	...mapGetters('App',['getAppForms']),	      	
	      	sortFlag_mode() {
	      		if (!this.sortFlag) {
	      			this.sortValue = '';
	      		}
	      		return !this.sortFlag;
	      	},	
	      	filterFlag_mode() {
	      		// console.log('ABC - ', this.myGrid.Grid.FilterList)
				// return this.myGrid.Grid.SortList.find(a => a.value == nilai);
	      		if (!this.filterFlag) {
		      		if (this.myGrid.Grid.FilterList !== undefined) {
		      			var c = this.myGrid.Grid.FilterList.find(a => a.field === this.dataColumn.field);
		      		}
	      		}
	      		return !this.filterFlag;
	      	},
		},
		methods: {
			...mapMutations('App',['setAppForms_Data']),
			doApply() {

	      		// console.log('masuk doApply - ', this.myGrid.Grid.Sort)
				var urut = this.myGrid.Grid.Sort;
				var o = urut.find(r => r.name === this.dataColumn.field);
				// var o = urut.find(r => r.name === 'MMITNO');
				if ( typeof(o) == 'undefined' ) {
					if (this.sortFlag) {
						urut.push({ 
							name : this.dataColumn.field,
							direction : this.sortValue
						});
					}
				} else {
					if (this.sortFlag) {
						o.direction = this.sortValue;
					} else {
						urut = urut.filter(r => r.name !== this.dataColumn.field);
					}
				}

				this.setAppForms_Data({ 
					id: this.frmID, 
					path: this.subFrmID+'Grid.Sort', 
					data: urut });

				this.setAppForms_Data({ 
					id: this.frmID, 
					path: this.subFrmID+'Grid.Filter', 
					data: this.myGrid.Grid.FilterList });

				this.myGrid.Grid.LoadDataGrid();				
				this.$emit('hide');
			}
		},		
		created () {			
			// console.log('masuk Object Grid HEADER ', this.frmID+' ('+this.subFrmID+')');
			// console.log('masuk', this.myGrid.Grid);
		},				
		// mounted() { console.log('ObjGrid_C mounted', 'Test 1222222') },	
		// beforeMount () { console.log('ObjGrid_C beforeMount', 'Test 22222') },		
		updated() { 
			// console.log('ObjGrid_C updated', this.showFrame) 

      		if (!this.showFrame && typeof(this.myGrid.Grid.Sort) != "undefined") {

				// Begin ini semua result sort
				var sR = this.myGrid.Grid.Sort;
				this.sortResult = [];
				for (var i in sR ) {
					this.sortResult.push( sR[i].name );
				} 
				// End ini semua result sort

				// Begin ini sort field
		      	var a = this.sortResult.find(a => a === this.dataColumn.field);
	      		if(a) {
	      			this.sortFlag = true;
	      			var b = this.myGrid.Grid.SortList.find(a => a.value == this.dataColumn.field);
	      			this.sortValue = b.asc === true ? 'asc' : 'desc';
	      		} else {
	      			this.sortFlag = false;	
	      		}
				// end ini sort field	   


      			var c = this.myGrid.Grid.FilterList.find(a => a.field === this.dataColumn.field);
      			if (c !== undefined) {	
      				// console.log('abcdef ', c);		      	
	      			this.filterFlag = c.filterValue === "" ? false : true;
      			} else {
	      			this.filterFlag = false;	      				
      			}

      		}

		},	
		// beforeUpdate () { console.log('ObjGrid_C beforeUpdate', 'Test 456') },			
		// activated () { console.log('ObjGrid_C activated', 'active') },
		// deactivated () { console.log('ObjGrid_C deactivated', 'active') },
		// activated () { console.log('activated', 'active') },
		data () {
			return {	
		        FrameMenu: '1',
		        sortFlag: false,
		        sortValue: '',	        
		        sortResult: [],
		        sortType: [
				        { label: 'Ascending', value: 'asc' },
				        { label: 'Descending', value: 'desc' },
			    	],
		        filterFlag: false,
	      	}
	    }
	    
	}
</script>
