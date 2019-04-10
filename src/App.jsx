import React, { Component } from 'react';

//react router
import { BrowserRouter as Router, Route } from 'react-router-dom';

//pages
import { PlPage1 } from './pages/pl_page_1/pl_page_1';

class App extends Component {

  render() {
    return (
      <Router>
        <div className="grid-frame app">
          <Route exact path="/" component={PlPage1} />
          <Route path="/page1" component={PlPage1} />          
        </div>
      </Router>
    );
  }
}

export default App;



