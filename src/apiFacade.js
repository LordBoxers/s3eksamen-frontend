import URL from "./settings.js"

function handleHttpErrors(res) {
    if (!res.ok) {
        return Promise.reject({ status: res.status, fullError: res.json() })
    }
    return res.json();
}

function apiFacade() { /* Insert utility-methods from a latter step (d) here (REMEMBER to uncomment in the returned object when you do)*/

    const setToken = (token) => {
        localStorage.setItem('jwtToken', token)
    }
    const getToken = () => {
        return localStorage.getItem('jwtToken')
    }
    const loggedIn = () => {
        const loggedIn = getToken() != null;
        return loggedIn;
    }
    const logout = () => {
        localStorage.removeItem("jwtToken");
    }


    const login = (user, password) => {
        const options = makeOptions("POST", true, {
            username: user,
            password: password
        });
        return fetch(URL + "/api/login", options).then(handleHttpErrors).then(res => {
            setToken(res.token)
        })
    }
    const fetchData = () => {
        const options = makeOptions("GET", true); // True add's the token
        var base64Url = getToken().split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        if (JSON.parse(atob(base64)).roles === "user") {
            return fetch(URL + "/api/info/user", options).then(handleHttpErrors);
        } else {
            return fetch(URL + "/api/info/admin", options).then(handleHttpErrors);
        }

        
        
    }

   
    const makeOptions = (method, addToken, body) => {
        var opts = {
            method: method,
            headers: {
                "Content-type": "application/json",
                'Accept': 'application/json'
            }
        }
        if (addToken && loggedIn()) {
            opts.headers["x-access-token"] = getToken();
        }
        if (body) {
            opts.body = JSON.stringify(body);
        }
        return opts;
    }
    const fetchSportTeams = () => {
        const options = makeOptions("GET", true); // True add's the token
        return fetch(URL + "/api/sport/allSportTeams", options).then(handleHttpErrors);
    }
    const fetchSports = () => {
        const options = makeOptions("GET", true); // True add's the token
        return fetch(URL + "/api/sport/allSports", options).then(handleHttpErrors);
    }
    const addSport = (name, description) => {
        const options = makeOptions("POST", true, {
          name: name,
          description: description,
        });
        return fetch(URL + "/api/sport/addSport", options)
          .then(handleHttpErrors)
          .then((res) => {
            setToken(res.token);
          });
      };
    const addSportTeam = (teamName, pricePerYear, minAge, maxAge) => {
        const options = makeOptions("POST", true, {
            teamName: teamName,
            pricePerYear: pricePerYear,
            minAge: minAge,
            maxAge: maxAge
          });
          return fetch(URL + "/api/sport/addSportTeam", options)
            .then(handleHttpErrors)
            .then((res) => {
              setToken(res.token);
            });
    };


    return {
        makeOptions,
        setToken,
        getToken,
        loggedIn,
        login,
        logout,
        fetchData,
        fetchSportTeams,
        fetchSports,
        addSport,
        addSportTeam
    }
}
const loginFacade = apiFacade();
export default loginFacade;
