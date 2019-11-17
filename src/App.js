import React, { Component  } from 'react';
import './App.css';

import Layout from './Components/Layout/Layout';
import BurgerBuild from  './Containers/BurgerBuild/BurgerBuild';

class App extends Component  {
  

  render() {
    return(
      <div>
        <Layout>
           <BurgerBuild/>
        </Layout>
      </div>
    );
  }
}

export default App;
