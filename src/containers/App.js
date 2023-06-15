import React from "react";
import 'whatwg-fetch';
import Cookies from 'js-cookie';
import unsplashUser from '../unsplash/unsplash';
import PhotoList from "../components/main/PhotoList.js";
import Header from "../components/header/header.js";
import logo from '../img/shutter-camera.png';
import 'normalize.css'
import '../styles/styles.scss'
import { accessKey } from "../unsplash/keys";
import { toJson } from "unsplash-js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PhotoDetail from "../components/PhotoDetail/PhotoDetail";


const authenticationUrl = unsplashUser.auth.getAuthenticationUrl([
  "public",
  "write_likes"
]);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
      currentUser: {},
      columns: 3
    }
    this.onLogin = this.onLogin.bind(this)
    this.onLogout = this.onLogout.bind(this)
  }

  onLogin() {
    window.location.assign(authenticationUrl)
  }


  onLogout() {
    Cookies.remove('access_token');
    let unsplashUserError = unsplashUser;
    unsplashUserError.accessKey = accessKey + 'err'
    window.location.assign(unsplashUserError.auth.getAuthenticationUrl())
    let url = new URL(document.location);
    url.searchParams.delete('code');
    window.location.assign(url)
    this.setState({ auth: false });
  }


  componentDidMount() {
    if (!Cookies.get('access_token')) {
      const code = window.location.search.split('code=')[1];
      if (typeof code === 'string' && code.length > 1) {
        unsplashUser.auth.userAuthentication(code)
          .then((result) => result.json())
          .then((json) => {
            if (json.access_token) {
              unsplashUser.auth.setBearerToken(json.access_token);
              Cookies.set('access_token', json.access_token);
              unsplashUser.currentUser.profile()
                .then(toJson)
                .then(data => {
                  this.setState({
                    currentUser: data,
                    auth: true,
                  })
                })
            }
          })
      }
    } else {
      unsplashUser.auth.setBearerToken(Cookies.get('access_token'))
      unsplashUser.currentUser.profile()
        .then(toJson)
        .then(data => {
          this.setState({
            currentUser: data,
            auth: true
          })
        })
    }
    this.updateColumns();
    window.addEventListener('resize', this.updateColumns)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateColumns);
  }

  updateColumns = () => {
    const windowWidth = document.documentElement.clientWidth;
    console.log(windowWidth)
    if (windowWidth <= 1024 && windowWidth > 768) {
      this.setState({ columns: 2 })
    } else if (windowWidth <= 768) {
      this.setState({ columns: 1 })
    } else {
      this.setState({ columns: 3 })
    }
  }

  render() {
    const auth = this.state.auth;
    let header;

    window.onLogin = this.onLogin

    if (auth) {
      header = <Header
        logo={logo}
        onClick={this.onLogout}
        auth={auth}
        currentUserName={this.state.currentUser.name}
        currentUserPhoto={this.state.currentUser.profile_image.medium}
        currentUserLink={this.state.currentUser.links.html}
      />
    } else {
      header = <Header
        logo={logo}
        onClick={this.onLogin}
        auth={auth}
      />
    }
    return (
      <BrowserRouter>
        <div className="App">
          {header}

          <Routes>
            <Route path='/' element={<PhotoList
              auth={this.state.auth}
              columns={this.state.columns} />} />
            <Route path="/photo/:id" element={<PhotoDetail auth={this.state.auth} />}/>
          </Routes>

        </div>
      </BrowserRouter>

    );
  }

}

export default App;
