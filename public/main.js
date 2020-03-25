(function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();


  // function isNumberKey(evt)
  // {
  // var charCode = (evt.which) ? evt.which : evt.keyCode;
  // if (charCode != 46 && charCode > 31
  // && (charCode < 48 || charCode > 57))
  // return false;
  // return true;
  // }
  // function isNumericKey(evt)
  // {
  // var charCode = (evt.which) ? evt.which : evt.keyCode;
  // if (charCode != 46 && charCode > 31
  // && (charCode < 48 || charCode > 57))
  // return true;
  // return false;
  // }
  // function checkUser()
  // {
  //   var store = document.getElementById('checkusers')
  //   console.log(store.value)
  //   if(store.value.length==12){
  //       axios.get(`http://localhost:8080/check_storage/${store.value}`)
  //       .then((res)=>{
  //           document.getElementById('okbhai').innerHTML = `<span style="color:red">Customer Id is Valid</span>`
  //           //- console.log(res)
  //       }).catch(error => {console.log(error)});  
  //   }else{
  //       return false;
  //   } 
  // }
  // function doit() {
  // var q1 = document.getElementById("q1");
  // var q2 = document.getElementById("q2");
  // var q3 = document.getElementById("q3");

  // var r1 = document.getElementById("r1");
  // var r2 = document.getElementById("r2");
  // var r3 = document.getElementById("r3");

  // var p1 = document.getElementById("p1");
  // var p2 = document.getElementById("p2");
  // var p3 = document.getElementById("p3");

  // p1.value = q1.value * r1.value
  // p2.value = q2.value * r2.value
  // p3.value = q3.value * r3.value
  //   function check_credit(val1,val2){
  //   if(val1<val2.value){
  //                   val2.style.border = "2px solid red"
  //                   val2.style.color = "red"
  //               }
  //               else
  //               {
  //                   val2.style.border = "2px solid green"
  //                   val2.style.color = "green"
  //               }
  //   }
  // axios.get(`http://localhost:8080/check_storage`)
  //           .then((res)=>{
  //               check_credit(res.data.rice,q1);
  //               check_credit(res.data.sugar,q2);
  //               check_credit(res.data.wheat,q3)
  //           }).catch(error => {console.log(error)});  
  // }