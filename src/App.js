import './App.css';
import React, { useState, useEffect } from "react";
import DoLogin from "./login.js"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
    useParams,
    useLocation,
    useHistory
} from "react-router-dom";
import loginFacade from './apiFacade';

function App() {
    const [isLoggedIn, setLoggedIn] = useState(false)
    let history = useHistory();
    const goHome = () => {
        history.push("/");
    }
    return (
        <div>
            <Header loginMsg={
                isLoggedIn ? "Logout" : "Login"
            }
                isLoggedIn={isLoggedIn} />
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route exact path="/login">
                    <DoLogin loggedIn={isLoggedIn} setLoggedIn={setLoggedIn} goHome={goHome} />
                </Route>
                <Route exact path="/allSportTeams">
                    <SportTeams />
                </Route>
                <Route exact path="/allSports">
                    <Sports />
                </Route>
                {isLoggedIn &&
                    <Route exact path="/adminpage">
                        <Adminpage />
                    </Route>
                }
                <Route>
                    <NoMatch />
                </Route>
            </Switch>
        </div>

    );
}

function Header({ isLoggedIn, loginMsg }) {
    return (
        <ul className="header">
            <li>
                <NavLink exact activeClassName="active" to="/">Home</NavLink>
            </li>
            <li>
                <NavLink activeClassName="active" to="/allSportTeams">Sport Teams</NavLink>
            </li>
            <li>
                <NavLink activeClassName="active" to="/allSports">Sports</NavLink>
            </li>
            {isLoggedIn && (
                <li>
                    <NavLink activeClassName="active" to="/adminpage">admin</NavLink>
                </li>
            )}
            <li>
                <NavLink activeClassName="active" to="/login">
                    {loginMsg}</NavLink>
            </li>

        </ul>

    )
}


function Home() {
    return (
        <div>
            <h2>Home</h2>
            <h3>How to use:</h3>
            <ul>
                <li>Login as User or Admin using username and password made in backend process</li>
                <li>User and Admin use different endpoints for login</li>
                <li><b>Extern API</b> use five different extern REST API endpoints through backend.</li>
                <li>Make sure to have backend running locally or delpoyet, and adjust link(s) in <b>settings.js</b></li>
                <li>Link to backend startcode: <a href="https://github.com/sslhansen/3semCA3backend">Backend Startcode</a> </li>
            </ul>
        </div>
    )
}


function SportTeams() {
    const [data, setData] = useState(null);
    const { strategy } = useParams();

    useEffect(() => {
        setData(null);
        loginFacade.fetchSportTeams().then(res => setData(res))
            .catch(err => {
                if (err.status) {
                    console.log(err.message);
                }
            });

    }, [])

    const toShow = data ? (
        <div>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Team Name</th>
                        <th scope="col">Price per Year</th>
                        <th scope="col">Minimum age</th>
                        <th scope="col">Maximum age</th>
                    </tr>
                </thead>
                <tr>
                    {data.map((x) => (
                        <tbody key={x.teamName}>

                            <td>{x.teamName}</td>
                            <td>{x.pricePerYear}</td>
                            <td>{x.minAge}</td>
                            <td>{x.maxAge}</td>
                        </tbody>
                    ))}
                </tr>

            </table>
        </div>
    ) : "Loading..."

    return (
        <div>
            <h2>data from server</h2>
            {toShow}
        </div>
    )
}
function Sports() {
    const [data, setData] = useState(null);
    const { strategy } = useParams();

    useEffect(() => {
        setData(null);
        loginFacade.fetchSports().then(res => setData(res))
            .catch(err => {
                if (err.status) {
                    console.log(err.message);
                }
            });

    }, [])

    const toShow = data ? (
        <div>
            {data.map((x) => (
                <tbody key={x.name}>

                    <td>{x.name}</td>
                    <td>{x.description}</td>
                </tbody>
            ))}
        </div>
    ) : "Loading..."

    return (
        <div>
            <h2>data from server</h2>
            {toShow}
        </div>
    )
}
function Adminpage() {
    const init = {
        name: "",
        description: "",
    };
    const [sportinfo, setSportinfo] = useState(init);
    const [sportTeaminfo, setSportTeaminfo] = useState(init);
    const [msg, setMsg] =useState("");

    function onSubmit(event) {
        event.preventDefault();
        loginFacade.addSport(sportinfo.name, sportinfo.description).catch(err => {
            if (err.status) {
                console.log(err.message);
            }
        });
        if (sportinfo.name) {
            setMsg("sport was added")
        } else { setMsg("an error have occured")};
    }
    function onSubmit2(event) {
        event.preventDefault();
        loginFacade.addSportTeam(sportTeaminfo.teamName, sportTeaminfo.pricePerYear, sportTeaminfo.minAge, sportTeaminfo.maxAge).catch(err => {
            if (err.status) {
                console.log(err.message);
            }
        });
        if (sportTeaminfo.teamName) {
            setMsg("sport team was added")
        } else { setMsg("an error have occured")};
    }

    const onChange = (evt) => {
        setSportinfo({
            ...sportinfo,
            [evt.target.id]: evt.target.value,
        });
    };
    const onChange2 = (evt) => {
        setSportTeaminfo({
            ...sportTeaminfo,
            [evt.target.id]: evt.target.value,
        });
    };
    return (
        <div>
            <form onChange={onChange}>
                <input placeholder="name" id="name" />
                <input placeholder="description" id="description" />
                <button onClick={onSubmit}>Add sport</button>
            </form>
            <p>{msg}</p>
            
            <form onChange={onChange2}>
                <input placeholder="teamName" id="teamName" />
                <input placeholder="pricePerYear" id="pricePerYear" />
                <input placeholder="minAge" id="minAge" />
                <input placeholder="maxAge" id="maxAge" />
                <button onClick={onSubmit2}>Add Sport Team</button>
            </form>
        </div>
    )
}


function NoMatch() {
    let location = useLocation();
    return (
        <div>
            <h3>No match for
                <code>{
                    location.pathname
                }</code>
            </h3>
        </div>
    )
}

export default App;
