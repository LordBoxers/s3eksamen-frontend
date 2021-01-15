import loginFacade from "./apiFacade.js"
import React, { useState, useEffect } from "react";


function DoLogin({ loggedIn, setLoggedIn, goHome }) {

    const [errorMsg, setErrorMsg] = useState('');


    const logout = () => {
        loginFacade.logout()
        setLoggedIn(false)
        setErrorMsg('')
        goHome();
    }

    const login = (user, pass) => {
        loginFacade.login(user, pass).then(res => setLoggedIn(true)).catch(err => {
            if (err.status) {
                err.fullError.then(e => setErrorMsg(e.message));
            }
        });
        goHome();
    }


    return (
        <div> {
            !loggedIn ? (
                <div><LogIn login={login} /><p>{errorMsg}</p>
                </div>
            ) : (
                    <div>
                        <LoggedIn />
                        <button onClick={logout}>Logout</button>
                    </div>
                )
        } </div>
    )
}

function LogIn({ login }) {
    const init = {
        username: "",
        password: ""
    };
    const [loginCredentials, setLoginCredentials] = useState(init);

    const performLogin = (evt) => {
        evt.preventDefault();
        login(loginCredentials.username, loginCredentials.password);
    }
    const onChange = (evt) => {
        setLoginCredentials({
            ...loginCredentials,
            [evt.target.id]: evt.target.value
        })
    }

    return (
        <div>
            <h2>Login</h2>
            <form onChange={onChange}>
                <input placeholder="User Name" id="username" />
                <input placeholder="Password" id="password" />
                <button onClick={performLogin}>Login</button>
            </form>
        </div>
    )

}
function LoggedIn() {
    const [dataFromServer, setDataFromServer] = useState("Loading...")

    useEffect(() => {
        loginFacade.fetchData().then(data => setDataFromServer(data.msg));
    }, [])

   

    return (
        <div>
            <h2>Data Received from server</h2>
            <h3>{dataFromServer}</h3>
        </div>
    )

}

export default DoLogin;