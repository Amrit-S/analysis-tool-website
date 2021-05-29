import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import {SITE_PAGES} from './constants/links';

import PageLayout from "./components/PageLayout";
import AnalysisInput from './pages/AnalysisInput';
import AnalysisResults from './pages/AnalysisResults';
import Segmentation from './pages/ModelOverview/Segmentation';
import CNN from './pages/ModelOverview/Cnn';
import Researchers from './pages/Researchers';
import Custom404 from './pages/Custom404';

function App() {
  return (
    <Router>
      <PageLayout>
        {/* Switch gurantees that a URL can match to only one route*/}
        <Switch>
          {/* Model Segmentation Page */}
          <Route exact path={SITE_PAGES.OVERVIEW_SEGMENTATION}>
            <Segmentation/>
          </Route>
          <Route exact path={SITE_PAGES.OVERVIEW_CNN}>
            <CNN/>
          </Route>
          {/* How to Use Page */}
          <Route exact path={SITE_PAGES.RESEARCHERS}>
            <Researchers/>
          </Route>
          {/* Results Page */}
          <Route exact path={SITE_PAGES.ANALYSIS_RESULTS}>
            <AnalysisResults/>
          </Route>
          {/* Analsyis Page - Input Retrieval (Home/Root Page of App) */}
          <Route exact path={SITE_PAGES.ANALYSIS_INPUT}>
            <AnalysisInput/>
          </Route>
          {/* Any other URL is automatically matched to 404 page */}
          <Route>
            <Custom404/>
          </Route>
        </Switch>
      </PageLayout>
    </Router>
  );
}

export default App;