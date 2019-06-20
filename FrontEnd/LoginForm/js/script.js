function validateForm(){
	const email = "abc@gmail.com";
	const pass = "1234567";
	let userEmail = document.getElementById("emailid").value;
	let password = document.getElementById("pass").value;
	if (userEmail === email && password===pass ){
		document.getElementById("alert").style.color = "green";
		document.getElementById("alert").innerHTML="Login Successful!!!!!";
		window.location = "salesTracker.html"
	}else{
		document.getElementById("alert").style.color="red";
		document.getElementById("alert").innerHTML="Login Unsuccessful!";
		
	}
}