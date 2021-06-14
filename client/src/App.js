import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { SITE_PAGES } from "./constants/links";

import PageLayout from "./components/PageLayout";
import AnalysisInput from "./pages/AnalysisInput";
import AnalysisResults from "./pages/AnalysisResults";
import Segmentation from "./pages/ModelOverview/Segmentation";
import CNN from "./pages/ModelOverview/Cnn";
import Researchers from "./pages/Researchers";
import Custom404 from "./pages/Custom404";

function App() {
    return (
        <Router>
                {/* Switch gurantees that a URL can match to only one route*/}
                <Switch>
                    {/* Model Segmentation Page */}
                    <Route exact path={SITE_PAGES.OVERVIEW_SEGMENTATION}>
                        <PageLayout title="Segmentation">
                            <Segmentation />
                        </PageLayout>
                    </Route>
                    <Route exact path={SITE_PAGES.OVERVIEW_CNN}>
                        <PageLayout title="CNN">
                            <CNN />
                        </PageLayout>
                    </Route>
                    {/* How to Use Page */}
                    <Route exact path={SITE_PAGES.RESEARCHERS}>
                        <PageLayout title="Researchers">
                            <Researchers />
                        </PageLayout>
                    </Route>
                    {/* Results Page */}
                    <Route exact path={SITE_PAGES.ANALYSIS_RESULTS}>
                        <PageLayout title="DMEK Analysis Results">
                            <AnalysisResults />
                        </PageLayout>
                    </Route>
                    {/* Analsyis Page - Input Retrieval (Home/Root Page of App) */}
                    <Route exact path={SITE_PAGES.ANALYSIS_INPUT}>
                        <PageLayout title="DMEK Analysis Tool">
                            <AnalysisInput />
                        </PageLayout>
                    </Route>
                    {/* Any other URL is automatically matched to 404 page */}
                    <Route>
                        <PageLayout title="404">
                            <Custom404 />
                        </PageLayout>
                    </Route>
                </Switch>
        </Router>
    );
}

export default App;
