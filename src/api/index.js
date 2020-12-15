// import something here
import axios from 'axios';
import Vue from 'vue';
import store from 'src/store'

// import vue from 'vue';
export default { 
	Vue : Vue,

	fnEncrypt: function (Data, UserName) {
		/*
			Encrypt data json harus sama dengan fnSoftWE.php
			Untuk ke laravel (cWeRouter.php)
			Note : Hasil Encrypt harus sama di file cWeRouter.php
		*/		
		var DataEncrypt = Data;
		    DataEncrypt = btoa("WilEdi2019") + Data;
		// console.log(DataEncrypt);	
		    DataEncrypt = btoa(DataEncrypt);
		// console.log(DataEncrypt);	
		    DataEncrypt = DataEncrypt.split('').reverse().join('');
		// console.log(DataEncrypt.length);	
		var P = (DataEncrypt.length/2);
		var D1 = DataEncrypt.slice(0, P).split('');	
		var D2 = DataEncrypt.slice(P).split('');	
		var E = [];
		var i = 0;
    		for(i=0;i<P;i++) {
    			E.push(D1[i] + D2[i]);
    		}         
		    DataEncrypt = E.join('');	
		// console.log(DataEncrypt);	
		return DataEncrypt;
		// console.log(btoa(a));
		// console.log(atob(btoa(a)));
	},

	fnDecrypt: function (Data, UserName) {		
		/*
			Decrypt data json harus sama dengan fnSoftWE.php
			Dari laravel (cWeRouter.php)
			Note : Hasil Decrypt harus sama di file cWeRouter.php
		*/	
		var DataDecrypt = Data;
		var D = DataDecrypt.split('');
		var D1 = []; 
		var D2 = [];
		var F = "1";
		var i = 0;
    		for(i=0;i<D.length;i++) {
    			if (F=="1") {
    				D1.push(D[i]);
    				F="2";
    			} else {
    				D2.push(D[i]);
    				F="1";
    			}
    		}         
    		DataDecrypt = D1.join('') + D2.join('');
    		DataDecrypt = DataDecrypt.split('').reverse().join('');	
		    DataDecrypt = atob(DataDecrypt);
		var Keys = btoa("WilEdi2019");		    
		    DataDecrypt = DataDecrypt.replace(Keys, "");
			// console.log('DataDecrypt Reverse',DataDecrypt);
		return JSON.parse(DataDecrypt);
	},

	fnEncryptParam: function (DataParms, UserName) {
		var DataJSon = JSON.stringify(DataParms);
		var ObjParms = new Object;
			ObjParms['Data'] = this.fnEncrypt(DataJSon);
		return ObjParms;
	},

	async fnLoginData (DataParms, UserName) {
		// console.log('api.fnLoginData', DataParms);
		// var params = DataParms; 
		var params = this.fnEncryptParam(DataParms); 
        var Address = process.env.API + 'login';
		try {
			const response = await axios.post(Address, { params: params, withCredentials: true,} );
			// console.log('api.fnLoginData 1111 ', response);
			return response.data;
		} catch (error) {
			if (error.response.data != undefined) {
				throw error.response.data;
			}
			// console.log('api.fnLoginData error -> ', error.response.aaa);	
			throw error;
		}
	},

	async fnRequestData (DataParms, UserName) {	
/*
Controller dan Method
ada di masing masing module yang memanggil fnRequestData
*/		
		var AppName = store.state.App.AppName;
		
		DataParms['AppCompanyCode'] = localStorage.getItem(AppName+'-company');
		DataParms['AppUserName'] = localStorage.getItem(AppName+'-name');
		DataParms['AppToken'] = localStorage.getItem(AppName+'-token');
		DataParms['AppDateInfo'] = localStorage.getItem(AppName+'-dateInfo');
		DataParms['AppName'] = AppName;

 		// console.log('api.fnRequestData - token', localStorage.getItem(AppName+'-token'));
 		// console.log('api.fnRequestData - DataParms', DataParms);

		var params = this.fnEncryptParam(DataParms); 
        var Address = process.env.API + 'getData';

		try {
        	// console.log('api.fnRequestData - params', params);		
			const response = await axios.get(Address, { params: params, withCredentials: true } )	
        	// console.log('api.fnRequestData', this.fnDecrypt(response.data));		
			return this.fnDecrypt(response.data, '');
		} catch (error) {
			console.log('api.fnRequestData error');	
			// return '';
			throw error;
		}
	},

	async fnPostData (DataParms, UserName) {	
/*
Controller dan Method
ada di masing masing module yang memanggil fnPostData
*/		
		var AppName = store.state.App.AppName;
		
		DataParms['AppCompanyCode'] = localStorage.getItem(AppName+'-company');
		DataParms['AppUserName'] = localStorage.getItem(AppName+'-name');
		DataParms['AppToken'] = localStorage.getItem(AppName+'-token');
		DataParms['AppDateInfo'] = localStorage.getItem(AppName+'-dateInfo');
		DataParms['AppName'] = AppName;
		
        var params = this.fnEncryptParam(DataParms); 
        var Address = process.env.API + 'postData';

		try {
			const response = await axios.post(Address, { params: params, withCredentials: true } )
			// const response = await axios.get(Address, { params: params } )
			return this.fnDecrypt(response.data, '');
		} catch (error) {
			throw error;
			// return {data: {sukses: false, title: 'Fail', message: 'fnPostData Fail ' + error}}
		}
	},

	async fnPostFile (DataParms, UserName) {		
        var params = DataParms; 
        var Address = process.env.API + 'postFile';
		try {
			const response = await axios.post(Address, params )
			return response.data;
		} catch (error) {
			throw error;
		}
	},



	async fnPrintData (DataParms, UserName) {	
/*
Controller dan Method
ada di masing masing module yang memanggil fnPrintData
*/		
		var AppName = store.state.App.AppName;
		
		DataParms['AppCompanyCode'] = localStorage.getItem(AppName+'-company');
		DataParms['AppUserName'] = localStorage.getItem(AppName+'-name');
		DataParms['AppToken'] = localStorage.getItem(AppName+'-token');
		DataParms['AppDateInfo'] = localStorage.getItem(AppName+'-dateInfo');
		DataParms['AppName'] = AppName;

 		// console.log('api.fnPrintData - token', localStorage.getItem(AppName+'-token'));
 		// console.log('api.fnPrintData - DataParms', DataParms);

		var params = this.fnEncryptParam(DataParms); 
    	return params.Data;

	},

}


