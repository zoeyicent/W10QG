<template>
	<q-tr :props="dataHead">		
			<!-- 
			@click.native="myGrid.Grid.showPopUpFilterForm('open', col.field)"
			@click.native="myGrid.Grid.showPopUpSortForm('open', col.field)"  
			class="bg-secondary"
			@click.native="myGrid.Grid.showPopUpFilterForm('open', col.field)" 
			 -->

<!-- 
		<q-th 
			:style="(myGrid.Grid.SearchAllColumns != '' ? 
						' text-decoration:underline; ' : '') 
					+ 
					(myGrid.Grid.Filter.find(
						r => r.field === col.name
					) ? 'font-weight:bold; font-style:italic;' : '') "
			@click.native="frmColSetting=!frmColSetting; dataColumn=col" 
			v-for="col in dataHead.cols"
			v-if="frmType === 'popup' ? col.tipe === 'act' ? false : true : true" 
			:key="col.name" 
			:props="dataHead" >
				<div v-if=" (col.tipeGrid == 'act102' ?  true : false) ">
		          <q-checkbox
		            v-model="dataHead.selected"
		            indeterminate-value="some"
		          />
				</div>
				<div v-else>
				    <span 
				    	v-if="myGrid.Grid.Sort.length === 0 ? false : true"
				    	v-show="myGrid.Grid.Sort.find(r => r.name === col.name) ? true : false"> 
				    	<q-icon :name= "myGrid.Grid.Sort.find(
				    				r => r.direction === 'desc' && r.name === col.name
				    			) ? 'arrow_upward' : 'arrow_downward'" /> 
				    </span>
				    {{ col.label }}

				</div>

		</q-th>
 -->

		<q-th 
			:style="(myGrid.Grid.Filter.find(
						r => r.field === col.name
					) ? 'font-weight:bold; font-style:italic;' : '')"			
			@click.native="onHeaderClick(col)" 
			v-for="col in dataHead.cols"
			v-if="frmType === 'popup' ? col.tipe === 'act' ? false : true : true" 			
			:key="col.name"
			:props="dataHead" >
				<div v-if=" (col.tipeGrid == 'act102' ?  true : false) ">
		          <q-checkbox
		            v-model="dataHead.selected"
		            indeterminate-value="some"
		          />
				</div>
				<div v-else>
				     <!-- color="grey-4" text-color="black"  -->
				    <q-chip :icon="myGrid.Grid.Sort.length === 0 ? '' : 
				    			   myGrid.Grid.Sort.find(r => r.name === col.name) ? 
						    			myGrid.Grid.Sort.find(
						    				r => r.direction === 'desc' && r.name === col.name
						    			) ? 'arrow_upward' : 'arrow_downward' : ''"
		    			   	small detail
		    			   	:style="'font-size: small'"
		    			   	:class="'shadow-6 ' + (myGrid.Grid.SearchAllColumns != '' ? ' dimmed ' : '') "
		    			   	:color="(myGrid.Grid.Filter.find(r => r.field === col.name) ? 'info' : 'secondary')" >
				    	{{ col.label }}
					</q-chip>

				</div>
		</q-th>



		<q-modal 	v-model="frmColSetting" 
					position="top"
					@show="showFrame=!showFrame"
					@hide="showFrame=!showFrame">
          <GridColSetting 	:frmID="frmID" 
				    		:subFrmID="subFrmID"
				    		:frmType="frmType"
				    		:myGrid="myGrid"
				    		:dataColumn="dataColumn"
				    		:showFrame="showFrame"
	    					@hide="onHide" />
		</q-modal>


	</q-tr>   
</template>

<script>
	import { mapGetters } from 'vuex';
	import GridColSetting from './ObjGrid_C.vue';
	export default { 
  		name: 'ObjGrid_H',		
  		components : { GridColSetting },	
  		props: {
            frmID: { type : String },
            subFrmID: { type : String },
            frmType: { type : String },
            myGrid: { type : Object },
            dataHead: {}
        },
		computed: {
	      	...mapGetters('App',['getAppForms']),
		},
		methods: {
			// notify (eventName) {
			// 	this.$q.notify(`Event "${eventName}" was triggered.`)
			// },
			onHide() {
				this.frmColSetting = false;
			},
			onHeaderClick(col) {
				if (this.frmType != 'grd') { 
					this.frmColSetting=!this.frmColSetting; 
					this.dataColumn=col; 
				}
			}
		},
		created () {			
			// console.log('masuk Object Grid HEADER ', this.frmID+' ('+this.subFrmID+')');
		},		
		data () {
			return {	
		        frmColSetting: false,	
		        showFrame: false,
		        dataColumn: {},
	      	}
	    }
	    
	}
</script>
