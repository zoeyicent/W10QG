<template>
      <div :props="dataFooter" class="row flex-center q-py-sm">
        <q-btn
          round dense size="sm" icon="refresh" color="secondary" class="q-mr-sm"
          @click="myGrid.Grid.LoadDataGrid()"
        />
        <q-btn
          round dense size="sm" icon="undo" color="secondary" class="q-mr-sm"
          :disable="dataFooter.isFirstPage"
          @click="dataFooter.prevPage"
        />
        <div class="q-mr-sm" style="font-size: small">
        	Page {{ dataFooter.pagination.page }} / {{ myGrid.Grid.Rows.last_page }}
        </div>
         <!-- myGrid.Grid.Rows.last_page -->
         <!-- dataFooter.pagesNumber -->
        <q-btn
          round dense size="sm" icon="redo" color="secondary" class="q-mr-sm"
          :disable="dataFooter.isLastPage"
          @click="dataFooter.nextPage"
        />
        <q-btn round dense size="sm" icon="settings" color="secondary" 
          @click="frmSetting=!frmSetting"
        />


    		<q-modal v-model="frmSetting" position="top">
              <GridSetting 
    	    		:frmID="frmID" 
    	    		:subFrmID="subFrmID"
    	    		:frmType="frmType"
    	    		:myGrid="myGrid"
              />
    		</q-modal>

      </div>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex';
	import GridSetting from './ObjGrid_S.vue';
	export default { 
  		name: 'ObjGrid_F',		
  		components : { GridSetting },
  		props: {
            frmID: { type : String },
            subFrmID: { type : String },
            frmType: { type : String },
            myGrid: { type : Object },
            dataFooter: {}
        },
		computed: {
	      	...mapGetters('App',['getAppForms']),			
		},
		created () {			
			// console.log('masuk Object Grid HEADER ', this.frmID+' ('+this.subFrmID+')');
		},			
		data () {
			return {	
		        frmSetting: false,
	      	}
	    }
	    
	}
</script>
