import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";


import AnalysisInput from './pages/AnalysisInput';
import AnalysisResults from './pages/AnalysisResults';
import Overview from './pages/Overview';
import Usage from './pages/Usage';
import Custom404 from './pages/Custom404';

function App() {
  return (
    <Router>
      {/* Switch gurantees that a URL can match to only one route*/}
      <Switch>
        {/* Model Overview Page */}
        <Route exact path="/overview">
          <Overview/>
        </Route>
        {/* How to Use Page */}
        <Route exact path="/usage">
          <Usage/>
        </Route>
        {/* Results Page */}
        <Route exact path="/analysis-results">
          <AnalysisResults/>
        </Route>
         {/* Analsyis Page - Input Retrieval (Home/Root Page of App) */}
         <Route exact path="/">
          <AnalysisInput/>
        </Route>
        {/* Any other URL is automatically matched to 404 page */}
        <Route>
          <Custom404/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;