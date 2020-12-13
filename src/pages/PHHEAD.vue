<template>
  <div>
  <!-- 
  	v-if akan merender ulang (re-create object ulang) 
  	kalau sudah re-create
  		akan mentrigger computed dan lain sebagainya
  -->
  	<div v-show="myForm.Properties.layout==='1'">
		<ObjGrid :frmID="frmID" />
  	</div>
  	<div v-if="myObj === undefined ? false : true"
  		 v-show="myForm.Properties.layout==='2'" 
  		 class="text-left q-ma-xs round dense row">

  		<div class="col-xs-12 col-md-11 row">
	  		<div class="col-xs-12 col-md-8">
				<ObjForm :pObj="myObj.PHBPNOIY" :pFrmObj="'frm'+frmID" />
				<ObjForm :pObj="myObj.PHADDR" :pFrmObj="'frm'+frmID" />
				<ObjForm :pObj="myObj.PHCITY" :pFrmObj="'frm'+frmID" />
				<ObjForm :pObj="myObj.PHTELP" :pFrmObj="'frm'+frmID" />
				<ObjForm :pObj="myObj.PHCPER" :pFrmObj="'frm'+frmID" />
	  		</div>
	  		<div class="col-xs-12 col-md-4">
				<ObjForm :pObj="myObj.PHPHNOIY" :pFrmObj="'frm'+frmID" />
				<ObjForm :pObj="myObj.PHPHNO" :pFrmObj="'frm'+frmID" />
				<ObjForm :pObj="myObj.PHDATE" :pFrmObj="'frm'+frmID" />
				<ObjForm :pObj="myObj.PHNOTA" :pFrmObj="'frm'+frmID" />
				<ObjForm :pObj="myObj.PHTYPE" :pFrmObj="'frm'+frmID" />
	  		</div>
  		</div>
  		<div class="col-xs-12 col-md-11 q-ma-xs">
			<ObjForm :pObj="myObj.PHLINE" :pFrmObj="'frm'+frmID"
					 @eCallDetailForm="PHLINEshow"
					 @eSaveDetailForm="PHLINEsave">
				<div slot="GridForm"
					 :style="$q.platform.is.mobile ? 'width: 280px' : 'width: 500px'" >
					<ObjForm v-for="(Obj, index) in myForm.Forms['frmPHLINE']" 
							 :pObj="Obj" :pFrmObj="'frmPHLINE'"
							 :key="index"
							 v-if="Obj.Panel === 'Panel11' ? true : false"/>
				</div>				 	
			</ObjForm>	
  		</div>
  		<div class="col-xs-12 col-md-11 q-ma-xs row">
	  		<div class="col-xs-12 col-md-8">
				<ObjForm :pObj="myObj.PHREMK" :pFrmObj="'frm'+frmID" />
	  		</div>
	  		<div class="col-xs-12 col-md-4">
				<ObjForm :pObj="myObj.PHSUBT" :pFrmObj="'frm'+frmID" />
				<ObjForm :pObj="myObj.PHEXCT" :pFrmObj="'frm'+frmID" />
				<ObjForm :pObj="myObj.PHTOTL" :pFrmObj="'frm'+frmID" />
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
					frmObj: 'frmPHLINE',	
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
			'myForm.Forms.frmPHLINE.PLQTYS.Value': function (data) {
				this.TotalLineAmount();
			},
			'myForm.Forms.frmPHLINE.PLHARG.Value': function (data) {
				this.TotalLineAmount();
			},
			'myForm.Forms.frmPHHEAD.PHLINE.Value': function (data) {
				let total = 0;
				let g = data;
				for (let index in g) {
					// console.log('index', index);
					total += Number(g[index].PLTOTL)
				}
				// console.log('masuk.... Jumlah Grid ');
				this.myForm.Forms.frmPHHEAD.PHSUBT.Value = total;	
				this.GrandTotal();							
			},
			'myForm.Forms.frmPHHEAD.PHEXCT.Value': function (data) {
				this.GrandTotal();							
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
					    case "9": // Print
					    	// window.open('http://www.detik.com', '_blank');		
					    	// window.open('report', '_blank');		
					        weAuth.printReport({frmID: this.frmID, method: 'PrintForm', params: ''})
					        break;	        
					}					
				}

			},
			TotalLineAmount () {
				var f = this.myForm.Forms['frmPHLINE']
				f.PLTOTL.Value = f.PLQTYS.ValueNum * f.PLHARG.ValueNum;

			},
			GrandTotal() {
				var f = this.myForm.Forms['frm'+this.frmID]
				var ST = f.PHSUBT.ValueNum;
				var PM = f.PHEXCT.ValueNum;
					// ST = ST.toString().replace(/,/g, '').toString();
					// PM = PM.toString().replace(/,/g, '').toString();
				// console.log('SUBT xxx',  Number(ST))
				// console.log('EXCT xxx',  Number(PM)) 
				// console.log('TOTL xxx',  Number(ST) + Number(PM)) 
				var Total = Number(ST) + Number(PM);
				this.myForm.Forms.frmPHHEAD.PHTOTL.Value = Total;
				// console.log('TOTL xxx',  this.myForm.Forms.frmPHHEAD.PHTOTL.Value) 
				// this.myForm.Forms.frmPHHEAD.PHTOTL.Value = Number(ST) + Number(PM);
				// this.myForm.Forms.frmPHHEAD.PHTOTL.Value = '123456' + PM;

			},
			PHLINEshow ({mode, data}) {
				var f = this.myForm.Forms['frm'+this.frmID]
				// console.log('f.PHBPNOIY',f.PHBPNOIY);
				if(mode === '1') {
					if (f.PHBPNOIY.Value == '') {
						this.$q.notify('Customer harus diisi dulu!!!');
						f.PHLINE.OpenForm = false;
					}
				} else if (mode === '2') {
					// this.frmPHLINE.BBDESC.ReadOnly = true
				}
			},
			PHLINEsave (mode) {
				var f = this.myForm.Forms['frm'+this.frmID]
				if(mode === '1') {
					// var g = this.myForm.Forms['frm'+this.frmID].PHLINE.Grid.Rows.data;

					// let total = 0;
					// for (let index in g) {
					// 	console.log('index', index);
					// 	total += Number(g[index].PLTOTL)
					// }
					// console.log('total', total);

					if (f.PHBPNOIY.Value == '') {
						this.$q.notify('Customer harus diisi dulu!!!');
						f.PHLINE.SaveForm = false;
					}
				} else if (mode === '2') {
					// this.frmPHLINE.BBDESC.ReadOnly = true
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