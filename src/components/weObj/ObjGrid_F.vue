<template>
      <div  class="row flex-center q-py-sm"
            v-if="myGrid.Grid === undefined ? false : 
                  myGrid.Grid.Columns === undefined ? false : true">

        <q-btn  round dense size="sm" 
                icon="refresh" color="secondary" class="q-mr-sm"
                @click="myGrid.Grid.LoadDataGrid()" />
        <q-btn  round dense size="sm" icon="undo" color="secondary" class="q-mr-sm"
                :disable="myGrid.Grid.Rows.current_page == 1 ? true : false"
                @click="PreviousPage()" />
        <div  class="q-mr-sm" 
              style="font-size: small">
        	Page {{ myGrid.Grid.Rows.current_page }} / {{ myGrid.Grid.Rows.last_page }}
        </div>
         <!-- myGrid.Grid.Rows.last_page -->
         <!-- dataFooter.pagesNumber -->
        <q-btn  round dense size="sm" icon="redo" color="secondary" class="q-mr-sm"
                :disable="myGrid.Grid.Rows.current_page === myGrid.Grid.Rows.last_page ? true : false"
                @click="NextPage()" />
        <q-btn  round dense size="sm" 
                icon="settings" color="secondary" 
                @click="frmSetting=!frmSetting" />

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
    methods: {
      ...mapMutations('App',['setAppForms_Data']),
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
      }
    },    
		data () {
			return {	
		        frmSetting: false,
	      	}
	    }
	    
	}
</script>
