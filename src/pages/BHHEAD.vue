<template>
  <div class="">
  <!-- 
  	v-if akan merender ulang (re-create object ulang) 
  	kalau sudah re-create
  		akan mentrigger computed dan lain sebagainya
  -->
  	<div v-show="myForm.Properties.layout==='1'">
		<ObjGrid :frmID="frmID" />
  	</div>
  	<div 
  		 v-if="myObj === undefined ? false : true"
  		 v-show="myForm.Properties.layout==='2'" 
  		 class="text-left q-ma-xs round dense row">

  		<div class="col-xs-12 col-md-11 q-ma-xs row">
	  		<div class="col-xs-12 col-md-8">
				<ObjForm :pObj="myObj.BHDESC" :pFrmObj="'frm'+frmID" />
<!-- 				<ObjForm :pObj="myObj.BHBPNOIY" :pFrmObj="'frm'+frmID" />
				<ObjForm :pObj="myObj.BHADDR" :pFrmObj="'frm'+frmID" />
				<ObjForm :pObj="myObj.BHCITY" :pFrmObj="'frm'+frmID" />
				<ObjForm :pObj="myObj.BHTELP" :pFrmObj="'frm'+frmID" />
				<ObjForm :pObj="myObj.BHCPER" :pFrmObj="'frm'+frmID" /> -->
	  		</div>
	  		<div class="col-xs-12 col-md-4">
				<ObjForm :pObj="myObj.BHBHNOIY" :pFrmObj="'frm'+frmID" />
				<ObjForm :pObj="myObj.BHBHNO" :pFrmObj="'frm'+frmID" />
				<ObjForm :pObj="myObj.BHNOTA" :pFrmObj="'frm'+frmID" />
				<ObjForm :pObj="myObj.BHDATE" :pFrmObj="'frm'+frmID" />
	  		</div>
  		</div>
  		<div class="col-xs-12 col-md-11 q-ma-xs">
			<ObjForm 
				:pObj="myObj.BHLINE" :pFrmObj="'frm'+frmID"
				@eCallDetailForm="BHLINEshow"
				@eSaveDetailForm="BHLINEsave"
			>
				<div 
					slot="GridForm"
					:style="$q.platform.is.mobile ? 'width: 280px' : 'width: 500px'"
				>
					<ObjForm 
						v-for="(Obj, index) in myForm.Forms['frmBHLINE']" 
						:pObj="Obj" :pFrmObj="'frmBHLINE'"
						:key="index"
						v-if="Obj.Panel === 'Panel11' ? true : false"
					/>
				</div>				 	
			</ObjForm>	
  		</div>
  		<div class="col-xs-12 col-md-11 q-ma-xs row">
	  		<div class="col-xs-12 col-md-8">
				<ObjForm :pObj="myObj.BHREMK" :pFrmObj="'frm'+frmID" />
	  		</div>
	  		<div class="col-xs-12 col-md-4">
				<ObjForm :pObj="myObj.BHTOTL" :pFrmObj="'frm'+frmID" />
	  		</div>
  		</div>  		 		
  		<!-- <div class="col-xs-12 col-md-5 q-ma-xs">
			<ObjForm 
				v-for="(Obj, index) in myForm.Forms['frm'+frmID]" 
				:pObj="Obj" :pFrmObj="'frm'+frmID"
				:key="index"
				v-if="Obj.Panel === 'Panel4' ? true : false"
			/>  	
  		</div> -->
  	</div>
  </div>
</template>

<script>

	import weAuth from 'src/auth';
	import weObjs from '../components/weObj/main.js';
	// import { mapGetters, mapMutations, mapActions } from 'vuex';
	import { mapGetters } from 'vuex';
	export default { 
  		components : weObjs,	
	    created () { 
	    	weAuth.setupForm({
	    		form: this,						// --> local this
	    		formId: 'frmID',  				// --> local variabel name 
	    		CommandClick: this.CommandClick
	    	}).then(()=>{

				weAuth.loadFormObject({
					form: this,
					frmID: this.frmID,			
					frmObj: 'frmBHLINE',	
					method: 'FormObjectDetail' 	
				});

	    	});
	    },
		// mounted() { console.log('TBLDSC mounted', 'Test 1222222') },	
		// beforeMount () { console.log('TBLDSC beforeMount', 'Test 22222') },		
		// updated() { console.log('TBLDSC updated', 'Test 123') },	
		// beforeUpdate () { console.log('TBLDSC beforeUpdate', 'Test 456') },			
		// activated () { console.log('TBLDSC activated', 'active') },
		// deactivated () { console.log('TBLDSC deactivated', 'active') },
		computed: {
	      	...mapGetters('App',['getAppForms']),
			myForm() {
				return this.getAppForms[this.frmID];
				// return [];
			},		
			myObj() {
				// console.log(this.frmID + ' myObj', this.myForm.Forms['frm'+this.frmID])
				return this.myForm.Forms['frm'+this.frmID];
			},					
		},	
		watch: {
			'myForm.Forms.frmBHHEAD.BHLINE.Value': function (data) {
				let total = 0;
				let g = data;
				for (let index in g) {
					// console.log('index', index);
					total += Number(g[index].BLTOTL)
				}

				this.myForm.Forms.frmBHHEAD.BHTOTL.Value = total;	
			},
		},
		methods: {
			// ...mapMutations('App',['setAppForms_Data']),
			// ...mapActions('App',['doAppLoadObject']),
			CommandClick: function (mode) {
				if (mode != "") {

					weAuth.actionForm({
						form: this,
						frmID: this.frmID, 
						mode:mode
					});	

					switch(mode) {
					    case "1": // Add
					    	// alert('masuk sini');
					    	break;
					    case "2": // Edit
					    	weAuth.fillFormObject({
					    		form: this, 
					    		frmID: this.frmID, 
					    		frmObj: 'frm' + this.frmID, 
					    		method: ''
					    	});
					    	break;
					    case "3": // Delete
					    	weAuth.saveData({
					    		form: this, 
					    		frmID: this.frmID, 
					    		frmObj: 'frm' + this.frmID,
					    		method: ''
					    	});
					    	return;
					        break;
					    case "4": // Save
					    	// console.log('Begin Saving Data')
					    	weAuth.saveData({
					    		form: this, 
					    		frmID: this.frmID, 
					    		frmObj: 'frm' + this.frmID,
					    		method: ''
					    	})
					    	// console.log('End Saving Data')
					    	return;
					    	break;
					    case "5": // Cancel		
					        break;
					    case "6": // View
					    	weAuth.fillFormObject({
					    		form: this, 
					    		frmID: this.frmID, 
					    		frmObj: 'frm' + this.frmID, 
					    		method: ''
					    	});

					    	break;					        
					}					
				}

			},
			BHLINEshow ({mode, data}) {
				var f = this.myForm.Forms['frm'+this.frmID]
				// console.log('f.BHBPNOIY',f.BHBPNOIY);
				// if(mode === '1') {
				// 	if (f.BHBPNOIY.Value == '') {
				// 		this.$q.notify('Customer harus diisi dulu!!!');
				// 		f.BHLINE.OpenForm = false;
				// 	}
				// } else if (mode === '2') {
				// 	// this.frmBHLINE.BBDESC.ReadOnly = true
				// }
			},
			BHLINEsave (mode) {
				var f = this.myForm.Forms['frm'+this.frmID]
				if(mode === '1') {
					// var g = this.myForm.Forms['frm'+this.frmID].BHLINE.Grid.Rows.data;

					// let total = 0;
					// for (let index in g) {
					// 	console.log('index', index);
					// 	total += Number(g[index].PLTOTL)
					// }
					// console.log('total', total);

					// if (f.BHBPNOIY.Value == '') {
					// 	this.$q.notify('Customer harus diisi dulu!!!');
					// 	f.BHLINE.SaveForm = false;
					// }
				} else if (mode === '2') {
					// this.frmBHLINE.BBDESC.ReadOnly = true
				}
			},
		},			
		data () {
			return {
  				frmID: 'TBLDSCXXXX',
	      	}
	    }
	}
</script>