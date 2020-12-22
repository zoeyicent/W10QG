<template>
  <div>
    <!-- <iframe width="560" height="315" src="http://localhost:9991/PrintForm?data=abcdef" frameborder="0" /> -->
    <!-- <iframe width="560" height="815"  :src="queryData" frameborder="0" /> -->
    <iframe width="100%" height="715" :src="queryData" frameborder="0" />
  </div>
</template>

<script>

  // import { mapGetters, mapMutations, mapActions } from 'vuex';
  import { mapGetters, mapActions } from 'vuex';
  export default {
    name: 'report',
    async created () { 
    	// console.log('masuk sini', this.$route.query.data);
    	// this.queryData = "http://localhost:9991/api/printData?Data=" + this.$route.query.data;
    	// console.log('sss',process.env.API);
      console.log('route : ', this.$route);
    	this.queryData = process.env.API + 
                      "printData?Data=" + this.$route.query.data + 
                      "&token=" + this.$route.query.token;
    },	  
	  data () {
  		return {
  			frmID: 'TBLDSCXXXX',
  			queryData : ''
      }
    }
  }
</script>

<style>
</style>
