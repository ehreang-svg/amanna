setTimeout(() => {

    const savedUser =
    localStorage.getItem("user");

    if(savedUser){

        loadDashboard(
            JSON.parse(savedUser)
        );

    }else{

        nav("loginPage");

    }

},2000);